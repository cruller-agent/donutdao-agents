/**
 * XMTP Client for Farcaster Private Messaging
 * 
 * XMTP (Extensible Message Transport Protocol) is the decentralized messaging
 * protocol used by many Farcaster apps for DMs and group chats.
 * 
 * IMPORTANT ARCHITECTURE NOTES:
 * ===========================
 * 
 * 1. XMTP vs Warpcast DMs:
 *    - Warpcast's native DMs ("Direct Casts") use a PROPRIETARY API, NOT XMTP
 *    - XMTP is a separate protocol that some Farcaster clients support
 *    - Users need an XMTP-enabled client to receive XMTP messages
 *    - NOT all Farcaster users have XMTP enabled
 * 
 * 2. Identity Model:
 *    - XMTP uses Ethereum addresses as identities (NOT Farcaster FIDs!)
 *    - To message a Farcaster user via XMTP, you need their custody address
 *    - The custody address is the wallet that registered their FID
 * 
 * 3. Group Chats:
 *    - XMTP v3 supports MLS-based group chats (up to 250 members)
 *    - Groups use inbox IDs, not conversation IDs like Warpcast
 *    - You can only add members who have XMTP enabled
 * 
 * 4. Conversation IDs:
 *    - Warpcast conversation IDs (like "4508b83dfc815a01") are Warpcast-specific
 *    - XMTP has its own conversation/group identifiers
 *    - These are NOT interchangeable!
 * 
 * Usage:
 *   const xmtp = require('./xmtp-client');
 *   const client = await xmtp.createClient(privateKey);
 *   await xmtp.sendDM(client, '0xRecipientAddress', 'Hello!');
 */

const { Client, IdentifierKind, ConsentState } = require('@xmtp/node-sdk');
const { Wallet } = require('ethers');
const crypto = require('node:crypto');
const fs = require('fs');
const path = require('path');

// XMTP data directory for persistence
const XMTP_DATA_DIR = path.join(__dirname, '..', '.xmtp-data');

// Ensure data directory exists
if (!fs.existsSync(XMTP_DATA_DIR)) {
  fs.mkdirSync(XMTP_DATA_DIR, { recursive: true });
}

/**
 * Get or create a database encryption key for XMTP
 * This key is used to encrypt the local SQLite database
 * 
 * @param {string} address - Wallet address (used to namespace keys)
 * @returns {Uint8Array} 32-byte encryption key
 */
function getOrCreateDbEncryptionKey(address) {
  const keyFile = path.join(XMTP_DATA_DIR, `${address.toLowerCase()}-db-key`);
  
  if (fs.existsSync(keyFile)) {
    const keyHex = fs.readFileSync(keyFile, 'utf8').trim();
    return Buffer.from(keyHex, 'hex');
  }
  
  // Generate new key
  const key = crypto.getRandomValues(new Uint8Array(32));
  const keyHex = Buffer.from(key).toString('hex');
  fs.writeFileSync(keyFile, keyHex, { mode: 0o600 });
  console.log(`Created new XMTP database encryption key for ${address}`);
  
  return key;
}

/**
 * Create a signer from an Ethereum wallet
 * 
 * @param {Wallet} wallet - ethers.js Wallet instance
 * @returns {Object} XMTP Signer object
 */
function createSigner(wallet) {
  return {
    type: 'EOA',
    getIdentifier: () => ({
      identifier: wallet.address.toLowerCase(),
      identifierKind: IdentifierKind.Ethereum,
    }),
    signMessage: async (message) => {
      // XMTP expects raw bytes, not hex string
      const signature = await wallet.signMessage(message);
      // Remove 0x prefix and convert to bytes
      return Buffer.from(signature.slice(2), 'hex');
    },
  };
}

/**
 * Create an XMTP client
 * 
 * @param {string} privateKey - Ethereum private key (with or without 0x prefix)
 * @param {Object} options - Client options
 * @param {string} [options.env='production'] - XMTP environment ('dev' or 'production')
 * @param {string} [options.appVersion='farcaster-agent/1.0'] - App version identifier
 * @returns {Promise<Client>} XMTP Client instance
 */
async function createClient(privateKey, options = {}) {
  const {
    env = 'production',
    appVersion = 'farcaster-agent/1.0'
  } = options;
  
  // Ensure private key has 0x prefix
  const pk = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
  const wallet = new Wallet(pk);
  
  console.log(`Creating XMTP client for ${wallet.address}...`);
  console.log(`Environment: ${env}`);
  
  const signer = createSigner(wallet);
  const dbEncryptionKey = getOrCreateDbEncryptionKey(wallet.address);
  
  // Database path for persistence
  const dbPath = path.join(XMTP_DATA_DIR, `${wallet.address.toLowerCase()}-${env}.db3`);
  
  const client = await Client.create(signer, {
    env,
    appVersion,
    dbEncryptionKey,
    dbPath,
  });
  
  console.log(`✅ XMTP client created!`);
  console.log(`   Inbox ID: ${client.inboxId}`);
  console.log(`   Address: ${wallet.address}`);
  
  return client;
}

/**
 * Check if addresses can receive XMTP messages
 * 
 * @param {Client} client - XMTP client (used for env config)
 * @param {string[]} addresses - Ethereum addresses to check
 * @param {string} [env='production'] - XMTP environment
 * @returns {Promise<Map<string, boolean>>} Map of address to reachability
 */
async function canMessage(client, addresses, env = 'production') {
  const identifiers = addresses.map(addr => ({
    identifier: addr.toLowerCase(),
    identifierKind: IdentifierKind.Ethereum,
  }));
  
  // Static method - pass identifiers and env as separate args
  return await Client.canMessage(identifiers, env);
}

/**
 * Send a direct message to an Ethereum address
 * 
 * @param {Client} client - XMTP client
 * @param {string} recipientAddress - Recipient's Ethereum address
 * @param {string} message - Message text to send
 * @param {string} [env='production'] - XMTP environment
 * @returns {Promise<Object>} Result with conversation and message info
 */
async function sendDM(client, recipientAddress, message, env = 'production') {
  const addr = recipientAddress.toLowerCase();
  
  console.log(`Sending DM to ${addr}...`);
  
  // Check if recipient can receive XMTP messages
  const canReceive = await canMessage(client, [addr], env);
  if (!canReceive.get(addr)) {
    throw new Error(`Recipient ${addr} cannot receive XMTP messages. They may not have XMTP enabled.`);
  }
  
  const identifier = {
    identifier: addr,
    identifierKind: IdentifierKind.Ethereum,
  };
  
  // Get or create DM conversation
  const dm = await client.conversations.fetchDmByIdentifier(identifier);
  
  let conversation;
  if (dm) {
    conversation = dm;
    console.log(`Found existing DM conversation`);
  } else {
    // Create new DM using identifier
    // Sync first to ensure we have latest state
    await client.conversations.syncAll();
    
    // Use createDmWithIdentifier for address-based creation
    conversation = await client.conversations.createDmWithIdentifier(identifier);
    console.log(`Created new DM conversation`);
  }
  
  // Send the message
  await conversation.sendText(message);
  
  console.log(`✅ Message sent!`);
  
  return {
    conversationId: conversation.id,
    recipientAddress: addr,
    message,
  };
}

/**
 * Create a new group chat
 * 
 * @param {Client} client - XMTP client
 * @param {string[]} memberAddresses - Array of member Ethereum addresses
 * @param {Object} options - Group options
 * @param {string} [options.name] - Group name
 * @param {string} [options.description] - Group description
 * @param {string} [options.env='production'] - XMTP environment
 * @returns {Promise<Object>} Created group info
 */
async function createGroup(client, memberAddresses, options = {}) {
  const { name, description, env = 'production' } = options;
  
  console.log(`Creating group with ${memberAddresses.length} members...`);
  
  // Check which members can receive XMTP
  const reachability = await canMessage(client, memberAddresses, env);
  const reachableMembers = memberAddresses.filter(addr => 
    reachability.get(addr.toLowerCase())
  );
  
  if (reachableMembers.length === 0) {
    throw new Error('No members are reachable on XMTP. They need to have XMTP enabled.');
  }
  
  if (reachableMembers.length < memberAddresses.length) {
    const unreachable = memberAddresses.filter(addr => 
      !reachability.get(addr.toLowerCase())
    );
    console.log(`⚠️  ${unreachable.length} members not reachable on XMTP: ${unreachable.join(', ')}`);
  }
  
  // Convert addresses to identifiers
  const memberIdentifiers = reachableMembers.map(addr => ({
    identifier: addr.toLowerCase(),
    identifierKind: IdentifierKind.Ethereum,
  }));
  
  // Build group options
  const groupOptions = {};
  if (name) groupOptions.name = name;
  if (description) groupOptions.description = description;
  
  // Use createGroupWithIdentifiers for address-based creation
  const group = await client.conversations.createGroupWithIdentifiers(
    memberIdentifiers,
    Object.keys(groupOptions).length ? groupOptions : undefined
  );
  
  console.log(`✅ Group created!`);
  console.log(`   Group ID: ${group.id}`);
  console.log(`   Members added: ${reachableMembers.length}`);
  
  return {
    groupId: group.id,
    name: name || 'Unnamed Group',
    members: reachableMembers,
  };
}

/**
 * Send a message to a group
 * 
 * @param {Client} client - XMTP client
 * @param {string} groupId - XMTP group ID
 * @param {string} message - Message text to send
 * @returns {Promise<Object>} Result info
 */
async function sendToGroup(client, groupId, message) {
  console.log(`Sending message to group ${groupId}...`);
  
  // Sync to get latest groups
  await client.conversations.syncAll();
  
  // Find the group
  const conversation = await client.conversations.getConversationById(groupId);
  
  if (!conversation) {
    throw new Error(`Group ${groupId} not found. Make sure you're a member.`);
  }
  
  await conversation.sendText(message);
  
  console.log(`✅ Message sent to group!`);
  
  return {
    groupId,
    message,
  };
}

/**
 * List all conversations (DMs and groups)
 * 
 * @param {Client} client - XMTP client
 * @param {Object} options - List options
 * @param {string[]} [options.consentStates] - Filter by consent state
 * @returns {Promise<Object[]>} Array of conversation info
 */
async function listConversations(client, options = {}) {
  const { consentStates = ['allowed', 'unknown'] } = options;
  
  console.log('Syncing conversations...');
  await client.conversations.syncAll();
  
  const conversations = await client.conversations.list({
    consentStates: consentStates.map(s => {
      switch(s) {
        case 'allowed': return ConsentState.Allowed;
        case 'unknown': return ConsentState.Unknown;
        case 'denied': return ConsentState.Denied;
        default: return ConsentState.Unknown;
      }
    }),
  });
  
  console.log(`Found ${conversations.length} conversations`);
  
  return conversations.map(conv => ({
    id: conv.id,
    type: conv.members?.length > 2 ? 'group' : 'dm',
    name: conv.name || 'Unnamed',
    memberCount: conv.members?.length || 0,
  }));
}

/**
 * Read messages from a conversation
 * 
 * @param {Client} client - XMTP client
 * @param {string} conversationId - Conversation ID
 * @param {Object} options - Read options
 * @param {number} [options.limit=20] - Max messages to return
 * @returns {Promise<Object[]>} Array of messages
 */
async function readMessages(client, conversationId, options = {}) {
  const { limit = 20 } = options;
  
  console.log(`Reading messages from ${conversationId}...`);
  
  // Sync first
  await client.conversations.syncAll();
  
  const conversation = await client.conversations.getConversationById(conversationId);
  
  if (!conversation) {
    throw new Error(`Conversation ${conversationId} not found`);
  }
  
  // Sync this conversation's messages
  await conversation.sync();
  
  const messages = await conversation.messages({ limit });
  
  return messages.map(msg => ({
    id: msg.id,
    senderInboxId: msg.senderInboxId,
    content: msg.content,
    sentAt: msg.sentAtNs ? new Date(Number(msg.sentAtNs) / 1_000_000) : null,
  }));
}

/**
 * Stream new messages in real-time
 * 
 * @param {Client} client - XMTP client
 * @param {Function} onMessage - Callback for new messages
 * @param {Object} options - Stream options
 * @returns {Promise<Function>} Function to stop streaming
 */
async function streamMessages(client, onMessage, options = {}) {
  console.log('Starting message stream...');
  
  const stream = await client.conversations.streamAllMessages({
    consentStates: [ConsentState.Allowed, ConsentState.Unknown],
    onValue: (message) => {
      onMessage({
        id: message.id,
        conversationId: message.conversationId,
        senderInboxId: message.senderInboxId,
        content: message.content,
        sentAt: message.sentAtNs ? new Date(Number(message.sentAtNs) / 1_000_000) : null,
      });
    },
    onError: (error) => {
      console.error('Stream error:', error);
    },
  });
  
  console.log('✅ Streaming messages...');
  
  return () => {
    stream.return();
  };
}

/**
 * Get the inbox ID for a given address
 * 
 * @param {string} address - Ethereum address
 * @returns {Promise<string|null>} Inbox ID or null if not registered
 */
async function getInboxIdForAddress(address) {
  const canReceive = await Client.canMessage([{
    identifier: address.toLowerCase(),
    identifierKind: IdentifierKind.Ethereum,
  }]);
  
  // If they can receive, we know they have an inbox
  // But we'd need a client to get the actual inbox ID
  return canReceive.get(address.toLowerCase()) ? 'registered' : null;
}

// Export functions
module.exports = {
  createClient,
  createSigner,
  canMessage,
  sendDM,
  createGroup,
  sendToGroup,
  listConversations,
  readMessages,
  streamMessages,
  getInboxIdForAddress,
  XMTP_DATA_DIR,
};
