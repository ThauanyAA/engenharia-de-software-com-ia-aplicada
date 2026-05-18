import { type Customer, type CreateCustomerInput } from '../domain/customer.ts';

export class CustomersHttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async listCustomers(): Promise<Customer[]> {
    const response = await fetch(`${this.baseUrl}/customers`);
    return response.json() as Promise<Customer[]>;
  }

  async createCustomer(customer: Customer): Promise<CreateCustomerInput> {
    const response = await fetch(`${this.baseUrl}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(customer)
    });
    return response.json() as Promise<CreateCustomerInput>;
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    const response = await fetch(`${this.baseUrl}/customers/${id}`);
    if (response.status === 404) {
      return null;
    }
    return response.json() as Promise<Customer>;
  }
}