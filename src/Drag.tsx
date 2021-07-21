import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import Images from './assets';
import { PanGestureHandler  } from "react-native-gesture-handler";
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring, useDerivedValue } from "react-native-reanimated";


const DEFINED_RADIUS = 80;
type VectorVelocity = {
  X: number;
  Y: number;
  Z: number;
}

const Drag = () => {
  const displacementSteeringX = useSharedValue(0);
  const displacementSteeringY = useSharedValue(0);
  const displacementVerticalVelocity = useSharedValue(0);

  const [isTakeoff, setIsTakeoff] = useState<boolean>(true);
  const [velocities, setVelocities] = useState<VectorVelocity>({X: 0, Y:0, Z: 0});

  const onGestureSteering = useAnimatedGestureHandler({
    onActive(event) {
      if ((event.translationX)**2 + (event.translationY)**2 < DEFINED_RADIUS**2) {
        displacementSteeringX.value = event.translationX;
        displacementSteeringY.value = event.translationY;
      } else {
        const angle = Math.atan(event.translationY/event.translationX);
        displacementSteeringX.value = Math.sign(event.translationX) * Math.abs(Math.cos(angle) * DEFINED_RADIUS);
        displacementSteeringY.value = Math.sign(event.translationY) * Math.abs(Math.sin(angle) * DEFINED_RADIUS);
      }
    },
    onEnd() {
      displacementSteeringX.value = withSpring(0, {damping: 1 , mass: 0.05, stiffness: 20});
      displacementSteeringY.value = withSpring(0, {damping: 1 , mass: 0.05, stiffness: 20});
    },
  });

  const onGestureVerticalVelocity = useAnimatedGestureHandler({
    onActive(event) {
      if (Math.abs(event.translationY) < DEFINED_RADIUS) {
        displacementVerticalVelocity.value = event.translationY;
      } else {
        displacementVerticalVelocity.value = Math.sign(event.translationY) * DEFINED_RADIUS;
      }
    },
    onEnd() {
      displacementVerticalVelocity.value = withSpring(0, {damping: 1 , mass: 0.05, stiffness: 20});
    },
  });

  const displacementSteeringStyle = useAnimatedStyle(() => {
    return {
      transform: [
          {translateX: displacementSteeringX.value},
          {translateY: displacementSteeringY.value },
        ],
    }
  });

  const displacementVerticalVelocityStyle = useAnimatedStyle(() => {
    return {
      transform: [
          {translateY: displacementVerticalVelocity.value },
        ],
    }
  });

  const displacementValue = useDerivedValue(() => {
    return {
      X: displacementSteeringX.value,
      Y: displacementSteeringY.value,
      Z: displacementVerticalVelocity.value,
    }
  });

  useEffect(() => {
    const id = setInterval(() => {
        console.log(displacementValue);
      }
    , 10);

    return () => clearInterval(id);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={Images.logo} style={styles.logoStyle} />
      <View  style={[styles.availableStyle, { backgroundColor: isTakeoff ? 'green' : 'red' }]}/>
      <TouchableOpacity onPress={() => setIsTakeoff(prevState => !prevState)}>
        <Image source={isTakeoff ? Images.takeoff: Images.land} style={styles.land_takeoff} />
      </TouchableOpacity>
      <View style={styles.steering}>
        <PanGestureHandler onGestureEvent={onGestureSteering}>
          <Animated.View
            style={[styles.driverSteering, displacementSteeringStyle]}
          />
        </PanGestureHandler>
      </View>
      <View style={styles.verticalSpeed}>
        <PanGestureHandler onGestureEvent={onGestureVerticalVelocity}>
          <Animated.View
            style={[styles.driverVerticalVelocity, displacementVerticalVelocityStyle]}
          />
        </PanGestureHandler>
      </View>
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center'
  },
  steering: {
    width: DEFINED_RADIUS*2,
    height: DEFINED_RADIUS*2,
    marginTop: -175,
    marginLeft: 50,
    borderRadius: DEFINED_RADIUS*2,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#BEBEBE',
    opacity: 0.3,
    alignSelf: 'flex-start',
  },
  verticalSpeed: {
    width: 50,
    height: DEFINED_RADIUS*2,
    marginTop: -175,
    marginRight: 25 + DEFINED_RADIUS,
    borderRadius: DEFINED_RADIUS*2,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#BEBEBE',
    opacity: 0.3,
    alignSelf: 'flex-end',
  },
  driverSteering: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#282828',
    opacity: 0.6,
    marginTop: DEFINED_RADIUS - 25,
    marginLeft: DEFINED_RADIUS - 25,
  },
  driverVerticalVelocity: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#282828',
    opacity: 0.6,
    marginTop: DEFINED_RADIUS - 25,
  },
  logoStyle: {
    marginTop: 20,
    width: 120,
    height: 100,
  },
  availableStyle: {
    marginTop: 10,
    width: 30,
    height: 30,
    borderRadius: 30,
    borderColor: '#000',
    borderWidth: 1,
  },
  land_takeoff: {
    marginTop: 60,
    width: 100,
    height: 100,
  },
});

export default Drag;