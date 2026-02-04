/**
 * Farcaster Direct Cast (DM) - Read Messages
 * 
 * Read direct messages and conversations from Warpcast inbox.
 * 
 * IMPORTANT: DMs on Farcaster are NOT part of the decentralized protocol!
 * They are a Warpcast-specific feature using their proprietary API.
 * 
 * Authentication:
 * - Requires WARPCAST_API_KEY (from Warpcast Developer Settings)
 * - Get it from: Warpcast App > Settings > Developer Mode > API Keys
 * 
 * API Endpoints:
 * - GET https://api.warpcast.com/v2/direct-cast-inbox
 * - GET https://api.warpcast.com/v2/direct-cast-conversation
 */

const https = require('https');

/**
 * Make HTTPS GET request to Warpcast API
 */
function makeRequest(options) {
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
    req.end();
  });
}

/**
 * Get the inbox - list of all conversations
 * 
 * @param {Object} options
 * @param {string} options.warpcastApiKey - Warpcast API key
 * @param {number} [options.limit] - Max conversations to return
 * @param {string} [options.cursor] - Pagination cursor
 * @returns {Promise<Object>} Inbox data
 */
async function getInbox({ warpcastApiKey, limit, cursor }) {
  if (!warpcastApiKey) {
    throw new Error('Warpcast API key required. Get it from Warpcast app Developer Settings.');
  }

  let path = '/v2/direct-cast-inbox';
  const params = [];
  if (limit) params.push(`limit=${limit}`);
  if (cursor) params.push(`cursor=${encodeURIComponent(cursor)}`);
  if (params.length) path += '?' + params.join('&');

  console.log('Fetching inbox...');

  const result = await makeRequest({
    hostname: 'api.warpcast.com',
    path,
    method: 'GET',
    port: 443,
    headers: {
      'Authorization': `Bearer ${warpcastApiKey}`
    }
  });

  return result;
}

/**
 * Get messages in a specific conversation
 * 
 * @param {Object} options
 * @param {string} options.warpcastApiKey - Warpcast API key
 * @param {string} options.conversationId - Conversation ID
 * @param {number} [options.limit] - Max messages to return
 * @param {string} [options.cursor] - Pagination cursor
 * @returns {Promise<Object>} Conversation messages
 */
async function getConversation({ warpcastApiKey, conversationId, limit, cursor }) {
  if (!warpcastApiKey) {
    throw new Error('Warpcast API key required. Get it from Warpcast app Developer Settings.');
  }

  let path = `/v2/direct-cast-conversation?conversationId=${encodeURIComponent(conversationId)}`;
  if (limit) path += `&limit=${limit}`;
  if (cursor) path += `&cursor=${encodeURIComponent(cursor)}`;

  console.log(`Fetching conversation ${conversationId}...`);

  const result = await makeRequest({
    hostname: 'api.warpcast.com',
    path,
    method: 'GET',
    port: 443,
    headers: {
      'Authorization': `Bearer ${warpcastApiKey}`
    }
  });

  return result;
}

/**
 * Format conversation for display
 */
function formatConversation(conv) {
  const participants = conv.participants?.map(p => `@${p.username || p.fid}`).join(', ') || 'Unknown';
  const lastMessage = conv.lastMessage?.text?.substring(0, 50) || '';
  const time = conv.lastMessage?.timestamp 
    ? new Date(conv.lastMessage.timestamp).toLocaleString() 
    : 'Unknown';
  
  return {
    id: conv.conversationId || conv.id,
    participants,
    lastMessage: lastMessage + (lastMessage.length >= 50 ? '...' : ''),
    time,
    unread: conv.unreadCount || 0
  };
}

/**
 * Format message for display
 */
function formatMessage(msg) {
  return {
    from: `@${msg.author?.username || msg.senderFid || 'Unknown'}`,
    text: msg.text || msg.message,
    time: msg.timestamp ? new Date(msg.timestamp).toLocaleString() : 'Unknown'
  };
}

// CLI usage
if (require.main === module) {
  const warpcastApiKey = process.env.WARPCAST_API_KEY;
  
  const command = process.argv[2]; // 'inbox' or 'conversation'
  const conversationId = process.argv[3]; // Only for 'conversation'
  const limit = process.argv[4] ? parseInt(process.argv[4]) : 10;

  if (!warpcastApiKey) {
    console.log('Farcaster Direct Message Reader');
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
    console.log('   WARPCAST_API_KEY="..." node dm-read.js inbox [limit]');
    console.log('   WARPCAST_API_KEY="..." node dm-read.js conversation <conversationId> [limit]');
    console.log('\nExamples:');
    console.log('   node dm-read.js inbox 20');
    console.log('   node dm-read.js conversation 4508b83dfc815a01 10');
    process.exit(1);
  }

  if (!command) {
    console.error('Usage: node dm-read.js <inbox|conversation> [conversationId] [limit]');
    process.exit(1);
  }

  const options = {
    warpcastApiKey,
    limit
  };

  let readPromise;
  if (command === 'inbox') {
    readPromise = getInbox(options);
  } else if (command === 'conversation') {
    if (!conversationId) {
      console.error('Conversation ID required for conversation command');
      process.exit(1);
    }
    options.conversationId = conversationId;
    readPromise = getConversation(options);
  } else {
    console.error('Command must be "inbox" or "conversation"');
    process.exit(1);
  }

  readPromise
    .then(result => {
      if (result.status === 200) {
        console.log('\n✅ Success!\n');
        
        if (command === 'inbox') {
          const conversations = result.data?.result?.conversations || result.data?.conversations || [];
          console.log(`Found ${conversations.length} conversations:\n`);
          conversations.forEach((conv, i) => {
            const formatted = formatConversation(conv);
            console.log(`${i + 1}. [${formatted.id}]`);
            console.log(`   Participants: ${formatted.participants}`);
            console.log(`   Last: "${formatted.lastMessage}"`);
            console.log(`   Time: ${formatted.time}`);
            console.log(`   Unread: ${formatted.unread}\n`);
          });
        } else {
          const messages = result.data?.result?.messages || result.data?.messages || [];
          console.log(`Found ${messages.length} messages:\n`);
          messages.forEach((msg, i) => {
            const formatted = formatMessage(msg);
            console.log(`${i + 1}. ${formatted.from} (${formatted.time})`);
            console.log(`   ${formatted.text}\n`);
          });
        }
        
        // Show raw response for debugging
        if (process.env.DEBUG) {
          console.log('\nRaw response:');
          console.log(JSON.stringify(result.data, null, 2));
        }
      } else {
        console.log('\n❌ Failed to fetch data');
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

module.exports = { getInbox, getConversation, formatConversation, formatMessage };
