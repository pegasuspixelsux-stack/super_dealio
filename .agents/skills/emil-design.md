# Emil Kowalski Design & Motion Rules

Core philosophy: taste is trained, unseen details compound, beauty is leverage.

## Micro-interactions
- Every interactive element feels tactile: buttons and cards scale down on press (`active:scale-[0.98]`, or `scale(0.97)` for small buttons).
- Popovers and dropdowns scale from their trigger origin (set `transform-origin` accordingly).
- Every state change (loading, success, error) is instantaneous and intentional.

## Motion
- Use natural spring physics (Framer Motion springs) or `cubic-bezier(0.16, 1, 0.3, 1)`. Never sluggish `ease-in`.
- Keep durations short (150-300ms for UI feedback).
- Zero-lag command palettes: never animate keyboard-initiated actions (command menus, shortcuts, typing).
- Respect `prefers-reduced-motion`.

## Surfaces
- No solid black borders. Use ultra-subtle semi-transparent borders (e.g. `border-slate-800/80`).
- Pair borders with soft, multi-layered shadows.
