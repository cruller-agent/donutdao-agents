/**
 * Farcaster Group Posting Script
 * 
 * IMPORTANT: Farcaster "Groups" (~/group/{id}) are different from "Channels" (~/channel/{id})
 * 
 * - CHANNELS: Protocol-level feature, stored on Farcaster hubs, accessible via x402 payments
 * - GROUPS: Warpcast-proprietary feature, requires Neynar API key (not x402)
 * 
 * This script attempts to post to groups using the Neynar API.
 * If you don't have a Neynar API key, use post-to-channel.js for channel posting instead.
 * 
 * To get a Neynar API key: https://neynar.com (some plans are free for basic usage)
 */

const { Wallet, JsonRpcProvider } = require('ethers');
const {
  makeCastAdd,
  NobleEd25519Signer,
  FarcasterNetwork,
  Message
} = require('@farcaster/hub-nodejs');
const { RPC } = require('./config');
const { submitMessage, getCast } = require('./x402');
const https = require('https');

/**
 * Make a request to Neynar API with API key
 */
async function neynarRequest(apiKey, options, body = null) {
  return new Promise((resolve, reject) => {
    const reqOptions = {
      ...options,
      port: 443,
      headers: {
        ...options.headers,
        'api_key': apiKey,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(body);
    }
    req.end();
  });
}

/**
 * Get group information from Neynar API
 */
async function getGroup(apiKey, groupId) {
  const result = await neynarRequest(apiKey, {
    hostname: 'api.neynar.com',
    path: `/v2/farcaster/group?identifier=${encodeURIComponent(groupId)}`,
    method: 'GET'
  });
  
  if (result.status !== 200) {
    return null;
  }
  
  return result.data?.group;
}

/**
 * Get group feed from Neynar API
 */
async function getGroupFeed(apiKey, groupId, limit = 10) {
  const result = await neynarRequest(apiKey, {
    hostname: 'api.neynar.com',
    path: `/v2/farcaster/group/feed?group_id=${encodeURIComponent(groupId)}&limit=${limit}`,
    method: 'GET'
  });
  
  if (result.status !== 200) {
    return [];
  }
  
  return result.data?.casts || [];
}

/**
 * Post to a Farcaster group
 * 
 * Note: Groups may require specific parentUrl format or use a different posting mechanism.
 * This function attempts to post using the warpcast group URL as parentUrl.
 * 
 * If this doesn't work, you may need to:
 * 1. Use the Neynar managed signer API
 * 2. Post through Warpcast directly
 * 
 * @param {Object} options
 * @param {string} options.privateKey - Custody wallet private key
 * @param {string} options.signerPrivateKey - Ed25519 signer private key
 * @param {number} options.fid - Farcaster ID
 * @param {string} options.text - Cast text content
 * @param {string} options.groupId - Group ID (base64 URL-safe encoded, e.g., '7qIxCdzvkPEVZMqFVSM-tg')
 * @param {string} [options.neynarApiKey] - Optional Neynar API key for group lookup
 */
async function postToGroup({ privateKey, signerPrivateKey, fid, text, groupId, neynarApiKey }) {
  // Create wallet for x402 payments
  const baseProvider = new JsonRpcProvider(RPC.BASE);
  const wallet = new Wallet(privateKey, baseProvider);

  // Determine the parentUrl for the group
  // Groups use a URL format like: https://warpcast.com/~/group/{groupId}
  // or potentially: https://farcaster.xyz/~/group/{groupId}
  const parentUrl = `https://warpcast.com/~/group/${groupId}`;

  console.log('Group ID:', groupId);
  console.log('Using parentUrl:', parentUrl);
  console.log('Posting as FID:', fid);
  console.log('Text:', text);

  // If we have an API key, try to look up group info
  if (neynarApiKey) {
    console.log('\nLooking up group info...');
    const group = await getGroup(neynarApiKey, groupId);
    if (group) {
      console.log('Group found:', group.name || 'Unknown');
    } else {
      console.log('Could not fetch group info (this may be normal)');
    }
  }

  // Create signer
  const signerBytes = Buffer.from(signerPrivateKey, 'hex');
  const signer = new NobleEd25519Signer(signerBytes);

  // Create cast message with parentUrl for group
  const castResult = await makeCastAdd(
    {
      text,
      embeds: [],
      embedsDeprecated: [],
      mentions: [],
      mentionsPositions: [],
      parentUrl
    },
    {
      fid,
      network: FarcasterNetwork.MAINNET
    },
    signer
  );

  if (castResult.isErr()) {
    throw new Error(`Failed to create cast: ${castResult.error}`);
  }

  const cast = castResult.value;
  const hash = '0x' + Buffer.from(cast.hash).toString('hex');
  const messageBytes = Buffer.from(Message.encode(cast).finish());

  console.log('\nCast hash:', hash);
  console.log('Message size:', messageBytes.length, 'bytes');

  // Submit to Neynar hub
  console.log('Submitting to Neynar hub...');
  const submitResult = await submitMessage(wallet, messageBytes);

  if (submitResult.status !== 200) {
    throw new Error(`Submit failed: ${JSON.stringify(submitResult.data)}`);
  }

  console.log('Submitted successfully');

  // Wait for propagation
  await new Promise(r => setTimeout(r, 2000));

  // Verify
  console.log('Verifying cast...');
  const verifyResult = await getCast(wallet, hash);
  const verified = verifyResult.status === 200;

  if (verified) {
    console.log('\nCast verified on network!');
  } else {
    console.log('\nCast submitted but not yet verified.');
  }

  return {
    hash,
    verified,
    groupUrl: `https://warpcast.com/~/group/${groupId}`,
    castUrl: `https://warpcast.com/~/conversations/${hash}`,
    note: 'Group posting may require the cast to appear through Warpcast specifically. If it does not appear in the group feed, the cast was still posted to your profile.'
  };
}

// CLI usage
if (require.main === module) {
  const privateKey = process.env.PRIVATE_KEY;
  const signerPrivateKey = process.env.SIGNER_PRIVATE_KEY;
  const fid = parseInt(process.env.FID);
  const neynarApiKey = process.env.NEYNAR_API_KEY;
  const groupId = process.argv[2];
  const text = process.argv[3];

  if (!privateKey || !signerPrivateKey || !fid || !groupId || !text) {
    console.log('Farcaster Group Posting');
    console.log('========================');
    console.log('\nUsage: PRIVATE_KEY=0x... SIGNER_PRIVATE_KEY=... FID=123 [NEYNAR_API_KEY=...] node group-post.js <groupId> "Your text"');
    console.log('\nExample:');
    console.log('  node group-post.js 7qIxCdzvkPEVZMqFVSM-tg "Hello group!"');
    console.log('\nEnvironment variables:');
    console.log('  PRIVATE_KEY        - Custody wallet private key (required)');
    console.log('  SIGNER_PRIVATE_KEY - Ed25519 signer private key (required)');
    console.log('  FID                - Your Farcaster ID number (required)');
    console.log('  NEYNAR_API_KEY     - Neynar API key (optional, for group lookup)');
    console.log('\nNOTE: Groups are a Warpcast-specific feature.');
    console.log('      Unlike channels, group posts may not propagate to the group feed');
    console.log('      unless you have proper Neynar API access or post through Warpcast.');
    console.log('\nFor channel posting (recommended), use: node post-to-channel.js <channelId> "text"');
    process.exit(1);
  }

  postToGroup({ privateKey, signerPrivateKey, fid, text, groupId, neynarApiKey })
    .then(result => {
      console.log('\n=== Group Post Result ===');
      console.log('Hash:', result.hash);
      console.log('Verified:', result.verified);
      console.log('Group URL:', result.groupUrl);
      console.log('Cast URL:', result.castUrl);
      console.log('\n' + result.note);
    })
    .catch(err => {
      console.error('Error:', err.message);
      process.exit(1);
    });
}

module.exports = { postToGroup, getGroup, getGroupFeed, neynarRequest };
