import React, { Component } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  UIManager,
  LayoutAnimation,
  Platform,
  TextInput,
  Button,
  Dimensions,
  Animated,
  PanResponder
} from 'react-native';
import axios from 'axios';
const c = require('../assets/constants');


const {height} = Dimensions.get('window')
const peek = 100

class BasePage extends Component {
  constructor(props) {
    super(props);
    this.position = new Animated.ValueXY()
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        this.position.setOffset({ x: 0, y: this.position.y._value });
      },
      onPanResponderMove: Animated.event([null, { dx: 0, dy: this.position.y }]),
      onPanResponderRelease: (evt, gestureState) => {
        this.position.flattenOffset();
        let y = gestureState.dy < 75 ? -height + peek : 0;
        Animated.spring(this.position, { toValue: { x: 0, y } }).start(({ fin }) => {
          console.log('Position Release 2: ', this.position);
        });
      }
    });
  }

  onPressButton() {
    console.log('Button Pressed');
    Animated.spring(this.position, { toValue: { x: 0, y: -height } }).start();
    this.position.setOffset({ x: 0, y: -height });
    this.position.flattenOffset();
  }

  render() {
    return (
      <View style={[styles.container]}>
        <Animated.View
          {...this.panResponder.panHandlers}
          style={[styles.card, { transform: this.position.getTranslateTransform() }]}>
            <Text>Card</Text>
        </Animated.View>
          <TouchableOpacity onPress={() => this.onPressButton()} style={{ height: 40, width: 40, zIndex: 99, backgroundColor: 'red'}} />
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green'
  },

  card: {
    position: 'absolute',
    top: height - peek,
    height: '50%',
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2.5,
    borderRadius: 10,
    borderWidth: 0.5,
    zIndex: 40,
    alignSelf: 'center',
    backgroundColor: '#FFF'
  },
}

export default BasePage;



//this.newAnimatedPosition = -height + peek;
let maxScrollHeight = this.animatedView.height - peek + statusBar;
this.coordinate += gestureState.dy;
//console.log(this.coordinate);
if (gestureState.dy < 0) {
  // Scroll is going up
  //console.log('Scrolling Up');
  if (this.position.y._value > -height + peek) {
    console.log('jumping to break point');
    //When scrolling up from begining, jump to first snap point
    this.coordinate = -height + peek;
    Animated.spring(this.position, { toValue: { x: 0, y: -height + peek }, useNativeDriver: false }).start();
  } else if (gestureState.dy < 0 && this.coordinate <= -maxScrollHeight) {
    console.log('jumping to end ');
    // At end of list, bounce back to end
    Animated.spring(this.position, { toValue: { x: 0, y: -maxScrollHeight }, useNativeDriver: false }).start();
  }
  else {
    console.log('just scrolling');
    console.log(gestureState);
    Animated.decay(this.position, {
      velocity: { x:0, y: gestureState.vy},
      deceleration: 0.989
    }).start(() => {

    });
  }
} else {
  //Scrolling back down
}
