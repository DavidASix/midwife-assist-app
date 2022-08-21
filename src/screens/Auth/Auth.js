import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import ReactNativeBiometrics from 'react-native-biometrics';
const rnBiometrics = new ReactNativeBiometrics();

import SlideUpModal from '../../components/SlideUpModal/';
const c = require('../../assets/constants');

class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bio: null,
      pin: '',
      loading: false,
    };
    this.pinModal = null;
    this.authTypes = [
      {
        title: 'Pin',
        icon: 'lock-smart',
        onPressVal: 'pin',
        showButton: true,
      },
      {
        title: 'Biometric',
        icon: 'fingerprint',
        onPressVal: 'bio',
        showButton: this.state.bio,
      },
      {
        title: 'No security',
        icon: 'lock-open',
        onPressVal: 'none',
        showButton: true,
      },
    ];
  }

  async componentDidMount() {
    if (this.props.authType === 'none') {
      this.props.navigation.navigate('tabs');
    } else {
      try {
        // If implementing on iOS then need to update this to handle diff bios
        //https://github.com/SelfLender/react-native-biometrics
        let sensor = await rnBiometrics.isSensorAvailable();
        this.setState({bio: sensor.biometryType});
      } catch (err) {
        this.setState({bio: false});
      }
    }
  }

  onPressNewAuthType(type) {
    switch (type) {
      case 'pin':
        this.onPressNewPin();
        break;
      case 'bio':
        this.onPressBiometric();
        break;
      case 'none':
        this.onPressNoSecurity();
        break;
      default:
        Toast.show({type: 'error', text1: 'Invalid authentication type'});
    }
  }

  onPressNewPin = () => {
    this.pinModal.changeVisibility();
  };

  onPressBiometric = async () => {
    let promptMessage = this.props.authType
      ? 'Confirm Fingerprint'
      : 'Scan fingerprint to enable biometrics';
    try {
      let prompt = await rnBiometrics.simplePrompt({promptMessage});
      if (prompt.success) {
        this.props.login();
        this.props.updateAuthType('biometric');
        this.props.navigation.navigate('tabs');
      } else {
        Toast.show({type: 'error', text1: prompt.error});
      }
    } catch (e) {
      Toast.show({type: 'error', text1: e});
    }
  };

  onPressNoSecurity = () => {
    this.setState({loading: false, pin: ''});
    this.props.updateAuthType('none');
    this.props.navigation.navigate('tabs');
  };

  onPressSubmitNewPin = () => {
    // Attempting to set a new pin
    let pin = String(this.state.pin);
    this.setState({loading: true});
    setTimeout(() => {
      this.setState({loading: false, pin: ''});
      if (pin.length === 4 && pin.match(/^\d+$/)) {
        this.props.updateAuthType('pin', pin);
        this.props.login();
        this.pinModal.changeVisibility('down');
        Alert.alert(
          `Your PIN is set to: ${pin}`,
          "To protect client information there is no PIN recovery option. Don't forget it!",
          [{text: 'OK', onPress: () => this.props.navigation.navigate('tabs')}],
        );
      } else {
        Toast.show({
          type: 'error',
          text1: 'Issue with PIN',
          text2: "PIN's must be 4 numbers. Please try again.",
        });
      }
    });
  };

  onPinAuthAttemptChangeText(newPin) {
    // Attempting to authenticate an exisisting pin
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

  renderSwitch() {
    const thm = c.themes[this.props.theme];
    switch (this.props.authType) {
      case 'biometric':
        return (
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
        );
      case 'pin':
        return (
          <View style={[sty.button, sty.pinC, {backgroundColor: thm.accent}]}>
            <TextInput
              onChangeText={text => this.onPinAuthAttemptChangeText(text)}
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
        );
      case 'none':
        return null;
      default: // authType is null, return login form
        return this.authTypes.map(
          (type, i) =>
            type.showButton && (
              <TouchableOpacity
                key={i}
                onPress={() => this.onPressNewAuthType(type.onPressVal)}
                style={[sty.button, {backgroundColor: thm.accent}]}>
                <MCIcons
                  style={{position: 'absolute', left: 5}}
                  size={30}
                  color={thm.lightText}
                  name={type.icon}
                />
                <Text style={{fontSize: 16, color: thm.lightText}}>
                  {type.title}
                </Text>
              </TouchableOpacity>
            ),
        );
    }
  }

  render() {
    const thm = c.themes[this.props.theme];
    return (
      <>
        <View style={[sty.container, {backgroundColor: thm.background}]}>
          <View style={c.center}>
            <Text style={[c.titleFont, {fontSize: 42, color: thm.text}]}>
              Midwife
            </Text>
            <Text style={[c.titleFont, {fontSize: 20, color: thm.text}]}>
              Assist
            </Text>
          </View>

          <View style={{...c.center, width: '100%'}}>
            {this.renderSwitch()}
          </View>
        </View>
        {/*** START SLIDE UP NEW PIN ENTRY MODAL ***/}
        <SlideUpModal
          ref={ref => (this.pinModal = ref)}
          style={[
            sty.pinModal,
            {backgroundColor: thm.modal, borderColor: thm.border},
          ]}
          peek={0}>
          <View style={{...c.center, flexDirection: 'row'}}>
            <View style={[sty.button, sty.pinC, {backgroundColor: thm.accent}]}>
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
                  {color: thm.lightText, borderColor: thm.lightText},
                ]}
              />
            </View>
            <TouchableOpacity
              style={[sty.button, sty.pinSubmit, {backgroundColor: thm.accent}]}
              onPress={this.onPressSubmitNewPin}>
              {this.state.loading ? (
                <ActivityIndicator color={thm.lightText} size="small" />
              ) : (
                <MCIcons size={30} name="chevron-right" color={thm.lightText} />
              )}
            </TouchableOpacity>
          </View>

          <Text style={[c.titleFont, {fontSize: 12, color: thm.text}]}>
            Do not forget this PIN!
          </Text>
          <Text style={[c.titleFont, {fontSize: 10, color: thm.text}]}>
            To protect client information there is no PIN recovery option.
          </Text>
        </SlideUpModal>
      </>
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
  pinInput: {
    width: '90%',
    height: 40,
    fontSize: 16,
    padding: 0,
    borderBottomWidth: 1,
  },
  button: {
    ...c.center,
    elevation: 3,
    height: 45,
    borderRadius: 10,
    width: '70%',
    marginVertical: 10,
  },
  pinModal: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '93%',
    flex: 0,
    padding: 15,
    borderRadius: 10,
    borderWidth: 0.5,
    elevation: 4,
  },
  pinC: {
    height: 50,
  },
  pinSubmit: {
    marginLeft: 10,
    height: 40,
    width: 40,
    borderRadius: 30,
  },
};

export default Auth;
