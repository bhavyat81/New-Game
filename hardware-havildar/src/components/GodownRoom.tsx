import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GodownItem, PendingOrder } from '../store/useGameStore';
import { ITEMS } from '../constants/items';

interface Props {
  godownItems: GodownItem[];
  pendingOrders: PendingOrder[];
  onCollect: (itemType: string) => void;
  isPlayerHere: boolean;
}

export default function GodownRoom({ godownItems, pendingOrders, onCollect, isPlayerHere }: Props) {
  return (
    <View style={[styles.container, isPlayerHere && styles.active]}>
      <Text style={styles.title}>📦 GODOWN</Text>
      <View style={styles.itemsRow}>
        {godownItems.map((item) => {
          const config = ITEMS[item.itemType];
          return (
            <TouchableOpacity
              key={item.itemType}
              style={styles.itemChip}
              onPress={() => onCollect(item.itemType)}
            >
              <Text style={styles.itemEmoji}>{config.emoji}</Text>
              <Text style={styles.itemQty}>x{item.quantity}</Text>
            </TouchableOpacity>
          );
        })}
        {pendingOrders.map((order) => {
          const config = ITEMS[order.itemType];
          const elapsed = (Date.now() - order.orderedAt) / 1000;
          const remaining = Math.max(0, Math.ceil(order.eta - elapsed));
          return (
            <View key={order.itemType} style={styles.pendingChip}>
              <Text style={styles.itemEmoji}>{config.emoji}</Text>
              <Text style={styles.pendingTime}>{remaining}s</Text>
            </View>
          );
        })}
        {godownItems.length === 0 && pendingOrders.length === 0 && (
          <Text style={styles.emptyText}>Empty</Text>
        )}
      </View>
      {isPlayerHere && godownItems.length > 0 && (
        <Text style={styles.collectHint}>Walk over items to collect!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E8EAF6',
    borderRadius: 8,
    padding: 8,
    borderWidth: 2,
    borderColor: '#7986CB',
  },
  active: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  title: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  itemsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  itemChip: {
    backgroundColor: '#C5CAE9',
    borderRadius: 4,
    padding: 4,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 2,
  },
  pendingChip: {
    backgroundColor: '#FFECB3',
    borderRadius: 4,
    padding: 4,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 2,
  },
  itemEmoji: {
    fontSize: 16,
  },
  itemQty: {
    fontSize: 10,
    color: '#333',
    fontWeight: 'bold',
  },
  pendingTime: {
    fontSize: 9,
    color: '#FF8C00',
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 10,
    color: '#999',
    fontStyle: 'italic',
  },
  collectHint: {
    fontSize: 9,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: 4,
  },
});
