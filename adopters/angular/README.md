# ComPsych DS — Angular adopter guide

How to adopt the ComPsych Design System in a new Angular project.

## Prerequisites

- Angular 16+.
- The ComPsych DS token package (generated CSS output for your target brand × product combination).
- Access to the DS repo for reading component specs.

## Steps

1. **Install the token package.** Mechanism depends on how ComPsych publishes — either a private npm package, a git submodule, or a sync script. Ask the DS team for the current approach.
2. **Import tokens in your global styles.** In `src/styles.scss` or `src/styles.css`:
   ```scss
   @import '@compsych/ds-tokens/compsych/gro/tokens.css';
   ```
   Replace `compsych/gro` with the active (brand, product) combination for this deployment.
3. **Install Lucide icons.**
   ```
   npm install lucide-angular
   ```
4. **Set the product theme on the root element.** In `src/index.html`:
   ```html
   <html lang="en" data-theme="gro">
   ```
   Change `gro` to the active product for this deployment. For multi-brand deployments, also set `data-brand`.
5. **Copy the adopter `CLAUDE.md` into your project root.** It configures Claude Code sessions to follow the system's rules.
6. **Read `specs/foundations.md` in the DS repo** to understand the four-tier architecture and the token catalog.

## Implementing a component

1. Find the spec: `<compsych-ds>/specs/<component-name>.spec.md`.
2. Generate the Angular component, styled with `var(--sys-*)` custom properties only.
3. Match the spec's API, states, and accessibility requirements exactly.

See `CLAUDE.md` in this folder for the full rules.

## Missing component?

If the component doesn't exist in `specs/`, don't invent one locally. Draft a spec using the DS template, submit it upstream to Konpo for review, and once approved implement from the finalized spec.
