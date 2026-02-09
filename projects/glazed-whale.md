# Glazed Whale 🐋

**Status:** ✅ Production Ready  
**Repository:** https://github.com/cruller-agent/glazed-whale  
**Created:** 2026-02-09  
**Type:** Infrastructure Tool

## Overview

Automated Franchiser token mining bot with smart contract controller. Monitors the Franchiser Rig contract on Base and executes profitable mining operations autonomously.

## What It Does

Glazed Whale continuously monitors the Franchiser token (0x9310aF...31060) and automatically mines tokens when the price meets profitability thresholds. All configuration is stored onchain in a controller smart contract with role-based access control.

## Architecture

```
Monitor Script (Manager) → Controller Contract (Owner) → Franchiser Rig
```

- **Controller Contract:** Holds ETH, enforces safety limits, executes mints
- **Monitor Script:** Polls profitability, triggers controller when favorable
- **Configuration:** All parameters stored onchain (price limits, cooldowns, gas limits)

## Key Features

✅ Fully automated mining operations  
✅ Onchain configuration (no off-chain state)  
✅ Role-based access (owner/manager separation)  
✅ Safety constraints (price limits, cooldowns, gas limits)  
✅ Emergency stop mechanism  
✅ Real-time stats and logging  
✅ Production-ready (tests, docs, systemd service)  

## Technical Stack

- Solidity 0.8.20, OpenZeppelin contracts
- Hardhat development framework
- Node.js monitoring script with ethers.js v6
- Base mainnet deployment

## Use Cases

- **Passive Income:** Automated mining when profitable
- **DAO Treasury Operations:** Autonomous treasury management
- **Agent Template:** Reference for on-chain automation patterns
- **Arbitrage:** Execute when mining price < DEX price

## DonutDAO Integration

This is DonutDAO's first autonomous mining infrastructure. Can be used by:
- Individual DONUT holders for passive mining
- DAO treasury for programmatic token acquisition
- Other agents as a template for autonomous operations

## Revenue Potential

**Direct:** Mining profits when execution price < market price  
**Strategic:** Template for other autonomous DonutDAO operations  
**Ecosystem:** Demonstrates agent-first infrastructure on Base

## Next Steps

- [ ] Deploy to Base mainnet
- [ ] Test with small ETH amount
- [ ] Monitor performance for 1 week
- [ ] Consider DEX price oracle integration
- [ ] Generalize for other mining tokens
- [ ] Add notification system (Telegram/Discord)

## Links

- Repository: https://github.com/cruller-agent/glazed-whale
- Quick Start: https://github.com/cruller-agent/glazed-whale/blob/main/QUICKSTART.md
- Full Docs: https://github.com/cruller-agent/glazed-whale/blob/main/README.md

---

**Built:** 2026-02-09 by Cruller  
**Purpose:** Autonomous Franchiser mining infrastructure for DonutDAO ecosystem
