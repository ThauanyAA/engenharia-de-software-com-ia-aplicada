import { describe, it, after, before } from "node:test";
import assert from "node:assert";
import { createTestClient } from "../helpers.ts";
import { Client } from "@modelcontextprotocol/sdk/client";
import { type CreateCustomerInput, type Customer } from "../../src/domain/customer.ts";

type CreateCustomerResult = { structuredContent: CreateCustomerInput }
type CustomersResult = { structuredContent: { customers: Customer[] } }
type CustomerResult = { structuredContent: { customer: Customer } }

describe('Customer MCP Suite', () => {
  let client: Client

  before(async () => {
    client = await createTestClient()
  })

  after(async () => {
    await client.close()
  })

  it('should list customers', async () => {
    const result = await client.callTool({
      name: 'list_customers',
      arguments: {}
    }) as unknown as CustomersResult

    assert.ok(
      Array.isArray(result.structuredContent.customers),
      'Should return as array of customers'
    )
  })

  it('should create a customer', async () => {
    const result = await client.callTool({
      name: 'create_customer',
      arguments: {
        name: 'Thau',
        phone: '1234567890'
      }
    }) as unknown as CreateCustomerResult

    assert.ok(result.structuredContent.id, 'Should return a customer ID')
  })

  it('should get a customer', async () => {
    const customer = {
      name: 'Thauany',
      phone: '1234567890'
    }
    await client.callTool({
      name: 'create_customer',
      arguments: customer
    }) as unknown as CreateCustomerInput

    const result = await client.callTool({
      name: 'get_customer',
      arguments: {
        name: 'Thau',
      }
    }) as unknown as CustomerResult

    assert.ok(result.structuredContent.customer._id, 'Should return a customer ID')
  })
})
