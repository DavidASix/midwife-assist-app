import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  UIManager,
  LayoutAnimation,
  Platform,
  ToastAndroid,
} from 'react-native';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcons from 'react-native-vector-icons/MaterialIcons';
import SIcon from 'react-native-vector-icons/SimpleLineIcons';
const c = require('../../assets/constants');
import SlideUpModal from '../../SlideUpModal/';
import SVGIcon from '../../components/SVGIcon/';

const Github = 'http://www.github.com/davidasix';
const Instagram = 'http://www.instagram.com/dave6dev';
const Website = 'http://www.dave6.com/';
const Email = 'mailto:developer@dave6.ca';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      starSelected: 0,
      complaint: '',
    };
  }

  onPressChangeAuth = () => {
    this.props.updateAuthType(null);
    this.props.navigation.navigate('auth');
  };

  onPressStar(num) {
    LayoutAnimation.configureNext({
      duration: 700,
      create: {type: 'spring', springDamping: 0.4, property: 'scaleY'},
      update: {type: 'spring', springDamping: 0.4},
    });
    LayoutAnimation.configureNext({
      duration: 50,
      delete: {type: 'easeIn', springDamping: 0.4, property: 'scaleY'},
    });
    this.setState({starSelected: num});
    if (num > 3) {
      // Allow a delay before switching apps, so that the user can see and visualize the 5 stars
      setTimeout(
        () =>
          Linking.openURL(
            'https://play.google.com/store/apps/details?id=com.dave6.www.midwifeassist',
          ),
        400,
      );
    } else {
      this.rating.onPressButton('up');
    }
  }

  onPressSubmitComment = () => {
    this.rating.onPressButton();
    setTimeout(
      () =>
        ToastAndroid.showWithGravityAndOffset(
          'Thank you for your feeback!',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
        ),
      650,
    );
  };

  stars() {
    let {theme} = this.props;
    let stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <MIcons
          onPress={() => this.onPressStar(i + 1)}
          name={this.state.starSelected >= i + 1 ? 'star' : 'star-border'}
          size={45}
          color={
            this.state.starSelected >= i + 1
              ? c.themes[theme].accent
              : c.themes[theme].text
          }
        />,
      );
    }
    return stars;
  }

  renderRatingModal() {
    let thm = c.themes[this.props.theme];
    return (
      <SlideUpModal
        ref={ref => (this.rating = ref)}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: '93%',
          minHeight: 300,
          padding: 15,
          borderRadius: 10,
          borderWidth: 0.5,
          elevation: 4,
          backgroundColor: thm.modal,
          borderColor: thm.border,
        }}
        peek={0}>
        <Text style={{color: thm.text, marginVertical: 10}}>
          Tell us what you think!
        </Text>

        {this.state.starSelected && this.state.starSelected < 4 ? (
          <>
            <TouchableOpacity
              style={[
                sty.row,
                {
                  marginVertical: 10,
                  justifyContent: 'center',
                  backgroundColor: thm.accent,
                  borderColor: thm.border,
                },
              ]}
              onPress={this.onPressSubmitComment}>
              <Text style={{color: c.themes.dark.text}}>Submit Rating</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                sty.row,
                {
                  marginVertical: 10,
                  justifyContent: 'center',
                  backgroundColor: thm.accent,
                  borderColor: thm.border,
                },
              ]}
              onPress={() =>
                Linking.openURL(
                  'mailto:developer@dave6.ca?subject=Midwife Assist - Comment',
                )
              }>
              <Text style={{color: c.themes.dark.text}}>Contact Developer</Text>
            </TouchableOpacity>
          </>
        ) : null}
        <View style={[sty.row, {marginVertical: 10, borderWidth: 0}]}>
          {this.stars()}
        </View>
      </SlideUpModal>
    );
  }

  render() {
    let {theme} = this.props;
    let thm = c.themes[this.props.theme];
    const invertTheme = theme === 'light' ? 'dark' : 'light';
    return (
      <View style={[sty.container, {backgroundColor: thm.background}]}>
        <View style={sty.header}>
          {/** background start **/}
          <View
            style={{
              backgroundColor: thm.accent,
              position: 'absolute',
              top: 0,
              width: '100%',
              height: '75%',
            }}
          />
          <SVGIcon
            name="stackedWaves"
            color={thm.accent}
            style={{
              transform: [{rotate: '180deg'}],
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: '75%',
            }}
          />
          {/** Background End **/}
          {/** headerContent Start **/}
          <Text
            style={[
              {
                color: thm.lightText,
                fontSize: 24,
                marginLeft: 15,
              },
              c.titleFont,
            ]}>
            Settings
          </Text>
          {/** headerContent End **/}
        </View>

        <View style={[sty.body]}>
          <TouchableOpacity
            onPress={() => this.props.changeTheme(invertTheme)}
            style={[
              sty.row,
              {
                backgroundColor: thm.background,
                borderColor: thm.border,
              },
            ]}>
            <Text style={[sty.buttonText, {color: thm.text}]}>
              {invertTheme.charAt(0).toUpperCase() + invertTheme.substr(1)}{' '}
              Theme
            </Text>
            <MCIcons name="theme-light-dark" size={30} color={thm.text} />
          </TouchableOpacity>
        </View>

        <View
          style={[
            sty.body,
            {
              backgroundColor: thm.modal,
              borderColor: thm.border,
            },
          ]}>
          {this.props.authType !== 'none' && (
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('auth')}
              style={[
                sty.row,
                {
                  backgroundColor: thm.background,
                  borderColor: thm.border,
                },
              ]}>
              <Text style={[sty.buttonText, {color: thm.text}]}>Logout</Text>
              <MCIcons name="logout" size={30} color={thm.text} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={this.onPressChangeAuth}
            style={[
              sty.row,
              {
                backgroundColor: thm.background,
                borderColor: thm.border,
              },
            ]}>
            <Text style={[sty.buttonText, {color: thm.text}]}>
              Change Security Option
            </Text>
            <MCIcons name="lock" size={30} color={thm.text} />
          </TouchableOpacity>
        </View>

        <View
          style={[
            sty.body,
            {
              backgroundColor: thm.modal,
              borderColor: thm.border,
            },
          ]}>
          <TouchableOpacity
            onPress={() => this.rating.onPressButton()}
            style={[
              sty.row,
              {
                backgroundColor: thm.background,
                borderColor: thm.border,
              },
            ]}>
            <Text style={[sty.buttonText, {color: thm.text}]}>
              Rate this App
            </Text>
            <MCIcons name="star-outline" size={30} color={thm.text} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Linking.openURL('https://www.dave6.com')}
            style={[
              sty.row,
              {
                backgroundColor: thm.background,
                borderColor: thm.border,
              },
            ]}>
            <Text style={[sty.buttonText, {color: thm.text}]}>
              Developers Website
            </Text>
            <MCIcons name="web" size={30} color={thm.text} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                'mailto:davidandersonsix@gmail.com?subject=Regarding Midwife Assist App',
              )
            }
            style={[
              sty.row,
              {
                backgroundColor: thm.background,
                borderColor: thm.border,
              },
            ]}>
            <Text style={[sty.buttonText, {color: thm.text}]}>
              Contact Developer
            </Text>
            <MCIcons name="email-outline" size={30} color={thm.text} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 7,
            bottom: 0,
            width: '100%',
            backgroundColor: thm.modal,
          }}>
          <SVGIcon
            name="tabBarDivider"
            style={{
              position: 'absolute',
              top: -15,
              height: 15,
              width: '100%',
              transform: [{scaleX: -1}],
            }}
            color={thm.modal}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
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
  },
  sectionTop: {
    height: 10,
    width: '95%',
    justifyContent: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  body: {
    flex: 0,
    width: '95%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderWidth: 1,
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    elevation: 1,
  },
  row: {
    width: '100%',
    height: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 2.5,
  },
  button: {
    height: 45,
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
  },
  textInput: {
    flex: 1,
    borderBottomWidth: 1,
    textAlign: 'left',
    fontSize: 12,
  },
};

export default Settings;
