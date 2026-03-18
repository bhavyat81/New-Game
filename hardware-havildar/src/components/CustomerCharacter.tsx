import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
} from 'react-native-reanimated';
import { Customer } from '../store/useGameStore';
import { CUSTOMER_CONFIGS } from '../constants/customers';

interface Props {
  customer: Customer;
}

export default function CustomerCharacter({ customer }: Props) {
  const animX = useSharedValue(customer.position.x);
  const animY = useSharedValue(customer.position.y);
  const bobY = useSharedValue(0);

  useEffect(() => {
    animX.value = withTiming(customer.position.x, { duration: 100 });
    animY.value = withTiming(customer.position.y, { duration: 100 });
  }, [customer.position.x, customer.position.y]);

  useEffect(() => {
    bobY.value = withRepeat(withTiming(-2, { duration: 300 }), -1, true);
  }, []);

  const config = CUSTOMER_CONFIGS[customer.type];
  const patienceRatio =
    customer.maxPatience > 0 ? customer.patience / customer.maxPatience : 1;
  const patienceColor =
    patienceRatio > 0.6 ? '#4CAF50' : patienceRatio > 0.3 ? '#FFC107' : '#F44336';

  const isAngry = customer.state === 'angry_exit';

  const animStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: animX.value - 20,
    top: animY.value - 40 + bobY.value,
  }));

  const showPatience =
    customer.state === 'waiting_at_billing' || customer.state === 'waiting_at_shelf';

  return (
    <Animated.View style={[animStyle, isAngry && styles.angryContainer]}>
      {showPatience && (
        <View style={styles.patienceBarBg}>
          <View
            style={[
              styles.patienceBarFill,
              {
                width: `${patienceRatio * 100}%` as `${number}%`,
                backgroundColor: patienceColor,
              },
            ]}
          />
        </View>
      )}
      <View style={[styles.character, { backgroundColor: config.color }]}>
        <Text style={styles.emoji}>{config.emoji}</Text>
      </View>
      <Text style={styles.name}>{config.name.split(' ')[0]}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  angryContainer: {
    opacity: 0.8,
  },
  patienceBarBg: {
    width: 36,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    marginBottom: 2,
    overflow: 'hidden',
  },
  patienceBarFill: {
    height: 4,
    borderRadius: 2,
  },
  character: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 22,
  },
  name: {
    fontSize: 7,
    color: '#333',
    textAlign: 'center',
    marginTop: 1,
  },
});
