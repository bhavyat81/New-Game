import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

interface Props {
  amount: number;
  x: number;
  y: number;
  onComplete: () => void;
}

export default function CoinPopup({ amount, x, y, onComplete }: Props) {
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    scale.value = withSpring(1.2, { damping: 8 });
    translateY.value = withTiming(-50, { duration: 1200 });
    opacity.value = withTiming(0, { duration: 1200 }, (finished) => {
      if (finished) {
        runOnJS(onComplete)();
      }
    });
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: x - 20,
    top: y + translateY.value,
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animStyle}>
      <Text style={styles.text}>+🪙{amount}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
