#!/bin/bash
# Unified Farcaster posting script
# Usage: ./farcaster-post.sh [profile|channel|group] <target> "message"

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"

# Load credentials
export PRIVATE_KEY="$(pass donut-agent/farcaster-agent/wallet | head -1)"
export SIGNER_PRIVATE_KEY="$(pass donut-agent/farcaster/signer-private-key)"
export FID="$(pass donut-agent/farcaster/fid)"

# Check for Neynar API key (optional)
if pass ls donut-agent/neynar/api-key &>/dev/null; then
    export NEYNAR_API_KEY="$(pass donut-agent/neynar/api-key)"
fi

cd "$REPO_DIR"

case "$1" in
    profile|cast)
        shift
        node src/post-cast.js "$@"
        ;;
    channel)
        if [ -z "$2" ] || [ -z "$3" ]; then
            echo "Usage: $0 channel <channel-id> \"message\""
            echo "Example: $0 channel daos \"DAO update!\""
            exit 1
        fi
        node src/post-to-channel.js "$2" "$3"
        ;;
    group)
        if [ -z "$2" ] || [ -z "$3" ]; then
            echo "Usage: $0 group <group-id> \"message\""
            echo "Example: $0 group 7qIxCdzvkPEVZMqFVSM-tg \"Hello group!\""
            exit 1
        fi
        node src/group-post.js "$2" "$3"
        ;;
    search)
        if [ -z "$2" ]; then
            echo "Usage: $0 search <query>"
            echo "Searches for channels matching the query"
            exit 1
        fi
        node -e "
const { Wallet, JsonRpcProvider } = require('ethers');
const { RPC } = require('./src/config');
const { searchChannels } = require('./src/post-to-channel');

(async () => {
    const wallet = new Wallet(process.env.PRIVATE_KEY, new JsonRpcProvider(RPC.BASE));
    const channels = await searchChannels(wallet, '$2');
    if (channels.length === 0) {
        console.log('No channels found for: $2');
    } else {
        console.log('Channels matching \"$2\":');
        channels.forEach(c => console.log('  /' + c.id + ' - ' + c.name + ' (' + c.follower_count + ' followers)'));
    }
})().catch(console.error);
"
        ;;
    *)
        echo "Farcaster Posting Script"
        echo "========================"
        echo ""
        echo "Usage: $0 <command> [args]"
        echo ""
        echo "Commands:"
        echo "  profile \"message\"              Post to your profile"
        echo "  channel <id> \"message\"         Post to a channel"
        echo "  group <id> \"message\"           Post to a group (experimental)"
        echo "  search <query>                  Search for channels"
        echo ""
        echo "Examples:"
        echo "  $0 profile \"gm farcaster!\""
        echo "  $0 channel daos \"DAO governance update\""
        echo "  $0 channel donut \"DonutDAO news!\""
        echo "  $0 group 7qIxCdzvkPEVZMqFVSM-tg \"Hello DonutDAO group!\""
        echo "  $0 search dao"
        echo ""
        echo "Note: Groups are Warpcast-specific. For best results, use channels."
        exit 1
        ;;
esac
