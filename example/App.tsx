/**
 * Example App demonstrating react-native-universal-modal
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {
  ModalProvider,
  ModalRoot,
  UniversalModal,
  useModal,
  ThemeProvider,
  defaultTheme,
} from 'react-native-universal-modal';

// ============================================================================
// Example Modal Components
// ============================================================================

interface AlertModalProps {
  title: string;
  message: string;
  hide?: (result?: string) => void;
}

const AlertModal = ({ title, message, hide }: AlertModalProps) => (
  <View style={styles.modalContent}>
    <Text style={styles.modalTitle}>{title}</Text>
    <Text style={styles.modalMessage}>{message}</Text>
    <View style={styles.buttonRow}>
      <Button title="OK" onPress={() => hide?.('ok')} />
    </View>
  </View>
);

interface ConfirmModalProps {
  title: string;
  message: string;
  hide?: (result?: 'confirm' | 'cancel') => void;
}

const ConfirmModal = ({ title, message, hide }: ConfirmModalProps) => (
  <View style={styles.modalContent}>
    <Text style={styles.modalTitle}>{title}</Text>
    <Text style={styles.modalMessage}>{message}</Text>
    <View style={styles.buttonRow}>
      <Button title="Cancel" onPress={() => hide?.('cancel')} color="#999" />
      <View style={styles.buttonSpacer} />
      <Button title="Confirm" onPress={() => hide?.('confirm')} />
    </View>
  </View>
);

// ============================================================================
// Demo Components
// ============================================================================

function DeclarativeDemo() {
  const [visible, setVisible] = useState(false);
  const [animation, setAnimation] = useState<'fade' | 'slideUp' | 'scale'>('fade');

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Declarative API</Text>
      <Text style={styles.description}>
        Use the {'<UniversalModal>'} component for simple cases
      </Text>

      <View style={styles.buttonGroup}>
        <Button title="Fade" onPress={() => { setAnimation('fade'); setVisible(true); }} />
        <Button title="Slide Up" onPress={() => { setAnimation('slideUp'); setVisible(true); }} />
        <Button title="Scale" onPress={() => { setAnimation('scale'); setVisible(true); }} />
      </View>

      <UniversalModal
        visible={visible}
        onClose={() => setVisible(false)}
        animation={animation}
        closeOnBackdropPress
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Declarative Modal</Text>
          <Text style={styles.modalMessage}>
            Animation: {animation}
          </Text>
          <Button title="Close" onPress={() => setVisible(false)} />
        </View>
      </UniversalModal>
    </View>
  );
}

function ImperativeDemo() {
  const alert = useModal(AlertModal, { animation: 'scale' });
  const confirm = useModal(ConfirmModal, { animation: 'slideUp' });
  const [result, setResult] = useState<string>('');

  const showAlert = async () => {
    await alert.show({
      title: 'Hello!',
      message: 'This is an alert modal using the imperative API.',
    });
    setResult('Alert closed');
  };

  const showConfirm = async () => {
    const response = await confirm.show({
      title: 'Confirm Action',
      message: 'Are you sure you want to proceed?',
    });
    setResult(`Confirm result: ${response.data ?? 'dismissed'}`);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Imperative API</Text>
      <Text style={styles.description}>
        Use the useModal hook for promise-based modals
      </Text>

      <View style={styles.buttonGroup}>
        <Button title="Show Alert" onPress={showAlert} />
        <Button title="Show Confirm" onPress={showConfirm} />
      </View>

      {result ? <Text style={styles.result}>Result: {result}</Text> : null}
    </View>
  );
}

function NestedDemo() {
  const [level1, setLevel1] = useState(false);
  const [level2, setLevel2] = useState(false);
  const [level3, setLevel3] = useState(false);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Nested Modals</Text>
      <Text style={styles.description}>
        Open multiple modals stacked on top of each other
      </Text>

      <Button title="Open Level 1" onPress={() => setLevel1(true)} />

      <UniversalModal
        visible={level1}
        onClose={() => setLevel1(false)}
        animation="slideUp"
        backdropOpacity={0.3}
      >
        <View style={[styles.modalContent, { backgroundColor: '#e3f2fd' }]}>
          <Text style={styles.modalTitle}>Level 1</Text>
          <Button title="Open Level 2" onPress={() => setLevel2(true)} />
          <View style={styles.buttonSpacer} />
          <Button title="Close" onPress={() => setLevel1(false)} color="#999" />
        </View>
      </UniversalModal>

      <UniversalModal
        visible={level2}
        onClose={() => setLevel2(false)}
        animation="scale"
        backdropOpacity={0.4}
      >
        <View style={[styles.modalContent, { backgroundColor: '#fff3e0' }]}>
          <Text style={styles.modalTitle}>Level 2</Text>
          <Button title="Open Level 3" onPress={() => setLevel3(true)} />
          <View style={styles.buttonSpacer} />
          <Button title="Close" onPress={() => setLevel2(false)} color="#999" />
        </View>
      </UniversalModal>

      <UniversalModal
        visible={level3}
        onClose={() => setLevel3(false)}
        animation="fade"
        backdropOpacity={0.5}
      >
        <View style={[styles.modalContent, { backgroundColor: '#e8f5e9' }]}>
          <Text style={styles.modalTitle}>Level 3</Text>
          <Text style={styles.modalMessage}>This is the deepest modal!</Text>
          <Button title="Close All" onPress={() => {
            setLevel3(false);
            setLevel2(false);
            setLevel1(false);
          }} />
        </View>
      </UniversalModal>
    </View>
  );
}

// ============================================================================
// Main App
// ============================================================================

function MainContent() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>react-native-universal-modal</Text>
        <Text style={styles.subtitle}>Example App</Text>

        <DeclarativeDemo />
        <ImperativeDemo />
        <NestedDemo />
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <ModalProvider>
        <MainContent />
        <ModalRoot />
      </ModalProvider>
    </ThemeProvider>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  result: {
    marginTop: 12,
    fontSize: 14,
    color: '#007AFF',
    fontStyle: 'italic',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    minWidth: 280,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonSpacer: {
    width: 12,
    height: 12,
  },
});
