# Farcaster Integration Options - Budget Analysis

**Goal:** Connect DonutDAO agents to Farcaster without expensive API keys  
**Date:** 2026-01-31

---

## Option 1: Neynar API (Easiest, Has Free Tier)

### Overview
- **What:** Managed Farcaster API service
- **Provider:** Neynar (official Farcaster infrastructure)
- **Website:** https://neynar.com / https://dev.neynar.com

### Pricing
**Free Tier:**
- **Read operations:** Generous free tier
- **Limitations:** Need to check exact limits
- **API key:** Free to get

**Paid Tiers:**
- Paid plans for higher volume
- Writing (posting casts) may require signer + higher tier

### Pros
✅ Official, well-maintained  
✅ **Free tier available**  
✅ Easy to use (REST API)  
✅ Works with our existing skill  
✅ Good documentation  
✅ No infrastructure to maintain

### Cons
❌ Need to verify free tier limits  
❌ Posting may require paid tier  
❌ Still an API key (but free)  
❌ Rate limits on free tier

### Best For
- **Read-only operations** (monitoring feeds, looking up users)
- **Light posting** (if free tier allows)
- **Getting started quickly**

### Recommendation
✅ **START HERE** - Get free API key, test limits, then decide if we need more

---

## Option 2: Self-Hosted Snapchain Node (Free, Heavy Infrastructure)

### Overview
- **What:** Run your own Farcaster node
- **Provider:** Official Farcaster protocol
- **Docs:** https://snapchain.farcaster.xyz

### Requirements
**Hardware:**
- 16 GB RAM
- 4 CPU cores
- **2 TB storage** ⚠️
- Public IP with ports 3381-3383 exposed

**Initial Sync:**
- **200 GB snapshot download**
- Several hours to sync
- Ongoing sync required

### Costs (if self-hosting)
**VPS with these specs:**
- ~$40-80/month (DigitalOcean, Hetzner, etc.)
- 2TB storage is expensive
- Network bandwidth for sync

**Your Current VPS:**
- Would need to check specs
- Likely insufficient storage

### Pros
✅ **No API key needed**  
✅ Full control over data  
✅ Direct protocol access  
✅ No rate limits  
✅ Can query historical data

### Cons
❌ **Massive storage requirement (2TB)**  
❌ **200GB initial download**  
❌ Requires maintenance  
❌ Needs public IP + open ports  
❌ Complex setup  
❌ Ongoing costs > free API

### Best For
- Heavy data analysis
- Building infrastructure
- High-volume apps

### Recommendation
❌ **NOT RECOMMENDED** - Cost and complexity exceed free API value

---

## Option 3: Hub-Nodejs Client + Public Hubs (Free, Limited)

### Overview
- **What:** Connect directly to public Farcaster hubs using client library
- **Provider:** Official Farcaster Hub client
- **Repo:** https://github.com/farcasterxyz/hub-monorepo

### How It Works
```bash
npm install @farcaster/hub-nodejs

# Connect to a public hub
import { getSSLHubRpcClient } from '@farcaster/hub-nodejs';

const client = getSSLHubRpcClient('nemes.farcaster.xyz:2283');
```

### Public Hubs
- Several public hubs available
- Free to connect
- No API key required
- gRPC protocol

### Pros
✅ **No API key**  
✅ **Free**  
✅ Direct protocol access  
✅ Official client library  
✅ No infrastructure needed

### Cons
❌ Public hubs may be unreliable  
❌ No guarantees of uptime  
❌ Limited features vs Neynar  
❌ May have rate limits  
❌ Need to find reliable public hub

### Best For
- **Read-only operations**
- **Budget-conscious projects**
- **Simple use cases**

### Recommendation
⚠️ **WORTH TESTING** - Try as free alternative to Neynar

---

## Option 4: Neynar's Free Snapchain gRPC Endpoint

### Overview
Neynar provides free access to Snapchain data via gRPC (as shown in their docs):

```javascript
import {
  createDefaultMetadataKeyInterceptor,
  getSSLHubRpcClient,
} from '@farcaster/hub-nodejs';

const client = getSSLHubRpcClient('snapchain-grpc-api.neynar.com', {
  interceptors: [
    createDefaultMetadataKeyInterceptor('x-api-key', 'YOUR_FREE_KEY'),
  ],
});
```

### Pros
✅ **Free tier available**  
✅ Managed infrastructure  
✅ Snapchain access (full data)  
✅ Official hub-nodejs client  
✅ No storage/maintenance

### Cons
❌ Still requires API key (but free)  
❌ Need to check rate limits  
❌ May be read-only

### Recommendation
✅ **GOOD OPTION** - Combines free access with reliability

---

## Comparison Table

| Option | Cost | Setup Difficulty | API Key? | Storage | Reliability | Posting? |
|--------|------|------------------|----------|---------|-------------|----------|
| **Neynar REST** | Free tier | Easy | Yes (free) | None | High | Maybe |
| **Self-hosted Snapchain** | $40-80/mo | Very Hard | No | 2TB | High | Yes |
| **Hub-nodejs + Public Hub** | Free | Medium | No | None | Medium | Unknown |
| **Neynar gRPC** | Free tier | Medium | Yes (free) | None | High | Unknown |

---

## Recommended Approach

### Phase 1: Start with Free Neynar API ✅
1. Get free Neynar API key from dev.neynar.com
2. Configure existing neynar skill
3. Test read operations (feeds, user lookup)
4. Test if posting works on free tier
5. Monitor rate limits

**Why:**
- Easiest to get started
- Free tier available
- Well-documented
- Works with existing skill

### Phase 2: Test Alternatives if Needed
If Neynar free tier is too limited:

**Try Hub-nodejs + Public Hub:**
```bash
# Find public hubs
curl https://nemes.farcaster.xyz:2283/v1/info

# Test connection
npm install @farcaster/hub-nodejs
# Connect without API key
```

**Or Try Neynar gRPC:**
- Same free API key
- Different endpoint (gRPC instead of REST)
- May have different limits

### Phase 3: Evaluate Results
After testing:
- **If free tiers work:** Stick with Neynar (easiest)
- **If we need more:** Consider hub-nodejs + public hub
- **Only if necessary:** Look into paid tier or self-hosting

---

## Specific Use Cases for DonutDAO

### Read-Only (Monitoring)
**Need:**
- Check mentions of @DonutDAO
- Monitor Base ecosystem discussions
- Find collaborators

**Best Option:** Neynar free tier or hub-nodejs + public hub

### Light Posting (Updates)
**Need:**
- Post daily/weekly updates
- Share GitHub commits
- Announce milestones

**Best Option:** Neynar free tier (check posting limits)

### Heavy Activity (Engagement)
**Need:**
- Reply to mentions
- Active community engagement
- High-frequency posting

**Best Option:** May need paid tier or self-hosting

---

## Action Plan

### Immediate (Today)
1. ✅ Research complete
2. ⏳ Sign up for free Neynar API key
3. ⏳ Configure neynar skill
4. ⏳ Test read operations
5. ⏳ Test posting capability

### This Week
1. Monitor free tier limits
2. Test hub-nodejs + public hub as backup
3. Document which approach works best
4. Set up posting workflow

### Evaluate
After 1 week of testing:
- Are free tiers sufficient?
- Do we need paid tier?
- Should we use multiple approaches?

---

## Budget Impact

### Current Plan (Neynar Free)
- **Cost:** $0/month
- **Setup:** 30 minutes
- **Maintenance:** None

### Alternative (Self-hosted)
- **Cost:** $40-80/month
- **Setup:** Several hours
- **Maintenance:** Ongoing
- **Storage:** 2TB ($$$)

### Savings
Using free Neynar API vs self-hosting: **~$40-80/month saved**

---

## Conclusion

**Recommended:** Start with Neynar free tier

**Why:**
1. ✅ Free (no budget impact)
2. ✅ Easy to set up
3. ✅ Reliable infrastructure
4. ✅ Works with existing skill
5. ✅ Can upgrade if needed

**Backup:** hub-nodejs + public hub (if free tier insufficient)

**Avoid:** Self-hosting Snapchain (overkill for our needs)

---

## Next Steps

1. Get free Neynar API key
2. Test limits and capabilities
3. Document what works
4. Set up DonutDAO Farcaster presence
5. Start posting updates!

**Let's start with free tier and see how far we can get! 🍩🟪**
