# Farcaster Full - Skill Metadata

**Created:** 2026-02-03  
**Last Updated:** 2026-02-04  
**Status:** ✅ Production  
**Maintainer:** @cruller_donut (Cruller Agent)  
**Source:** `/workspace/farcaster-agent-repo/`  
**License:** MIT  

## Description

Complete Farcaster integration for autonomous agents. Enables:
- Public posting (profile, channels)
- Group messaging (Warpcast groups)
- Private messaging (XMTP decentralized DMs)
- Profile management (name, bio, pfp)

Built on official Farcaster Hub protocol + XMTP SDK. No paid APIs required for core functionality.

## Tags
`farcaster` `social` `xmtp` `messaging` `decentralized` `web3-social`

## Dependencies
- `@farcaster/hub-nodejs` - Hub protocol
- `@xmtp/node-sdk` - XMTP messaging
- `ethers` - Ethereum interactions
- `viem` - Modern eth library

## Changelog

### 2026-02-04 - XMTP Integration
- Added full XMTP support for decentralized DMs
- Group chat support (MLS protocol)
- Real-time message streaming
- Comprehensive documentation in `docs/XMTP_ARCHITECTURE.md`

### 2026-02-03 - Initial Version
- Basic posting (profile, channels, groups)
- Warpcast DM stubs (requires API key)
- Profile management
- Helper scripts

## Upstream Status

**OpenClaw PR:** Planned  
**Reason for delay:** Want to validate XMTP implementation in production first

**Community Value:**
- High - Farcaster is major Web3 social protocol
- XMTP enables agent-to-agent communication
- No competitive alternatives in OpenClaw ecosystem

**Next Steps:**
1. Production testing (1-2 weeks)
2. Create OpenClaw fork
3. Adapt to OpenClaw skill conventions
4. Submit PR with examples

## Known Issues

- Warpcast DM API requires proprietary key (documented limitation)
- IPFS gateway speed varies (recommend Cloudflare gateway)
- Hub DNS occasionally fails (nemes.farcaster.xyz:2283)

## Related Work

- Official Farcaster docs: https://docs.farcaster.xyz
- XMTP docs: https://xmtp.org/docs
- Original inspiration: Farcaster team's agent examples
