import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { decrypt, encrypt } from "./service.ts";
import { describe } from "node:test";
 
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

server.registerResource(
  'encryption://info',
  'encryption://info',
  {
    description: 'Describes the encryption algorithm and key requirements for using the encrypt_message and decrypt_message tools',
  },
  () => ({
    contents: [
      {
        uri: 'encryption://info',
        mimeType: 'text/plain',
        text: 'This MCP server uses AES-256-CBC for encryption and decryption. The encryption key is derived from the provided passphrase using PBKDF2 with a random salt. The encrypted message format is "iv:ciphertext", where "iv" is the initialization vector used during encryption, and "ciphertext" is the resulting encrypted data. To successfully encrypt and decrypt messages, ensure that you use the same passphrase for both operations and that the encrypted message follows the specified format.',
      },
    ],
  })
)

server.registerPrompt(
  'encrypt_message_prompt',
  {
    description: 'A prompt that guides the user through encrypting a message using the encrypt_message tool',
    argsSchema: {
      message: z.string().describe('The message to encrypt'),
      encryptionKey: z.string().describe('Any passphrase to use for encryption - the server derives a strong key from it automatically'),
    }
  },
  async ({ message, encryptionKey }) => ({
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `Please encrypt the message "${message}", we will use the "encrypt_message" tool. Encryption key to use: "${encryptionKey}".`
        }
      }
    ]
  })
)