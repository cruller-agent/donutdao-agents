#!/usr/bin/env node
/**
 * XMTP Read - Read messages via XMTP protocol
 * 
 * This script reads messages using XMTP, the decentralized messaging protocol.
 * Note: XMTP is SEPARATE from Warpcast's native "Direct Cast" DMs!
 * 
 * Usage:
 *   node xmtp-read.js list
 *   node xmtp-read.js read <conversationId> [limit]
 *   node xmtp-read.js stream
 * 
 * Environment:
 *   PRIVATE_KEY - Ethereum wallet private key
 *   XMTP_ENV    - 'dev' or 'production' (default: production)
 */

const xmtp = require('./xmtp-client');

async function main() {
  const privateKey = process.env.PRIVATE_KEY;
  const xmtpEnv = process.env.XMTP_ENV || 'production';
  
  const command = process.argv[2];
  
  if (!privateKey) {
    console.log('XMTP Read - Decentralized Messaging');
    console.log('====================================');
    console.log('\nXMTP is a decentralized messaging protocol. It is NOT the same as');
    console.log('Warpcast\'s "Direct Cast" DMs which use a proprietary API.');
    console.log('\nRequired environment variables:');
    console.log('   PRIVATE_KEY - Your Ethereum wallet private key');
    console.log('   XMTP_ENV    - "dev" or "production" (default: production)');
    console.log('\nUsage:');
    console.log('   node xmtp-read.js list');
    console.log('   node xmtp-read.js read <conversationId> [limit]');
    console.log('   node xmtp-read.js stream');
    console.log('\nExamples:');
    console.log('   PRIVATE_KEY="0x..." node xmtp-read.js list');
    console.log('   PRIVATE_KEY="0x..." node xmtp-read.js read abc123 20');
    console.log('   PRIVATE_KEY="0x..." node xmtp-read.js stream');
    process.exit(1);
  }
  
  if (!command) {
    console.error('Usage: node xmtp-read.js <list|read|stream>');
    process.exit(1);
  }
  
  try {
    const client = await xmtp.createClient(privateKey, { env: xmtpEnv });
    
    switch (command) {
      case 'list': {
        // List all conversations
        const conversations = await xmtp.listConversations(client);
        
        console.log('\n📬 Conversations:');
        console.log('=================');
        
        if (conversations.length === 0) {
          console.log('No conversations found.');
          console.log('\nNote: You need to have XMTP conversations to see them here.');
          console.log('Warpcast "Direct Cast" DMs are NOT shown - they use a different system.');
        } else {
          conversations.forEach((conv, i) => {
            const typeEmoji = conv.type === 'group' ? '👥' : '💬';
            console.log(`\n${i + 1}. ${typeEmoji} ${conv.name}`);
            console.log(`   ID: ${conv.id}`);
            console.log(`   Type: ${conv.type}`);
            if (conv.type === 'group') {
              console.log(`   Members: ${conv.memberCount}`);
            }
          });
        }
        break;
      }
      
      case 'read': {
        // Read messages from a conversation
        const conversationId = process.argv[3];
        const limit = parseInt(process.argv[4]) || 20;
        
        if (!conversationId) {
          console.error('Usage: node xmtp-read.js read <conversationId> [limit]');
          process.exit(1);
        }
        
        const messages = await xmtp.readMessages(client, conversationId, { limit });
        
        console.log(`\n📩 Messages (${messages.length}):`);
        console.log('==================');
        
        if (messages.length === 0) {
          console.log('No messages found.');
        } else {
          messages.forEach((msg, i) => {
            const time = msg.sentAt ? msg.sentAt.toLocaleString() : 'Unknown';
            const sender = msg.senderInboxId?.substring(0, 8) || 'Unknown';
            console.log(`\n${i + 1}. From: ${sender}... (${time})`);
            console.log(`   ${typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)}`);
          });
        }
        break;
      }
      
      case 'stream': {
        // Stream messages in real-time
        console.log('\n🎧 Streaming messages... (Ctrl+C to stop)');
        console.log('==========================================');
        
        const stop = await xmtp.streamMessages(client, (msg) => {
          const time = msg.sentAt ? msg.sentAt.toLocaleString() : 'Now';
          const sender = msg.senderInboxId?.substring(0, 8) || 'Unknown';
          console.log(`\n📨 New message (${time})`);
          console.log(`   From: ${sender}...`);
          console.log(`   Conv: ${msg.conversationId?.substring(0, 16)}...`);
          console.log(`   ${typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)}`);
        });
        
        // Handle Ctrl+C
        process.on('SIGINT', () => {
          console.log('\n\nStopping stream...');
          stop();
          process.exit(0);
        });
        
        // Keep running
        await new Promise(() => {});
        break;
      }
      
      default:
        console.error(`Unknown command: ${command}`);
        console.error('Valid commands: list, read, stream');
        process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();
