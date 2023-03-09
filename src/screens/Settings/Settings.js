import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Linking,
  BackHandler,
} from 'react-native';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SIcon from 'react-native-vector-icons/SimpleLineIcons';
const c = require('../../assets/constants');
import SlideUpModal from '../../components/SlideUpModal/';
import SVGIcon from '../../components/SVGIcon/';

const Github = 'http://www.github.com/davidasix';
const Instagram = 'http://www.instagram.com/dave6dev';
const Website = 'http://www.dave6.com/';
const Email = 'mailto:developer@dave6.ca';
const FeatureRequest =
  'mailto:developer@dave6.ca?subject=Midwife Assist - Feature Request';
const StorePage =
  'https://play.google.com/store/apps/details?id=com.dave6.www.midwifeassist';
const ContactDev = 'mailto:developer@dave6.ca?subject=Midwife Assist';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      starSelected: 0,
      complaint: '',
    };
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.state.backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => this.onPressBack(),
      );
    });
    this.blurListener = this.props.navigation.addListener('blur', () => {
      this.state.backHandler.remove();
    });
  }

  componentWillUnmount() {
    this.focusListener();
    this.blurListener();
  }

  onPressBack() {
    if (this.rating.visible()) {
      this.rating.changeVisibility();
    }
    return true;
  }

  onPressChangeAuth = () => {
    this.props.updateAuthType(null);
    this.props.navigation.navigate('auth');
  };

  onPressThumb = dir => {
    if (dir === 'up') Linking.openURL(StorePage);
    else {
      Alert.alert(
        'Sorry to hear that!',
        'How can we make it better?',
        [
          {
            text: 'Submit Review',
            onPress: () => Linking.openURL(StorePage),
          },
          {
            text: 'Add a Feature',
            onPress: () => Linking.openURL(FeatureRequest),
          },
          {
            text: 'Contact Developer',
            onPress: () => Linking.openURL(ContactDev),
          },
        ],
        {cancelable: true},
      );
    }
  };

  renderRatingModal() {
    let thm = c.themes[this.props.theme];
    return (
      <SlideUpModal
        ref={ref => (this.rating = ref)}
        style={[sty.rmo, {backgroundColor: thm.modal, borderColor: thm.border}]}
        peek={0}>
        <Text style={{color: thm.text}}>How has your experience been?</Text>

        <View style={sty.thumbRow}>
          <TouchableOpacity
            onPress={() => this.onPressThumb('down')}
            style={[sty.button, sty.thumbButton, {backgroundColor: thm.bad}]}>
            <Text style={{fontSize: 40}}>👎</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.onPressThumb('up')}
            style={[sty.button, sty.thumbButton, {backgroundColor: thm.good}]}>
            <Text style={{fontSize: 40}}>👍</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => Linking.openURL(ContactDev)}
          style={[sty.button, {backgroundColor: thm.modal}]}>
          <Text style={[sty.buttonText, {color: thm.text}]}>
            Contact Developer
          </Text>
          <SIcon name="bubble" size={25} color={thm.text} />
        </TouchableOpacity>
      </SlideUpModal>
    );
  }

  render() {
    let thm = c.themes[this.props.theme];
    const invertTheme = this.props.theme === 'light' ? 'dark' : 'light';
    return (
      <View style={[sty.container, {backgroundColor: thm.background}]}>
        <View style={sty.header}>
          {/** background start **/}
          <View style={[sty.headerBg.solid, {backgroundColor: thm.accent}]} />
          <SVGIcon
            name="stackedWaves"
            color={thm.accent}
            style={sty.headerBg.svg}
          />
          {/** Background End **/}
          {/** headerContent Start **/}
          <Text style={[{color: thm.lightText}, c.titleFont, sty.title]}>
            Settings
          </Text>
          {/** headerContent End **/}
        </View>
        <View style={{flex: 0, width: '100%', alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => this.props.changeTheme(invertTheme)}
            style={[sty.button, {backgroundColor: thm.modal}]}>
            <Text style={[sty.buttonText, {color: thm.text}]}>
              {invertTheme.charAt(0).toUpperCase() + invertTheme.substr(1)}{' '}
              Theme
            </Text>
            <MCIcons name="theme-light-dark" size={25} color={thm.text} />
          </TouchableOpacity>

          {this.props.authType !== 'none' && (
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('auth')}
              style={[sty.button, {backgroundColor: thm.modal}]}>
              <Text style={[sty.buttonText, {color: thm.text}]}>Logout</Text>
              <MCIcons name="logout" size={25} color={thm.text} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={this.onPressChangeAuth}
            style={[sty.button, {backgroundColor: thm.modal}]}>
            <Text style={[sty.buttonText, {color: thm.text}]}>
              Change Security Option
            </Text>
            <SIcon name="lock" size={25} color={thm.text} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.rating.changeVisibility()}
            style={[sty.button, {backgroundColor: thm.modal}]}>
            <Text style={[sty.buttonText, {color: thm.text}]}>
              Rate this App
            </Text>
            <SIcon name="star" size={25} color={thm.text} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Linking.openURL(FeatureRequest)}
            style={[sty.button, {backgroundColor: thm.modal}]}>
            <Text style={[sty.buttonText, {color: thm.text}]}>
              Feature Request
            </Text>
            <SIcon name="plus" size={25} color={thm.text} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('tutorial')}
            style={[sty.button, {backgroundColor: thm.modal}]}>
            <Text style={[sty.buttonText, {color: thm.text}]}>
              View Welcome Screen
            </Text>
            <SIcon name="loop" size={25} color={thm.text} />
          </TouchableOpacity>
        </View>

        {/**
        <View style={sty.statsContainer}>
          <Text style={{fontSize: 32, color: thm.accent}}>Stats</Text>
        </View>
        **/}

        <View style={[sty.linkBar, {backgroundColor: thm.modal}]}>
          <SVGIcon
            name="tabBarDivider"
            style={sty.linkBarDivider}
            color={thm.modal}
          />
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <SIcon
              name="social-github"
              size={25}
              color={thm.text}
              style={{marginHorizontal: 15}}
              onPress={() => Linking.openURL(Github)}
            />
            <SIcon
              name="screen-desktop"
              size={25}
              color={thm.text}
              style={{marginHorizontal: 15}}
              onPress={() => Linking.openURL(Website)}
            />
            <SIcon
              name="social-instagram"
              size={25}
              color={thm.text}
              style={{marginHorizontal: 15}}
              onPress={() => Linking.openURL(Instagram)}
            />
            <SIcon
              name="envelope"
              size={25}
              color={thm.text}
              style={{marginHorizontal: 15}}
              onPress={() => Linking.openURL(Email)}
            />
          </View>
          <Text style={{marginTop: 0, color: thm.text, fontSize: 14}}>
            Created by Dave6
          </Text>
        </View>
        {this.renderRatingModal()}
      </View>
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
  header: {
    height: 37,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  headerBg: {
    solid: {
      position: 'absolute',
      top: 0,
      width: '100%',
      height: '75%',
    },
    svg: {
      transform: [{rotate: '180deg'}],
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: '75%',
    },
  },
  title: {
    fontSize: 24,
    marginLeft: 15,
  },
  button: {
    width: '95%',
    height: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 2.5,
  },
  buttonText: {
    fontSize: 16,
  },
  statsContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'flex-start',
    borderWidth: 1,
  },
  linkBar: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 7,
    bottom: 0,
    width: '100%',
  },
  linkBarDivider: {
    position: 'absolute',
    top: -15,
    height: 15,
    width: '100%',
    transform: [{scaleX: -1}],
  },
  rmo: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '93%',
    flex: 0,
    padding: 15,
    borderRadius: 10,
    borderWidth: 0.5,
    elevation: 4,
  },
  thumbRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  thumbButton: {
    width: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1,
  },
};

export default Settings;
