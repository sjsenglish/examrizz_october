# Styles Architecture Documentation

## Overview
This directory contains the organized CSS architecture for the ExamRizz application, following a modular and maintainable structure.

## Directory Structure

```
styles/
├── globals.css          # Global styles, resets, and utilities
├── variables.css        # CSS custom properties (design tokens)
├── components/          # Component-specific styles
│   └── Button.css
└── pages/              # Page-specific overrides
    └── exam-search.css
```

## File Descriptions

### `variables.css`
Contains all design tokens as CSS custom properties:
- **Colors**: Primary, secondary, neutral palettes
- **Typography**: Font families, sizes
- **Spacing**: Consistent spacing scale
- **Borders**: Border styles and radius values
- **Shadows**: 3D-style shadow effects
- **Z-index**: Layering scale
- **Transitions**: Animation timings

### `globals.css`
Global styles and resets:
- CSS reset for consistent cross-browser styling
- Root element defaults
- Typography defaults
- Utility classes (.flex, .hidden, .container, etc.)
- Scrollbar hiding utilities

### `components/`
Component-specific styles following the component structure:
- One CSS file per component
- Scoped to component classes
- Uses CSS variables from `variables.css`

### `pages/`
Page-specific overrides and fixes:
- Background color corrections
- Layout adjustments
- Page-specific responsive styles

## Usage

### In Components
```tsx
import '../../styles/globals.css';
import './ComponentName.css';
```

### CSS Variables
Use the predefined variables for consistency:
```css
.my-element {
  color: var(--color-primary);
  padding: var(--space-lg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}
```

### Utility Classes
Available utility classes from `globals.css`:
- `.container` - Centered container with max-width
- `.flex`, `.flex-center`, `.flex-between` - Flexbox utilities
- `.text-center`, `.text-left`, `.text-right` - Text alignment
- `.hidden`, `.visible` - Visibility control
- `.scrollbar-hide` - Hide scrollbars
- `.z-dropdown`, `.z-modal`, `.z-overlay` - Z-index utilities

## Best Practices

1. **Use CSS Variables**: Always use variables from `variables.css` for consistency
2. **Component Scoping**: Keep styles scoped to component classes
3. **Avoid Inline Styles**: Extract repeated inline styles to CSS classes
4. **Mobile-First**: Write mobile styles first, then add desktop overrides
5. **BEM Naming**: Use BEM methodology for class naming when applicable

## Color Palette

Primary Colors:
- `--color-primary`: #00CED1 (Turquoise)
- `--color-primary-light`: #B3F0F2
- `--color-primary-lighter`: #89F3FF

Secondary Colors:
- `--color-secondary`: #D4D0FF
- `--color-secondary-light`: #E4E0F7

Neutral Colors:
- `--color-white`: #FFFFFF
- `--color-background`: #F8F8F5
- `--color-black`: #000000

## Typography Scale

- `--text-xs`: 12px
- `--text-sm`: 14px
- `--text-base`: 16px
- `--text-lg`: 18px
- `--text-xl`: 20px
- `--text-2xl`: 22px
- `--text-3xl`: 28px
- `--text-4xl`: 32px
- `--text-5xl`: 60px
- `--text-6xl`: 105px

## Spacing Scale

- `--space-xs`: 4px
- `--space-sm`: 8px
- `--space-md`: 12px
- `--space-lg`: 20px
- `--space-xl`: 30px
- `--space-2xl`: 40px
- `--space-3xl`: 60px