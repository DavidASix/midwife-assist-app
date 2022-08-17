import React from 'react';
import {View, Text, TouchableOpacity, Animated} from 'react-native';
import SIcon from 'react-native-vector-icons/SimpleLineIcons';
import SVGIcon from '../components/SVGIcon/';
import c from '../assets/constants';

// Animated values used in the TabBar Component
let scrollAnimation = new Animated.ValueXY();
let indicatorPosition = new Animated.ValueXY();

const containerWidth = c.device.width * 0.7;
const linksInBar = 3;

const BottomTabBar = props => {
  const {state, descriptors, navigation, theme} = props;

  //Animate the indicator position
  Animated.spring(indicatorPosition, {
    toValue: {x: state.index * (containerWidth / linksInBar), y: 0},
    duration: 80,
    bounciness: 5,
    useNativeDriver: true,
  }).start();

  function icons(route, focused, size = 30) {
    let color = focused ? c.themes[theme].accent : c.themes[theme].lightText;
    switch (route.name) {
      case 'calcStack':
        return <SIcon name="calculator" color={color} size={size} />;
      case 'clientStack':
        return <SIcon name="people" color={color} size={size} />;
      case 'settings':
        return <SIcon name="settings" color={color} size={size} />;
      default:
        return <SIcon name="" color={color} size={size} />;
    }
  }

  function renderTabBarButtons() {
    return state.routes.map((route, index) => {
      const {options} = descriptors[route.key];

      // Gets most proper tab bar title
      const label =
        options.tabBarLabel !== undefined
          ? options.tabBarLabel
          : options.title !== undefined
          ? options.title
          : route.name;
      const isFocused = state.index === index;
      const onLongPress = () =>
        navigation.emit({type: 'tabLongPress', target: route.key});

      const onPress = () => {
        const event = navigation.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        });
        if (!isFocused && !event.defaultPrevented) {
          // The `merge: true` option makes sure that the params inside the tab screen are preserved
          navigation.navigate({name: route.name, merge: true});
        }
      };

      return (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={options.tabBarAccessibilityLabel}
          onPress={onPress}
          onLongPress={onLongPress}
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          key={index}>
          {icons(route, isFocused, 20)}
          <Text
            style={{
              fontSize: 10,
              marginTop: 1,
              color: isFocused
                ? c.themes[theme].accent
                : c.themes[theme].lightText,
            }}>
            {label}
          </Text>
        </TouchableOpacity>
      );
    });
  }

  return (
    <View
      style={[
        styles.outerContainer,
        {backgroundColor: c.themes[theme].background},
      ]}>
      <SVGIcon
        name="tabBarDivider"
        style={{position: 'absolute', top: -10, height: 15, width: '100%'}}
        color={c.themes[theme].accent}
      />
      <View
        style={{
          height: 45,
          width: '100%',
          position: 'absolute',
          bottom: 0,
          backgroundColor: c.themes[theme].accent,
        }}
      />

      <Animated.View style={[styles.mainContainer, {}]}>
        <Animated.View style={styles.indicatorContainer}>
          <View
            style={[
              styles.indicator,
              {backgroundColor: c.themes[theme].lightText},
            ]}
          />
        </Animated.View>
        {renderTabBarButtons()}
      </Animated.View>
    </View>
  );
};

const styles = {
  outerContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    flex: 0,
    height: 50,
    paddingBottom: 2,
  },
  mainContainer: {
    flexDirection: 'row',
    padding: 0,
    width: containerWidth,
    height: 45,
    transform: scrollAnimation.getTranslateTransform(),
  },
  indicatorContainer: {
    position: 'absolute',
    width: containerWidth / linksInBar,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    transform: indicatorPosition.getTranslateTransform(),
  },
  indicator: {
    backgroundColor: 'white',
    height: 45,
    width: 50,
    elevation: 5,
    borderRadius: 10,
  },
};

export default BottomTabBar;
