import React from 'react';
import { View, StyleSheet } from 'react-native';
import { STORE_WIDTH, STORE_HEIGHT } from '../constants/layout';

const TILE_SIZE = 40;

export default function StoreFloor() {
  const cols = Math.ceil(STORE_WIDTH / TILE_SIZE);
  const rows = Math.ceil(STORE_HEIGHT / TILE_SIZE);

  return (
    <View style={styles.container}>
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: cols }).map((_, col) => (
          <View
            key={`${row}-${col}`}
            style={[
              styles.tile,
              {
                left: col * TILE_SIZE,
                top: row * TILE_SIZE,
                backgroundColor: (row + col) % 2 === 0 ? '#F5E6C8' : '#EDD9A8',
              },
            ]}
          />
        ))
      )}
      {/* Road at top */}
      <View style={styles.road} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: STORE_WIDTH,
    height: STORE_HEIGHT,
  },
  tile: {
    position: 'absolute',
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderWidth: 0.5,
    borderColor: '#D4C59A',
  },
  road: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: '#555555',
  },
});
