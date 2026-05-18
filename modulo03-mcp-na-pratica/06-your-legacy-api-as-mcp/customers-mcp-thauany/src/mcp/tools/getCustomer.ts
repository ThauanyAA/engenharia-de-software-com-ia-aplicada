import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CustomerService } from "../../application/customerService.ts";
import { type CustomerQuery, CustomerQuerySchema, CustomerSchema } from "../../domain/customer.ts";

export function registerGetCustomerTool(
  server: McpServer,
  service: CustomerService
) {
  server.registerTool(
    "get_customer",
    {
      description: "Retrieves a customer by name",
      inputSchema: CustomerQuerySchema,
      outputSchema: {
        customer: CustomerSchema.nullable().describe("The retrieved customer, or null if not found")
      }
    },
    async (query: CustomerQuery ) => {
      try {
        const customer = await service.findCustomer(query);
        return {
          content:[
            {
              type: "text",
              text: JSON.stringify(customer, null, 2)
            }
          ],
          structuredContent: { customer }
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