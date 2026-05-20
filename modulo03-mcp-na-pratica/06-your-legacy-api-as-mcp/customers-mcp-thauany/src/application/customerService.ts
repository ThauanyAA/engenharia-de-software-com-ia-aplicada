import { type CustomerQuery, type CustomerMutation, type Customer, type CustomerUpdate } from "../domain/customer.ts";
import { CustomersHttpClient } from "../infrastructure/customesHttpClient.ts";

export class CustomerService {
  private readonly httpClient: CustomersHttpClient;

  constructor(baseUrl: string) {
    this.httpClient = new CustomersHttpClient(baseUrl);
  }

  async listCustomers(): Promise<Customer[]> {
    return this.httpClient.listCustomers();
  }

  async createCustomer(customer: Customer): Promise<CustomerMutation> {
    return this.httpClient.createCustomer(customer);
  }

  async findCustomer(query: CustomerQuery): Promise<Customer | null> {
    if (query._id) return this.httpClient.getCustomerById(query._id);
    
    const customers = await this.httpClient.listCustomers();
    return (
      customers.find(customer => {
        const entries = Object.entries(query) as [keyof CustomerQuery, string][];
        return entries.every(([key, value]) => {
          const customerValue = customer[key as keyof Customer];
          return customerValue === value;
        })
      })
    ) ?? null
  }

  async updateCustomer(customer: CustomerUpdate) {
    return this.httpClient.updateCustomer(customer);
  }

  async deleteCustomer(id: string) {
    return this.httpClient.deleteCustomer(id);
  }
}