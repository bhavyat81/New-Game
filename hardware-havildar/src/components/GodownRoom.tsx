import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GodownItem, PendingOrder, Shelf } from '../store/useGameStore';
import { ITEMS, ItemType } from '../constants/items';

interface Props {
  godownItems: GodownItem[];
  pendingOrders: PendingOrder[];
  onCollect: (itemType: string) => void;
  onOrder: (itemType: ItemType) => void;
  isPlayerHere: boolean;
  shelves: Shelf[];
}

export default function GodownRoom({ godownItems, pendingOrders, onCollect, onOrder, isPlayerHere, shelves }: Props) {
  const lowStockShelves = shelves.filter(
    (s) =>
      s.unlocked &&
      s.stock < s.maxStock &&
      !pendingOrders.some((o) => o.itemType === s.itemType) &&
      !godownItems.some((g) => g.itemType === s.itemType)
  );

  return (
    <View style={[styles.container, isPlayerHere && styles.active]}>
      <View style={styles.header}>
        <Text style={styles.title}>📦 GODOWN</Text>
        {isPlayerHere && <Text style={styles.playerHere}>👣 You're here</Text>}
      </View>

      {/* Items available to collect */}
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

        {/* Pending deliveries */}
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

      {/* ORDER BOX — place restock orders for low-stock shelves */}
      {lowStockShelves.length > 0 && (
        <View style={styles.orderBox}>
          <Text style={styles.orderBoxTitle}>📫 ORDER BOX</Text>
          <View style={styles.orderRow}>
            {lowStockShelves.map((shelf) => {
              const item = ITEMS[shelf.itemType];
              return (
                <TouchableOpacity
                  key={shelf.id}
                  style={styles.orderBtn}
                  onPress={() => onOrder(shelf.itemType)}
                >
                  <Text style={styles.orderBtnEmoji}>{item.emoji}</Text>
                  <Text style={styles.orderBtnText}>Order</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {isPlayerHere && godownItems.length > 0 && (
        <Text style={styles.collectHint}>Tap items or walk over to collect!</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333',
  },
  playerHere: {
    fontSize: 9,
    color: '#4CAF50',
    fontWeight: 'bold',
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
  orderBox: {
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#9FA8DA',
    paddingTop: 6,
  },
  orderBoxTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#5C6BC0',
    marginBottom: 4,
  },
  orderRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  orderBtn: {
    backgroundColor: '#5C6BC0',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  orderBtnEmoji: {
    fontSize: 12,
  },
  orderBtnText: {
    fontSize: 9,
    color: '#FFF',
    fontWeight: 'bold',
  },
  collectHint: {
    fontSize: 9,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: 4,
  },
});
