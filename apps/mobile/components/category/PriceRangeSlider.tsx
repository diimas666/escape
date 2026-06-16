import { useMemo, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  PanResponder,
  StyleSheet,
  Text,
  View,
  type PanResponderGestureState,
} from 'react-native';
import { colors } from '../../constants/theme';

const THUMB_SIZE = 24;
const TRACK_HEIGHT = 4;

type Props = {
  min: number;
  max: number;
  from: number;
  to: number;
  onChange: (from: number, to: number) => void;
  step?: number;
};

function formatPrice(value: number) {
  return `${Math.round(value).toLocaleString('uk-UA')} ₴`;
}

export function PriceRangeSlider({
  min,
  max,
  from,
  to,
  onChange,
  step = 50,
}: Props) {
  const trackWidthRef = useRef(0);
  const [trackWidth, setTrackWidth] = useState(0);
  const valuesRef = useRef({ from, to, min, max });
  valuesRef.current = { from, to, min, max };

  const clamp = (value: number) => Math.min(max, Math.max(min, value));

  const snap = (value: number) => {
    if (step <= 0) {
      return clamp(value);
    }

    return clamp(Math.round(value / step) * step);
  };

  const valueToX = (value: number, width: number) => {
    if (max <= min || width <= THUMB_SIZE) {
      return 0;
    }

    const ratio = (value - min) / (max - min);
    return ratio * (width - THUMB_SIZE);
  };

  const xToValue = (x: number, width: number) => {
    if (max <= min || width <= THUMB_SIZE) {
      return min;
    }

    const ratio = Math.min(1, Math.max(0, x / (width - THUMB_SIZE)));
    return snap(min + ratio * (max - min));
  };

  const makeResponder = (thumb: 'from' | 'to') =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (
        _event,
        gestureState: PanResponderGestureState,
      ) => {
        const width = trackWidthRef.current;
        const {
          from: currentFrom,
          to: currentTo,
        } = valuesRef.current;
        const startX = valueToX(
          thumb === 'from' ? currentFrom : currentTo,
          width,
        );
        const nextValue = xToValue(startX + gestureState.dx, width);

        if (thumb === 'from') {
          onChange(Math.min(nextValue, currentTo), currentTo);
        } else {
          onChange(currentFrom, Math.max(nextValue, currentFrom));
        }
      },
    });

  const fromResponder = useMemo(
    () => makeResponder('from'),
    [onChange],
  );
  const toResponder = useMemo(() => makeResponder('to'), [onChange]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    trackWidthRef.current = width;
    setTrackWidth(width);
  };

  const fromX = valueToX(from, trackWidth);
  const toX = valueToX(to, trackWidth);
  const rangeLeft = fromX + THUMB_SIZE / 2;
  const rangeWidth = Math.max(0, toX - fromX);

  return (
    <View style={styles.wrapper}>
      <View style={styles.labels}>
        <Text style={styles.priceLabel}>Від {formatPrice(from)}</Text>
        <Text style={styles.priceLabel}>До {formatPrice(to)}</Text>
      </View>

      <View style={styles.trackContainer} onLayout={handleLayout}>
        <View style={styles.track} />
        <View style={[styles.range, { left: rangeLeft, width: rangeWidth }]} />
        <View
          style={[styles.thumb, { left: fromX }]}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          {...fromResponder.panHandlers}
        />
        <View
          style={[styles.thumb, { left: toX }]}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          {...toResponder.panHandlers}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 16,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textOnDarkMuted,
  },
  trackContainer: {
    height: THUMB_SIZE,
    justifyContent: 'center',
  },
  track: {
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    backgroundColor: colors.homeSurface,
  },
  range: {
    position: 'absolute',
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    backgroundColor: colors.primary,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: colors.textOnDark,
    borderWidth: 2,
    borderColor: colors.primary,
    top: 0,
  },
});
