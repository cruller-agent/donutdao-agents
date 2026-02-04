#!/bin/bash
# XMTP Helper Script
# 
# Sends and reads messages via XMTP decentralized messaging protocol.
# Note: XMTP is SEPARATE from Warpcast's "Direct Cast" DMs!
#
# Usage:
#   ./scripts/xmtp.sh check <address>
#   ./scripts/xmtp.sh dm <address> "message"
#   ./scripts/xmtp.sh group <groupId> "message"
#   ./scripts/xmtp.sh create-group <name> <addr1,addr2,...> ["message"]
#   ./scripts/xmtp.sh list
#   ./scripts/xmtp.sh read <conversationId> [limit]
#   ./scripts/xmtp.sh stream

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"

# Load credentials from pass if available
if command -v pass &> /dev/null; then
    export PRIVATE_KEY="${PRIVATE_KEY:-$(pass donut-agent/farcaster-agent/wallet 2>/dev/null | head -1 || echo "")}"
fi

if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ Error: PRIVATE_KEY not set"
    echo ""
    echo "Set it manually:"
    echo "  export PRIVATE_KEY=\"0x...\""
    echo ""
    echo "Or store in pass:"
    echo "  pass insert donut-agent/farcaster-agent/wallet"
    exit 1
fi

# XMTP environment (default: production)
export XMTP_ENV="${XMTP_ENV:-production}"

command="$1"
shift || true

case "$command" in
    check|dm|group|create-group)
        cd "$REPO_DIR" && node src/xmtp-send.js "$command" "$@"
        ;;
    list|read|stream)
        cd "$REPO_DIR" && node src/xmtp-read.js "$command" "$@"
        ;;
    ""|help|--help|-h)
        echo "XMTP Helper - Decentralized Messaging for Farcaster"
        echo "===================================================="
        echo ""
        echo "⚠️  IMPORTANT: XMTP is NOT the same as Warpcast DMs!"
        echo "   - Warpcast 'Direct Cast' uses a proprietary API"
        echo "   - XMTP is a separate decentralized protocol"
        echo "   - Recipients must have XMTP enabled to receive messages"
        echo "   - XMTP uses Ethereum addresses, not FIDs"
        echo ""
        echo "Usage:"
        echo "  $0 check <address>                    - Check if address can receive XMTP"
        echo "  $0 dm <address> \"message\"            - Send DM to an address"
        echo "  $0 group <groupId> \"message\"         - Send to existing group"
        echo "  $0 create-group <name> <addrs> [msg]  - Create group (addrs: comma-separated)"
        echo "  $0 list                               - List conversations"
        echo "  $0 read <convId> [limit]              - Read messages from conversation"
        echo "  $0 stream                             - Stream new messages live"
        echo ""
        echo "Environment:"
        echo "  PRIVATE_KEY - Ethereum wallet private key (or stored in pass)"
        echo "  XMTP_ENV    - 'dev' or 'production' (default: production)"
        echo ""
        echo "Examples:"
        echo "  $0 check 0x1234...abcd"
        echo "  $0 dm 0x1234...abcd \"Hello from XMTP!\""
        echo "  $0 create-group \"DonutDAO\" 0x111...,0x222... \"Welcome!\""
        echo "  $0 list"
        ;;
    *)
        echo "Unknown command: $command"
        echo "Run '$0 --help' for usage"
        exit 1
        ;;
esac
