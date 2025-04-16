import { createLogger } from '@autonomys/agent-core';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

/**
 * Tool Template
 *
 * This file provides a generic template for creating custom tools.
 * Replace the placeholders with your actual implementation.
 */

// Create a logger for your tool
const logger = createLogger('custom-tool');

/**
 * TEMPLATE: Custom Tool Creation
 *
 * This is a template for creating custom tools for your agent.
 *
 * To create a new tool:
 * 1. Define a function that returns a DynamicStructuredTool
 * 2. Use Zod to create a schema for your tool's parameters
 * 3. Implement your tool's logic in the func property
 * 4. Import and register your tool in index.ts
 * 5. Install any necessary dependencies
 */

/**
 * Creates a custom tool for your agent
 * @param config - Configuration options for your tool
 * @returns A DynamicStructuredTool instance
 */
export const createCustomTool = (config: any) =>
  new DynamicStructuredTool({
    name: 'custom_tool_name',
    description: `
    Description of what your tool does.
    USE THIS WHEN:
    - Specify when the agent should use this tool
    - Add clear usage guidelines
    OUTPUT: Describe what the tool returns
    `,
    schema: z.object({
      // Define your input parameters using Zod
      parameter1: z.string().describe('Description of parameter1'),
      parameter2: z.number().describe('Description of parameter2'),
      parameter3: z.boolean().optional().describe('Optional parameter'),

      // For enum parameters:
      parameter4: z
        .enum(['option1', 'option2', 'option3'])
        .default('option1')
        .describe('Parameter with predefined options'),
    }),
    func: async ({ parameter1, parameter2, parameter3, parameter4 }) => {
      try {
        // Log the function call
        logger.info('Custom tool called with parameters', {
          parameter1,
          parameter2,
          parameter3,
          parameter4,
        });

        // Implement your tool logic here
        // ...

        // Return a structured response
        return {
          success: true,
          // Include your result data here
          result: {
            message: 'Operation completed successfully',
            data: {
              // Your output data
            },
          },
        };
      } catch (error) {
        // Log and handle errors
        logger.error('Error in custom tool:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    },
  });
