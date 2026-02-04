#!/bin/bash
# Farcaster DM Helper Script
#
# Usage:
#   ./dm.sh send user <fid> "message"
#   ./dm.sh send conversation <id> "message"
#   ./dm.sh inbox [limit]
#   ./dm.sh read <conversationId> [limit]
#
# Requirements:
#   - Warpcast API key stored in: pass donut-agent/warpcast/api-key
#   - Get it from: Warpcast > Settings > Developer Mode > API Keys

set -e
cd "$(dirname "$0")/.."

# Get Warpcast API key
WARPCAST_API_KEY=$(pass donut-agent/warpcast/api-key 2>/dev/null) || {
    echo "❌ Warpcast API key not found!"
    echo ""
    echo "To set up DM access:"
    echo "1. Open Warpcast app"
    echo "2. Go to Settings > Developer Mode (enable if needed)"
    echo "3. Go to Developer Tools > API Keys"
    echo "4. Create a new API key"
    echo "5. Store it: pass insert donut-agent/warpcast/api-key"
    exit 1
}

export WARPCAST_API_KEY

case "$1" in
    send)
        if [ -z "$2" ] || [ -z "$3" ] || [ -z "$4" ]; then
            echo "Usage: $0 send <user|conversation> <target> \"message\""
            echo ""
            echo "Examples:"
            echo "  $0 send user 272109 \"Hello @heesh!\""
            echo "  $0 send conversation 4508b83dfc815a01 \"Hello group!\""
            exit 1
        fi
        node src/dm-send.js "$2" "$3" "$4"
        ;;
    
    inbox)
        limit="${2:-10}"
        node src/dm-read.js inbox "$limit"
        ;;
    
    read)
        if [ -z "$2" ]; then
            echo "Usage: $0 read <conversationId> [limit]"
            echo ""
            echo "Example:"
            echo "  $0 read 4508b83dfc815a01 20"
            exit 1
        fi
        limit="${3:-10}"
        node src/dm-read.js conversation "$2" "$limit"
        ;;
    
    *)
        echo "Farcaster DM Helper"
        echo "==================="
        echo ""
        echo "Commands:"
        echo "  send user <fid> \"message\"           Send DM to user by FID"
        echo "  send conversation <id> \"message\"   Send message to group/conversation"
        echo "  inbox [limit]                       List conversations"
        echo "  read <conversationId> [limit]       Read messages in conversation"
        echo ""
        echo "Examples:"
        echo "  $0 send user 272109 \"Hello!\""
        echo "  $0 send conversation 4508b83dfc815a01 \"Hello group!\""
        echo "  $0 inbox"
        echo "  $0 read 4508b83dfc815a01"
        echo ""
        echo "Target conversation: 4508b83dfc815a01"
        echo ""
        echo "Note: Requires Warpcast API key in pass at donut-agent/warpcast/api-key"
        ;;
esac
