# XMTP + Farcaster Architecture Guide

This document explains how XMTP integrates with Farcaster and the key architectural decisions for agent-to-agent private communication.

## Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Farcaster Ecosystem                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐       │
│  │ Farcaster Hub │    │   Warpcast    │    │    XMTP       │       │
│  │  (Protocol)   │    │  (Warpcast)   │    │  (Protocol)   │       │
│  └───────┬───────┘    └───────┬───────┘    └───────┬───────┘       │
│          │                    │                    │                │
│   Public Casts          "Direct Cast"         End-to-End           │
│   Channels              DMs (proprietary)     Encrypted DMs        │
│   Reactions             Groups                Group Chats          │
│          │                    │                    │                │
│          │                    │                    │                │
│          ▼                    ▼                    ▼                │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                     Ethereum Wallet                          │   │
│  │              (0x08E7c7c40d3df4B97f25d9adaa606587ECE955a5)    │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Identity Models

### Farcaster
- **Primary Identity:** FID (Farcaster ID) - a unique number
- **Usernames:** Human-readable handles (e.g., @crulleragent)
- **Custody Address:** Ethereum wallet that "owns" the FID
- **Signer Keys:** Ed25519 keys authorized to post on behalf of FID

### XMTP
- **Primary Identity:** Ethereum Address
- **Inbox ID:** Derived from wallet's public key material
- **Installations:** Per-device client instances (max 10)

### Mapping Between Systems
```
Farcaster FID 2647465 (@crulleragent)
         │
         ├── Custody Address: 0x08E7c7c40d3df4B97f25d9adaa606587ECE955a5
         │                          │
         │                          └── XMTP Inbox ID: 791a8022a5201d42...
         │
         └── Signer Keys (Ed25519) - for posting casts
```

To message a Farcaster user via XMTP, you need their **custody address**, not their FID.

## Message Flow Comparison

### Farcaster Public Casts
```
Agent → Signer Key → Hub → Propagation → All Clients
```

### Warpcast DMs ("Direct Cast")
```
Agent → Warpcast API Key → Warpcast Server → Recipient's Warpcast
```
- Proprietary
- Only works within Warpcast
- Requires API key from Warpcast settings

### XMTP Messages
```
Agent → Wallet Signature → XMTP Network → Recipient's XMTP-enabled App
```
- Decentralized
- Works across any XMTP-enabled app
- End-to-end encrypted (MLS protocol)
- No API key needed (uses wallet signatures)

## XMTP Client Lifecycle

### 1. First-Time Setup
```javascript
const client = await Client.create(signer, {
  env: 'production',
  dbEncryptionKey: randomBytes(32),  // Save this!
  dbPath: './xmtp-data/wallet-addr.db3'
});
```
- Registers wallet on XMTP network
- Creates inbox ID (permanent identity)
- Stores encryption keys locally

### 2. Subsequent Connections
```javascript
// If database exists with same encryption key:
// - Reuses existing inbox ID
// - Loads stored conversations/messages
// - Creates new installation if needed
```

### 3. Database Persistence
```
.xmtp-data/
├── 0x08e7c7c40d3df4b97f25d9adaa606587ece955a5-db-key  # Encryption key
└── 0x08e7c7c40d3df4b97f25d9adaa606587ece955a5-production.db3  # SQLite DB
```

**Critical:** If you lose the db encryption key, you lose access to messages!

## Group Chat Architecture (MLS)

XMTP v3 uses the MLS (Message Layer Security) protocol for groups:

```
┌─────────────────────────────────────────────┐
│              XMTP Group                      │
├─────────────────────────────────────────────┤
│  Members (up to 250):                       │
│    - Inbox ID 1 (Creator)                   │
│    - Inbox ID 2                             │
│    - Inbox ID 3                             │
│    - ...                                    │
├─────────────────────────────────────────────┤
│  MLS Features:                              │
│    - Forward secrecy                        │
│    - Post-compromise security               │
│    - Efficient key rotation                 │
└─────────────────────────────────────────────┘
```

## Practical Considerations

### Reachability
Not all Farcaster users have XMTP enabled. Check before sending:
```javascript
const canReceive = await Client.canMessage(identifiers, 'production');
```

### Conversation IDs
- **XMTP:** Derived from participant inbox IDs
- **Warpcast DMs:** Proprietary hex IDs (e.g., `4508b83dfc815a01`)

These are **NOT interchangeable**!

### Rate Limits
- Inbox limit: 256 updates (add/remove wallets, installations)
- Installation limit: 10 per inbox
- No message rate limits (protocol-level)

## Agent Communication Patterns

### Pattern 1: Direct XMTP DM
```javascript
// Agent A → Agent B
await sendDM(client, agentBAddress, 'Task assignment');
```
- Simple 1:1 communication
- Both agents need XMTP enabled

### Pattern 2: XMTP Group for Multi-Agent Coordination
```javascript
// Create coordinating group
const group = await createGroup(client, [agentB, agentC, agentD], {
  name: 'DAO Agents Coordination'
});
await sendToGroup(client, group.groupId, 'New governance proposal detected');
```
- Up to 250 agents
- End-to-end encrypted
- Message history synced

### Pattern 3: Streaming for Real-Time Events
```javascript
await streamMessages(client, async (message) => {
  if (message.content.includes('URGENT')) {
    // Handle urgent message
  }
});
```
- Real-time message processing
- Good for event-driven agents

## Warpcast DM Group (4508b83dfc815a01)

The target group `4508b83dfc815a01` is a **Warpcast conversation**, not XMTP.

To access it:
1. Get Warpcast API key from app settings
2. Use `dm-send.js` with `conversation` mode:
```bash
WARPCAST_API_KEY="..." node src/dm-send.js conversation 4508b83dfc815a01 "Message"
```

This is separate from XMTP and works only within Warpcast.

## Environment Setup

```bash
# For XMTP (decentralized)
export PRIVATE_KEY="0x..."  # Ethereum wallet
export XMTP_ENV="production"  # or "dev"

# For Warpcast DMs (proprietary)
export WARPCAST_API_KEY="..."  # From Warpcast app

# For Farcaster posting
export SIGNER_PRIVATE_KEY="..."  # Ed25519 hex
export FID="2647465"
```

## Security Notes

1. **Private Key Storage:** Never commit private keys. Use `pass` or similar.
2. **Database Encryption:** XMTP DB key is critical - back it up securely.
3. **E2E Encryption:** XMTP messages are encrypted; Warpcast manages its own encryption.
4. **Installation Management:** Monitor active installations, revoke unused ones.

## References

- [XMTP Documentation](https://docs.xmtp.org)
- [XMTP Node SDK](https://github.com/xmtp/xmtp-js/tree/main/sdks/node-sdk)
- [Farcaster Protocol](https://docs.farcaster.xyz)
- [MLS Protocol](https://messaginglayersecurity.rocks/)
