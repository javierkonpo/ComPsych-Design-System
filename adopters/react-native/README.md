# ComPsych DS — React Native adopter guide

How to adopt the ComPsych Design System in a new React Native project.

## Prerequisites

- React Native 0.72+ (or Expo SDK 49+).
- TypeScript.
- The ComPsych DS token package (generated TypeScript output).
- Access to the DS repo for reading component specs.

## Steps

1. **Install the token package.** Publishing approach depends on ComPsych's setup — private npm, git submodule, or sync script. Ask the DS team.
2. **Install Lucide icons.**
   ```
   npm install lucide-react-native
   ```
   React Native additionally requires `react-native-svg`. Install it and follow its setup instructions for iOS and Android.
3. **Set up the DS provider.** At the root of your app:
   ```tsx
   import { DsProvider } from '@compsych/ds';

   export default function App() {
     return (
       <DsProvider brand="compsych" product="gro">
         <RootNavigator />
       </DsProvider>
     );
   }
   ```
   Change `brand` and `product` to the active combination for this deployment.
4. **Copy the adopter `CLAUDE.md` into your project root.** It configures Claude Code sessions to follow the system's rules.
5. **Read `specs/foundations.md` in the DS repo** to understand the four-tier architecture and the token catalog.

## Implementing a component

1. Find the spec: `<compsych-ds>/specs/<component-name>.spec.md`.
2. Generate the React Native component, using `useSys()` to read tokens and `StyleSheet.create()` for styles.
3. Use React Native-native prop names (`onPress`, `label`, etc.) per the spec's API contract.
4. Match the spec's states, behavior, and accessibility requirements — paying special attention to the React Native subsection of Accessibility.

See `CLAUDE.md` in this folder for the full rules.

## Missing component?

If the component doesn't exist in `specs/`, don't invent one locally. Draft a spec using the DS template, submit it upstream to Konpo for review, and once approved implement from the finalized spec.
