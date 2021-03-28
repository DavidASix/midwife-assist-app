import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import statusBar from '../assets/statusBar';
let {height} = Dimensions.get('window')
const peek = 100

class SlideUpModal extends Component {
  constructor(props) {
    super(props);
    this.newAnimatedPosition = 0;
    this.animatedView = null;
    this.coordinate = 0;
    this.position = new Animated.ValueXY();
    window.SlideUpModal = this;

    this.position.addListener((value) => {
      //console.log({ y: value.y, thingHeight:  -(this.animatedView.height - peek + statusBar)});
      if (value.y < -(this.animatedView.height - peek + statusBar)) {
        //Animated.decay(this.position).stop();
        //console.log('Decay Halted');
        //Animated.spring(this.position, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
        //console.log('too far!!!');
      }
    })

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        return true;
      },
      onPanResponderGrant: (evt, gestureState) => {
        // Set the offset so the next touch event knows where to place the component on the screen
        this.position.setOffset({ x: 0, y: this.position.y._value });
        // Reset the value of the animation to 0. If this is not done, then setting the offset will double the current y value
        // Doubling the Y value pushes the component off the screen
        this.position.setValue({ x:0, y:0 });
      },
      //onPanResponderMove: Animated.event([null, { dx: 0, dy: this.position.y }], { useNativeDriver: false }),
      onPanResponderMove: (evt, gestureState) => {
        this.position.setValue({ x: 0, y: gestureState.dy });
      },
      onPanResponderRelease: (evt, gestureState) => {
        this.position.flattenOffset();
        let maxScrollHeight = this.animatedView.height - peek + statusBar;
        this.coordinate += gestureState.dy;
        // Create an immutable version of the gestureState object, as AnimatedDecay will 0' the object out.
        let action = {...gestureState};
        let proxToTop = this.position.y._value - (-height + peek);
        if (action.dy < 0 && this.position.y._value > -height + peek) {
          //When scrolling up from begining, jump to first snap point
          console.log('Jump to top position');
          Animated.spring(this.position, { toValue: { x: 0, y: -height + peek }, useNativeDriver: false }).start();
        } else if (action.dy > 0 && this.position.y._value - (-height + peek) > 75) {
          // Scrolling down, top of animated view is over 75px below the top of the frame, snap to bottom of frame.
          console.log('Jump to home position');
          Animated.spring(this.position, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
        } else if (action.dy > 0 && proxToTop <= 75 && proxToTop > 0) {
          // Scrolling up, Top of animated view is within 75px above the top of the frame. Snap to the top of the frame
          console.log('Jump to top position from viewing position');
          Animated.spring(this.position, { toValue: { x: 0, y: -height + peek }, useNativeDriver: false }).start();
        } else if (action.dy < 0 && this.position.y._value <= -maxScrollHeight) {
          // Scroll has reached past bottom of list and is bouncing back
          console.log('Jump to bottom position');
          Animated.spring(this.position, { toValue: { x: 0, y: -maxScrollHeight }, useNativeDriver: false }).start();
        } else {
          console.log('Decay Movement');
          let velocitySign = action.vy < 0 ? -1 : 1;
          let velocity = Math.abs(action.vy) < 1.2 ? 1.2 : Math.abs(action.vy);
          velocity = velocity * velocitySign;
          velocity = Math.abs(action.vy) <= 0.025 ? 0 : velocity;
          console.log({ oV: action.vy, nV: velocity });
          Animated.decay(this.position,
            {
              velocity: {  x: 0, y: velocity },
              deceleration: 0.995,
              useNativeDriver: false
            }).start(() => this.move(action))
        }
      }
    });
  }

  move(action) {
    let maxScrollHeight = this.animatedView.height - peek + statusBar;
    let proxToTop = this.position.y._value - (-height + peek);
    if (action.dy < 0 && this.position.y._value > -height + peek) {
      //When scrolling up from begining, jump to first snap point
      console.log('Jump to top position');
      Animated.spring(this.position, { toValue: { x: 0, y: -height + peek }, useNativeDriver: false }).start();
    } else if (action.dy > 0 && this.position.y._value - (-height + peek) > 75) {
      // Scrolling down, top of animated view is over 75px below the top of the frame, snap to bottom of frame.
      console.log('Jump to home position');
      Animated.spring(this.position, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
    } else if (action.dy > 0 && proxToTop <= 75 && proxToTop > 0) {
      // Scrolling up, Top of animated view is within 75px above the top of the frame. Snap to the top of the frame
      console.log('Jump to top position from viewing position');
      Animated.spring(this.position, { toValue: { x: 0, y: -height + peek }, useNativeDriver: false }).start();
    } else if (action.dy < 0 && this.position.y._value <= -maxScrollHeight) {
      // Scroll has reached past bottom of list and is bouncing back
      console.log('Jump to bottom position');
      Animated.spring(this.position, { toValue: { x: 0, y: -maxScrollHeight }, useNativeDriver: false }).start();
    }
  }

  onPressButton() {
    // Unnecessary variable, but put in for readability
    let topOfAnimatedViewForCenter = (height + this.animatedView.height) / -2 + this.props.peek;
    // Flip the animated position to the opposite of the current position.
    this.newAnimatedPosition = this.newAnimatedPosition === 0 ? topOfAnimatedViewForCenter : 0;
    Animated.spring(this.position, { toValue: { x: 0, y: this.newAnimatedPosition }, useNativeDriver: false }).start();
  }

  render() {
    return (
      <>
        <Animated.View
          {...this.panResponder.panHandlers}
          onLayout={({ nativeEvent }) => this.animatedView = nativeEvent.layout}
          style={[
            this.props.style,
            {
              position: 'absolute',
              alignSelf: 'center',
              transform: this.position.getTranslateTransform(),
              top: height - this.props.peek,
              minHeight: height,
              width: '100%'
            }]}>
        </Animated.View>

      </>
    );
  }
}
/*
<TouchableOpacity
  onPress={() => this.onPressButton()}
  style={{
    position: 'absolute',
    top: height / 2 - 20,
    height: 40,
    width: 40,
    zIndex: 99,
    backgroundColor: 'red'}} />
*/
SlideUpModal.defaultProps = {
  peek: 100,
  style: {
    backgroundColor: '#FFF',
    borderColor: '#DDD',
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 0.5,
    elevation: 4,
  },
  children: [<Text>Content Goes Here!</Text>]
};

export default SlideUpModal;
