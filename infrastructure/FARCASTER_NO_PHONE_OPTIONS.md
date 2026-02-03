# Farcaster Account Creation Without Phone

**Problem:** Need Farcaster account but no phone for SMS verification  
**Date:** 2026-01-31

---

## Research Findings

### ❌ Warpcast Mobile App
- **Requires:** Phone number for SMS verification
- **Not viable** without phone

### ❌ Neynar User Registration API
- **Requires:** Paid Neynar plan
- **Cost:** Unknown (need to check pricing)
- **Error:** "PaymentRequired - Upgrade to a paid plan to access this feature"

---

## Alternative Options

### Option 1: Wallet-Based Signup (No Phone Required) ✅

**What to try:**
1. Go to **https://farcaster.xyz** or alternative Farcaster clients
2. Look for "Sign in with Ethereum" or wallet-based signup
3. Connect wallet (MetaMask, Coinbase Wallet, etc.)
4. Complete onboarding via wallet signature
5. No phone number needed!

**Farcaster Clients to Try:**
- **Warpcast Web** (https://warpcast.com) - May have wallet option
- **Supercast** (https://supercast.xyz) - Premium client, wallet-based
- **Other clients** - Check https://www.farcaster.xyz for list

**How it works:**
- Farcaster protocol allows Ethereum wallet-based registration
- Sign message with your wallet
- Pay registration fee (~$7) via crypto
- No phone required!

### Option 2: Pay for Neynar Sponsored Account

**If wallet-based doesn't work:**

1. **Check Neynar pricing:** https://neynar.com/#pricing
2. **See what tier includes user registration**
3. **Evaluate cost vs benefit**

**Pros:**
- Create accounts programmatically
- No phone needed
- Can create multiple accounts for agents

**Cons:**
- Costs money (monthly fee)
- Overkill if we only need one account

### Option 3: Use Existing Account Temporarily

**Quick solution:**
- If you have ANY Farcaster account already
- Use it to get started
- Create dedicated account later when we find workaround

### Option 4: Virtual Phone Number Service

**Last resort:**
- Services like Google Voice, Twilio, etc.
- Get temporary phone number
- Use for SMS verification
- Costs: $0-5 depending on service

**Services to try:**
- Google Voice (free in US)
- Twilio (pay-per-use)
- SMS-Activate (virtual numbers)

---

## Recommended Approach

### Step 1: Try Wallet-Based Signup First ✅

**Try these in order:**

1. **Warpcast Web + Wallet:**
   - Go to https://warpcast.com
   - Look for "Connect Wallet" or "Sign in with Ethereum"
   - Use MetaMask or Coinbase Wallet
   - Pay fee in crypto (~$7 worth of ETH)

2. **Supercast:**
   - Go to https://supercast.xyz
   - Sign up with wallet
   - Premium client but may have easier wallet flow

3. **Direct Protocol Registration:**
   - Use Farcaster protocol directly
   - Register via smart contract
   - More technical but no phone needed

### Step 2: If Wallet Option Exists

**You'll need:**
- Ethereum wallet with ~$10-15 worth of ETH (for fees + storage)
- Wallet extension (MetaMask, Coinbase Wallet, Rainbow, etc.)
- No phone number!

**Process:**
1. Connect wallet to Farcaster client
2. Sign registration message
3. Pay onchain fee (~$7 for storage)
4. Choose username
5. Complete profile
6. Done!

### Step 3: Get Signer UUID

Once account is created (via wallet):
1. Go to https://dev.neynar.com
2. Sign in with the Farcaster account
3. Generate signer UUID
4. Send it to me

---

## Technical Option: Direct Contract Interaction

**For advanced users:**

Farcaster registration is onchain. You can interact directly with contracts:

**Contracts (Optimism mainnet):**
- **ID Registry:** `0x00000000Fc6c5F01Fc30151999387Bb99A9f489b`
- **Key Registry:** Contract for signing keys
- **Storage Registry:** Storage rental

**What you'd do:**
1. Call `register()` on ID Registry
2. Pay storage fee
3. Register signing key
4. Set username via fname registry

**Tools:**
- Etherscan contract interaction
- Foundry/Cast
- Direct web3.js/ethers.js calls

**This is complex but bypasses all UIs and phone requirements!**

---

## What I Can Help With

### If You Have a Wallet:
1. **Tell me which wallet you use** (MetaMask, Coinbase Wallet, etc.)
2. **I'll guide you** through wallet-based signup
3. **We'll find a client** that supports wallet registration
4. **No phone needed!**

### If You Want Technical Route:
1. **I can write a script** to register directly via contracts
2. **You provide wallet address** and sign transactions
3. **Fully automated** registration
4. **More complex but doable**

---

## Questions to Answer

1. **Do you have an Ethereum wallet?**
   - MetaMask, Coinbase Wallet, Rainbow, etc.?
   - With ~$10-15 ETH for fees?

2. **Are you comfortable signing wallet transactions?**
   - If yes → wallet-based signup is easiest
   - If no → we need different approach

3. **Do you have ANY existing Farcaster account?**
   - If yes → we can use temporarily
   - If no → need to create one

4. **How technical do you want to get?**
   - Simple: Try wallet signup manually
   - Advanced: I write registration script

---

## Next Steps

**Tell me:**
1. Do you have an Ethereum wallet? Which one?
2. Comfortable with wallet transactions?
3. Want me to guide you through wallet signup?
4. Or want me to write automated registration script?

**Then:**
- I'll provide exact steps for your situation
- We'll get the account created without phone
- Get signer UUID and start posting!

---

**Wallet-based registration should work - no phone needed! Just need crypto wallet + some ETH. 🍩⚙️**
