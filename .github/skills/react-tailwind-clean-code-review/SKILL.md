---
name: react-tailwind-clean-code-review
description: 'Review React, ReactJS, TSX, JSX, and Tailwind CSS code for bugs, regressions, accessibility, maintainability, clean code, naming, hooks usage, state flow, styling quality, and coding conventions. Use for PR review, component review, refactor review, frontend review, and best-practice checks.'
argument-hint: 'React/Tailwind files, component, PR, or review scope'
user-invocable: true
disable-model-invocation: false
---

# React Tailwind Clean Code Review

## What This Skill Does
This skill performs a structured review of React and Tailwind code with emphasis on:
- correctness and behavioral regressions
- React hooks and state management best practices
- Tailwind class quality, maintainability, and responsive behavior
- simple clean code and naming clarity
- accessibility, semantics, and UI consistency
- findings-first review output with actionable fixes

## When to Use
Use this skill when reviewing:
- React or ReactJS components
- TSX or JSX files
- Tailwind-heavy UI code
- frontend pull requests
- refactors of components, hooks, or routing
- code that feels messy, over-complicated, duplicated, or inconsistent

Use this skill especially when the goal is not just style feedback, but to catch real defects and improve code quality with simple, maintainable patterns.

## Review Standard
Prioritize issues in this order:
1. Bugs, incorrect behavior, and regressions
2. Accessibility and semantic HTML issues
3. Hook misuse, state flow problems, and effect mistakes
4. Tailwind maintainability and responsive design issues
5. Clean code, readability, naming, and unnecessary complexity
6. Minor consistency improvements

If no meaningful findings are present, explicitly say so and mention any remaining testing gaps or residual risk.

## Procedure

### 1. Define the Review Target
Identify the exact scope first:
- single component
- multiple files in a feature
- full PR or changed files
- React behavior only
- Tailwind/UI quality only
- full frontend review

If the scope is broad, start from the changed files or the component directly responsible for the behavior.

### 2. Read the Code Like a Reviewer
Build a quick local model of:
- what the component renders
- where the data comes from
- what state exists locally
- what side effects happen
- what props and callbacks flow in or out
- which parts are styling-only vs behavior-controlling

Avoid broad exploration unless required by the review target.

### 3. Check React Correctness
Review for:
- invalid or fragile hook usage
- incorrect `useEffect` dependencies
- effects that should be derived values instead
- stale closures and event handler capture bugs
- duplicated or conflicting state
- state that can be computed instead of stored
- unnecessary rerenders or unstable props passed deep into children
- unsafe async effects, race conditions, and missing cleanup
- key usage in lists
- uncontrolled vs controlled form mistakes
- routing/state sync issues

Ask:
- Is this effect truly a side effect?
- Should this be a normal variable instead of state?
- Is `useMemo` or `useEffect` being used for the wrong job?
- Is data fetched, derived, and displayed in the simplest safe way?

### 4. Check Tailwind Quality
Review for:
- conflicting utility classes
- duplicated utility groups repeated across files
- poor spacing or inconsistent sizing systems
- missing responsive variants where layout clearly needs them
- overlong class strings hiding component intent
- class combinations that make maintenance harder
- missing hover/focus/active/disabled states when applicable
- visual structure that should be extracted into a reusable component
- styling that fights semantic HTML structure

Ask:
- Are the classes readable enough to maintain?
- Is the layout responsive by design, not by accident?
- Are reusable patterns repeated instead of extracted?
- Are colors, spacing, and typography consistent with nearby code?

### 5. Check Clean Code
Review for:
- confusing naming
- oversized components doing too many things
- deeply nested JSX that should be extracted
- magic strings and magic numbers
- duplicated logic or duplicated markup
- weak prop/type modeling
- dead code and commented-out code
- hard-to-follow conditional rendering
- helpers placed inside components without good reason
- abstractions that are more complex than the problem

Prefer simple code over clever code.

### 6. Check Accessibility and Semantics
Review for:
- buttons used where links are needed, or vice versa
- missing labels, alt text, or accessible names
- click handlers on non-interactive elements
- missing keyboard affordances
- weak heading structure
- low-contrast or state-only color communication when relevant
- screen-reader-hostile UI patterns

### 7. Decide Whether to Suggest Refactoring
Only suggest refactoring when it improves one of:
- correctness
- clarity
- maintainability
- reuse
- accessibility

Do not suggest churn for style alone.

### 8. Write the Review Output
Present findings first, ordered by severity.
For each finding, include:
- what is wrong
- why it matters
- where it is
- the simplest direction for fixing it

Then optionally include:
- open questions or assumptions
- a short summary of strengths or remaining risks

## Output Format
Use this structure when reporting a review:

1. Findings
- Each finding should be concrete and standalone
- Reference the affected file
- Focus on bugs and risks before style

2. Open Questions
- Mention uncertainties only if they affect the review conclusion

3. Residual Risk
- Note missing tests, unverified states, or responsive/accessibility gaps

If there are no findings, say:
- No material findings found.
- Then mention any testing gaps or areas not validated.

## Decision Rules

### Prefer Derived Values Over Effects
If a value can be computed from props/state during render, prefer a normal variable or `useMemo` instead of `useEffect` + `useState`.

### Prefer Effects Only for Real Side Effects
Use `useEffect` only for:
- data fetching
- subscriptions
- timers
- DOM integration
- external system synchronization

### Prefer Extraction Only When It Clarifies
Extract components or helpers when it reduces duplication or cognitive load. Do not split simple code into many small files without real benefit.

### Prefer Stable, Clear Naming
Names should communicate role clearly:
- `ProductListPage` over `Catalog` when the screen is a listing page
- `selectedCategory` over vague names like `item` or `data`
- `itemViewMode` over ambiguous `mode`

## Completion Checks
Before finishing a review, confirm:
- the main behavior was understood
- the findings are ordered by severity
- style comments did not overshadow correctness issues
- Tailwind comments are tied to maintainability or UI behavior
- React comments distinguish derived values from true side effects
- suggestions keep the code simple instead of making it more abstract

## Example Prompts
- `/react-tailwind-clean-code-review review this component for React and Tailwind issues`
- `/react-tailwind-clean-code-review review changed frontend files with clean-code focus`
- `/react-tailwind-clean-code-review check this TSX page for hook misuse and Tailwind problems`
- `/react-tailwind-clean-code-review review this PR for accessibility and maintainability`
