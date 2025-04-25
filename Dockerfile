# Stage 1: Build stage
FROM node:20.18.1 AS builder

WORKDIR /app

# Install dependencies for build
RUN apt-get update && apt-get install -y \
    python3 make g++ git jq curl openssl \
    libc6-dev libx11-dev libnss3-dev libglib2.0-dev libasound2-dev libxi-dev libxtst-dev \
    && rm -rf /var/lib/apt/lists/*

# Enable corepack for proper Yarn version management
RUN corepack enable

# Copy package files and configuration - ONLY CODE
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
COPY tsconfig.json ./
COPY scripts ./scripts
COPY src ./src

# Install dependencies
RUN yarn install

# Fix line endings for .env files to ensure compatibility across operating systems
RUN find ./characters -name "*.env" -type f -exec sed -i 's/\r$//' {} \; || true

# Generate certificates if they don't exist
RUN mkdir -p certs && \
    if [ ! -f certs/server.cert ] || [ ! -f certs/server.key ]; then \
      echo "Generating self-signed certificates..." && \
      openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
      -keyout certs/server.key -out certs/server.cert -days 365; \
    fi

# Build the project
RUN yarn build

# Stage 2: Production stage
FROM node:20.18.1

WORKDIR /app

# Create a non-root user to run the application
RUN groupadd -r autonomys && useradd -r -g autonomys -m -d /home/autonomys autonomys

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    curl jq openssl \
    libc6 libx11-6 libnss3 libglib2.0-0 libasound2 libxi6 libxtst6 \
    && rm -rf /var/lib/apt/lists/*

# Enable corepack for proper Yarn version management
RUN corepack enable

# Copy package configuration
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

# Copy built files and configuration - ONLY CODE
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/scripts ./scripts

# Install production dependencies
RUN yarn

# Create mount points for credentials and data
RUN mkdir -p .cookies characters certs && \
    chmod 700 ./.cookies && \
    chmod 755 ./characters && \
    chmod 755 ./dist && \
    chmod 755 ./certs

# Set initial ownership of mount points
RUN chown -R autonomys:autonomys ./.cookies && \
    chown -R autonomys:autonomys ./characters && \
    chown -R autonomys:autonomys ./certs

# Create startup script with security enhancements
RUN echo '#!/bin/sh\n\
CHARACTER_NAME=${CHARACTER_NAME:-character.example}\n\
echo "Starting agent with character: $CHARACTER_NAME"\n\
\n\
# Ensure character directory exists\n\
if [ ! -d "/app/characters/$CHARACTER_NAME" ]; then\n\
  echo "ERROR: Character directory /app/characters/$CHARACTER_NAME does not exist!"\n\
  exit 1\n\
fi\n\
\n\
# Fix any line ending issues in the .env file\n\
if [ -f /app/characters/$CHARACTER_NAME/config/.env ]; then\n\
  sed -i "s/\\r$//" /app/characters/$CHARACTER_NAME/config/.env\n\
fi\n\
\n\
# Load the character configuration\n\
if [ -f /app/characters/$CHARACTER_NAME/config/.env ]; then\n\
  set -a\n\
  . /app/characters/$CHARACTER_NAME/config/.env\n\
  set +a\n\
fi\n\
\n\
# Ensure character directories exist and are properly secured\n\
mkdir -p /app/characters/$CHARACTER_NAME/logs\n\
mkdir -p /app/characters/$CHARACTER_NAME/data\n\
mkdir -p /app/characters/$CHARACTER_NAME/memories\n\
chmod -R 750 /app/characters/$CHARACTER_NAME\n\
chown -R autonomys:autonomys /app/characters/$CHARACTER_NAME\n\
\n\
# Start the application as non-root user\n\
exec su -c "node dist/src/index.js $CHARACTER_NAME" autonomys\n\
' > /app/start.sh && chmod +x /app/start.sh

ENTRYPOINT ["/app/start.sh"]

EXPOSE ${API_PORT:-3010}