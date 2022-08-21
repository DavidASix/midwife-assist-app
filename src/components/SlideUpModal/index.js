import React, {Component} from 'react';
import {Text, Dimensions, Animated, PanResponder} from 'react-native';

let {height} = Dimensions.get('window');

class SlideUpModal extends Component {
  constructor(props) {
    super(props);
    this.newAnimatedPosition = 0;
    this.animatedView = null;
    this.position = new Animated.ValueXY();
    window.SlideUpModal = this;

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        // Set the offset so the next touch event knows where to place the component on the screen
        this.position.setOffset({x: 0, y: this.position.y._value});
        // Reset the value of the animation to 0. If this is not done, then setting the offset will double the current y value
        // Doubling the Y value pushes the component off the screen
        this.position.setValue({x: 0, y: 0});
      },
      onPanResponderMove: (evt, gestureState) => {
        this.position.setValue({x: 0, y: gestureState.dy});
      },
      onPanResponderRelease: (evt, gestureState) => {
        this.position.flattenOffset();
        // These are unnecessary variables, but put in for readability
        let topOfAnimatedViewForCenter =
          (height + this.animatedView.height) / -2 + this.props.peek;
        let shouldChangePosition = Math.abs(gestureState.dy) > 75;
        // If the gesture was large enough to warranty a position change, check whether the gesture was up or down
        // Move the animated component according to the direction of the gesture
        if (shouldChangePosition) {
          this.newAnimatedPosition =
            gestureState.dy < 0 ? topOfAnimatedViewForCenter : 0;
        }
        Animated.spring(this.position, {
          toValue: {x: 0, y: this.newAnimatedPosition},
          useNativeDriver: false,
        }).start();
      },
    });
  }

  changeVisibility(direction) {
    // Unnecessary variable, but put in for readability
    let topOfAnimatedViewForCenter =
      (height + this.animatedView.height) / -2 + this.props.peek;
    // Flip the animated position to the opposite of the current position.
    if (direction === 'up') {
      this.newAnimatedPosition =
        (height + this.animatedView.height) / -2 + this.props.peek;
    } else if (direction === 'down') {
      this.newAnimatedPosition = 0;
    } else {
      this.newAnimatedPosition =
        this.newAnimatedPosition === 0 ? topOfAnimatedViewForCenter : 0;
    }
    Animated.spring(this.position, {
      toValue: {x: 0, y: this.newAnimatedPosition},
      useNativeDriver: false,
    }).start();
  }

  render() {
    return (
      <>
        <Animated.View
          {...this.panResponder.panHandlers}
          onLayout={({nativeEvent}) => (this.animatedView = nativeEvent.layout)}
          style={[
            this.props.style,
            {
              position: 'absolute',
              alignSelf: 'center',
              transform: this.position.getTranslateTransform(),
              top: height - this.props.peek,
            },
          ]}>
          {this.props.children}
        </Animated.View>
      </>
    );
  }
}

SlideUpModal.defaultProps = {
  peek: 100,
  style: {
    backgroundColor: '#FFF',
    borderColor: '#DDD',
    height: '50%',
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 0.5,
    elevation: 4,
  },
  children: [<Text>Content Goes Here!</Text>],
};

export default SlideUpModal;
