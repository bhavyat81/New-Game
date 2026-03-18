import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  isPlayerHere: boolean;
  waitingCount: number;
}

export default function BillingCounter({ isPlayerHere, waitingCount }: Props) {
  return (
    <View style={[styles.container, isPlayerHere && styles.active]}>
      <Text style={styles.icon}>💰</Text>
      <Text style={styles.label}>BILLING COUNTER</Text>
      {waitingCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{waitingCount}</Text>
        </View>
      )}
      {isPlayerHere && (
        <Text style={styles.activeLabel}>✓ Billing Active</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    padding: 8,
    borderWidth: 2,
    borderColor: '#FFC107',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  active: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  icon: {
    fontSize: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  badge: {
    backgroundColor: '#F44336',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  activeLabel: {
    fontSize: 9,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});
