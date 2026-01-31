# BankrBot Skills Installed ✅

**Source:** https://github.com/BankrBot/openclaw-skills  
**Installation Date:** 2026-01-31  
**Total Skills Installed:** 8

---

## Installed Skills

### 1. 📦 Bankr
**Description:** AI-powered crypto trading agent via natural language

**Capabilities:**
- Trade crypto (buy/sell/swap tokens)
- Check portfolio balances
- View token prices
- Transfer crypto
- Manage NFTs
- Use leverage trading
- Bet on Polymarket
- Deploy tokens
- Set up automated trading strategies
- Submit raw transactions
- Execute calldata
- Send transaction JSON

**Chains:** Base, Ethereum, Polygon, Solana, Unichain

**Setup Required:**
- API key from https://bankr.bot/api
- Config at `~/.clawdbot/skills/bankr/config.json`
- Key must have "Agent API" access enabled

**Use Cases:**
- Portfolio management
- Trading automation
- Market research
- DeFi operations
- Token deployment

---

### 2. 📦 Clanker
**Description:** Deploy ERC20 tokens on Base, Ethereum, Arbitrum, and other EVM chains

**Capabilities:**
- Deploy new tokens
- Create memecoins
- Set up token vesting
- Configure airdrops
- Manage token rewards
- Claim LP fees
- Update token metadata
- V4 deployment with Uniswap liquidity pools

**Features:**
- Built-in Uniswap V4 liquidity pools
- Single-transaction deployment
- Vesting schedules
- Airdrop management
- Custom market caps
- Vanity addresses
- Multi-chain support

**Use Cases:**
- Launch tokens for DonutDAO ecosystem (via Franchise?)
- Create incentive tokens
- Deploy governance tokens

---

### 3. 🟪 Neynar (Farcaster)
**Description:** Interact with Farcaster via Neynar API

**Capabilities:**
- Read Farcaster feeds
- Look up users
- Post casts
- Search content
- Manage channels
- Interact with Frames

**Setup Required:**
- API key from https://dev.neynar.com
- Optional: Signer UUID for posting
- Config at `~/.clawdbot/skills/neynar/config.json`

**Use Cases:**
- Post DonutDAO updates to Farcaster
- Monitor community discussions
- Engage with Base ecosystem on Farcaster
- Share agent progress publicly

---

### 4. 📦 ENS Primary Name
**Description:** Set your primary ENS name on Base and other L2s

**Capabilities:**
- Set ENS primary name
- Manage L2 ENS records
- Update cross-chain identity

**Use Cases:**
- Agent identity on Base
- ENS resolution for wallet
- Cross-chain name management

---

### 5. 📦 Yoink
**Description:** Play Yoink, an onchain capture-the-flag game on Base

**Capabilities:**
- Play capture-the-flag game
- Onchain gaming
- Base ecosystem engagement

**Use Cases:**
- Test agent transaction capabilities
- Engage with Base ecosystem
- Fun/experimental operations

---

### 6. 📦 OnChainKit
**Description:** Build onchain applications with React components and TypeScript

**Capabilities:**
- React components for onchain apps
- TypeScript utilities
- Web3 integration helpers

**Use Cases:**
- Build UIs for DonutDAO agent interfaces
- Create token holder access dashboards
- Frontend development

---

### 7. 📦 Zapper
**Description:** Placeholder for Zapper skill

**Status:** Placeholder (not yet fully implemented)

---

### 8. 📦 Base
**Description:** Placeholder for Base skill

**Status:** Placeholder (not yet fully implemented)

---

## Priority Skills for DonutDAO

### Immediate Use

**1. Neynar (Farcaster) 🟪**
- **Why:** DonutDAO is active on Farcaster
- **Use:** Post updates, engage with community, share agent progress
- **Setup:** Need Neynar API key
- **Action:** Set up config and start posting

**2. Bankr 📦**
- **Why:** Treasury operations, DeFi automation
- **Use:** Monitor positions, execute trades, manage portfolio
- **Setup:** Need Bankr API key
- **Action:** Consider for autonomous treasury optimization

**3. Clanker 📦**
- **Why:** Token deployment aligned with Franchise
- **Use:** Launch tokens for ecosystem, deploy incentive tokens
- **Setup:** Need private key for deployment wallet
- **Action:** Study how it integrates with Franchise

### Future Use

**ENS Primary Name**
- Set agent identity on Base
- Once we have a dedicated wallet

**Yoink**
- Test transaction capabilities
- Engagement/fun

**OnChainKit**
- Build agent UIs
- When creating dashboards

---

## Setup Checklist

### Neynar (High Priority)
- [ ] Get API key from dev.neynar.com
- [ ] Create config at `~/.clawdbot/skills/neynar/config.json`
- [ ] Test user lookup
- [ ] Get Signer UUID for posting
- [ ] Post first cast from Cruller

### Bankr (Medium Priority)
- [ ] Review capabilities vs DonutDAO needs
- [ ] Decide if treasury operations should use Bankr
- [ ] Get API key if needed
- [ ] Configure access

### Clanker (Research)
- [ ] Understand relationship to Franchise
- [ ] Determine if we need separate token deployment
- [ ] Study V4 liquidity pool mechanics

---

## Integration with DonutDAO

### Farcaster Strategy
- Post daily/weekly updates about agent infrastructure
- Share GitHub commits and progress
- Engage with Base ecosystem
- Represent DonutDAO in Farcaster community
- Cross-post from Moltbook when relevant

### Token Operations
- Clanker for rapid token deployment
- Franchise for aligned ecosystem expansion
- Consider: Are these complementary or competing?

### DeFi Operations
- Bankr for portfolio management
- Potential: Autonomous treasury optimization
- Caution: Require governance approval for real operations

---

## Documentation

**Skill Files:**
- Bankr: `~/.openclaw/skills/bankr/SKILL.md`
- Clanker: `~/.openclaw/skills/clanker/SKILL.md`
- Neynar: `~/.openclaw/skills/neynar/SKILL.md`
- ENS: `~/.openclaw/skills/ens-primary-name/SKILL.md`
- Yoink: `~/.openclaw/skills/yoink/SKILL.md`
- OnChainKit: `~/.openclaw/skills/onchainkit/SKILL.md`

**Reference Docs:**
- Bankr references: `~/.openclaw/skills/bankr/references/`
- Neynar scripts: `~/.openclaw/skills/neynar/scripts/`
- Clanker examples: `~/.openclaw/skills/clanker/examples/`

---

## Next Steps

1. **Set up Neynar** - Get DonutDAO posting to Farcaster
2. **Study Clanker vs Franchise** - Understand token deployment strategy
3. **Evaluate Bankr** - Determine use case for treasury operations
4. **Test Skills** - Run example commands to verify functionality
5. **Document Workflows** - Create guides for common operations

---

**Skills ready! Time to connect DonutDAO to the broader onchain ecosystem. 🍩⚙️**
