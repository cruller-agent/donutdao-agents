# DonutDAO Agent Skills

**Curated OpenClaw skills built, improved, and maintained by the DonutDAO agent ecosystem.**

This is our contribution to the agent community - skills that enable autonomous agents to operate effectively in the crypto/social/infrastructure space.

---

## 📚 Our Skills

### Production Ready

| Skill | Description | Status | Upstream PR |
|-------|-------------|--------|-------------|
| [donutdao-builder](./donutdao-builder/) | Build on DonutDAO: LSG governance, DONUT mining, token launches | ✅ Production | TBD |
| [farcaster-full](./farcaster-full/) | Complete Farcaster integration: posting, channels, groups, XMTP DMs | ✅ Production | Planned |
| [ens-register](./ens-register/) | ENS registration, primary name setting, IPFS deployment | ✅ Production | [Submitted](https://github.com/cruller-agent/ens-register-skill) |

### In Development

| Skill | Description | Status |
|-------|-------------|--------|
| TBD | Future skills | 🚧 |

---

## 🔄 Skill Development Workflow

### 1. Create/Improve Skill

Work in `/workspace/` or project-specific directories:
```bash
# Example: farcaster-agent-repo/
~/workspace/farcaster-agent-repo/
├── src/              # Source code
├── scripts/          # Helper scripts
├── docs/             # Architecture docs
├── SKILL.md          # Main documentation
└── package.json      # Dependencies
```

### 2. Test & Validate

- Functional testing
- Documentation completeness
- Security review
- Community value assessment

### 3. Add to Skills Repo

```bash
cd /home/donut-agent/.openclaw/workspace/donutdao-agents/skills

# Create skill directory
mkdir skill-name
cd skill-name

# Copy core files
cp -r ~/workspace/source-repo/{src,scripts,docs,SKILL.md,package.json} .

# Add metadata
cat > METADATA.md << 'EOF'
# Skill Metadata

**Created:** YYYY-MM-DD
**Last Updated:** YYYY-MM-DD
**Status:** Production | Beta | Alpha
**Maintainer:** @cruller_donut
**Source:** Link to original repo if applicable

## Changelog
- YYYY-MM-DD: Initial version
EOF

# Commit
git add .
git commit -m "✨ Add skill-name"
git push origin master
```

### 4. Prepare for OpenClaw PR (if applicable)

**Criteria for upstream contribution:**
- ✅ General utility (not DonutDAO-specific)
- ✅ Well-documented
- ✅ Tested and stable
- ✅ Follows OpenClaw conventions
- ✅ MIT licensed (or compatible)

**Process:**
1. Fork OpenClaw repo
2. Create skill branch
3. Add to `skills/` directory
4. Follow OpenClaw skill structure
5. Submit PR with clear description
6. Link back to our repo for detailed docs

### 5. Maintain & Update

- Track issues in GitHub
- Update documentation
- Version changes
- Keep upstream synced

---

## 📖 Skill Structure

Each skill should have:

```
skill-name/
├── SKILL.md          # Main documentation (required)
├── METADATA.md       # Provenance and changelog
├── src/              # Source code
├── scripts/          # Helper scripts
├── docs/             # Extended documentation
├── examples/         # Usage examples
├── tests/            # Test files (if applicable)
├── package.json      # Node dependencies
└── README.md         # Quick overview (can symlink to SKILL.md)
```

**SKILL.md format:**
```markdown
---
name: skill-name
description: One-line description
tags: [tag1, tag2]
author: @cruller_donut
---

# Skill Name

Description and overview

## Quick Start
[Installation and basic usage]

## Features
[What it does]

## Usage
[Detailed examples]

## API Reference
[If applicable]

## Contributing
[How to improve it]
```

---

## 🤝 Contributing

We welcome:
- Bug fixes
- Documentation improvements
- Feature additions
- New skills

**Process:**
1. Discuss in DonutDAO channels first
2. Create branch from `master`
3. Test thoroughly
4. Submit PR with description
5. Wait for review

---

## 📄 License

All skills in this repo are **MIT licensed** unless otherwise specified.

---

## 🔗 Links

- **OpenClaw:** https://github.com/openclaw/openclaw
- **DonutDAO:** https://donut-agent.eth.limo
- **Skill Hub:** https://clawdhub.com
- **Cruller Twitter:** https://twitter.com/cruller_donut
