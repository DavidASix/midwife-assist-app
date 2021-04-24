import React, { Component } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  FlatList,
  SectionList,
  Dimensions
} from 'react-native';
import DatePicker from 'react-native-date-picker'
import { Dropdown } from 'react-native-material-dropdown';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const c = require('../../assets/constants');

class Tutorial extends Component {
  constructor(props) {
    super(props);
    this.window = Dimensions.get('window');
    this.flatList;
    this.slides = [
      {
        title: 'Midwife Assist',
        description: 'Welcome to Midwife Assist, an app dedicated to assisting midwives in their day to day.',
        image: require('../../assets/phone.png'),
        iconName: 'mother-nurse',
      },
      {
        title: 'Do calculations',
        description: 'Say goodbye to OB wheels! You can easily convert estimated delivery date, gestational age, and last menstrual periods.',
        image: require('../../assets/calc.png'),
        iconName: 'calculator-variant',
      },
      {
        title: 'Store client information',
        description: 'Safely store your client information for later, locking it behind a pin or bio-metric scan.',
        image: require('../../assets/lock.png'),
        iconName: 'account-group',
      },
      {
        title: 'Never connect to a network',
        description: 'You can rest assured that your patients data is safe, as this app does not connect to the internet at all.',
        image: require('../../assets/nosignal.png'),
        iconName: 'access-point-network-off',
      }
    ]
    this.state = {
      page: 0,
      loading: true
    };
  }

  componentDidMount() {
    //console.log('tutorial');
    this.props.refreshStore();
    if (!this.props.firstLogin) {
      this.props.navigation.navigate('auth');
    } else {
      this.setState({ loading: false });
    }
  }

  onViewChange = (item) => this.setState({ page: item.changed[0].index });

  onPressFinalPage = () => {
    this.props.markFirstLogin();
    this.props.navigation.navigate('auth')
  }

  renderSlide(slide, i) {
    let { theme, clients } = this.props;
    let { page } = this.state;
    const Final = () =>  i === this.slides.length - 1 ?
    (<TouchableOpacity
        onPress={this.onPressFinalPage}
        style={[styles.completeButton, { backgroundColor: c.themes[theme].accent }]}>
      <Text style={{ color: c.themes[theme].lightText }}>
        Lets go
      </Text>
    </TouchableOpacity>)
    : null;
    return (
      <View style={{ width: this.window.width, justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.slide}>
          <View style={{ paddingVertical: 10, flex: 0, width: '90%', borderBottomWidth: 0.5, justifyContent: 'center' }}>
            <Text style={{ color: c.themes[theme].text }}>
              {i + 1} of {this.slides.length}
            </Text>
          </View>
          <View style={styles.slideContent}>
            <View style={{ flex: 1, ...c.center }}>
              <Image
                source={slide.image}
                style={{ height: '80%' }}
                resizeMode='contain' />
            </View>
            <View style={{ flex: 2, justifyContent: 'center' }}>
              <Text style={{ fontSize: 26, color: c.themes[theme].text, marginVertical: 10 }}>
                {slide.title}
              </Text>
              <Text style={{ color: c.themes[theme].text }}>
                {slide.description}
              </Text>
            </View>
            <View style={{ flex: 1, ...c.center }}>
              <Final />
            </View>
          </View>
        </View>
      </View>
    )
  }

  renderIndicator() {
    let { theme, clients } = this.props;
    let { page } = this.state;
    const size = 30;
    const indicatorColor = (j) => j === page ? c.themes[theme].accent : c.themes[theme].text;
    return this.slides.map((slide, i) => (
      <TouchableOpacity
        onPress={() => this.flatList.scrollToIndex({ index: i })}>
        <MCIcons
          style={styles.indicatorIcon}
          size={size}
          color={indicatorColor(i)}
          name={slide.iconName} />
      </TouchableOpacity>
    ))
  }

  renderLoadingSwitch() {
    let { theme, clients } = this.props;
    let { page } = this.state;
    if (this.state.loading) {
      return (
        <ActivityIndicator />
      );
    }
    return (
      <>
        <FlatList
          ref={(list) => this.flatList = list}
          data={this.slides}
          renderItem={({ item, index }) => this.renderSlide(item, index)}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 100 }}
          onViewableItemsChanged={this.onViewChange}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          horizontal />
        <View style={styles.indicatorContainer}>
          {this.renderIndicator()}
        </View>
      </>
    )
  }

  render() {
    let { theme, clients } = this.props;
    let { page } = this.state;
    return (
      <View style={[styles.container, { backgroundColor: c.themes[theme].background }]}>
        {this.renderLoadingSwitch()}
      </View>
    );
  }
}


const styles = {
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  slide: {
    height: '100%',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  slideContent: {
    paddingVertical: 10,
    flex: 1,
    width: '90%',
    justifyContent: 'space-around'
  },
  indicatorContainer: {
    ...c.center,
    padding: 10,
    borderTopWidth: 0.5,
    flexDirection: 'row',
  },
  indicatorIcon: {
    marginHorizontal: 15
  },
  completeButton: {
    ...c.center,
    elevation: 3,
    height: 45,
    borderRadius: 10,
    width: '70%'
  },
};


export default Tutorial;
