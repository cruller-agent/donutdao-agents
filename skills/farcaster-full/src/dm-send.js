/**
 * Farcaster Direct Cast (DM) - Send Messages
 * 
 * Send direct messages to individuals or group chats on Warpcast.
 * 
 * IMPORTANT: DMs on Farcaster are NOT part of the decentralized protocol!
 * They are a Warpcast-specific feature using their proprietary API.
 * 
 * Authentication Options:
 * 1. WARPCAST_API_KEY - Warpcast API key (from Warpcast Developer Settings)
 *    - This is the recommended method for bot/agent usage
 *    - Get it from: Warpcast App > Settings > Developer Mode > API Keys
 * 
 * 2. Self-signed token (Ed25519 signer) - Only works for Farcaster Client API
 *    - Does NOT work for Warpcast DM API!
 * 
 * API Endpoint:
 * - PUT https://api.warpcast.com/v2/ext-send-direct-cast
 */

const https = require('https');
const { v4: uuidv4 } = require('uuid');

/**
 * Make HTTPS request to Warpcast API
 */
function makeRequest(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ 
            status: res.statusCode, 
            data: JSON.parse(data),
            headers: res.headers
          });
        } catch {
          resolve({ status: res.statusCode, data, headers: res.headers });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

/**
 * Send a direct message to a user by FID
 * 
 * @param {Object} options
 * @param {string} options.warpcastApiKey - Warpcast API key (from developer settings)
 * @param {number} options.recipientFid - Recipient's Farcaster ID
 * @param {string} options.message - Message text to send
 * @param {string} [options.idempotencyKey] - Unique key to prevent duplicates
 * @returns {Promise<Object>} API response
 */
async function sendDM({ warpcastApiKey, recipientFid, message, idempotencyKey }) {
  if (!warpcastApiKey) {
    throw new Error('Warpcast API key required. Get it from Warpcast app Developer Settings.');
  }

  const body = {
    recipientFid: Number(recipientFid),
    message,
    idempotencyKey: idempotencyKey || uuidv4()
  };

  console.log(`Sending DM to FID ${recipientFid}...`);
  console.log('Message:', message.substring(0, 50) + (message.length > 50 ? '...' : ''));

  const result = await makeRequest({
    hostname: 'api.warpcast.com',
    path: '/v2/ext-send-direct-cast',
    method: 'PUT',
    port: 443,
    headers: {
      'Authorization': `Bearer ${warpcastApiKey}`,
      'Content-Type': 'application/json'
    }
  }, body);

  return result;
}

/**
 * Send a message to a group/conversation by conversation ID
 * 
 * Conversation IDs are the hex-encoded UUIDs used in inbox URLs.
 * Format: ~/inbox/{conversationId}
 * Example: 4508b83dfc815a01
 * 
 * @param {Object} options
 * @param {string} options.warpcastApiKey - Warpcast API key (from developer settings)
 * @param {string} options.conversationId - Conversation/group ID (hex string)
 * @param {string} options.message - Message text to send
 * @param {string} [options.idempotencyKey] - Unique key to prevent duplicates
 * @returns {Promise<Object>} API response
 */
async function sendToConversation({ warpcastApiKey, conversationId, message, idempotencyKey }) {
  if (!warpcastApiKey) {
    throw new Error('Warpcast API key required. Get it from Warpcast app Developer Settings.');
  }

  const body = {
    conversationId,
    message,
    idempotencyKey: idempotencyKey || uuidv4()
  };

  console.log(`Sending message to conversation ${conversationId}...`);
  console.log('Message:', message.substring(0, 50) + (message.length > 50 ? '...' : ''));

  const result = await makeRequest({
    hostname: 'api.warpcast.com',
    path: '/v2/ext-send-direct-cast',
    method: 'PUT',
    port: 443,
    headers: {
      'Authorization': `Bearer ${warpcastApiKey}`,
      'Content-Type': 'application/json'
    }
  }, body);

  return result;
}

// CLI usage
if (require.main === module) {
  const warpcastApiKey = process.env.WARPCAST_API_KEY;
  
  const targetType = process.argv[2]; // 'user' or 'conversation'
  const target = process.argv[3];     // FID or conversation ID
  const message = process.argv[4];

  if (!warpcastApiKey) {
    console.log('Farcaster Direct Message Sender');
    console.log('================================');
    console.log('\n⚠️  IMPORTANT: Warpcast DMs require a Warpcast API key!');
    console.log('   This is separate from your Farcaster signer key.');
    console.log('\nHow to get a Warpcast API key:');
    console.log('   1. Open Warpcast app');
    console.log('   2. Go to Settings > Developer Mode (enable if needed)');
    console.log('   3. Go to Developer Tools > API Keys');
    console.log('   4. Create a new API key');
    console.log('   5. Store it: pass insert donut-agent/warpcast/api-key');
    console.log('\nRequired environment variable:');
    console.log('   WARPCAST_API_KEY - Your Warpcast API key');
    console.log('\nUsage:');
    console.log('   WARPCAST_API_KEY="..." node dm-send.js user <recipientFid> "Your message"');
    console.log('   WARPCAST_API_KEY="..." node dm-send.js conversation <conversationId> "Your message"');
    console.log('\nExamples:');
    console.log('   node dm-send.js user 272109 "Hello @heesh!"');
    console.log('   node dm-send.js conversation 4508b83dfc815a01 "Hello group!"');
    process.exit(1);
  }

  if (!targetType || !target || !message) {
    console.error('Usage: node dm-send.js <user|conversation> <target> "message"');
    process.exit(1);
  }

  const options = {
    warpcastApiKey,
    message
  };

  let sendPromise;
  if (targetType === 'user') {
    options.recipientFid = Number(target);
    sendPromise = sendDM(options);
  } else if (targetType === 'conversation') {
    options.conversationId = target;
    sendPromise = sendToConversation(options);
  } else {
    console.error('Target type must be "user" or "conversation"');
    process.exit(1);
  }

  sendPromise
    .then(result => {
      if (result.status === 200) {
        console.log('\n✅ Message sent successfully!');
        console.log('Response:', JSON.stringify(result.data, null, 2));
      } else {
        console.log('\n❌ Failed to send message');
        console.log('Status:', result.status);
        console.log('Response:', JSON.stringify(result.data, null, 2));
        
        if (result.status === 401) {
          console.log('\n💡 Tip: Make sure your Warpcast API key is valid.');
          console.log('   Get a new one from Warpcast > Settings > Developer Mode > API Keys');
        }
      }
    })
    .catch(err => {
      console.error('Error:', err.message);
      process.exit(1);
    });
}

module.exports = { sendDM, sendToConversation };
