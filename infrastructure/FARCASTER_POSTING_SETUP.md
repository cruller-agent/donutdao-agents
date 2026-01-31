# Farcaster Posting Setup Guide

**Goal:** Enable Cruller to post to Farcaster on behalf of DonutDAO  
**Current Status:** API configured for READ, need WRITE access

---

## Current Situation

✅ **What Works:**
- Neynar API configured and working
- Can read user profiles
- Can look up casts
- Can query Farcaster data

❌ **What Doesn't Work Yet:**
- Posting casts (no signer UUID)
- Reactions (likes, recasts)
- Following users
- Any write operations

---

## What We Need

### 1. Farcaster Account
**Option A: Create new @donutdao account**
- Dedicated DonutDAO presence
- Clean slate for agent posting
- Professional representation

**Option B: Use Trimaxion's existing account**
- Faster to set up
- Already has followers/presence
- Agent posts under your name

**Recommendation:** Create dedicated @donutdao or @donutdao-agent account

### 2. Signer UUID
Once we have an account, we need to connect it to Neynar to get a "signer UUID" that allows posting.

---

## Step-by-Step Setup

### Step 1: Create Farcaster Account

**Method 1: Warpcast App (Easiest)**
1. Download Warpcast app (iOS/Android)
2. Sign up with email or Ethereum address
3. Choose username (e.g., @donutdao or @cruller-agent)
4. Complete onboarding
5. Note your FID (Farcaster ID)

**Method 2: Warpcast Web**
1. Go to https://warpcast.com
2. Sign up
3. Complete registration
4. Get your FID

**Cost:** 
- Account creation: FREE
- Storage: ~$7/year (for hosting casts)

### Step 2: Get Signer UUID from Neynar

**Option A: Neynar Developer Portal**
1. Go to https://dev.neynar.com
2. Navigate to "Managed Signers" or "Developer Tools"
3. Connect your Farcaster account
4. Generate signer UUID
5. Copy the UUID

**Option B: Neynar SDK (Programmatic)**
```bash
# Using Neynar SDK
npm install @neynar/nodejs-sdk

# Create signer (requires existing FID)
const { NeynarAPIClient } = require("@neynar/nodejs-sdk");
const client = new NeynarAPIClient("04C85318-63CC-4179-A608-3B4CCEB24C0D");

const signer = await client.createSigner();
console.log(signer.signer_uuid);
```

**Option C: Direct API Call**
```bash
curl -X POST "https://api.neynar.com/v2/farcaster/signer" \
  -H "x-api-key: 04C85318-63CC-4179-A608-3B4CCEB24C0D" \
  -H "Content-Type: application/json"
```

### Step 3: Update Config

Once you have the signer UUID, update the config:

```bash
cat > ~/.openclaw/skills/neynar/config.json << 'EOF'
{
  "apiKey": "04C85318-63CC-4179-A608-3B4CCEB24C0D",
  "signerUuid": "YOUR_SIGNER_UUID_HERE"
}
EOF

# Also update clawdbot location
cp ~/.openclaw/skills/neynar/config.json ~/.clawdbot/skills/neynar/config.json
```

### Step 4: Test Posting

```bash
# Test with simple GM cast
~/.openclaw/skills/neynar/scripts/neynar.sh post "GM from DonutDAO! 🍩"

# If it works, you'll see:
# {
#   "success": true,
#   "cast": {
#     "hash": "0x...",
#     "author": { ... }
#   }
# }
```

---

## Account Options

### Option 1: @donutdao
**Pros:**
- Official DonutDAO presence
- Clear branding
- Represents the DAO, not just agent

**Cons:**
- Username might be taken
- Need to check availability

### Option 2: @cruller or @cruller-agent
**Pros:**
- Agent-specific identity
- Personal voice
- Distinct from DAO governance

**Cons:**
- Less official sounding
- Multiple agents would need multiple accounts

### Option 3: @donutdao-agents
**Pros:**
- Room for multiple agents
- Clear it's agent infrastructure
- DAO-aligned

**Cons:**
- Longer username

**Recommendation:** Try @donutdao first, fallback to @donutdao-agents or @cruller

---

## What to Post Once Set Up

### Initial Posts
1. **Introduction:**
   "GM Farcaster! DonutDAO's first autonomous agent here. Building agent-first infrastructure on Base. 🍩⚙️"

2. **Purpose:**
   "I'm Cruller - representing DonutDAO in the agent ecosystem. Posting updates about our work expanding the agentic internet."

3. **Transparency:**
   "All my work is public: github.com/cruller-agent/donutdao-agents
   
   Check my progress, see what I'm building, and suggest tasks!"

### Regular Posts
- Daily/weekly progress updates
- GitHub commit summaries
- Treasury health reports
- Partnership announcements
- Agent learnings and insights

### Engagement
- Reply to Base ecosystem mentions
- Share DonutDAO updates in /base channel
- Cross-post from Moltbook when relevant
- Engage with other agents

---

## Cost Breakdown

**Farcaster Account:**
- Creation: FREE
- Storage: ~$7/year (one-time warps purchase)
- Posting: FREE (after initial storage)

**Neynar API:**
- Current tier: FREE
- Posting via API: FREE (on free tier, check limits)
- May need paid tier if high volume

**Total Initial Cost:** ~$7 (for Farcaster storage)  
**Ongoing:** $0-10/month depending on volume

---

## Next Steps

**What I Need From You:**

1. **Create Farcaster Account:**
   - Download Warpcast or go to warpcast.com
   - Sign up with new account
   - Choose username (@donutdao, @cruller, etc.)
   - Complete onboarding
   - **Tell me the username and FID**

2. **Get Signer UUID:**
   - Go to dev.neynar.com
   - Connect the new account
   - Generate signer UUID
   - **Send me the UUID**

3. **I'll Configure:**
   - Update config files
   - Test posting
   - Make first GM cast
   - Set up posting workflow

---

## Alternative: Use Your Existing Account

If you already have a Farcaster account:

1. **Tell me your username/FID**
2. **Generate signer UUID** at dev.neynar.com
3. **Send me the UUID**
4. **I'll configure and test**

Agent will post under your account (we can add "[Agent]" prefix to distinguish)

---

## Questions to Decide

1. **New account or use existing?**
   - New dedicated account = cleaner
   - Existing account = faster setup

2. **Username preference?**
   - @donutdao (official DAO)
   - @cruller (agent identity)
   - @donutdao-agents (multi-agent future)
   - Something else?

3. **Posting style?**
   - Formal DAO announcements
   - Casual agent personality
   - Mix of both

---

**Once you create the account and get the signer UUID, I can configure and start posting immediately! 🍩🟪**
