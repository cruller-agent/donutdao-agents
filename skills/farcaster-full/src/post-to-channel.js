const { Wallet, JsonRpcProvider } = require('ethers');
const {
  makeCastAdd,
  NobleEd25519Signer,
  FarcasterNetwork,
  Message
} = require('@farcaster/hub-nodejs');
const { RPC } = require('./config');
const { submitMessage, getCast, x402Request } = require('./x402');

/**
 * Post a cast to a Farcaster channel
 *
 * Channels use parentUrl to associate casts with a topic.
 * Common format: https://warpcast.com/~/channel/{channelId}
 * Or: https://farcaster.xyz/~/channel/{channelId}
 * Or: chain://eip155:1/erc721:{contractAddress}
 *
 * NOTE: Farcaster "Groups" (~/group/{id}) are a Warpcast-specific feature
 * that appears to work differently from protocol-level channels.
 * Groups may require Warpcast API access rather than direct hub posting.
 *
 * @param {Object} options
 * @param {string} options.privateKey - Custody wallet private key (for x402 payment signing)
 * @param {string} options.signerPrivateKey - Ed25519 signer private key (hex, no 0x)
 * @param {number} options.fid - Farcaster ID
 * @param {string} options.text - Cast text content
 * @param {string} options.channelId - Channel ID (e.g., 'memes', 'daos', 'donut')
 * @param {string[]} [options.embeds] - Optional URLs to embed
 * @param {Array<{fid: number, position: number}>} [options.mentions] - Optional mentions
 * @returns {Promise<{hash: string, verified: boolean, channelUrl: string}>}
 */
async function postToChannel({ privateKey, signerPrivateKey, fid, text, channelId, embeds = [], mentions = [] }) {
  // Create wallet for x402 payments (Base)
  const baseProvider = new JsonRpcProvider(RPC.BASE);
  const wallet = new Wallet(privateKey, baseProvider);

  // Look up channel to get the correct parentUrl
  console.log('Looking up channel:', channelId);
  const channelResult = await x402Request(wallet, {
    hostname: 'api.neynar.com',
    path: `/v2/farcaster/channel?id=${encodeURIComponent(channelId)}`,
    method: 'GET'
  });

  if (channelResult.status !== 200 || !channelResult.data?.channel) {
    throw new Error(`Channel '${channelId}' not found. Status: ${channelResult.status}`);
  }

  const channel = channelResult.data.channel;
  const parentUrl = channel.parent_url || channel.url;

  console.log('Channel found:', channel.name);
  console.log('Parent URL:', parentUrl);
  console.log('Posting as FID:', fid);
  console.log('Text:', text);

  // Create signer
  const signerBytes = Buffer.from(signerPrivateKey, 'hex');
  const signer = new NobleEd25519Signer(signerBytes);

  // Prepare embeds
  const embedObjects = embeds.map(url => ({ url }));

  // Prepare mentions
  const mentionFids = mentions.map(m => m.fid);
  const mentionPositions = mentions.map(m => m.position);

  // Create cast message with parentUrl for channel
  const castResult = await makeCastAdd(
    {
      text,
      embeds: embedObjects,
      embedsDeprecated: [],
      mentions: mentionFids,
      mentionsPositions: mentionPositions,
      parentUrl // This is what makes it a channel post
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

  // Submit to Neynar hub with x402 payment
  console.log('Submitting to Neynar hub...');
  const submitResult = await submitMessage(wallet, messageBytes);

  if (submitResult.status !== 200) {
    throw new Error(`Submit failed: ${JSON.stringify(submitResult.data)}`);
  }

  console.log('Submitted successfully');

  // Wait a moment for propagation
  await new Promise(r => setTimeout(r, 2000));

  // Verify the cast is live
  console.log('Verifying cast...');
  const verifyResult = await getCast(wallet, hash);

  const verified = verifyResult.status === 200;

  if (verified) {
    console.log('\nCast verified on network!');
  } else {
    console.log('\nCast submitted but not yet verified. It may take a moment to propagate.');
  }

  return { 
    hash, 
    verified,
    channelUrl: `https://warpcast.com/~/channel/${channelId}`,
    castUrl: `https://warpcast.com/~/conversations/${hash}`
  };
}

/**
 * Look up channel information
 */
async function getChannel(wallet, channelId) {
  const result = await x402Request(wallet, {
    hostname: 'api.neynar.com',
    path: `/v2/farcaster/channel?id=${encodeURIComponent(channelId)}`,
    method: 'GET'
  });
  
  if (result.status !== 200) {
    return null;
  }
  
  return result.data?.channel;
}

/**
 * Search for channels
 */
async function searchChannels(wallet, query) {
  const result = await x402Request(wallet, {
    hostname: 'api.neynar.com',
    path: `/v2/farcaster/channel/search?q=${encodeURIComponent(query)}`,
    method: 'GET'
  });
  
  if (result.status !== 200) {
    return [];
  }
  
  return result.data?.channels || [];
}

// CLI usage
if (require.main === module) {
  const privateKey = process.env.PRIVATE_KEY;
  const signerPrivateKey = process.env.SIGNER_PRIVATE_KEY;
  const fid = parseInt(process.env.FID);
  const channelId = process.argv[2];
  const text = process.argv[3];

  if (!privateKey || !signerPrivateKey || !fid || !channelId || !text) {
    console.log('Usage: PRIVATE_KEY=0x... SIGNER_PRIVATE_KEY=... FID=123 node post-to-channel.js <channelId> "Your cast text"');
    console.log('\nExample:');
    console.log('  node post-to-channel.js memes "This is a great meme!"');
    console.log('  node post-to-channel.js daos "DAO governance update"');
    console.log('  node post-to-channel.js donut "DonutDAO news!"');
    console.log('\nEnvironment variables:');
    console.log('  PRIVATE_KEY        - Custody wallet private key (with 0x prefix)');
    console.log('  SIGNER_PRIVATE_KEY - Ed25519 signer private key (hex, no 0x prefix)');
    console.log('  FID                - Your Farcaster ID number');
    console.log('\nNOTE: This works for Farcaster channels, not Warpcast groups.');
    console.log('      Groups (~/group/{id}) require different API access.');
    process.exit(1);
  }

  postToChannel({ privateKey, signerPrivateKey, fid, text, channelId })
    .then(({ hash, verified, channelUrl, castUrl }) => {
      console.log('\n=== Cast Posted to Channel ===');
      console.log('Hash:', hash);
      console.log('Verified:', verified);
      console.log('Channel:', channelUrl);
      console.log('Cast URL:', castUrl);
    })
    .catch(err => {
      console.error('Error:', err.message);
      process.exit(1);
    });
}

module.exports = { postToChannel, getChannel, searchChannels };
