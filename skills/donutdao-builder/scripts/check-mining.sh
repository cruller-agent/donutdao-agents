#!/bin/bash
# Check DONUT Mining Profitability

set -e

MINER="0xF69614F4Ee8D4D3879dd53d5A039eB3114C794F6"
DONUT="0xAE4a37d554C6D6F3E398546d8566B25052e0169C"
WETH="0x4200000000000000000000000000000000000006"
LP="0xD1DbB2E56533C55C3A637D13C53aeEf65c5D5703"
RPC_URL="${BASE_RPC_URL:-https://mainnet.base.org}"

echo "⛏️  DONUT Mining Analysis"
echo "========================"
echo ""

# Get miner price (per DONUT)
echo "💰 Miner Price:"
MINER_PRICE=$(cast call $MINER "quotePrice()(uint256)" --rpc-url $RPC_URL)
echo "  Raw: $MINER_PRICE wei"
echo "  Formatted: $(echo "scale=8; $MINER_PRICE / 10^18" | bc) ETH per DONUT"
echo ""

# Get current DPS (donuts per second)
echo "📊 Emission Rate:"
DPS=$(cast call $MINER "getDPS()(uint256)" --rpc-url $RPC_URL)
echo "  Current DPS: $(echo "scale=4; $DPS / 10^18" | bc) DONUT/second"
DAILY=$(echo "scale=2; $DPS * 86400 / 10^18" | bc)
echo "  Daily Emission: $DAILY DONUT"
echo ""

# Get current epoch
echo "⏰ Epoch Info:"
EPOCH=$(cast call $MINER "getCurrentEpochId()(uint256)" --rpc-url $RPC_URL)
echo "  Current Epoch: $EPOCH"
INIT_PRICE=$(cast call $MINER "initPrice()(uint256)" --rpc-url $RPC_URL)
echo "  Init Price: $(echo "scale=8; $INIT_PRICE / 10^18" | bc) ETH"
echo ""

# Get LP reserves for DEX price
echo "💱 DEX Price (from LP):"
RESERVES=$(cast call $LP "getReserves()(uint112,uint112,uint32)" --rpc-url $RPC_URL)
RESERVE0=$(echo $RESERVES | cut -d' ' -f1)
RESERVE1=$(echo $RESERVES | cut -d' ' -f2)

# Calculate price (reserve1 / reserve0)
DEX_PRICE=$(echo "scale=8; $RESERVE1 / $RESERVE0" | bc)
echo "  Reserve0 (DONUT): $(echo "scale=2; $RESERVE0 / 10^18" | bc)"
echo "  Reserve1 (WETH): $(echo "scale=2; $RESERVE1 / 10^18" | bc)"
echo "  DEX Price: $DEX_PRICE ETH per DONUT"
echo ""

# Compare prices
echo "🔍 Arbitrage Opportunity:"
MINER_ETH=$(echo "scale=8; $MINER_PRICE / 10^18" | bc)
if (( $(echo "$MINER_ETH < $DEX_PRICE" | bc -l) )); then
    DIFF=$(echo "scale=2; ($DEX_PRICE - $MINER_ETH) * 100 / $DEX_PRICE" | bc)
    echo "  ✅ PROFITABLE! Miner is ${DIFF}% cheaper than DEX"
    echo "  💡 Consider mining DONUT and selling on DEX"
else
    DIFF=$(echo "scale=2; ($MINER_ETH - $DEX_PRICE) * 100 / $MINER_ETH" | bc)
    echo "  ❌ NOT PROFITABLE. Miner is ${DIFF}% more expensive than DEX"
    echo "  💡 Consider buying from DEX instead of mining"
fi
echo ""

echo "✅ Analysis complete!"
