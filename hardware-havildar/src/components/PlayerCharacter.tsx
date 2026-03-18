import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  x: number;
  y: number;
  direction?: { x: number; y: number };
}

export default function PlayerCharacter({ x, y, direction }: Props) {
  const animX = useSharedValue(x);
  const animY = useSharedValue(y);
  const bobY = useSharedValue(0);

  useEffect(() => {
    animX.value = withSpring(x, { damping: 15 });
    animY.value = withSpring(y, { damping: 15 });
  }, [x, y]);

  useEffect(() => {
    bobY.value = withRepeat(withTiming(-3, { duration: 400 }), -1, true);
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: animX.value - 20,
    top: animY.value - 40 + bobY.value,
  }));

  const rotation = direction
    ? Math.atan2(direction.y, direction.x) * (180 / Math.PI)
    : 0;

  return (
    <Animated.View style={animStyle}>
      {/* Green circle glow */}
      <View style={styles.glowCircle} />
      {/* Direction arrow */}
      <View
        style={[
          styles.arrow,
          { transform: [{ rotate: `${rotation}deg` }] },
        ]}
      >
        <Text style={styles.arrowText}>▶</Text>
      </View>
      {/* Character */}
      <View style={styles.character}>
        <Text style={styles.characterEmoji}>🧔</Text>
      </View>
      <Text style={styles.label}>Havildar</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  glowCircle: {
    position: 'absolute',
    width: 44,
    height: 20,
    borderRadius: 22,
    backgroundColor: 'rgba(0,200,0,0.3)',
    borderWidth: 2,
    borderColor: '#00CC00',
    top: 28,
    left: -2,
  },
  arrow: {
    position: 'absolute',
    top: 30,
    left: 8,
    zIndex: 2,
  },
  arrowText: {
    fontSize: 10,
    color: '#00AA00',
  },
  character: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  characterEmoji: {
    fontSize: 32,
  },
  label: {
    fontSize: 8,
    color: '#333',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
