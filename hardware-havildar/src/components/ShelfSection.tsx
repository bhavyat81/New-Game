import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Shelf } from '../store/useGameStore';
import { ITEMS } from '../constants/items';

interface Props {
  shelf: Shelf;
  onTap: (shelfId: string) => void;
  canRestock: boolean;
}

export default function ShelfSection({ shelf, onTap, canRestock }: Props) {
  const item = ITEMS[shelf.itemType];

  if (!shelf.unlocked) {
    return (
      <View style={styles.lockedContainer}>
        <Text style={styles.lockIcon}>🔒</Text>
        <Text style={styles.lockedText}>Locked</Text>
        <Text style={styles.unlockCost}>🪙 {shelf.unlockCost}</Text>
        <View style={styles.progressBg}>
          <View
            style={[styles.progressFill, { width: `${shelf.unlockProgress}%` as `${number}%` }]}
          />
        </View>
      </View>
    );
  }

  const stockColor =
    shelf.stock === 0 ? '#F44336' : shelf.stock <= 1 ? '#FFC107' : '#4CAF50';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onTap(shelf.id)}
      disabled={!canRestock}
    >
      <Text style={styles.emoji}>{item.emoji}</Text>
      <Text style={styles.itemName}>{item.name}</Text>
      <View style={styles.stockRow}>
        {Array.from({ length: shelf.maxStock }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.stockDot,
              { backgroundColor: i < shelf.stock ? stockColor : '#E0E0E0' },
            ]}
          />
        ))}
      </View>
      {shelf.stock === 0 && (
        <Text style={styles.outOfStock}>OUT OF STOCK</Text>
      )}
      {canRestock && shelf.stock < shelf.maxStock && (
        <View style={styles.restockBadge}>
          <Text style={styles.restockText}>TAP TO RESTOCK</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF8E7',
    borderRadius: 8,
    padding: 6,
    borderWidth: 2,
    borderColor: '#D4A017',
    alignItems: 'center',
    minWidth: 90,
  },
  lockedContainer: {
    backgroundColor: '#BDBDBD',
    borderRadius: 8,
    padding: 6,
    borderWidth: 2,
    borderColor: '#9E9E9E',
    alignItems: 'center',
    minWidth: 90,
  },
  lockIcon: {
    fontSize: 24,
  },
  lockedText: {
    fontSize: 10,
    color: '#555',
    fontWeight: 'bold',
  },
  unlockCost: {
    fontSize: 10,
    color: '#333',
    marginTop: 2,
  },
  progressBg: {
    width: 60,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginTop: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    backgroundColor: '#FF8C00',
    borderRadius: 2,
  },
  emoji: {
    fontSize: 22,
  },
  itemName: {
    fontSize: 9,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  stockRow: {
    flexDirection: 'row',
    gap: 3,
    marginTop: 4,
  },
  stockDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  outOfStock: {
    fontSize: 7,
    color: '#F44336',
    fontWeight: 'bold',
    marginTop: 2,
  },
  restockBadge: {
    backgroundColor: '#FF8C00',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginTop: 3,
  },
  restockText: {
    fontSize: 7,
    color: '#FFF',
    fontWeight: 'bold',
  },
});
