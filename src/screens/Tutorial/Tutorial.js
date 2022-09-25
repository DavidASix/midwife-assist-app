import React, {Component} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  FlatList,
  Animated,
} from 'react-native';
import FIcon from 'react-native-vector-icons/Feather';

const c = require('../../assets/constants');

class Tutorial extends Component {
  constructor(props) {
    super(props);
    this.scrollAnim = new Animated.Value(0);
    this.flatList;
    this.slides = [
      {
        title: 'Midwife Assist',
        description: 'An app dedicated to assisting midwives',
        image: require('../../assets/images/woman.png'),
        iconName: 'home',
        color: c.themes[props.theme].accent,
      },
      {
        title: 'Delivery Date Calculations',
        description:
          'Convert estimated delivery date, gestational age, and last menstrual periods',
        image: require('../../assets/images/calendar.png'),
        iconName: 'calendar',
        color: '#B195BA',
      },
      {
        title: 'Store client information',
        description:
          'Store client data, locking it behind security of your choice',
        image: require('../../assets/images/shield.png'),
        iconName: 'users',
        color: '#BA7B70',
      },
      {
        title: 'Never connect to a network',
        description:
          "This app does not connect to the internet, your patient's data stays on your device",
        image: require('../../assets/images/no-server.png'),
        iconName: 'wifi-off',
        color: '#8FBFB7',
      },
    ];
    this.state = {
      page: 0,
      loading: true,
    };
  }

  componentDidMount() {
    this.props.refreshStore();

    if (!this.props.firstLogin) {
      this.props.navigation.navigate('auth');
    } else {
      this.setState({loading: false});
    }

    this.focusListener = this.props.navigation.addListener('focus', () =>
      this.onFocusChange(),
    );
    this.blurListener = this.props.navigation.addListener('blur', () =>
      this.onFocusChange(),
    );
  }

  componentWillUnmount() {
    this.focusListener();
    this.blurListener();
  }

  onFocusChange() {
    this.setState({loading: true});
    if (this.flatList) {
      this.flatList.scrollToOffset({offset: 0, animated: false});
    }
    this.setState({loading: false});
  }

  onViewChange = item => this.setState({page: item.changed[0].index});

  onPressFinalPage = () => {
    if (this.props.firstLogin) {
      this.props.markFirstLogin();
      this.props.navigation.navigate('auth');
    } else {
      this.props.navigation.navigate('tabs');
    }
  };

  renderSlide(slide, i) {
    let {theme} = this.props;
    let scale = Animated.divide(this.scrollAnim, c.device.width);
    scale = Animated.modulo(scale, 1);
    scale = scale.interpolate({
      inputRange: [0, 0.4, 0.6, 1],
      outputRange: [1, 0.975, 0.975, 1],
    });
    const Final = () =>
      i === this.slides.length - 1 ? (
        <TouchableOpacity
          onPress={this.onPressFinalPage}
          style={[
            sty.completeButton,
            {backgroundColor: c.themes[theme].accent},
          ]}>
          <Text style={{color: c.themes[theme].lightText}}>Get Started</Text>
        </TouchableOpacity>
      ) : null;
    return (
      <View style={[sty.slide]}>
        <Animated.View style={{transform: [{scale}], width: '100%', flex: 1}}>
          <View
            style={{
              flex: 2,
              ...c.center,
            }}>
            <View style={sty.imgCircle} />
            <Image
              source={slide.image}
              style={{width: '60%', position: 'absolute'}}
              resizeMode="contain"
            />
          </View>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text
              style={[
                c.titleFont,
                {
                  fontSize: 25,
                  color: c.themes[theme].lightText,
                  marginVertical: 10,
                },
              ]}>
              {slide.title}
            </Text>
            <Text
              style={{
                color: c.themes[theme].lightText,
                fontSize: 16,
                maxWidth: '80%',
                textAlign: 'center',
              }}>
              {slide.description}
            </Text>
            <Final />
          </View>
        </Animated.View>
      </View>
    );
  }

  renderIndicator() {
    let {theme} = this.props;
    let {page} = this.state;
    const size = 25;
    const indicatorColor = j =>
      j === page ? c.themes[theme].lightText : c.themes[theme].text;
    return this.slides.map((slide, i) => (
      <TouchableOpacity
        key={i}
        onPress={() => this.flatList.scrollToIndex({index: i})}>
        <FIcon
          style={sty.indicatorIcon}
          size={size}
          color={indicatorColor(i)}
          name={slide.iconName}
        />
      </TouchableOpacity>
    ));
  }

  renderLoadingSwitch() {
    if (this.state.loading) return <ActivityIndicator />;
    return (
      <>
        <FlatList
          ref={list => (this.flatList = list)}
          data={this.slides}
          renderItem={({item, index}) => this.renderSlide(item, index)}
          viewabilityConfig={{viewAreaCoveragePercentThreshold: 100}}
          onViewableItemsChanged={this.onViewChange}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: this.scrollAnim}}}],
            {useNativeDriver: false},
          )}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          horizontal
        />
        <View style={sty.indicatorContainer}>{this.renderIndicator()}</View>
      </>
    );
  }

  render() {
    let bg = this.scrollAnim.interpolate({
      inputRange: this.slides.map((v, i) => i * c.device.width),
      outputRange: this.slides.map(v => v.color),
    });
    return (
      <Animated.View style={[sty.container, {backgroundColor: bg}]}>
        {this.renderLoadingSwitch()}
      </Animated.View>
    );
  }
}

const sty = {
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  slide: {
    width: c.device.width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '85%',
    aspectRatio: 1,
    borderRadius: c.device.width,
    backgroundColor: 'white',
    opacity: 0.2,
  },
  indicatorContainer: {
    ...c.center,
    padding: 10,
    borderTopWidth: 0.5,
    flexDirection: 'row',
  },
  indicatorIcon: {
    marginHorizontal: 15,
  },
  completeButton: {
    ...c.center,
    elevation: 3,
    height: 45,
    borderRadius: 10,
    marginVertical: 10,
    width: '70%',
  },
};

export default Tutorial;
