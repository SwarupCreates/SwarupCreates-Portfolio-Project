# Design & Motion Audit: Apple HIG Alignment

This audit evaluates the portfolio against Apple's Human Interface Guidelines (HIG).

## 1. Typography & Hierarchy
*   **Issue**: Conflicts between `index.css` system fonts and `variables.css` (Inter/Outfit). The app currently defines multiple font-family variables that compete for priority.
*   **Recommendation**: Standardize on a single, clean font stack (e.g., Apple's San Francisco, or Inter as a close equivalent) across the entire project. Remove redundant definitions in `index.css`.
*   **HIG Principle**: "Clarity" — Typography should be consistent and readable across all views.

## 2. Color Palette & Theming
*   **Issue**: The color scheme is fractured (multiple accents: `#005AC2` vs `#aa3bff`).
*   **Recommendation**: Define a singular, semantic brand color palette. Ensure contrast ratios meet accessibility standards for both Light and Dark modes.
*   **HIG Principle**: "Deference" — Colors should be functional and support content, not compete with it.

## 3. Layout & Structure
*   **Issue**: The `70.375rem` fixed max-width and vertical borders create an artificial "boxed" feel that ignores modern fluid layout expectations.
*   **Recommendation**: Shift to a responsive, container-based approach that adapts more naturally to different device sizes rather than enforcing a rigid column width.
*   **HIG Principle**: "Content-First" — The UI should adapt to content and display size, not constrain content into a strict, predefined mold.

## 4. Interaction & Input
*   **Issue**: The Custom Cursor (`cursor: none`) can be detrimental to accessibility and expected browser behaviors.
*   **Recommendation**: Remove the forced custom cursor unless it offers a clear functional benefit that standard system cursors do not. Focus on improving hover/interactive feedback using standard CSS pseudo-classes.
*   **HIG Principle**: "Accessibility" — Always respect user input defaults unless there is a strong, UX-backed reason to modify them.

## 5. Motion (Framer Motion)
*   **Issue**: Some animations feel decorative rather than functional.
*   **Recommendation**: Ensure all animations have a clear purpose (e.g., providing context, showing transitions, indicating progress). Respect `prefers-reduced-motion` settings (currently handled but verify implementation across all components).
*   **HIG Principle**: "Motion" — Motion should be meaningful, subtle, and supportive. Avoid decorative animations that add friction or cause distraction.

---
### Next Steps
1.  **Refactor**: Consolidate `index.css` and `variables.css` to fix the typography and color conflicts.
2.  **Simplify**: Remove the custom cursor force-override.
3.  **Audit**: Review all Framer Motion components against the "Meaningful Motion" rule: "Does this animation help the user understand the state of the app?"
