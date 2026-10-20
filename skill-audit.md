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

## Accessibility findings

Locations below refer to the pre-edit installation commit 05b0744.

| Source location | Finding / disposition | Skill instruction |
| --- | --- | --- |
| frontend/src/App.tsx:51 | Added role=alert and lang=es to the existing Spanish error. | Error handling 3.3.1; Page language 3.1.1 |
| frontend/src/App.tsx:56 | Added persistent status region and aria-busy to data sections. | Live regions 4.1.3; ARIA usage 4.1.2 |
| frontend/src/App.tsx:65 | Added a native details/summary disclosure containing all monthly chart values, caption and scoped table headers. | Text alternatives 1.1; Keyboard accessible 2.1 |
| frontend/src/index.css:123 | Added currentColor focus-visible outline for chart focus targets and native controls. | Focus visible 2.4.7 |
| frontend/src/index.css:123 | Added reduced-motion override for CSS animations/transitions. | Motion 2.3 |
| frontend/src/index.css:58 | No palette change: neutral OKLCH estimate is 4.52:1 on muted and higher on card; no demonstrated failure. Actual rendered contrast remains unverified. | Color contrast 1.4.3 requires evidence, not speculative palette changes |
| frontend/src/components/dashboard/kpi-card.tsx:61; dashboard-header.tsx:12 | No change: Lucide already emits aria-hidden=true, verified in the page test. Icons repeat adjacent text; no icon-only buttons or HTML images exist. | Text alternatives 1.1 |
| frontend/src/App.tsx:46 | No repeated navigation, forms or dialogs; no invented skip navigation or focus trap. Native disclosure preserves focus order. | Keyboard accessible 2.1; Skip links 2.4.1; ARIA usage 4.1.2 |
| frontend/src/App.test.tsx | Added RTL tests for loading, data, error and empty states, native disclosure, headers, values and decorative SVG semantics. | Testing checklist: automated testing |

### Accessibility verification

The documented npm test passes 9 tests; npm run build and npm run lint pass.
No new lint warnings. The existing oversized chunk warning remains (585.49 kB).
Installing the RTL/jsdom dev dependencies with npm install resolved the declared
dependency ranges again (Vite 8.0.8 rather than the preinstalled 8.3.4); therefore
the baseline size difference is NOT attributed to accessibility improvements.
The configLoader warning does not occur with this resolved Vite version.
Npm reported 13 dependency vulnerabilities (1 low, 5 moderate, 7 high); no broad
audit fix was attempted. No browser automation, Lighthouse or screen reader
tool is exposed in this session. Live contrast, real keyboard traversal/traps,
zoom, high contrast and screen-reader behavior remain unverified. DOM tests
and CSS inspection are not a WCAG compliance claim.