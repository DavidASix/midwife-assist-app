import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  UIManager,
  LayoutAnimation,
  Platform,
  Alert,
} from 'react-native';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
//import FingerprintScanner from 'react-native-fingerprint-scanner';
const c = require('../../assets/constants');

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}


class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bio: null,
      pin: '',
      loading: false,
      showNewPinInputs: false,
    };
  }

  async componentDidMount() {
    let {authType} = this.props;
    if (authType === 'none') {
      this.props.navigation.navigate('tabs');
    } else {
      try {
        /*
        let sensor = await FingerprintScanner.isSensorAvailable();
        this.setState({ bio: sensor });*/
      } catch (err) {
        this.setState({bio: false});
      }
    }
  }

  onPressBiometric = async () => {
    /*
    try {
      let auth = await FingerprintScanner.authenticate({
        description: 'Scan your finger to enable biometric security.',
        fallbackEnabled: false
      });
      let sensor = await FingerprintScanner.isSensorAvailable();
      // Fingerprint scanner must be released or the process does not end when user presses cancel or scans fingerprint
      // If process is not over on next bio press the modal will show but promise will not resolve
      FingerprintScanner.release();
      if (auth) {
        this.props.login();
        this.props.updateAuthType(sensor);
        this.props.navigation.navigate('tabs');
      }
    } catch (err) {
      FingerprintScanner.release();
    }*/
  };

  onPressNoSecurity = () => {
    this.setState({loading: false, pin: '', showNewPinInputs: false});
    this.props.updateAuthType('none');
    this.props.navigation.navigate('tabs');
  };

  onPressSubmitNewPin = () => {
    let pin = String(this.state.pin);
    this.setState({loading: true});
    setTimeout(() => {
      this.setState({loading: false, pin: '', showNewPinInputs: false});
      if (pin.length === 4 && pin.match(/^\d+$/)) {
        this.props.updateAuthType('pin', pin);
        this.props.login();
        Alert.alert(
          `Your PIN is set to: ${pin}`,
          "To protect client information there is no PIN recovery option. Don't forget it!",
          [{text: 'OK', onPress: () => this.props.navigation.navigate('tabs')}],
        );
      } else {
        this.setState({showNewPinInputs: true});
        Alert.alert(
          'Issue with PIN',
          "PIN's must be 4 numbers. Please try again.",
        );
      }
    });
  };

  onPinTextChange(newPin) {
    this.setState({pin: newPin});

    if (newPin.length === 4) {
      this.setState({loading: true});
      setTimeout(() => {
        this.setState({pin: '', loading: false});
        if (newPin === this.props.pin) {
          this.props.login();
          this.props.navigation.navigate('tabs');
        } else {
          Alert.alert('PIN is Incorrect', 'Please try again.');
        }
      }, 750);
    }
  }

  renderNullAuth() {
    const thm = c.themes[this.props.theme];
    return (
      <View
        style={{justifyContent: 'center', alignItems: 'center', width: '100%'}}>
        <TouchableOpacity
          onPress={() => {
            LayoutAnimation.configureNext({
              duration: 700,
              create: {type: 'spring', springDamping: 0.4, property: 'scaleY'},
              update: {type: 'spring', springDamping: 0.4},
            });
            LayoutAnimation.configureNext({
              duration: 50,
              delete: {type: 'easeIn', springDamping: 0.4, property: 'scaleY'},
            });
            this.setState({showNewPinInputs: !this.state.showNewPinInputs});
          }}
          style={[sty.button, {backgroundColor: thm.accent}]}>
          <MCIcons
            style={{position: 'absolute', left: 5}}
            size={30}
            color={thm.lightText}
            name="lock-smart"
          />
          <Text style={{fontSize: 16, color: thm.lightText}}>Set a PIN</Text>
        </TouchableOpacity>

        {this.state.showNewPinInputs && (
          <>
            <View
              style={{
                ...c.center,
                width: '70%',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View
                style={[
                  sty.button,
                  {
                    flex: 1,
                    backgroundColor: thm.accent,
                    height: 60,
                  },
                ]}>
                <TextInput
                  onChangeText={text => this.setState({pin: text})}
                  keyboardType="number-pad"
                  keyboardAppearance={this.props.theme}
                  returnKeyType="go"
                  textAlign="center"
                  placeholder="PIN"
                  value={this.state.pin}
                  maxLength={4}
                  placeholderTextColor={thm.lightText + '60'}
                  style={[
                    sty.pinInput,
                    {
                      color: thm.lightText,
                      borderColor: thm.lightText,
                    },
                  ]}
                />
              </View>
              <TouchableOpacity
                style={[
                  sty.button,
                  {
                    marginLeft: 10,
                    height: 40,
                    width: 40,
                    borderRadius: 30,
                    backgroundColor: thm.accent,
                  },
                ]}
                onPress={this.onPressSubmitNewPin}>
                {this.state.loading ? (
                  <ActivityIndicator color={thm.lightText} size="small" />
                ) : (
                  <MCIcons
                    size={30}
                    name="chevron-double-right"
                    color={thm.lightText}
                  />
                )}
              </TouchableOpacity>
            </View>

            <Text
              style={{
                fontSize: 12,
                color: thm.text,
                fontFamily: 'ZillaSlab',
              }}>
              Do not forget this PIN!
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: thm.text,
                fontFamily: 'ZillaSlab',
              }}>
              To protect client information there is no PIN recovery option.
            </Text>
          </>
        )}

        {this.state.bio && (
          <TouchableOpacity
            onPress={this.onPressBiometric}
            style={[sty.button, {backgroundColor: thm.accent}]}>
            <MCIcons
              style={{position: 'absolute', left: 5}}
              size={30}
              color={thm.lightText}
              name="fingerprint"
            />
            <Text style={{fontSize: 16, color: thm.lightText}}>
              Use Biometrics
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={this.onPressNoSecurity}
          style={[sty.button, {backgroundColor: thm.accent}]}>
          <MCIcons
            style={{position: 'absolute', left: 5}}
            size={30}
            color={thm.lightText}
            name="lock-open"
          />
          <Text style={{fontSize: 16, color: thm.lightText}}>No security</Text>
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 12,
            color: thm.text,
            fontFamily: 'ZillaSlab',
          }}>
          (You can change this later in Settings)
        </Text>
      </View>
    );
  }

  renderEnterPin() {
    const thm = c.themes[this.props.theme];
    return (
      <View
        style={{justifyContent: 'center', alignItems: 'center', width: '100%'}}>
        <View style={[sty.button, {backgroundColor: thm.accent, height: 60}]}>
          <TextInput
            onChangeText={text => this.onPinTextChange(text)}
            keyboardType="number-pad"
            keyboardAppearance={this.props.theme}
            returnKeyType="go"
            textAlign="center"
            placeholder="PIN"
            value={this.state.pin}
            maxLength={4}
            placeholderTextColor={thm.lightText + '60'}
            style={[
              sty.pinInput,
              {
                color: thm.lightText,
                borderColor: thm.lightText,
              },
            ]}
          />

          {this.state.loading && (
            <View style={{position: 'absolute', right: 15}}>
              <ActivityIndicator color={thm.lightText} size="small" />
            </View>
          )}
        </View>
      </View>
    );
  }

  renderBioAuth() {
    const thm = c.themes[this.props.theme];
    return (
      <View
        style={{justifyContent: 'center', alignItems: 'center', width: '100%'}}>
        <TouchableOpacity
          onPress={this.onPressBiometric}
          style={[sty.button, {backgroundColor: thm.accent}]}>
          <MCIcons
            style={{position: 'absolute', left: 5}}
            size={30}
            color={thm.lightText}
            name="fingerprint"
          />
          <Text style={{fontSize: 16, color: thm.lightText}}>
            Login with Biometrics
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderSwitch() {
    switch (this.props.authType) {
      case null:
        return <>{this.renderNullAuth()}</>;
      case 'none':
        return <>{this.renderNullAuth()}</>;
      case 'pin':
        return <>{this.renderEnterPin()}</>;
      default:
        return <>{this.renderBioAuth()}</>;
    }
  }

  render() {
    const thm = c.themes[this.props.theme];
    return (
      <View style={[sty.container, {backgroundColor: thm.background}]}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text
            style={{
              fontSize: 42,
              color: thm.text,
              fontFamily: 'ZillaSlab',
            }}>
            Midwife
          </Text>
          <Text
            style={{
              fontSize: 20,
              color: thm.text,
              fontFamily: 'ZillaSlab',
            }}>
            Assist
          </Text>
        </View>
        {this.renderSwitch()}
      </View>
    );
  }
}

const sty = {
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-around',
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
    justifyContent: 'space-around',
  },
  pinInput: {
    width: '90%',
    height: '80%',
    borderBottomWidth: 1,
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
  button: {
    ...c.center,
    elevation: 3,
    height: 45,
    borderRadius: 10,
    width: '70%',
    marginVertical: 10,
  },
};

export default Auth;
