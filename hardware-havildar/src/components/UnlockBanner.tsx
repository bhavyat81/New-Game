import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

interface Props {
  shelfName: string;
  cost: number;
  currentCoins: number;
  onUnlock: () => void;
}

export default function UnlockBanner({ shelfName, cost, currentCoins, onUnlock }: Props) {
  const canAfford = currentCoins >= cost;
  const progressPercent = Math.min(100, (currentCoins / cost) * 100);

  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={[styles.container, animStyle]}>
      <View style={styles.row}>
        <Text style={styles.title}>🔓 Unlock {shelfName}</Text>
        <TouchableOpacity
          style={[styles.button, !canAfford && styles.buttonDisabled]}
          onPress={onUnlock}
          disabled={!canAfford}
        >
          <Text style={styles.buttonText}>
            {canAfford ? `UNLOCK! 🪙${cost}` : `🪙 ${cost}`}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${progressPercent}%` as `${number}%` }]} />
      </View>
      <Text style={styles.progressText}>
        {currentCoins} / {cost} coins
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#6A1B9A',
    padding: 8,
    marginHorizontal: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
    flex: 1,
  },
  button: {
    backgroundColor: '#FF8C00',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  buttonDisabled: {
    backgroundColor: '#888',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  progressBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    marginTop: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    backgroundColor: '#FFD700',
    borderRadius: 3,
  },
  progressText: {
    color: '#EEE',
    fontSize: 9,
    marginTop: 2,
  },
});
