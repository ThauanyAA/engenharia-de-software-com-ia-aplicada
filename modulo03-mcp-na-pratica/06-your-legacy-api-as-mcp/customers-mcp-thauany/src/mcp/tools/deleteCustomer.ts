import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CustomerService } from "../../application/customerService.ts";
import { z } from "zod";
import { CustomerMutationSchema, type CustomerUpdate, CustomerUpdateSchema } from "../../domain/customer.ts";

export function registerDeleteCustomerTool(
  server: McpServer,
  service: CustomerService
) {
  server.registerTool(
    "delete_customer",
    {
      description: "Deletes an existing customer",
      inputSchema: { 
        _id : z.string().describe("The ID of the customer to delete") 
      },
      outputSchema: CustomerMutationSchema.shape
    },
    async ({ _id }) => {
      try {
        const result = await service.deleteCustomer(_id as string);
        return {
          content:[
            {
              type: "text",
              text: result.message ?? ""
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
              text: `Failed to delete customer: ${(error as Error).message || error}`
            }
          ]
        }
      }
    }
  ); 
}