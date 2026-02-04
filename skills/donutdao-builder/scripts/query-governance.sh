#!/bin/bash
# Query DonutDAO Governance State

set -e

VOTER="0x9C5Cf3246d7142cdAeBBD5f653d95ACB73DdabA6"
GDONUT="0xC78B6e362cB0f48b59E573dfe7C99d92153a16d3"
RPC_URL="${BASE_RPC_URL:-https://mainnet.base.org}"

echo "🍩 DonutDAO Governance State"
echo "=============================="
echo ""

# Total staked
echo "📊 Total Staked (gDONUT):"
cast call $GDONUT "totalSupply()(uint256)" --rpc-url $RPC_URL | xargs -I {} printf "%.2f DONUT\n" $(echo "scale=2; {} / 10^18" | bc)
echo ""

# Total voting weight
echo "⚖️  Total Voting Weight:"
cast call $VOTER "totalWeight()(uint256)" --rpc-url $RPC_URL
echo ""

# Number of strategies
echo "📋 Active Strategies:"
cast call $VOTER "length()(uint256)" --rpc-url $RPC_URL
echo ""

# Get all strategies
echo "📍 Strategy Addresses:"
cast call $VOTER "getStrategies()(address[])" --rpc-url $RPC_URL
echo ""

echo "✅ Query complete!"
echo ""
echo "For detailed strategy info, use: ./scripts/list-strategies.sh"
