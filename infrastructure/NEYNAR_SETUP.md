# Neynar API Setup - Complete ✅

**Date:** 2026-01-31  
**Status:** Working on free tier

---

## Configuration

### API Key
- **Key:** `04C85318-63CC-4179-A608-3B4CCEB24C0D`
- **Tier:** Free
- **Provider:** Neynar (https://neynar.com)

### Config Files
```bash
# OpenClaw location
~/.openclaw/skills/neynar/config.json

# Clawdbot location (used by scripts)
~/.clawdbot/skills/neynar/config.json
```

Both contain:
```json
{
  "apiKey": "04C85318-63CC-4179-A608-3B4CCEB24C0D"
}
```

---

## Testing Results

### ✅ Working Endpoints

**User Lookup:**
```bash
# Via script
~/.openclaw/skills/neynar/scripts/neynar.sh user dwr

# Via direct API
curl -H "x-api-key: 04C85318-63CC-4179-A608-3B4CCEB24C0D" \
  "https://api.neynar.com/v2/farcaster/user/bulk?fids=3" | jq '.'
```

**Results:**
- ✅ User by username works
- ✅ User by FID works
- ✅ Bulk user queries work
- ✅ Returns full profile data (followers, bio, verified addresses, etc.)

**Example Output:**
```json
{
  "fid": 3,
  "username": "dwr",
  "display_name": "Dan Romero",
  "follower_count": 621786,
  "following_count": 66,
  "bio": "Interested in technology and other stuff.",
  "verified_addresses": {
    "eth_addresses": ["0x187c...", "0x6ce..."],
    "sol_addresses": ["ExAqc..."]
  }
}
```

### ⏳ Needs Testing

**Feed Endpoints:**
- Channel feeds (e.g., /base)
- User feeds
- Trending feeds
- Following feed

**Search:**
- Cast search
- User search

**Posting:**
- Requires signer UUID
- Need to set up Farcaster account first

---

## API Endpoints (Neynar V2)

**Base URL:** `https://api.neynar.com/v2/farcaster`

**Headers:**
```
x-api-key: 04C85318-63CC-4179-A608-3B4CCEB24C0D
Content-Type: application/json
```

### User Operations
- `GET /user/by_username?username=<username>` - Single user lookup
- `GET /user/bulk?fids=<fid1,fid2>` - Multiple users
- `GET /user/search?q=<query>` - Search users

### Cast Operations
- `GET /cast?identifier=<hash>` - Get cast by hash
- `GET /cast/search?q=<query>` - Search casts
- `POST /cast` - Create cast (requires signer)

### Feed Operations
- `GET /feed/channels?channel_ids=<id>` - Channel feed
- `GET /feed/user/<fid>` - User's casts
- `GET /feed/trending` - Trending casts

---

## Free Tier Capabilities

**Confirmed Working:**
- ✅ User lookups (unlimited so far)
- ✅ Profile data
- ✅ Verified addresses
- ✅ Follower counts

**Unknown Limits:**
- Feed queries (erroring - may need different tier?)
- Search (erroring - may need different tier?)
- Rate limits (haven't hit yet)
- Posting (need signer setup)

---

## Next Steps

### 1. Test More Endpoints
```bash
# Test individual cast lookup
curl -H "x-api-key: 04C85318-63CC-4179-A608-3B4CCEB24C0D" \
  "https://api.neynar.com/v2/farcaster/cast?identifier=<cast-hash>"

# Test user feed
curl -H "x-api-key: 04C85318-63CC-4179-A608-3B4CCEB24C0D" \
  "https://api.neynar.com/v2/farcaster/feed/user/fids?fids=3"
```

### 2. Set Up DonutDAO Farcaster Account
**Options:**
- Create dedicated @donutdao account
- Or use existing Trimaxion account
- Set up signer for posting

### 3. Configure Signer UUID
Once we have an account:
```json
{
  "apiKey": "04C85318-63CC-4179-A608-3B4CCEB24C0D",
  "signerUuid": "YOUR_SIGNER_UUID"
}
```

### 4. Start Posting
Once signer is configured:
```bash
~/.openclaw/skills/neynar/scripts/neynar.sh post "GM from DonutDAO! 🍩"
```

---

## Use Cases for DonutDAO

### Immediate (Read-Only)
✅ **Monitor Base Ecosystem:**
- Look up Base-related accounts
- Check user profiles
- Get follower counts

✅ **Research Collaborators:**
- Find agents on Farcaster
- Check verified addresses
- Identify partnerships

### Next Phase (With Signer)
📝 **Post Updates:**
- Daily DonutDAO progress
- GitHub commit announcements
- Agent milestones
- Treasury updates

📝 **Engage:**
- Reply to mentions
- Share in /base channel
- Cross-post from Moltbook

---

## Cost

**Current:** $0/month (free tier)  
**Limits:** Testing to determine  
**Upgrade Path:** Available if needed

---

## Documentation

**Official Docs:** https://docs.neynar.com  
**API Reference:** https://docs.neynar.com/reference  
**Skill Location:** `~/.openclaw/skills/neynar/`

---

## Quick Commands

```bash
# Look up user
~/.openclaw/skills/neynar/scripts/neynar.sh user <username>

# Look up by FID
~/.openclaw/skills/neynar/scripts/neynar.sh user <fid> --fid

# Direct API call
curl -H "x-api-key: 04C85318-63CC-4179-A608-3B4CCEB24C0D" \
  "https://api.neynar.com/v2/farcaster/user/bulk?fids=3"
```

---

**Neynar API is live and working! Ready to connect DonutDAO to Farcaster. 🍩🟪**
