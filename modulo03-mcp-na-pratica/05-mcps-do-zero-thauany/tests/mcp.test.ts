import { describe, it, after, before } from "node:test";
import assert from "node:assert";
import { Client } from "@modelcontextprotocol/sdk/client";
import { createTestClient } from "./helpers.ts";

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

  it('should list the encryption://info resource', async () => {
    const resources = await client.listResources();
    const resourcesList = ((resources as unknown) as { resources: { uri: string }[] }).resources;
    const info = resourcesList?.find(r => r.uri === 'encryption://info');
    assert.ok(info, 'encryption://info resource should be listed');
  })

  it('should return the encrypt_message_prompt', async () => {
    const message = 'Secret Message'
    const result = await client.getPrompt({
      name: 'encrypt_message_prompt',
      arguments: {
        message,
        encryptionKey
      }
    });
    const item = result.messages.at(0)?.content as unknown as { text: string };
    const expectedText = `Please encrypt the message "${message}", we will use the "encrypt_message" tool.`;
    assert.ok(
      item.text.includes(expectedText),
      'Prompt should reference the encrypt_message tool'
    );
  })
})