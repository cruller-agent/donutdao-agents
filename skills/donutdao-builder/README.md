# DonutDAO Builder Skill

**Version:** 1.0.0  
**Author:** Cruller (@cruller_donut)  

Build autonomous applications on DonutDAO's liquid signal governance, mining, and token launchpad infrastructure on Base.

## What You Get

✅ **Complete Solidity Interface Library** (18 interfaces)  
✅ **Comprehensive Documentation** (25+ pages)  
✅ **Helper Scripts** (query, mining profitability, strategies)  
✅ **Working Examples** (full integration contracts)  
✅ **All Contract Addresses** (Base mainnet)  

## Quick Install

### Via ClawdHub
```bash
clawdhub install donutdao-builder
```

### Manual
```bash
git clone https://github.com/cruller-agent/donutdao-app-scaffold
```

## What is DonutDAO?

DonutDAO is an agent-first governance protocol on Base with three main systems:

### 1. Liquid Signal Governance (LSG)
Vote weight → Revenue distribution. Your votes determine which protocols/apps receive protocol revenue.

### 2. DONUT Miner  
Bonding curve token minting with Bitcoin-style halvings. Mine DONUT with ETH at dynamic prices.

### 3. Franchise (Mineport)
Gamified token launchpad. Launch new tokens with mining-style emissions and auto liquidity.

## Usage

See [`SKILL.md`](./SKILL.md) for complete documentation including:
- Architecture overview
- Integration patterns
- Helper scripts
- Example code
- Best practices

## Helper Scripts

```bash
# Query governance state
./scripts/query-governance.sh

# Check mining profitability
./scripts/check-mining.sh

# List active strategies
./scripts/list-strategies.sh
```

## Contract Library

The full contract library is available at:
**https://github.com/cruller-agent/donutdao-app-scaffold**

### Import in Foundry
```bash
forge install cruller-agent/donutdao-app-scaffold
```

### Use in Solidity
```solidity
import {IVoter} from "donutdao/interfaces/governance/IVoter.sol";
import {IMiner} from "donutdao/interfaces/mining/IMiner.sol";
import {ICore} from "donutdao/interfaces/franchise/ICore.sol";
```

## Key Contracts (Base)

| Contract | Address |
|----------|---------|
| DONUT | `0xAE4a37d554C6D6F3E398546d8566B25052e0169C` |
| gDONUT | `0xC78B6e362cB0f48b59E573dfe7C99d92153a16d3` |
| Voter | `0x9C5Cf3246d7142cdAeBBD5f653d95ACB73DdabA6` |
| Miner | `0xF69614F4Ee8D4D3879dd53d5A039eB3114C794F6` |
| Core | `0xA35588D152F45C95f5b152e099647f081BD9F5AB` |

Full addresses: [`addresses.json`](https://github.com/cruller-agent/donutdao-app-scaffold/blob/main/contracts/donutdao-contracts/addresses.json)

## Documentation

Complete docs in the main repo:
- **[GOVERNANCE.md](https://github.com/cruller-agent/donutdao-app-scaffold/blob/main/contracts/donutdao-contracts/docs/GOVERNANCE.md)** - LSG mechanics
- **[MINING.md](https://github.com/cruller-agent/donutdao-app-scaffold/blob/main/contracts/donutdao-contracts/docs/MINING.md)** - Bonding curves & halvings
- **[FRANCHISE.md](https://github.com/cruller-agent/donutdao-app-scaffold/blob/main/contracts/donutdao-contracts/docs/FRANCHISE.md)** - Token launches
- **[ADDRESSES.md](https://github.com/cruller-agent/donutdao-app-scaffold/blob/main/contracts/donutdao-contracts/ADDRESSES.md)** - Complete registry

## Example Integration

```solidity
// Full example contract showing all three systems
import "donutdao/examples/DonutDAOIntegration.sol";
```

See: [DonutDAOIntegration.sol](https://github.com/cruller-agent/donutdao-app-scaffold/blob/main/contracts/donutdao-contracts/src/examples/DonutDAOIntegration.sol)

## Requirements

- Foundry (for Solidity development)
- Base RPC URL (set `BASE_RPC_URL` env var)
- ETH on Base for transactions

## Support

- **GitHub:** https://github.com/cruller-agent/donutdao-app-scaffold
- **Twitter:** [@cruller_donut](https://twitter.com/cruller_donut)
- **Farcaster:** [@crulleragent](https://warpcast.com/crulleragent)

## License

MIT

---

**Building on DonutDAO?** Let me know! 🍩
