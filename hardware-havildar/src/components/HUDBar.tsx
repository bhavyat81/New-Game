import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  level: number;
  xp: number;
  xpToNextLevel: number;
  coins: number;
  gems: number;
  carryingCount: number;
  activeEvent: string | null;
}

function formatCoins(coins: number): string {
  if (coins >= 1000) return `${(coins / 1000).toFixed(1)}K`;
  return coins.toString();
}

export default function HUDBar({
  level,
  xp,
  xpToNextLevel,
  coins,
  gems,
  carryingCount,
  activeEvent,
}: Props) {
  const xpPercent = Math.min(100, (xp / xpToNextLevel) * 100);

  return (
    <View style={styles.container}>
      {/* Level Badge */}
      <View style={styles.levelBadge}>
        <Text style={styles.levelText}>{level}</Text>
      </View>

      {/* XP Bar + Name */}
      <View style={styles.xpSection}>
        <Text style={styles.playerName}>Havildar Ji</Text>
        <View style={styles.xpBarBg}>
          <View style={[styles.xpBarFill, { width: `${xpPercent}%` as `${number}%` }]} />
        </View>
        <Text style={styles.xpText}>
          {xp}/{xpToNextLevel} XP
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {carryingCount > 0 && (
          <View style={styles.statChip}>
            <Text style={styles.statEmoji}>📦</Text>
            <Text style={styles.statText}>{carryingCount}</Text>
          </View>
        )}
        {/* Gems */}
        <View style={styles.statChip}>
          <Text style={styles.statEmoji}>💎</Text>
          <Text style={styles.statText}>{gems}</Text>
        </View>
        {/* Coins */}
        <View style={[styles.statChip, styles.coinChip]}>
          <Text style={styles.statEmoji}>🪙</Text>
          <Text style={[styles.statText, styles.coinText]}>{formatCoins(coins)}</Text>
        </View>
      </View>

      {/* Active Event Banner */}
      {activeEvent && (
        <View style={styles.eventBanner}>
          <Text style={styles.eventText}>{activeEvent}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A1A2E',
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  levelBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#64B5F6',
  },
  levelText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  xpSection: {
    flex: 1,
  },
  playerName: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  xpBarBg: {
    height: 6,
    backgroundColor: '#333',
    borderRadius: 3,
    marginVertical: 2,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: 6,
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  xpText: {
    color: '#AAA',
    fontSize: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#333',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  coinChip: {
    backgroundColor: '#D4A017',
  },
  statEmoji: {
    fontSize: 12,
  },
  statText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  coinText: {
    color: '#FFF',
  },
  eventBanner: {
    position: 'absolute',
    bottom: -18,
    left: 0,
    right: 0,
    backgroundColor: '#E91E63',
    paddingVertical: 2,
    alignItems: 'center',
  },
  eventText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
