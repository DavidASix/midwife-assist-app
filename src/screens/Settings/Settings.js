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
const c = require('../../assets/constants');
import SlideUpModal from '../../SlideUpModal/';

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
    //
    let {theme} = this.props;
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
          backgroundColor: c.themes[theme].background,
          borderColor: c.themes[theme].border,
        }}
        peek={0}>
        <Text style={{color: c.themes[theme].text, marginVertical: 10}}>
          Tell us what you think!
        </Text>

        {this.state.starSelected && this.state.starSelected < 4 ? (
          <>
            <TouchableOpacity
              style={[
                styles.row,
                {
                  marginVertical: 10,
                  justifyContent: 'center',
                  backgroundColor: c.themes[theme].accent,
                  borderColor: c.themes[theme].border,
                },
              ]}
              onPress={this.onPressSubmitComment}>
              <Text style={{color: c.themes.dark.text}}>Submit Rating</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.row,
                {
                  marginVertical: 10,
                  justifyContent: 'center',
                  backgroundColor: c.themes[theme].accent,
                  borderColor: c.themes[theme].border,
                },
              ]}
              onPress={() =>
                Linking.openURL(
                  'mailto:davidandersonsix@gmail.com?subject=Midwife Assist - Comment',
                )
              }>
              <Text style={{color: c.themes.dark.text}}>Contact Developer</Text>
            </TouchableOpacity>
          </>
        ) : null}
        <View style={[styles.row, {marginVertical: 10, borderWidth: 0}]}>
          {this.stars()}
        </View>
      </SlideUpModal>
    );
  }

  render() {
    let {theme} = this.props;
    const invertTheme = theme === 'light' ? 'dark' : 'light';
    return (
      <View
        style={[
          styles.container,
          {backgroundColor: c.themes[theme].background},
        ]}>
        <View
          style={[styles.header, {backgroundColor: c.themes[theme].accent}]}>
          <View style={{flex: 1, width: '100%', justifyContent: 'center'}}>
            <Text
              style={[
                {
                  color: c.themes[theme].lightText,
                  fontSize: 36,
                  marginLeft: 20,
                },
                c.titleFont,
              ]}>
              Settings
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.body,
            {
              backgroundColor: c.themes[theme].modal,
              borderColor: c.themes[theme].border,
            },
          ]}>
          <TouchableOpacity
            onPress={() => this.props.changeTheme(invertTheme)}
            style={[
              styles.row,
              {
                backgroundColor: c.themes[theme].background,
                borderColor: c.themes[theme].border,
              },
            ]}>
            <Text style={[styles.buttonText, {color: c.themes[theme].text}]}>
              {invertTheme.charAt(0).toUpperCase() + invertTheme.substr(1)}{' '}
              Theme
            </Text>
            <MCIcons
              name="theme-light-dark"
              size={30}
              color={c.themes[theme].text}
            />
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.body,
            {
              backgroundColor: c.themes[theme].modal,
              borderColor: c.themes[theme].border,
            },
          ]}>
          {this.props.authType !== 'none' && (
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('auth')}
              style={[
                styles.row,
                {
                  backgroundColor: c.themes[theme].background,
                  borderColor: c.themes[theme].border,
                },
              ]}>
              <Text style={[styles.buttonText, {color: c.themes[theme].text}]}>
                Logout
              </Text>
              <MCIcons name="logout" size={30} color={c.themes[theme].text} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={this.onPressChangeAuth}
            style={[
              styles.row,
              {
                backgroundColor: c.themes[theme].background,
                borderColor: c.themes[theme].border,
              },
            ]}>
            <Text style={[styles.buttonText, {color: c.themes[theme].text}]}>
              Change Security Option
            </Text>
            <MCIcons name="lock" size={30} color={c.themes[theme].text} />
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.body,
            {
              backgroundColor: c.themes[theme].modal,
              borderColor: c.themes[theme].border,
            },
          ]}>
          <TouchableOpacity
            onPress={() => this.rating.onPressButton()}
            style={[
              styles.row,
              {
                backgroundColor: c.themes[theme].background,
                borderColor: c.themes[theme].border,
              },
            ]}>
            <Text style={[styles.buttonText, {color: c.themes[theme].text}]}>
              Rate this App
            </Text>
            <MCIcons
              name="star-outline"
              size={30}
              color={c.themes[theme].text}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Linking.openURL('https://www.dave6.com')}
            style={[
              styles.row,
              {
                backgroundColor: c.themes[theme].background,
                borderColor: c.themes[theme].border,
              },
            ]}>
            <Text style={[styles.buttonText, {color: c.themes[theme].text}]}>
              Developers Website
            </Text>
            <MCIcons name="web" size={30} color={c.themes[theme].text} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                'mailto:davidandersonsix@gmail.com?subject=Regarding Midwife Assist App',
              )
            }
            style={[
              styles.row,
              {
                backgroundColor: c.themes[theme].background,
                borderColor: c.themes[theme].border,
              },
            ]}>
            <Text style={[styles.buttonText, {color: c.themes[theme].text}]}>
              Contact Developer
            </Text>
            <MCIcons
              name="email-outline"
              size={30}
              color={c.themes[theme].text}
            />
          </TouchableOpacity>
        </View>
        {this.renderRatingModal()}
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
  header: {
    height: 65,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
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
