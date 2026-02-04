# Farcaster Agent Skill

A complete Farcaster posting agent with support for channels, groups, and **private messaging via XMTP**.

## Quick Start

```bash
cd ~/.openclaw/workspace/farcaster-agent-repo

# Set environment variables
export PRIVATE_KEY="$(pass donut-agent/farcaster-agent/wallet | head -1)"
export SIGNER_PRIVATE_KEY="$(pass donut-agent/farcaster/signer-private-key)"
export FID="$(pass donut-agent/farcaster/fid)"

# Post to profile
node src/post-cast.js "Your message here"

# Post to a channel (recommended for communities)
node src/post-to-channel.js "daos" "DAO update!"
node src/post-to-channel.js "donut" "Donut news!"

# Post to a group (Warpcast-specific feature)
node src/group-post.js "7qIxCdzvkPEVZMqFVSM-tg" "Hello group!"
```

## Account Info

- **FID:** 2647465
- **Handle:** @crulleragent
- **Profile:** https://warpcast.com/crulleragent
- **Wallet:** 0x08E7c7c40d3df4B97f25d9adaa606587ECE955a5

---

## 📨 XMTP Integration (Decentralized Messaging)

XMTP (Extensible Message Transport Protocol) provides **decentralized, end-to-end encrypted** messaging for Web3. It's used by many Farcaster apps for private communication.

### ⚠️ CRITICAL: XMTP vs Warpcast DMs

| Feature | XMTP | Warpcast "Direct Cast" |
|---------|------|------------------------|
| **Protocol** | Decentralized, open | Proprietary, Warpcast-only |
| **Identity** | Ethereum addresses | Farcaster FIDs |
| **Encryption** | E2E encrypted (MLS) | Warpcast manages |
| **API Key** | None (uses wallet signature) | Requires Warpcast API key |
| **Interop** | Any XMTP-enabled app | Warpcast app only |

**The target group `4508b83dfc815a01` is a Warpcast conversation ID** - it CANNOT be accessed via XMTP! See the Warpcast DM section below for that.

### XMTP Quick Start

```bash
cd ~/.openclaw/workspace/farcaster-agent-repo

# Check if an address can receive XMTP
./scripts/xmtp.sh check 0x1234...abcd

# Send DM to an address
./scripts/xmtp.sh dm 0x1234...abcd "Hello via XMTP!"

# List your XMTP conversations
./scripts/xmtp.sh list

# Read messages from a conversation
./scripts/xmtp.sh read <conversationId>

# Stream messages in real-time
./scripts/xmtp.sh stream

# Create a group
./scripts/xmtp.sh create-group "My Group" 0x111...,0x222... "Welcome!"
```

### Direct Script Usage

```bash
# Set your wallet key
export PRIVATE_KEY="$(pass donut-agent/farcaster-agent/wallet | head -1)"
export XMTP_ENV="production"  # or "dev" for testing

# Check reachability
node src/xmtp-send.js check 0x1234...

# Send DM
node src/xmtp-send.js dm 0x1234... "Hello!"

# Create group
node src/xmtp-send.js create-group "Name" 0x111,0x222 "Welcome msg"

# List conversations
node src/xmtp-read.js list

# Read messages
node src/xmtp-read.js read <conversationId> 20

# Stream messages
node src/xmtp-read.js stream
```

### Programmatic Usage

```javascript
const xmtp = require('./src/xmtp-client');

// Create client (first time registers on XMTP network)
const client = await xmtp.createClient(process.env.PRIVATE_KEY, {
  env: 'production',  // or 'dev'
  appVersion: 'my-app/1.0'
});

// Check if address can receive XMTP
const reachability = await xmtp.canMessage(client, ['0x1234...']);
console.log(reachability.get('0x1234...'));  // true/false

// Send DM
const result = await xmtp.sendDM(client, '0x1234...', 'Hello!');
console.log(result.conversationId);

// Create group
const group = await xmtp.createGroup(client, ['0x111...', '0x222...'], {
  name: 'My Group',
  description: 'A test group'
});

// Send to group
await xmtp.sendToGroup(client, group.groupId, 'Hello group!');

// List conversations
const convos = await xmtp.listConversations(client);

// Read messages
const messages = await xmtp.readMessages(client, conversationId, { limit: 20 });

// Stream new messages
const stopStreaming = await xmtp.streamMessages(client, (msg) => {
  console.log('New message:', msg.content);
});
// Later: stopStreaming();
```

### XMTP Architecture Notes

1. **Identity Model**
   - XMTP uses **Ethereum addresses**, NOT Farcaster FIDs
   - To message a Farcaster user, you need their **custody wallet address**
   - Users must have XMTP enabled (used an XMTP app before)

2. **Local Database**
   - XMTP stores messages in a local SQLite database
   - Database is encrypted with a key stored in `.xmtp-data/`
   - Messages persist across sessions

3. **Registration**
   - First time creating a client registers your wallet on XMTP
   - Creates an "inbox ID" that represents your identity
   - Others can then message your Ethereum address

4. **Group Chats (MLS)**
   - XMTP v3 uses MLS protocol for group chats
   - Up to 250 members per group
   - All members must have XMTP enabled

### Finding Farcaster Users' Addresses

To message a Farcaster user via XMTP, you need their custody address:

```javascript
// Use Farcaster hub to look up user's custody address by FID
const { getSSLHubRpcClient } = require('@farcaster/hub-nodejs');
const client = getSSLHubRpcClient('nemes.farcaster.xyz:2283');

// Get custody address for FID
const result = await client.getCustodyAddress({ fid: 272109 });
// Use this address for XMTP messaging
```

---

## 📱 Warpcast DMs (Direct Cast) 

Warpcast's native DMs are **proprietary** and separate from XMTP. They require a Warpcast API key.

### Setup: Get a Warpcast API Key

1. Open **Warpcast** app on your phone
2. Go to **Settings > Developer Mode** (enable it if needed)
3. Navigate to **Developer Tools > API Keys**
4. Create a new API key
5. Store it securely:
   ```bash
   pass insert donut-agent/warpcast/api-key
   ```

### Using Warpcast DM Scripts

**Helper script (recommended):**
```bash
# List inbox
./scripts/dm.sh inbox

# Read a conversation
./scripts/dm.sh read 4508b83dfc815a01

# Send to user by FID
./scripts/dm.sh send user 272109 "Hello!"

# Send to group/conversation
./scripts/dm.sh send conversation 4508b83dfc815a01 "Hello group!"
```

**Direct usage:**
```bash
export WARPCAST_API_KEY="$(pass donut-agent/warpcast/api-key)"

# Read inbox
node src/dm-read.js inbox 10

# Read specific conversation
node src/dm-read.js conversation 4508b83dfc815a01 20

# Send DM to user
node src/dm-send.js user 272109 "Hello!"

# Send to conversation/group
node src/dm-send.js conversation 4508b83dfc815a01 "Hello group!"
```

### Target Group

The target group for DonutDAO agent communication:
- **Conversation ID:** `4508b83dfc815a01`
- **URL:** `https://warpcast.com/~/inbox/4508b83dfc815a01`
- **Requires:** Warpcast API key

---

## 🎨 Profile Management

Update your Farcaster profile (display name, bio, pfp, URL).

### Quick Start

```bash
cd ~/.openclaw/workspace/farcaster-agent-repo

# Set environment
export PRIVATE_KEY="$(pass donut-agent/farcaster-agent/wallet | head -1)"
export SIGNER_PRIVATE_KEY="$(pass donut-agent/farcaster/signer-private-key)"
export FID="$(pass donut-agent/farcaster/fid)"

# Upload pfp to IPFS (if you have a local image)
ipfs add /path/to/image.jpg
# Use the hash with a fast gateway: https://cloudflare-ipfs.com/ipfs/YOUR_HASH

# Update profile
node src/set-profile.js "" "Display Name" "Your bio here" "https://cloudflare-ipfs.com/ipfs/YOUR_HASH"

# Or set individual fields (leave empty "" to skip)
node src/set-profile.js "" "Cruller" "" ""  # Just display name
node src/set-profile.js "" "" "New bio!" ""  # Just bio
```

### Profile Fields

- **Display Name** - Your human-readable name
- **Bio** - Profile description (supports emojis!)
- **PFP (Profile Picture)** - Must be a public URL (IPFS recommended)
- **URL** - Website or link (optional)

### Image Hosting Options

**Recommended:** Use IPFS with fast gateways
```bash
# Upload to IPFS
ipfs add image.jpg
# Output: added QmXXX... image.jpg

# Use Cloudflare's IPFS gateway (fastest)
https://cloudflare-ipfs.com/ipfs/QmXXX...

# Or other gateways
https://ipfs.io/ipfs/QmXXX...
https://gateway.pinata.cloud/ipfs/QmXXX...
```

**Note:** `ipfs.io` gateway can be slow. Cloudflare and Pinata gateways are usually faster for profile pictures to load.

### Programmatic Usage

```javascript
const { setProfileData } = require('./src/set-profile');

await setProfileData({
  privateKey: process.env.PRIVATE_KEY,
  signerPrivateKey: process.env.SIGNER_PRIVATE_KEY,
  fid: parseInt(process.env.FID),
  displayName: 'Cruller',
  bio: 'DonutDAO\'s first autonomous agent 🍩',
  pfpUrl: 'https://cloudflare-ipfs.com/ipfs/QmV7...',
  url: 'https://donut-agent.eth.limo'
});
```

---

## Scripts Reference

| Script | Description |
|--------|-------------|
| `post-cast.js` | Post to your profile |
| `post-to-channel.js` | Post to a Farcaster channel |
| `group-post.js` | Post to a Warpcast group |
| `set-profile.js` | Update profile (name, bio, pfp, URL) |
| `dm-send.js` | Send Warpcast DMs (requires API key) |
| `dm-read.js` | Read Warpcast inbox/conversations |
| `xmtp-client.js` | XMTP client library |
| `xmtp-send.js` | Send XMTP messages (DM, group, check) |
| `xmtp-read.js` | Read XMTP messages (list, read, stream) |
| `auto-setup.js` | Complete account setup |

---

## Channels vs Groups vs XMTP vs Warpcast DMs

| Feature | Protocol | API | Description |
|---------|----------|-----|-------------|
| **Channels** (~/channel/{id}) | Decentralized | Neynar x402 | Protocol-level, stored on hubs |
| **Groups** (~/group/{id}) | Warpcast-only | Neynar API | Warpcast-specific public groups |
| **Warpcast DMs** (~/inbox/{id}) | Warpcast-only | Warpcast API | Private messages, proprietary |
| **XMTP DMs** | Decentralized | XMTP SDK | E2E encrypted, cross-app |
| **XMTP Groups** | Decentralized | XMTP SDK | E2E encrypted group chats |

### When to Use What

- **Public announcements** → Channels (`/daos`, `/donut`)
- **Community discussions** → Channels or Warpcast Groups
- **Private 1:1 or group chat** → XMTP (preferred) or Warpcast DMs
- **Agent-to-agent communication** → XMTP (decentralized, no API key)
- **Warpcast-specific features** → Warpcast DMs (requires API key)

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PRIVATE_KEY` | Custody wallet private key (0x prefix) |
| `SIGNER_PRIVATE_KEY` | Ed25519 signer key (hex, no prefix) |
| `FID` | Your Farcaster ID |
| `XMTP_ENV` | XMTP environment: `dev` or `production` |
| `WARPCAST_API_KEY` | Warpcast API key (for DMs only) |
| `NEYNAR_API_KEY` | Optional Neynar API key for groups |

---

## Costs

**Public posting** uses x402 payments on Base (USDC):
- Per API call: ~0.001 USDC
- Posting: 1-2 API calls (submit + verify)

**XMTP** is free (uses wallet signatures, no payments).

**Warpcast DMs** are free (Warpcast covers the cost).

---

## Useful Channels for DonutDAO

- `/daos` - General DAO discussions (1.9k followers)
- `/dao` - Smaller DAO channel (108 followers)
- `/donut` - Donut-themed (603 followers)
- `/daobase` - DAO on Base (351 followers)
