import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { useGameStore } from '../src/store/useGameStore';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { coins, level, bestDayCoins } = useGameStore();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />

      {/* Background */}
      <View style={styles.bgPattern} />

      {/* Logo Section */}
      <View style={styles.logoSection}>
        <Text style={styles.logoHindi}>हार्डवेयर हवलदार</Text>
        <Text style={styles.logoEnglish}>HARDWARE HAVILDAR</Text>
        <Text style={styles.tagline}>🔩 Indian Hardware Store Tycoon 🔌</Text>
        <Text style={styles.storeEmoji}>🏪</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>Lv.{level}</Text>
          <Text style={styles.statLabel}>Level</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>🪙 {coins}</Text>
          <Text style={styles.statLabel}>Coins</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>🏆 {bestDayCoins}</Text>
          <Text style={styles.statLabel}>Best Day</Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonSection}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.push('/game')}
        >
          <Text style={styles.startButtonText}>🎮 START GAME</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.upgradeButton}
          onPress={() => router.push('/upgrade')}
        >
          <Text style={styles.upgradeButtonText}>⬆️ UPGRADES</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Credits */}
      <Text style={styles.credits}>
        Inspired by Gada Electronics • TMKOC 🇮🇳
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 40,
  },
  bgPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1A1A2E',
  },
  logoSection: {
    alignItems: 'center',
    paddingTop: 20,
  },
  logoHindi: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF8C00',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  logoEnglish: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 4,
    marginTop: 4,
  },
  tagline: {
    fontSize: 13,
    color: '#AAA',
    marginTop: 6,
  },
  storeEmoji: {
    fontSize: 80,
    marginTop: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    backgroundColor: '#2D2D44',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minWidth: width / 4,
    borderWidth: 1,
    borderColor: '#FF8C00',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  statLabel: {
    fontSize: 10,
    color: '#AAA',
    marginTop: 2,
  },
  buttonSection: {
    width: '80%',
    gap: 12,
  },
  startButton: {
    backgroundColor: '#FF8C00',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#FF8C00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 2,
  },
  upgradeButton: {
    backgroundColor: '#2196F3',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#64B5F6',
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  credits: {
    fontSize: 10,
    color: '#555',
    textAlign: 'center',
  },
});
