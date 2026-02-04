#!/bin/bash
# List Active DonutDAO Strategies

set -e

VOTER="0x9C5Cf3246d7142cdAeBBD5f653d95ACB73DdabA6"
RPC_URL="${BASE_RPC_URL:-https://mainnet.base.org}"

echo "📋 DonutDAO Active Strategies"
echo "=============================="
echo ""

# Get all strategies
STRATEGIES=$(cast call $VOTER "getStrategies()(address[])" --rpc-url $RPC_URL)

# Remove brackets and split
STRATEGIES=$(echo $STRATEGIES | tr -d '[]')
IFS=',' read -ra ADDR <<< "$STRATEGIES"

for strategy in "${ADDR[@]}"; do
    # Clean address
    strategy=$(echo $strategy | xargs)
    
    echo "Strategy: $strategy"
    echo "----------------------------------------"
    
    # Get weight
    WEIGHT=$(cast call $VOTER "strategy_Weight(address)(uint256)" $strategy --rpc-url $RPC_URL)
    echo "  Weight: $WEIGHT"
    
    # Get claimable
    CLAIMABLE=$(cast call $VOTER "strategy_Claimable(address)(uint256)" $strategy --rpc-url $RPC_URL)
    echo "  Claimable: $(echo "scale=6; $CLAIMABLE / 10^18" | bc) tokens"
    
    # Get payment token
    TOKEN=$(cast call $VOTER "strategy_PaymentToken(address)(address)" $strategy --rpc-url $RPC_URL)
    echo "  Payment Token: $TOKEN"
    
    # Get bribe
    BRIBE=$(cast call $VOTER "strategy_Bribe(address)(address)" $strategy --rpc-url $RPC_URL)
    echo "  Bribe: $BRIBE"
    
    # Check if alive
    ALIVE=$(cast call $VOTER "strategy_IsAlive(address)(bool)" $strategy --rpc-url $RPC_URL)
    if [ "$ALIVE" = "true" ]; then
        echo "  Status: ✅ Active"
    else
        echo "  Status: ❌ Inactive"
    fi
    
    echo ""
done

echo "✅ Strategy list complete!"
