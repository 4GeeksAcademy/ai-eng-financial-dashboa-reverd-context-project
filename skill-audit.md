# Agent skills audit

## Installation

Installed locally for GitHub Copilot with skills CLI 1.7.4:

```sh
npx skills find accessibility
npx skills find vercel-react-best-practices
npx skills add --help
npx skills add addyosmani/web-quality-skills --skill accessibility --agent github-copilot --yes
npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices --agent github-copilot --yes
npx skills list --agent github-copilot
```

Selected the exact accessibility match from Addy Osmani's web quality repository
and the exact React match from Vercel's official repository, rather than forks.
Installation counts are search snapshots, not security guarantees.

### Accessibility search results

| Skill | Repository / owner | Installs |
| --- | --- | --- |
| web-design-guidelines | vercel-labs/agent-skills | 757.8K |
| ui-ux-pro-max | nextlevelbuilder/ui-ux-pro-max-skill | 404.5K |
| ios-design | uizze.sh | 371.1K |
| impeccable | pbakaus/impeccable | 344.3K |
| playwright-best-practices | currents-dev/playwright-best-practices-skill | 96K |
| audit | pbakaus/impeccable | 81.9K |
| audit-website | squirrelscan/skills | 73.2K |
| accessibility (selected) | addyosmani/web-quality-skills | 62.4K |
| frontend-ui-engineering | addyosmani/agent-skills | 61.9K |
| limrun-ios-simulator | limrun-inc/skills | 37.2K |
| web-quality-audit | addyosmani/web-quality-skills | 31.6K |
| better-accessibility | jakubkrehel/skills | 27.7K |
| fixing-accessibility | ibelick/ui-skills | 20.7K |
| building-components | vercel/components.build | 14.5K |
| accessibility-compliance | wshobson/agents | 14.4K |
| web-design-reviewer | github/awesome-copilot | 13.9K |
| data-visualization | anthropics/knowledge-work-plugins | 13.4K |
| penpot-uiux-design | github/awesome-copilot | 12.8K |
| scoutqa-test | github/awesome-copilot | 10K |
| accessibility | affaan-m/ecc | 9K |

### React search results

| Skill | Repository / owner | Installs |
| --- | --- | --- |
| vercel-react-best-practices (selected) | vercel-labs/agent-skills | 818K |
| vercel-react-best-practices | am-will/codex-skills | 1.2K |
| vercel-react-best-practices | calesthio/openmontage | 967 |
| react-best-practices | sickn33/agentic-awesome-skills | 898 |
| vercel-react-best-practices | langgenius/dify | 612 |
| vercel-react-best-practices | lobehub/lobehub | 489 |
| vercel-react-best-practices | vercel-labs/agent-eval | 402 |
| vercel-react-best-practices | pymodel/react-frontend-skills | 397 |
| vercel-react-best-practices | akillness/jeo-skills | 383 |
| vercel-react-best-practices | davila7/claude-code-templates | 376 |
| vercel-react-best-practices | vercel-labs/openreview | 364 |
| react-best-practices | secondsky/claude-skills | 357 |
| vercel-react-best-practices | pedronauck/skills | 350 |
| vercel-react-best-practices | guanyang/open-agent-hub | 284 |
| vercel-react-best-practices | sickn33/agentic-awesome-skills | 272 |
| react-best-practices | laguagu/claude-code-nextjs-skills | 248 |
| vercel-react-best-practices | boraoztunc/skills | 230 |
| react-best-practices | tech-leads-club/agent-skills | 229 |
| vercel-react | blockmatic/basilic-skills | 212 |
| vercel-react-best-practices | vercel-labs/open-agents | 165 |

## Skill summaries

### accessibility

1. Audit WCAG 2.2 using rendered evidence and automated tools where available.
2. Provide text alternatives and accessible names.
3. Check contrast and avoid color-only information.
4. Support keyboard operation, visible focus and escape from components.
5. Prefer native semantics; announce loading, changes and errors correctly.

### vercel-react-best-practices

1. Eliminate request waterfalls before lower-impact optimizations.
2. Reduce initial JavaScript and defer expensive components.
3. Avoid unnecessary subscriptions and re-renders.
4. Optimize computations and iterations when the code justifies it.
5. Apply server and Next.js rules only to matching execution environments.

## Baseline

From frontend/, the documented npm run build, npm run lint and npm test pass.
There are 5 existing tests. Baseline build warnings: Vite config uses __dirname;
the initial JavaScript chunk is 632.68 kB (188.17 kB gzip), above 500 kB.
No warnings are suppressed or size thresholds increased.

The global Copilot instruction and customization skill paths supplied by the
environment were excluded from Copilot reads. Local AGENTS.md, all local rules,
all memory-bank files and both installed SKILL.md files were reviewed.