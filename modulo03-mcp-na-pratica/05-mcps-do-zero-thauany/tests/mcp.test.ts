import { describe, it, after, before } from "node:test";
import assert from "node:assert";
import { Client } from "@modelcontextprotocol/sdk/client";
import { createTestClient } from "./helpers.ts";
import { de } from "zod/v4/locales";

async function encryptMessage(client: Client, message: string, encryptionKey: string) {
  const result = await client.callTool({
    name: 'encrypt_message',
    arguments: {
      message,
      encryptionKey
    }
  }) as unknown as { structuredContent: { encryptedMessage: string } };
  return result;
}

async function decryptMessage(client: Client, encryptedMessage: string, encryptionKey: string) {
  const result = await client.callTool({
    name: 'decrypt_message',
    arguments: {
      encryptedMessage,
      encryptionKey
    }
  }) as unknown as { structuredContent: { decryptedMessage: string } };
  return result;
}

describe("MCP Tool Tests", () => {
  let client: Client;
  let encryptionKey = 'my-super-passphrase';
  before(async () => {
    client = await createTestClient();
  })
  after(async () => {
    await client.close();
  })
  
  it("should encrypt a message correctly", async () => {
    const myMessage = "Hello, World!";
    const result = await encryptMessage(
      client,
      myMessage,
      encryptionKey
    );
    
    assert.ok(
      result.structuredContent.encryptedMessage.length > 60,
      "Encrypted message should not be empty"
    );
  });
  
  it("should decrypt a message correctly", async () => {
    const myMessage = "Hello!";
    const { structuredContent: { encryptedMessage } }  = await encryptMessage(
      client,
      myMessage,
      encryptionKey
    )
    
    const { structuredContent: { decryptedMessage } } = await decryptMessage(
      client,
      encryptedMessage,
      encryptionKey
    )

    assert.deepStrictEqual(
      decryptedMessage,
      myMessage,
      "Decrypted message should match the original message"
    )
   
  });
})