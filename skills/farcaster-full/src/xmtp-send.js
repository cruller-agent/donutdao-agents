#!/usr/bin/env node
/**
 * XMTP Send - Send messages via XMTP protocol
 * 
 * This script sends messages using XMTP, the decentralized messaging protocol.
 * Note: XMTP is SEPARATE from Warpcast's native "Direct Cast" DMs!
 * 
 * Usage:
 *   node xmtp-send.js dm <address> "message"
 *   node xmtp-send.js group <groupId> "message"
 *   node xmtp-send.js create-group <name> <addr1,addr2,...> "welcome message"
 *   node xmtp-send.js check <address>
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
    console.log('XMTP Send - Decentralized Messaging');
    console.log('====================================');
    console.log('\nXMTP is a decentralized messaging protocol. It is NOT the same as');
    console.log('Warpcast\'s "Direct Cast" DMs which use a proprietary API.');
    console.log('\n⚠️  Important:');
    console.log('   - Recipients must have XMTP enabled to receive messages');
    console.log('   - XMTP uses Ethereum addresses, not Farcaster FIDs');
    console.log('   - Warpcast conversation IDs do NOT work with XMTP');
    console.log('\nRequired environment variables:');
    console.log('   PRIVATE_KEY - Your Ethereum wallet private key');
    console.log('   XMTP_ENV    - "dev" or "production" (default: production)');
    console.log('\nUsage:');
    console.log('   node xmtp-send.js dm <address> "message"');
    console.log('   node xmtp-send.js group <groupId> "message"');
    console.log('   node xmtp-send.js create-group <name> <addr1,addr2,...> "message"');
    console.log('   node xmtp-send.js check <address>');
    console.log('\nExamples:');
    console.log('   PRIVATE_KEY="0x..." node xmtp-send.js check 0x1234...abcd');
    console.log('   PRIVATE_KEY="0x..." node xmtp-send.js dm 0x1234...abcd "Hello!"');
    console.log('   PRIVATE_KEY="0x..." node xmtp-send.js create-group "Test" 0x123,0x456 "Hi group!"');
    process.exit(1);
  }
  
  if (!command) {
    console.error('Usage: node xmtp-send.js <dm|group|create-group|check> <args>');
    process.exit(1);
  }
  
  try {
    switch (command) {
      case 'check': {
        // Check if an address can receive XMTP messages
        const address = process.argv[3];
        if (!address) {
          console.error('Usage: node xmtp-send.js check <address>');
          process.exit(1);
        }
        
        console.log(`Checking if ${address} can receive XMTP messages...`);
        
        const client = await xmtp.createClient(privateKey, { env: xmtpEnv });
        const result = await xmtp.canMessage(client, [address]);
        
        const canReceive = result.get(address.toLowerCase());
        if (canReceive) {
          console.log(`\n✅ ${address} CAN receive XMTP messages!`);
        } else {
          console.log(`\n❌ ${address} CANNOT receive XMTP messages.`);
          console.log('   They need to enable XMTP in a compatible app first.');
        }
        break;
      }
      
      case 'dm': {
        // Send a DM
        const address = process.argv[3];
        const message = process.argv[4];
        
        if (!address || !message) {
          console.error('Usage: node xmtp-send.js dm <address> "message"');
          process.exit(1);
        }
        
        const client = await xmtp.createClient(privateKey, { env: xmtpEnv });
        const result = await xmtp.sendDM(client, address, message);
        
        console.log('\n✅ DM sent!');
        console.log(`   To: ${result.recipientAddress}`);
        console.log(`   Conversation: ${result.conversationId}`);
        break;
      }
      
      case 'group': {
        // Send to existing group
        const groupId = process.argv[3];
        const message = process.argv[4];
        
        if (!groupId || !message) {
          console.error('Usage: node xmtp-send.js group <groupId> "message"');
          process.exit(1);
        }
        
        const client = await xmtp.createClient(privateKey, { env: xmtpEnv });
        const result = await xmtp.sendToGroup(client, groupId, message);
        
        console.log('\n✅ Message sent to group!');
        console.log(`   Group: ${result.groupId}`);
        break;
      }
      
      case 'create-group': {
        // Create a new group and optionally send a message
        const name = process.argv[3];
        const membersStr = process.argv[4];
        const message = process.argv[5];
        
        if (!name || !membersStr) {
          console.error('Usage: node xmtp-send.js create-group <name> <addr1,addr2,...> ["message"]');
          process.exit(1);
        }
        
        const members = membersStr.split(',').map(a => a.trim());
        
        const client = await xmtp.createClient(privateKey, { env: xmtpEnv });
        const group = await xmtp.createGroup(client, members, { name });
        
        console.log('\n✅ Group created!');
        console.log(`   Name: ${group.name}`);
        console.log(`   Group ID: ${group.groupId}`);
        console.log(`   Members: ${group.members.length}`);
        
        if (message) {
          await xmtp.sendToGroup(client, group.groupId, message);
          console.log(`   Initial message sent!`);
        }
        break;
      }
      
      default:
        console.error(`Unknown command: ${command}`);
        console.error('Valid commands: dm, group, create-group, check');
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
