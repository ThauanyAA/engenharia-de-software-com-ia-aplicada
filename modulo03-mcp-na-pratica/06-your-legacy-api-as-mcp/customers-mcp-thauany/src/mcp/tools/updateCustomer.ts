import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CustomerService } from "../../application/customerService.ts";
import { z } from "zod";
import { CustomerMutationSchema, type CustomerUpdate, CustomerUpdateSchema } from "../../domain/customer.ts";

export function registerUpdateCustomerTool(
  server: McpServer,
  service: CustomerService
) {
  server.registerTool(
    "update_customer",
    {
      description: "Updates an existing customer",
      inputSchema: CustomerUpdateSchema.shape,
      outputSchema: CustomerMutationSchema.shape
    },
    async (customer) => {
      try {
        const result = await service.updateCustomer(customer);
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
              text: `Failed to update customer: ${(error as Error).message || error}`
            }
          ]
        }
      }
    }
  ); 
}