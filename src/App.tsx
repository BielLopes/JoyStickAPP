import React, { useEffect } from "react";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, interpolate, Extrapolate } from 'react-native-reanimated';
import { Text, View, StatusBar, StyleSheet  } from 'react-native';

const App = () => {
  const titlePosition = useSharedValue(30);

  useEffect(() => {
    setTimeout(() => {
      titlePosition.value = withTiming(0, { duration: 500, easing: Easing.bounce })
    }, 2000);
  }, []);

  const titleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: titlePosition.value },
      ],
      opacity: interpolate(
        titlePosition.value,
        [30, 0],
        [0, 1],
        Extrapolate.CLAMP,
      )
    }
  })

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor='#13131A' />
      <Animated.Text style={[styles.title, titleStyle]}>Aloha</Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#13131A',
  },
  title: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 32,
  }
});

export default App;