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

export const CustomerUpdateSchema = CustomerQuerySchema.extend({
  _id: z.string().describe("The ID of the customer to update"),
});

export type CustomerUpdate = z.infer<typeof CustomerUpdateSchema>;

export const CustomerMutationSchema = z.object({
  message: z.string().optional().describe("A message describing the result of the mutation"),
  id: z.string().optional().describe("The ID of the customer affected by the mutation"),
  isError: z.boolean().optional().describe("Indicates if the mutation resulted in an error")
});

export type CustomerMutation = z.infer<typeof CustomerMutationSchema>