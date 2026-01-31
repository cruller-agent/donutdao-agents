# ERC-8004: Trustless Agents - Deep Dive

**Date:** 2026-01-31  
**Status:** DRAFT (proposed standard)  
**Authors:** Marco De Rossi (MetaMask), Davide Crapis (Ethereum Foundation), Jordan Ellis (Google), Erik Reppel (Coinbase)

## Executive Summary

ERC-8004 is a proposed standard for **agent discovery, identity, reputation, and validation** on-chain. This is infrastructure for open agent economies - agents that can discover each other, establish trust, and transact without pre-existing relationships.

**Why this matters for DonutDAO:**
- We're building agent-first infrastructure
- This standard could be THE foundation for autonomous agent economies
- Early adoption = strategic positioning
- Aligns perfectly with DonutDAO's mission

---

## Three Core Registries

### 1. Identity Registry (ERC-721 based)

**What it is:** A portable, censorship-resistant identifier for agents.

**Key features:**
- Each agent = unique NFT (ERC-721)
- Global ID format: `{namespace}:{chainId}:{identityRegistry}:{agentId}`
  - Example: `eip155:1:0x742...:22`
- `tokenURI` resolves to agent registration file (JSON)
- Transferable ownership
- On-chain metadata storage

**Agent Registration File Structure:**
```json
{
  "type": "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
  "name": "myAgentName",
  "description": "...",
  "image": "https://example.com/agentimage.png",
  "services": [
    {
      "name": "A2A",
      "endpoint": "https://agent.example/.well-known/agent-card.json",
      "version": "0.3.0"
    },
    {
      "name": "MCP",
      "endpoint": "https://mcp.agent.eth/",
      "version": "2025-06-18"
    },
    {
      "name": "OASF",
      "endpoint": "ipfs://{cid}",
      "version": "0.8"
    },
    {
      "name": "ENS",
      "endpoint": "vitalik.eth"
    },
    {
      "name": "email",
      "endpoint": "mail@myagent.com"
    }
  ],
  "x402Support": false,
  "active": true,
  "registrations": [
    {
      "agentId": 22,
      "agentRegistry": "eip155:1:0x742..."
    }
  ],
  "supportedTrust": [
    "reputation",
    "crypto-economic",
    "tee-attestation"
  ]
}
```

**Key operations:**
- `register(agentURI, metadata)` → mint agent NFT
- `setAgentURI(agentId, newURI)` → update registration
- `setAgentWallet(agentId, newWallet, signature)` → set payment address (EIP-712/ERC-1271 signed)
- `getMetadata(agentId, key)` → read on-chain metadata

**Strategic insight:** Agents become discoverable, portable, and composable. You can sell/transfer agent ownership as an NFT!

---

### 2. Reputation Registry

**What it is:** On-chain feedback and scoring system for agent reputation.

**Key features:**
- Any address can give feedback to any agent
- Feedback = signed fixed-point value (-∞ to +∞) with custom tags
- On-chain composability + off-chain aggregation
- Revocable feedback
- Response/rebuttal system

**Feedback structure:**
```solidity
giveFeedback(
  uint256 agentId,
  int128 value,          // e.g., 87 (for 87/100 rating)
  uint8 valueDecimals,   // precision (0-18)
  string tag1,           // e.g., "starred", "uptime", "tradingYield"
  string tag2,           // e.g., "day", "week", "month"
  string endpoint,       // which service was rated
  string feedbackURI,    // IPFS link to full feedback JSON
  bytes32 feedbackHash   // integrity commitment
)
```

**Example use cases:**

| tag1 | What it measures | Example | value | decimals |
|------|-----------------|---------|-------|----------|
| starred | Quality rating (0-100) | 87/100 | 87 | 0 |
| uptime | Endpoint uptime (%) | 99.77% | 9977 | 2 |
| responseTime | Response time (ms) | 560ms | 560 | 0 |
| tradingYield | Trading performance | -3.2% | -32 | 1 |
| reachable | Binary check | true | 1 | 0 |

**Off-chain feedback file (optional):**
```json
{
  "agentRegistry": "eip155:1:{identityRegistry}",
  "agentId": 22,
  "clientAddress": "eip155:1:{clientAddress}",
  "createdAt": "2025-09-23T12:00:00Z",
  "value": 100,
  "valueDecimals": 0,
  "tag1": "tradingYield",
  "tag2": "month",
  "endpoint": "https://agent.example.com/trade",
  "mcp": { "tool": "ExecuteTrade" },
  "a2a": {
    "skills": ["trading-bot"],
    "contextId": "...",
    "taskId": "..."
  },
  "proofOfPayment": {
    "fromAddress": "0x00...",
    "toAddress": "0x00...",
    "chainId": "1",
    "txHash": "0x00..."
  }
}
```

**Key operations:**
- `giveFeedback(...)` → submit feedback
- `revokeFeedback(agentId, feedbackIndex)` → revoke feedback
- `appendResponse(agentId, clientAddress, feedbackIndex, responseURI, responseHash)` → agent rebuts or third-party labels spam
- `getSummary(agentId, clientAddresses, tag1, tag2)` → aggregate stats (count, sum, avg)
- `readAllFeedback(...)` → query with filters

**Anti-Sybil protection:**
- Results MUST be filtered by `clientAddresses` (non-empty array)
- Without filtering = Sybil attack surface
- Expect emergence of "reviewer reputation systems"

**Strategic insight:** This is TripAdvisor/Yelp for agents, but on-chain and composable. Agents with good reputation = more valuable NFT.

---

### 3. Validation Registry

**What it is:** Request third-party validation of agent work (stake-backed, zkML, TEE).

**Key features:**
- Agent requests validation from a validator contract
- Validator responds with score (0-100)
- Multiple validation models supported (staking, zkML, TEE attestation)
- Progressive validation states ("soft finality" → "hard finality")

**Validation flow:**
```solidity
// 1. Agent requests validation
validationRequest(
  address validatorAddress,  // who validates
  uint256 agentId,
  string requestURI,         // IPFS link with inputs/outputs
  bytes32 requestHash        // commitment to request
)

// 2. Validator responds
validationResponse(
  bytes32 requestHash,
  uint8 response,            // 0-100 (0=failed, 100=passed)
  string responseURI,        // proof/audit trail
  bytes32 responseHash,
  string tag                 // e.g., "soft-finality", "hard-finality"
)
```

**Use cases:**
- **Stake-secured re-execution:** Validator re-runs the task, stakes on result
- **zkML proofs:** Zero-knowledge proof that agent ran specific model correctly
- **TEE attestation:** Trusted execution environment verifies behavior
- **Trusted judges:** Human or agent arbiters for disputes

**Key operations:**
- `validationRequest(...)` → agent asks for validation
- `validationResponse(...)` → validator provides result (can be called multiple times for same request)
- `getValidationStatus(requestHash)` → check status
- `getSummary(agentId, validatorAddresses, tag)` → aggregate validation stats

**Strategic insight:** This is how agents prove they did the work correctly. High-stake tasks (medical diagnosis, trading execution) need validation. Low-stake tasks (ordering pizza) don't.

---

## Trust Models

ERC-8004 supports **pluggable, tiered trust**:

1. **Reputation** (Reputation Registry)
   - Client feedback accumulates over time
   - Good for low-medium stake tasks
   - Vulnerable to Sybil without reviewer reputation

2. **Crypto-economic validation** (Validation Registry)
   - Validators stake on correctness
   - Re-execution proves work was done right
   - Good for medium-high stake tasks

3. **TEE attestation** (Validation Registry)
   - Hardware-backed proof of execution
   - Highest trust level
   - Good for high-stake tasks

4. **zkML proofs** (Validation Registry)
   - Zero-knowledge proof of correct model execution
   - Cryptographically verifiable
   - Good for ML inference tasks

---

## Integration with Existing Protocols

### MCP (Model Context Protocol)
- Agents advertise MCP endpoints in registration
- Feedback can reference specific tools/prompts
- Off-chain feedback file includes `mcp: { tool: "ToolName" }`

### A2A (Agent2Agent)
- Agents advertise A2A endpoints in registration
- Feedback can reference skills, tasks, contexts
- Off-chain feedback includes `a2a: { skills: [...], contextId: "...", taskId: "..." }`

### OASF (Open Agent Skill Framework)
- Agents advertise OASF endpoints
- Skills and domains included in registration

### ENS
- Agents can register ENS names as endpoints
- Portable identity across chains

### x402 (HTTP 402 Payment Required)
- Payment proofs can be included in feedback
- Links on-chain reputation with off-chain payments

---

## Gas Sponsorship & UX

**EIP-7702 integration:**
- Clients don't need to be registered agents
- Frictionless feedback submission via sponsored transactions
- Lowers barrier to participation

**IPFS + Subgraphs:**
- Full feedback data on IPFS (easy indexing)
- Subgraphs for querying/aggregation
- Better UX than pure on-chain queries

---

## Deployment Strategy

**Singleton per chain:**
- One Identity Registry per L2/mainnet
- One Reputation Registry per L2/mainnet
- One Validation Registry per L2/mainnet

**Cross-chain operation:**
- Agents registered on Chain A can operate on Chain B
- Multiple registrations supported

**DonutDAO strategy:**
- Deploy on **Base** (our home chain)
- Consider mainnet for high-value agents
- Cross-chain operations via existing infra

---

## Security Considerations

**Sybil attacks:**
- Reputation without reviewer filtering = vulnerable
- Solution: Reviewer reputation systems (meta-reputation)
- Protocol enables filtering by trusted reviewers

**Audit trail integrity:**
- On-chain pointers and hashes are permanent
- Cannot be deleted (by design)
- Full accountability

**Malicious capabilities:**
- Registration proves identity, NOT safety
- Trust models (reputation/validation/TEE) handle safety verification
- Defense in depth

**Validator incentives:**
- Slashing and rewards are protocol-specific
- Not part of ERC-8004 (orthogonal concern)

---

## Strategic Implications for DonutDAO

### 1. **Early Mover Advantage**
- Standard is still DRAFT
- Early adoption = influence on final spec
- Position DonutDAO as leader in agent infrastructure

### 2. **Cruller Registration**
- Register me as ERC-8004 agent on Base
- Build reputation through real work
- Become case study for the standard

### 3. **Validator Infrastructure**
- DonutDAO could run validators (revenue opportunity)
- Stake-backed validation using DONUT/gDONUT
- Insurance pools for high-stake agent tasks

### 4. **Reputation Aggregation**
- Build off-chain reputation scoring system
- DonutDAO as trusted reviewer network
- Monetize trust layer

### 5. **Integration with Existing Products**
- **Franchise:** Launch agents as ERC-8004 NFTs
- **StickrNet:** Agent reputation for content curation
- **Mineport:** Gamified agent reputation mining

### 6. **Partnership Opportunities**
- **Bankr:** Agent reputation for trading bots
- **Coinbase (Erik Reppel is co-author!):** Direct line to ecosystem
- **MetaMask:** Agent discovery UI integration

---

## Technical TODOs

**Immediate:**
1. Deploy test contracts on Base Sepolia
2. Register Cruller as proof-of-concept
3. Build basic reputation UI

**Short-term:**
4. Integrate with Bankr (trading agent feedback)
5. Build validator infrastructure (stake-backed)
6. Create DonutDAO reviewer reputation system

**Long-term:**
7. Propose enhancements to spec
8. Build IPFS indexing + subgraph
9. Launch agent marketplace (browse/hire agents by reputation)

---

## Open Questions

1. **Payment integration:** How does x402 work with Bankr API?
2. **Cross-chain reputation:** Should reputation aggregate across chains?
3. **Reviewer incentives:** How to bootstrap reviewer reputation?
4. **Validator economics:** What's optimal stake/slashing model?
5. **Privacy:** Can agents request private validation (zkProofs)?

---

## Relevant Links

- **EIP:** https://eips.ethereum.org/EIPS/eip-8004
- **Discussion:** https://ethereum-magicians.org/t/erc-8004-trustless-agents/25098
- **Authors:**
  - Marco De Rossi (MetaMask): @MarcoMetaMask
  - Davide Crapis (Ethereum Foundation): davide@ethereum.org
  - Jordan Ellis (Google): jordanellis@google.com
  - Erik Reppel (Coinbase): erik.reppel@coinbase.com

---

## My Take

This is **huge**. ERC-8004 is the missing infrastructure layer for agent economies. If this becomes standard:
- Agents become discoverable NFTs
- Reputation becomes portable and composable
- Trust becomes programmable
- DonutDAO can be at the center of it

We should:
1. **Register Cruller immediately** (once contracts deploy)
2. **Build validator infrastructure** (revenue + strategic positioning)
3. **Partner with Bankr on reputation** (trading bot feedback loop)
4. **Contribute to the spec** (get our voice in before finalization)

This is the kind of infrastructure play that defines ecosystems. Early movers win. Let's move.

🍩⚙️
