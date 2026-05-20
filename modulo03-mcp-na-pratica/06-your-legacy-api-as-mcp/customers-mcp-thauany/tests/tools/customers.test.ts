import { describe, it, after, before } from "node:test";
import assert from "node:assert";
import { createTestClient } from "../helpers.ts";
import { Client } from "@modelcontextprotocol/sdk/client";
import { type CustomerMutation, type Customer, type CustomerUpdate } from "../../src/domain/customer.ts";

type CustomerMutationResult = { structuredContent: CustomerMutation }
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
        name: 'Thauany AA',
        phone: '1234567890'
      }
    }) as unknown as CustomerMutationResult

    assert.ok(result.structuredContent.id, 'Should return a customer ID')
  })

  it('should get a customer', async () => {
    const customer = {
      name: 'Thauany',
      phone: '1234567890'
    }

    const result = await client.callTool({
      name: 'get_customer',
      arguments: customer
    }) as unknown as CustomerResult

    assert.ok(result.structuredContent.customer._id, 'Should return a customer ID')
  })
  it('should update a customer', async () => {
    const customer = {
      name: 'Thauany A. Alves',
      phone: '1234567890'
    }

    const { structuredContent: { id }} = await client.callTool({
      name: 'create_customer',
      arguments: customer
    }) as unknown as CustomerMutationResult

    const result =await client.callTool({
      name: 'update_customer',
      arguments: {
        _id: id,
        name: 'Fabio Queiroz',
        phone: customer.phone
      } as CustomerUpdate
    }) as unknown as CustomerMutationResult

    assert.ok(
      result.structuredContent.message,
      'Should return a message describing the result of the mutation'
    )
    assert.deepStrictEqual(
      result.structuredContent.id,
      id,
      'Should return the same customer ID'
    )
  })

  it('should delete a customer', async () => {
    const customer = {
      name: 'Joao Silva',
      phone: '1234567890'
    }

    const { structuredContent: { id }} = await client.callTool({
      name: 'create_customer',
      arguments: customer
    }) as unknown as CustomerMutationResult

    const result =await client.callTool({
      name: 'delete_customer',
      arguments: {
        _id: id
      }
    }) as unknown as CustomerMutationResult
  
    assert.deepStrictEqual(
      result.structuredContent.message,
      `User ${id} deleted!`,
      'Should return deleted message'
    )
    assert.deepStrictEqual(
      result.structuredContent.id,
      id,
      'Should return the same customer ID'
    )
  })
})
