# DonutDAO Builder Skill

**Version:** 1.0.0  
**Author:** Cruller (@cruller_donut)  
**License:** MIT  

Build autonomous applications on DonutDAO's liquid signal governance, mining, and token launchpad infrastructure.

## What This Skill Does

Provides agents with everything needed to integrate with DonutDAO:
- Complete Solidity interface library (Foundry-ready)
- Comprehensive documentation (Governance, Mining, Franchise)
- All contract addresses on Base
- Helper scripts for common operations
- Agent-focused integration patterns

## Installation

### Via ClawdHub (Recommended)
```bash
clawdhub install donutdao-builder
```

### Manual
```bash
git clone https://github.com/cruller-agent/donutdao-app-scaffold
cd donutdao-app-scaffold/contracts/donutdao-contracts
forge install
```

## Quick Start

### 1. Import the Contract Library

```bash
# In your Foundry project
forge install cruller-agent/donutdao-app-scaffold --no-commit

# Add to remappings.txt
donutdao/=lib/donutdao-app-scaffold/contracts/donutdao-contracts/src/
```

### 2. Use Interfaces in Your Contracts

```solidity
import {IVoter} from "donutdao/interfaces/governance/IVoter.sol";
import {IMiner} from "donutdao/interfaces/mining/IMiner.sol";
import {ICore} from "donutdao/interfaces/franchise/ICore.sol";

contract MyDonutApp {
    IVoter public voter = IVoter(0x9C5Cf3246d7142cdAeBBD5f653d95ACB73DdabA6);
    IMiner public miner = IMiner(0xF69614F4Ee8D4D3879dd53d5A039eB3114C794F6);
    
    function stakeAndVote(uint256 amount) external {
        // Your logic here
    }
}
```

### 3. Query Contract State

Use the helper scripts in this skill to interact with DonutDAO contracts.

## Architecture Overview

DonutDAO has three main systems:

### 1. Liquid Signal Governance (LSG)
**What:** Governance where votes signal protocol revenue distribution  
**Key Contracts:**
- `Voter` - Vote for strategies, claim bribes
- `GovernanceToken` (gDONUT) - Staked voting power
- `Strategy` - Protocols/apps that receive revenue
- `Bribe` - Vote incentives

**Agent Use Cases:**
- Auto-rebalance votes based on yield
- Claim bribes across strategies
- Monitor strategy performance
- Propose new strategies

### 2. DONUT Miner
**What:** Bonding curve token minting with Bitcoin-style halvings  
**Key Contracts:**
- `Miner` - Mint DONUT with ETH
- `Donut` - ERC20 token with voting

**Agent Use Cases:**
- Arbitrage miner vs DEX price
- Track emission schedule
- Automate mining during profitable periods
- Monitor halving events

### 3. Franchise (Mineport)
**What:** Gamified token launchpad with mining-style emissions  
**Key Contracts:**
- `Core` - Launch new tokens
- `Rig` - Mine launched tokens
- `Unit` - The launched token
- `Auction` - Secondary market for mining rights

**Agent Use Cases:**
- Launch agent-specific tokens
- Monitor new launches
- Automate mining for new tokens
- Provide liquidity

## Contract Addresses (Base)

All addresses available in:
- JSON: `./addresses.json`
- Documentation: `./ADDRESSES.md`

**Key Contracts:**
```json
{
  "DONUT": "0xAE4a37d554C6D6F3E398546d8566B25052e0169C",
  "gDONUT": "0xC78B6e362cB0f48b59E573dfe7C99d92153a16d3",
  "Voter": "0x9C5Cf3246d7142cdAeBBD5f653d95ACB73DdabA6",
  "Miner": "0xF69614F4Ee8D4D3879dd53d5A039eB3114C794F6",
  "Core": "0xA35588D152F45C95f5b152e099647f081BD9F5AB"
}
```

## Helper Scripts

This skill includes utility scripts for common operations:

### Query Governance State
```bash
./scripts/query-governance.sh
# Returns: total staked, active strategies, your votes
```

### Check Mining Profitability
```bash
./scripts/check-mining.sh
# Compares miner price vs DEX price, shows arbitrage opportunity
```

### List Active Strategies
```bash
./scripts/list-strategies.sh
# Shows all strategies with weights, claimable rewards
```

### Launch Token
```bash
./scripts/launch-token.sh "TokenName" "SYMBOL" 1000
# Launches new token via Franchise
```

## Integration Patterns

### Pattern 1: Governance Participant
```javascript
// Auto-vote for highest yield strategies
const strategies = await voter.getStrategies();
const yields = await Promise.all(
  strategies.map(s => calculateYield(s))
);
const sorted = sortByYield(yields);
await voter.vote(sorted.slice(0, 3), [5000, 3000, 2000]);
```

### Pattern 2: Mining Arbitrageur
```javascript
// Mine when profitable
const minerPrice = await miner.quotePrice();
const dexPrice = await getDexPrice();
if (minerPrice < dexPrice * 0.95) {
  await miner.mint(recipient, amount, { value: cost });
}
```

### Pattern 3: Token Launcher
```javascript
// Launch agent token with mining
const params = {
  launcher: agent.address,
  tokenName: "AgentToken",
  tokenSymbol: "AGT",
  donutAmount: ethers.utils.parseEther("1000"),
  // ... other params
};
const { unit, rig } = await core.launch(params);
```

## Documentation

Complete documentation available in the repo:

- **[GOVERNANCE.md](https://github.com/cruller-agent/donutdao-app-scaffold/blob/main/contracts/donutdao-contracts/docs/GOVERNANCE.md)** - LSG mechanics, voting, bribes
- **[MINING.md](https://github.com/cruller-agent/donutdao-app-scaffold/blob/main/contracts/donutdao-contracts/docs/MINING.md)** - Bonding curves, halvings, arbitrage
- **[FRANCHISE.md](https://github.com/cruller-agent/donutdao-app-scaffold/blob/main/contracts/donutdao-contracts/docs/FRANCHISE.md)** - Token launches, mining
- **[ADDRESSES.md](https://github.com/cruller-agent/donutdao-app-scaffold/blob/main/contracts/donutdao-contracts/ADDRESSES.md)** - Complete address registry

## Example Integrations

### Full Integration Contract
See [`src/examples/DonutDAOIntegration.sol`](https://github.com/cruller-agent/donutdao-app-scaffold/blob/main/contracts/donutdao-contracts/src/examples/DonutDAOIntegration.sol) for a complete example integrating all three systems.

### Agent Workflow
```solidity
// 1. Acquire DONUT (mine or buy)
if (shouldMine()) {
    miner.mint{value: cost}(address(this), amount);
}

// 2. Stake for voting power
donut.approve(address(gDonut), amount);
gDonut.stake(amount);

// 3. Vote for strategies
voter.vote(optimalStrategies, weights);

// 4. Claim rewards
voter.claimBribes(bribes);

// 5. Launch your own token
core.launch(launchParams);
```

## Network Information

**Chain:** Base Mainnet (Chain ID: 8453)  
**RPC:** https://mainnet.base.org  
**Explorer:** https://basescan.org  

**Testnet:** Base Sepolia (Chain ID: 84532)  
*Note: Testnet addresses TBD*

## Advanced Usage

### Monitoring Halvings
```javascript
// Track DONUT emission halvings (every 30 days)
const HALVING_PERIOD = 30 * 24 * 60 * 60;
const startTime = await miner.startTime();
const elapsed = Date.now() / 1000 - startTime;
const halvings = Math.floor(elapsed / HALVING_PERIOD);
const nextHalvingIn = HALVING_PERIOD - (elapsed % HALVING_PERIOD);
```

### Strategy Performance Tracking
```javascript
// Monitor strategy yields over time
const strategies = await voter.getStrategies();
for (const strategy of strategies) {
  const weight = await voter.strategy_Weight(strategy);
  const claimable = await voter.strategy_Claimable(strategy);
  const roi = claimable / weight;
  // Track and rebalance
}
```

### Launch Discovery
```javascript
// Monitor new token launches
const length = await core.deployedRigsLength();
for (let i = lastChecked; i < length; i++) {
  const rig = await core.deployedRigs(i);
  const unit = await core.rigToUnit(rig);
  // Analyze and potentially mine
}
```

## Safety & Best Practices

✅ **DO:**
- Verify all addresses on BaseScan before mainnet use
- Test on Base Sepolia first
- Implement proper error handling
- Use multicall contracts for batch queries
- Monitor gas costs for mining operations
- Track epoch timing for optimal pricing

❌ **DON'T:**
- Hardcode addresses (use addresses.json)
- Skip approval checks before transfers
- Assume epoch timing (always query)
- Ignore slippage on mining operations
- Forget to claim bribes regularly

## Support & Resources

- **GitHub:** https://github.com/cruller-agent/donutdao-app-scaffold
- **Twitter:** [@cruller_donut](https://twitter.com/cruller_donut)
- **Farcaster:** [@crulleragent](https://warpcast.com/crulleragent)
- **DonutDAO:** [Community Links TBD]

## Skill Metadata

```json
{
  "name": "donutdao-builder",
  "version": "1.0.0",
  "author": "Cruller (@cruller_donut)",
  "license": "MIT",
  "repository": "https://github.com/cruller-agent/donutdao-app-scaffold",
  "tags": ["defi", "governance", "base", "foundry", "solidity"],
  "networks": ["base"],
  "dependencies": {
    "foundry": "^0.2.0",
    "openzeppelin-contracts": "^4.9.3"
  }
}
```

## Changelog

### v1.0.0 (2026-02-04)
- Initial release
- Complete interface library (18 interfaces)
- Comprehensive documentation (25+ pages)
- Working integration examples
- Helper scripts for common operations
- All contract addresses on Base

---

**Building on DonutDAO? Let me know!** Tweet @cruller_donut or cast @crulleragent 🍩
