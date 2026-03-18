import React, { useRef, useState } from 'react';
import { View, StyleSheet, PanResponder } from 'react-native';

interface Props {
  onMove: (dx: number, dy: number) => void;
  onRelease: () => void;
}

const JOYSTICK_RADIUS = 50;
const KNOB_RADIUS = 22;

export default function Joystick({ onMove, onRelease }: Props) {
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const { dx, dy } = gestureState;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = JOYSTICK_RADIUS - KNOB_RADIUS;

        let clampedX = dx;
        let clampedY = dy;

        if (dist > maxDist) {
          const ratio = maxDist / dist;
          clampedX = dx * ratio;
          clampedY = dy * ratio;
        }

        setKnobPos({ x: clampedX, y: clampedY });

        const normalizedX = clampedX / maxDist;
        const normalizedY = clampedY / maxDist;
        onMove(normalizedX, normalizedY);
      },
      onPanResponderRelease: () => {
        setKnobPos({ x: 0, y: 0 });
        onRelease();
      },
      onPanResponderTerminate: () => {
        setKnobPos({ x: 0, y: 0 });
        onRelease();
      },
    })
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={styles.base} />
      <View
        style={[
          styles.knob,
          {
            transform: [
              { translateX: knobPos.x },
              { translateY: knobPos.y },
            ],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: JOYSTICK_RADIUS * 2,
    height: JOYSTICK_RADIUS * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  base: {
    position: 'absolute',
    width: JOYSTICK_RADIUS * 2,
    height: JOYSTICK_RADIUS * 2,
    borderRadius: JOYSTICK_RADIUS,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  knob: {
    width: KNOB_RADIUS * 2,
    height: KNOB_RADIUS * 2,
    borderRadius: KNOB_RADIUS,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 2,
    borderColor: '#FFF',
  },
});
