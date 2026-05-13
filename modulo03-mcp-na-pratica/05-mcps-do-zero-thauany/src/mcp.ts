import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { decrypt, encrypt } from "./service.ts";
 
export const server = new McpServer({
  name: '@thauanyaa/ciphersuite-mcp',
  description: 'A simple MCP server that provides encryption and decryption services.',
  version: '1.0.0',
})  

server.registerTool(
  'encrypt_message',
  {
    description: 'Encrypt a message',
    inputSchema: {
      message: z.string().describe('The message to encrypt'),
      encryptionKey: z.string().describe('Any passphrase to use for encryption - the server derives a strong key from it automatically'),
    },
    outputSchema: {
      encryptedMessage: z.string().describe('The encrypted message (format: iv:chiphertext)'),
    },
  },
  async ({ message, encryptionKey }) => {
    try {
      const encryptedMessage = encrypt(message, encryptionKey);
      return {
        content: [{ type: 'text', text: encryptedMessage }],
        structuredContent: { encryptedMessage }
      };  
    } catch (error) {
      return {
        isError: true,
        content: [{
          type: 'text',
          text: `Failed to encrypt the message! Check if the message and encryption key are valid. Error details: ${error instanceof Error ? error.message : String(error)}`,
        }]
      }
    }
  }
)

server.registerTool(
  'decrypt_message',
  {
    description: 'Decrypt a message',
    inputSchema: {
      encryptedMessage: z.string().describe('The encrypted message to decrypt (format: iv:chiphertext)'),
      encryptionKey: z.string().describe('The same passphrase used for during encryption'),
    },
    outputSchema: {
      decryptedMessage: z.string().describe('The decrypted original message'),
    },
  },
  async ({ encryptedMessage, encryptionKey }) => {
    try {
      const decryptedMessage = decrypt(encryptedMessage, encryptionKey);
      return {
        content: [{ type: 'text', text: decryptedMessage }],
        structuredContent: { decryptedMessage }
      };  
    } catch (error) {
      return {
        isError: true,
        content: [{
          type: 'text',
          text: `Failed to decrypt the message! Check if the encrypted message format is correct and if the encryption key is valid. Error details: ${error instanceof Error ? error.message : String(error)}`,
        }]
      }
    }
  }
)