import z from "zod";
export const CustomerSchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  phone: z.string()
});
export type Customer = z.infer<typeof CustomerSchema>;

export const CustomerQuerySchema = z.object({
  _id: z.string().optional().describe("The ID of the customer to retrieve"),
  name: z.string().optional().describe("The name of the customer"),
  phone: z.string().optional().describe("The phone number of the customer"),
});
export type CustomerQuery = z.infer<typeof CustomerQuerySchema>;

export type CreateCustomerInput = { message: string, id: string }