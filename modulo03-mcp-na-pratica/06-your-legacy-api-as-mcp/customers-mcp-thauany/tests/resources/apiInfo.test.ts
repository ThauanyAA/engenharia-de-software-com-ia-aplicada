import { describe, it, after, before } from "node:test";
import assert from "node:assert";
import { createTestClient } from "../helpers.ts";
import { Client } from "@modelcontextprotocol/sdk/client";

describe('Customer Resources', () => {
  let client: Client

  before(async () => {
    client = await createTestClient()
  })

  after(async () => {
    await client.close()
  })

  it('should list the customers://api-info resource', async () => {
    const { resources } = await client.listResources()

    const info = resources.find(r => r.uri === 'customers://api-info')

    assert.ok(
      info,
      'Should return the customers://api-info resource'
    )

    assert.deepStrictEqual(
      info.description,
      "Describes the customer rest API that this MCP server wraps",
      'Should have the correct description'
    )
  })
})
