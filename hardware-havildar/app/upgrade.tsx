import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useGameStore } from '../src/store/useGameStore';
import { UPGRADES } from '../src/constants/upgrades';
import { ITEMS } from '../src/constants/items';

export default function UpgradeScreen() {
  const {
    coins,
    gems,
    shelves,
    hasRamu,
    hasChotu,
    hasRestockBoost,
    unlockShelf,
    hireHelper,
    placeRestockOrder,
  } = useGameStore();

  const handleUpgrade = (upgradeId: string) => {
    const upgrade = UPGRADES.find((u) => u.id === upgradeId);
    if (!upgrade) return;

    if (upgrade.type === 'shelf') {
      const shelfMapping: Record<string, string> = {
        shelf_pipes: 'shelf_pipes',
        shelf_paint: 'shelf_paint',
        shelf_nuts: 'shelf_nuts',
        shelf_cement: 'shelf_cement',
      };
      const realShelfId = shelfMapping[upgradeId] ?? upgradeId;
      unlockShelf(realShelfId);
    } else if (upgrade.type === 'helper' || upgrade.type === 'boost') {
      const success = hireHelper(upgradeId);
      if (!success) {
        Alert.alert('Not enough!', `You need ${upgrade.cost} ${upgrade.costType}`);
      }
    }
  };

  const isUnlocked = (upgradeId: string): boolean => {
    if (upgradeId.startsWith('shelf_')) {
      const shelfMapping: Record<string, string> = {
        shelf_pipes: 'shelf_pipes',
        shelf_paint: 'shelf_paint',
        shelf_nuts: 'shelf_nuts',
        shelf_cement: 'shelf_cement',
      };
      const shelfId = shelfMapping[upgradeId] ?? upgradeId;
      const shelf = shelves.find((s) => s.id === shelfId);
      return shelf?.unlocked ?? false;
    }
    if (upgradeId === 'helper_ramu') return hasRamu;
    if (upgradeId === 'helper_chotu') return hasChotu;
    if (upgradeId === 'boost_restock') return hasRestockBoost;
    return false;
  };

  const canAfford = (upgrade: (typeof UPGRADES)[0]): boolean => {
    if (upgrade.costType === 'coins') return coins >= upgrade.cost;
    if (upgrade.costType === 'gems') return gems >= upgrade.cost;
    return false;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>⬆️ Upgrades</Text>
        <View style={styles.currencies}>
          <Text style={styles.currency}>🪙 {coins}</Text>
          <Text style={styles.currency}>💎 {gems}</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Current Shelves */}
        <Text style={styles.sectionTitle}>🏪 Your Shelves</Text>
        <View style={styles.shelvesGrid}>
          {shelves.map((shelf) => {
            const item = ITEMS[shelf.itemType];
            return (
              <View
                key={shelf.id}
                style={[styles.shelfCard, shelf.unlocked && styles.shelfCardUnlocked]}
              >
                <Text style={styles.shelfEmoji}>{item.emoji}</Text>
                <Text style={styles.shelfName}>{item.name}</Text>
                {shelf.unlocked ? (
                  <View style={styles.stockBar}>
                    <Text style={styles.stockText}>
                      {shelf.stock}/{shelf.maxStock} stock
                    </Text>
                    {shelf.stock <= 1 && (
                      <TouchableOpacity
                        style={styles.orderBtn}
                        onPress={() => placeRestockOrder(shelf.itemType)}
                      >
                        <Text style={styles.orderBtnText}>Order</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ) : (
                  <Text style={styles.shelfLocked}>🔒 🪙{shelf.unlockCost}</Text>
                )}
              </View>
            );
          })}
        </View>

        {/* Upgrade Cards */}
        <Text style={styles.sectionTitle}>🛒 Available Upgrades</Text>
        {UPGRADES.map((upgrade) => {
          const unlocked = isUnlocked(upgrade.id);
          const affordable = canAfford(upgrade);

          return (
            <View
              key={upgrade.id}
              style={[
                styles.upgradeCard,
                unlocked && styles.upgradeCardUnlocked,
                !unlocked && !affordable && styles.upgradeCardLocked,
              ]}
            >
              <Text style={styles.upgradeEmoji}>{upgrade.emoji}</Text>
              <View style={styles.upgradeInfo}>
                <Text style={styles.upgradeName}>{upgrade.name}</Text>
                <Text style={styles.upgradeDesc}>{upgrade.description}</Text>
              </View>
              {unlocked ? (
                <View style={styles.unlockedBadge}>
                  <Text style={styles.unlockedText}>✓ Owned</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.buyButton, !affordable && styles.buyButtonDisabled]}
                  onPress={() => handleUpgrade(upgrade.id)}
                  disabled={!affordable}
                >
                  <Text style={styles.buyButtonText}>
                    {upgrade.costType === 'coins' ? '🪙' : '💎'} {upgrade.cost}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}

        {/* Helpers Section */}
        <Text style={styles.sectionTitle}>👨‍💼 Helpers</Text>
        <View style={styles.helperCard}>
          <Text style={styles.helperEmoji}>👨‍💼</Text>
          <View style={styles.helperInfo}>
            <Text style={styles.helperName}>Ramu Kaka</Text>
            <Text style={styles.helperDesc}>
              {hasRamu
                ? '✓ Working — Auto-bills customers'
                : 'Hire to auto-bill customers while you restock'}
            </Text>
          </View>
          {!hasRamu && (
            <Text style={styles.helperCost}>🪙 500</Text>
          )}
        </View>

        <View style={styles.helperCard}>
          <Text style={styles.helperEmoji}>👦</Text>
          <View style={styles.helperInfo}>
            <Text style={styles.helperName}>Chotu</Text>
            <Text style={styles.helperDesc}>
              {hasChotu
                ? '✓ Working — Auto-restocks godown'
                : 'Hire to auto-restock godown automatically'}
            </Text>
          </View>
          {!hasChotu && (
            <Text style={styles.helperCost}>🪙 1500</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 44,
    backgroundColor: '#2D2D44',
    borderBottomWidth: 1,
    borderBottomColor: '#FF8C00',
  },
  backBtn: {
    paddingRight: 12,
  },
  backBtnText: {
    color: '#FF8C00',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    flex: 1,
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  currencies: {
    flexDirection: 'row',
    gap: 12,
  },
  currency: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 8,
  },
  sectionTitle: {
    color: '#FF8C00',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  shelvesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  shelfCard: {
    width: '47%',
    backgroundColor: '#2D2D44',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#555',
  },
  shelfCardUnlocked: {
    borderColor: '#4CAF50',
    backgroundColor: '#1B3A1E',
  },
  shelfEmoji: {
    fontSize: 28,
  },
  shelfName: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
    textAlign: 'center',
  },
  stockBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  stockText: {
    color: '#4CAF50',
    fontSize: 11,
  },
  orderBtn: {
    backgroundColor: '#FF8C00',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  orderBtnText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  shelfLocked: {
    color: '#F44336',
    fontSize: 11,
    marginTop: 4,
  },
  upgradeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D2D44',
    borderRadius: 10,
    padding: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: '#555',
    marginBottom: 6,
  },
  upgradeCardUnlocked: {
    borderColor: '#4CAF50',
    backgroundColor: '#1B3A1E',
  },
  upgradeCardLocked: {
    opacity: 0.6,
  },
  upgradeEmoji: {
    fontSize: 30,
  },
  upgradeInfo: {
    flex: 1,
  },
  upgradeName: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
  },
  upgradeDesc: {
    color: '#AAA',
    fontSize: 11,
    marginTop: 2,
  },
  unlockedBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  unlockedText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  buyButton: {
    backgroundColor: '#FF8C00',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  buyButtonDisabled: {
    backgroundColor: '#555',
  },
  buyButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  helperCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D2D44',
    borderRadius: 10,
    padding: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: '#555',
    marginBottom: 8,
  },
  helperEmoji: {
    fontSize: 30,
  },
  helperInfo: {
    flex: 1,
  },
  helperName: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
  },
  helperDesc: {
    color: '#AAA',
    fontSize: 11,
    marginTop: 2,
  },
  helperCost: {
    color: '#FFD700',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
