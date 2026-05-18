import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CustomerService } from "../../application/customerService.ts";
import { z } from "zod";
import { CustomerSchema } from "../../domain/customer.ts";

export function registerCreateCustomerTool(
  server: McpServer,
  service: CustomerService
) {
  server.registerTool(
    "create_customer",
    {
      description: "Creates a new customer",
      inputSchema: {
        name: z.string().describe("The name of the customer"),
        phone: z.string().describe("The phone number of the customer")
      },
      outputSchema: {
        message: z.string().describe("Confirmation message"),
        id: z.string().describe("The ID of the created customer")
      }
    },
    async ({ name, phone }) => {
      try {
        const result = await service.createCustomer({ name, phone });
        return {
          content:[
            {
              type: "text",
              text: JSON.stringify(result, null, 2)
            }
          ],
          structuredContent: result
        };
      } catch (error) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Failed to create customer: ${(error as Error).message || error}`
            }
          ]
        }
      }
    }
  ); 
}