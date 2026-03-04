# react-native-universal-modal

A fully customizable, accessible, cross-platform modal system for React Native (iOS, Android, Web).

[![npm version](https://badge.fury.io/js/react-native-universal-modal.svg)](https://badge.fury.io/js/react-native-universal-modal)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **Cross-Platform**: Works seamlessly on iOS, Android, and Web (via react-native-web)
- **Nested Modal Stacking**: Multiple modals with proper z-index management
- **Shared Transitions**: Smooth animations between modals
- **Accessibility First**: Focus trapping, screen reader announcements, keyboard navigation
- **Dual API**: Both declarative (`<UniversalModal>`) and imperative (`useModal`) APIs
- **TypeScript First**: Fully typed with excellent IntelliSense support
- **Tree-Shakeable**: Import only what you need
- **Themeable**: Built-in theming with dark mode support
- **Performant**: Optimized re-renders with split contexts
- **Expo Compatible**: Works with both Expo and bare React Native

## Installation

```bash
npm install react-native-universal-modal
# or
yarn add react-native-universal-modal
```

### Optional: react-native-reanimated

For smoother animations, install react-native-reanimated:

```bash
npm install react-native-reanimated
```

The library automatically uses Reanimated when available, falling back to React Native's Animated API.

## Quick Start

### 1. Wrap your app with ModalProvider

```tsx
import { ModalProvider, ModalRoot } from 'react-native-universal-modal';

function App() {
  return (
    <ModalProvider>
      <YourApp />
      <ModalRoot />
    </ModalProvider>
  );
}
```

### 2. Use the Declarative API

```tsx
import { UniversalModal } from 'react-native-universal-modal';
import { useState } from 'react';
import { View, Text, Button } from 'react-native';

function MyComponent() {
  const [visible, setVisible] = useState(false);

  return (
    <View>
      <Button title="Open Modal" onPress={() => setVisible(true)} />

      <UniversalModal
        visible={visible}
        onClose={() => setVisible(false)}
        animation="slideUp"
        closeOnBackdropPress
      >
        <View style={{ padding: 20 }}>
          <Text>Hello from Modal!</Text>
          <Button title="Close" onPress={() => setVisible(false)} />
        </View>
      </UniversalModal>
    </View>
  );
}
```

### 3. Or Use the Imperative API

```tsx
import { useModal } from 'react-native-universal-modal';
import { View, Text, Button } from 'react-native';

// Define your modal component
const ConfirmModal = ({ title, message, hide }) => (
  <View style={{ padding: 20 }}>
    <Text style={{ fontWeight: 'bold' }}>{title}</Text>
    <Text>{message}</Text>
    <Button title="Confirm" onPress={() => hide('confirmed')} />
    <Button title="Cancel" onPress={() => hide()} />
  </View>
);

function MyComponent() {
  const { show } = useModal(ConfirmModal);

  const handleDelete = async () => {
    const result = await show({
      title: 'Delete Item?',
      message: 'This action cannot be undone.',
    });

    if (result.data === 'confirmed') {
      // User confirmed
      console.log('Deleting...');
    }
  };

  return <Button title="Delete" onPress={handleDelete} />;
}
```

## API Reference

### Components

#### `<ModalProvider>`

Root provider that enables the modal system.

```tsx
<ModalProvider config={globalConfig}>
  {children}
</ModalProvider>
```

| Prop | Type | Description |
|------|------|-------------|
| `config` | `ModalConfig` | Global configuration for all modals |
| `baseZIndex` | `number` | Base z-index for modals (default: 1000) |

#### `<ModalRoot>`

Render target for all modals. Place at the root level.

```tsx
<ModalRoot />
```

#### `<UniversalModal>`

Declarative modal component.

```tsx
<UniversalModal
  visible={boolean}
  onClose={() => void}
  animation="fade" | "slideUp" | "slideDown" | "scale" | ...
  closeOnBackdropPress={boolean}
  closeOnEscape={boolean}
  backdropOpacity={number}
  accessibilityLabel={string}
>
  {children}
</UniversalModal>
```

### Hooks

#### `useModal<TProps, TResult>(Component, config?)`

Imperative hook for showing modals.

```tsx
const { show, hide, isVisible, modalId } = useModal(MyModal, {
  animation: 'slideUp',
});

// Show modal and wait for result
const result = await show({ title: 'Hello' });
if (result.data === 'confirmed') {
  // Handle confirmation
}
```

#### `useModalStackContext()`

Access stack information within a modal.

```tsx
const { modalId, zIndex, isTopModal, stackPosition } = useModalStackContext();
```

#### `useIsTopModal(modalId)`

Check if a specific modal is the topmost.

```tsx
const isTop = useIsTopModal('my-modal-id');
```

### Animation Presets

Built-in animation presets:

- `none` - No animation
- `fade` - Fade in/out
- `slideUp` - Slide from bottom
- `slideDown` - Slide from top
- `slideLeft` - Slide from right
- `slideRight` - Slide from left
- `scale` - Scale up/down
- `bounce` - Bouncy entrance
- `spring` - Spring physics

#### Custom Animations

```tsx
import { registerPreset, createPreset } from 'react-native-universal-modal';

// Register a custom animation
registerPreset('myAnimation', createPreset({
  enter: { opacity: 0, scale: 0.5, translateY: 100 },
  exit: { opacity: 1, scale: 1, translateY: 0 },
  config: { duration: 400, easing: 'easeOutBack' },
}));

// Use it
<UniversalModal animation="myAnimation">...</UniversalModal>
```

### Theming

```tsx
import { ThemeProvider, defaultTheme, darkTheme } from 'react-native-universal-modal';

// Use built-in themes
<ThemeProvider theme={defaultTheme} darkMode={isDark} darkTheme={darkTheme}>
  <ModalProvider>
    <App />
  </ModalProvider>
</ThemeProvider>

// Or create custom theme
const myTheme = {
  backdrop: { color: '#000', opacity: 0.7 },
  content: { backgroundColor: '#fff', borderRadius: 16 },
  animation: { preset: 'scale', duration: 250 },
};
```

## Accessibility

This library follows accessibility best practices:

### Web
- **Focus Trapping**: Tab navigation stays within the modal
- **ARIA Attributes**: Proper `role="dialog"`, `aria-modal`, `aria-labelledby`
- **Escape Key**: Press Escape to close the modal
- **Focus Restoration**: Returns focus to trigger element on close

### Native (iOS/Android)
- **VoiceOver/TalkBack**: `accessibilityViewIsModal` for iOS
- **Screen Reader Announcements**: Automatic announcements on open/close
- **Back Button**: Android hardware back button support

### Customization

```tsx
<UniversalModal
  accessibilityLabel="Settings dialog"
  openAnnouncement="Settings dialog opened"
  closeAnnouncement="Settings dialog closed"
  trapFocus={true}
  restoreFocus={true}
  closeOnEscape={true}
  closeOnBackButton={true}
>
  ...
</UniversalModal>
```

## Nested Modals

The library fully supports nested modals:

```tsx
function FirstModal({ hide }) {
  const { show: showSecond } = useModal(SecondModal);

  return (
    <View>
      <Text>First Modal</Text>
      <Button title="Open Second" onPress={() => showSecond()} />
      <Button title="Close" onPress={() => hide()} />
    </View>
  );
}

function SecondModal({ hide, isTopModal }) {
  return (
    <View>
      <Text>Second Modal (on top: {isTopModal ? 'yes' : 'no'})</Text>
      <Button title="Close" onPress={() => hide()} />
    </View>
  );
}
```

## Shared Transitions

Animate smoothly between modals:

```tsx
import { SharedTransitionProvider, useSharedTransition } from 'react-native-universal-modal';

function Modal1({ modalId }) {
  const { transitionTo } = useSharedTransition({ modalId });

  return (
    <Button
      title="Go to Modal 2"
      onPress={() => transitionTo('modal-2', { type: 'crossfade' })}
    />
  );
}
```

## Comparison with Other Libraries

| Feature | This Library | react-native-modal | react-native-modalize |
|---------|-------------|--------------------|-----------------------|
| Web Support | Yes | No | No |
| Nested Modals | Yes | Limited | No |
| Focus Trapping | Yes | No | No |
| ARIA Support | Yes | No | No |
| Imperative API | Yes | Limited | Yes |
| Shared Transitions | Yes | No | No |
| TypeScript | Yes | Yes | Yes |
| Tree-shakeable | Yes | No | No |
| Theming | Yes | Limited | Yes |
| Reanimated Support | Yes | Yes | Yes |

## Contributing

Contributions are welcome! Please read our contributing guide for details.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Support the Project

If you find this library helpful, consider supporting its development:

[![Donate](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://paypal.me/jobmyt86)

Your donations help maintain and improve this library!

## Issues & Support

Found a bug or have a feature request?

- **GitHub Issues**: [https://github.com/fr3em1nd/react-native-universal-modal/issues](https://github.com/fr3em1nd/react-native-universal-modal/issues)
- **Email**: [info@jobmyt.com](mailto:info@jobmyt.com)

## Author

**Solomon Monotilla**

- GitHub: [@fr3em1nd](https://github.com/fr3em1nd)

## License

MIT

---

Made with care for the React Native community
