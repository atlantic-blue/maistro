# How to Use the Maistro Design System

This guide explains how to use the shared design system in your Maistro Boost product verticals.

## Setup

The design system is implemented in the `@maistro/ui` package within the monorepo. It provides:

1. Color system
2. Typography
3. Spacing
4. UI components
5. Tailwind configuration

## Using in Product Verticals

### 1. Install the UI Package

In your product's package.json:

```json
{
  "dependencies": {
    "@maistro/ui": "workspace:*"
  }
}
```

Run:
```bash
pnpm install
```

### 2. Configure Tailwind

Create or update your tailwind.config.js file to extend the base configuration:

```js
// products/maistro-funnels/frontend/tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Ensure you're including the UI components in content
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "../../../packages/frontend/ui/src/**/*.{js,jsx,ts,tsx}"
  ],
  // Extend the base configuration
  presets: [require('../../../packages/frontend/ui/tailwind.config.js')],
  // You can add product-specific customizations here
  theme: {
    extend: {}
  }
}
```

### 3. Import Global Styles

In your main CSS file:

```css
/* Import the base styles from UI package */
@import '@maistro/ui/src/styles/globals.css';

/* Your product-specific styles */
```

Or in your entry file:

```tsx
// Import styles from the UI package
import '@maistro/ui/src/styles/globals.css';

// Your product-specific styles
import './styles.css';
```

### 4. Using Components

Import and use components from the UI package:

```tsx
import { Button, Card, CardBody } from '@maistro/ui';

function MyComponent() {
  return (
    <Card>
      <CardBody>
        <h2 className="text-primary text-xl font-semibold">Hello Maistro</h2>
        <p className="text-gray-500">This uses our design system</p>
        <Button variant="accent">Click me</Button>
      </CardBody>
    </Card>
  );
}
```

## Using Color System in Tailwind Classes

The design system exposes the following color classes:

### Primary Colors
- `text-primary` - Black text
- `bg-primary` - Black background
- `text-primary-white` - White text
- `bg-primary-white` - White background

### Accent Colors
- `text-accent-pink` - Pink text
- `bg-accent-pink` - Pink background
- `text-accent-orange` - Orange text
- `bg-accent-orange` - Orange background

#### With Variants
- `bg-accent-pink-light` - Lighter pink
- `bg-accent-pink-dark` - Darker pink
- `bg-accent-orange-light` - Lighter orange
- `bg-accent-orange-dark` - Darker orange

### UI Colors
- Gray scale: `text-gray-50` through `text-gray-900`
- Status colors: `bg-status-success`, `bg-status-error`, etc.

## Examples

### Button Variants

```tsx
<div className="space-y-4">
  <Button variant="primary">Primary Button</Button>
  <Button variant="secondary">Secondary Button</Button>
  <Button variant="accent">Accent Button</Button>
  <Button variant="outline">Outline Button</Button>
  <Button variant="ghost">Ghost Button</Button>
</div>
```

### Text Styling

```tsx
<div className="space-y-4">
  <h1 className="text-primary text-3xl font-bold">Heading 1</h1>
  <h2 className="text-primary text-2xl font-semibold">Heading 2</h2>
  <h3 className="text-primary text-xl font-semibold">Heading 3</h3>
  <p className="text-gray-800">Regular paragraph text</p>
  <p className="text-gray-500 text-sm">Small text</p>
  <p className="text-accent-pink font-medium">Accent text</p>
</div>
```

### Card Example

```tsx
<Card className="max-w-md">
  <CardBody>
    <div className="space-y-4">
      <h3 className="text-primary text-lg font-semibold">Card Title</h3>
      <p className="text-gray-600">Card content goes here.</p>
      <div className="pt-2">
        <Button variant="accent" isFullWidth>Action Button</Button>
      </div>
    </div>
  </CardBody>
</Card>
```

## Best Practices

1. **Consistency**: Always use the design system colors instead of custom hex values
2. **Typography**: Follow the typography scale for all text elements
3. **Components**: Use the shared components instead of rebuilding them
4. **Documentation**: Document any product-specific extensions to the design system
5. **Responsive Design**: Use the spacing system to maintain consistent layout across devices

## Extending the System

If you need to add product-specific styles:

1. Discuss with the design team first to see if it should be part of the core system
2. Document your additions thoroughly
3. Consider contributing back to the core UI package if the additions are generally useful

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [pnpm Workspaces Guide](https://pnpm.io/workspaces)