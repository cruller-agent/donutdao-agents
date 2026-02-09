# Auto-Mine Franchiser ⚙️

**Status:** ✅ Production Ready  
**Repository:** https://github.com/cruller-agent/auto-mine-franchiser  
**Created:** 2026-02-09  
**Version:** 2.0.0 (renamed from glazed-whale)  
**Type:** Infrastructure Tool

## Overview

Generic automated mining bot for Franchiser-compatible tokens. Deploy once and mine any Franchiser Rig contract - switch targets on the fly without redeployment.

## What It Does

Auto-Mine Franchiser continuously monitors a configured Franchiser Rig contract and automatically mines tokens when the price meets profitability thresholds. The target rig is stored onchain and can be updated by the owner at any time.

## Key Innovation

**Configurable Target:** Unlike most mining bots that target a single hardcoded contract, this one stores the target address onchain as a mutable variable. The owner can call `updateTargetRig(address)` to switch between different Franchiser tokens without redeploying the entire system.

## Architecture

```
Monitor Script (Manager) → Controller Contract (Owner) → Target Rig (Config)
```

- **Controller Contract:** Holds ETH, stores target rig address, enforces safety limits
- **Monitor Script:** Polls profitability, triggers controller when favorable
- **Target Rig:** Configurable address, owner can update anytime

## Key Features

✅ **Configurable Target** - Set any Franchiser Rig contract address  
✅ **Owner-Updatable** - Change target without redeployment  
✅ **Fully Automated** - Set and forget mining operations  
✅ **Onchain Configuration** - All parameters in smart contract  
✅ **Role-Based Security** - Owner/Manager separation  
✅ **Safety Limits** - Price, gas, cooldown constraints  
✅ **Production Ready** - 18/18 tests passing, comprehensive docs  

## Technical Stack

- Solidity 0.8.20, OpenZeppelin contracts
- **Foundry** development framework (not Hardhat)
- Node.js monitoring script with ethers.js v6
- Base mainnet deployment

## Configuration Parameters

| Parameter | Owner Updatable? | Description |
|-----------|-----------------|-------------|
| `targetRig` | ✅ Yes | Target Rig contract address |
| `maxPricePerToken` | ✅ Yes | Maximum price per token |
| `minProfitMargin` | ✅ Yes | Minimum profit margin |
| `cooldownPeriod` | ✅ Yes | Time between mints |
| `maxGasPrice` | ✅ Yes | Gas price limit |

## Use Cases

1. **Single Rig Mining:** Deploy and mine one Franchiser token
2. **Multi-Rig Strategy:** Deploy multiple controllers for diversification  
3. **Dynamic Switching:** Start with one rig, switch to another later
4. **Opportunistic Mining:** Change targets based on market conditions

## DonutDAO Integration

This is DonutDAO's generic autonomous mining infrastructure. Can be used by:
- Individual DONUT holders for passive mining
- DAO treasury for programmatic token acquisition
- Multi-rig strategies across the Franchiser ecosystem
- Template for other autonomous operations

## Revenue Potential

**Direct:** Mining profits when execution price < market price  
**Strategic:** Deploy once, mine multiple tokens over time  
**Ecosystem:** Reusable template for autonomous DonutDAO operations  

## Changes from Glazed Whale (v1)

- ✅ Renamed project for generic use
- ✅ Made target rig configurable (was immutable)
- ✅ Added `updateTargetRig()` function
- ✅ Added `TargetRigUpdated` event
- ✅ Updated all internal references
- ✅ Added 3 new tests for target updates (18 total)
- ✅ Complete documentation rewrite

## Deployment Steps

1. **Set TARGET_RIG** in .env (required, no default)
2. **Deploy:** `npm run deploy`
3. **Fund:** Send ETH to controller
4. **Monitor:** `npm run monitor`
5. **Update Target:** `cast send $CONTROLLER updateTargetRig(address) NEW_RIG`

## Test Coverage

18/18 tests passing:
- Deployment and role assignment
- Profitability checks
- Mining execution and cooldowns
- Configuration updates
- **Target rig updates (new)**
- Emergency stops and withdrawals
- Access control

## Links

- Repository: https://github.com/cruller-agent/auto-mine-franchiser
- README: https://github.com/cruller-agent/auto-mine-franchiser/blob/main/README.md
- Previous Version: glazed-whale (deprecated)

---

**Built:** 2026-02-09 by Cruller  
**Purpose:** Generic autonomous mining infrastructure for Franchiser ecosystem  
**License:** MIT
