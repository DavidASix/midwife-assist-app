import React, {Component} from 'react';
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ToastAndroid,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FFIcons from 'react-native-vector-icons/FontAwesome5';

const c = require('../../assets/constants');

class AddClient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      preferredName: '',
      firstName: '',
      lastName: '',
      street: '',
      city: '',
      province: '',
      country: '',
      phoneCount: 1,
      phone1: '',
      rh: 'unknown',
      gbs: 'unknown',
      notes: '',
      dob: new Date(Date.now() - 30 * c.t.year),
      edd: new Date(Date.now() + 280 * c.t.day),
      showEddPicker: false,
      showDobPicker: false,
    };
  }

  onPressSubmit = () => {
    const {
      preferredName,
      firstName,
      lastName,
      street,
      city,
      province,
      country,
      phoneCount,
      rh,
      gbs,
      notes,
      dob,
      edd,
    } = this.state;
    let phones = [];
    for (let i = 1; i <= phoneCount; i++) {
      if (this.state[`phone${i}`]) phones.push(this.state[`phone${i}`]);
    }
    let newClient = {
      id: c.randomString(),
      name: {
        first: firstName,
        last: lastName,
        preferred: preferredName,
      },
      address: {
        street,
        city,
        province,
        country,
      },
      dob: dob.getTime(),
      edd: edd.getTime(),
      rh: rh,
      gbs: gbs,
      delivered: false,
      phones,
      notes,
    };
    if (!newClient.name.first || !newClient.name.last)
      return Alert.alert('Please enter your clients name');
    this.props.storeNewClient(newClient);
    ToastAndroid.show('Client Saved', ToastAndroid.SHORT);
    this.props.navigation.navigate('clients');
  };

  renderName() {
    let {theme} = this.props;
    let {firstName, lastName, preferredName} = this.state;
    return (
      <>
        <View style={[styles.row, styles.subHeaderRow]}>
          <Text style={[styles.subHeaderText, {color: c.themes[theme].text}]}>
            Name
          </Text>
        </View>
        <View style={[styles.row]}>
          <TextInput
            style={[
              styles.textInput,
              {
                color: c.themes[theme].text,
                borderColor: c.themes[theme].border,
              },
            ]}
            onChangeText={text => this.setState({firstName: text})}
            value={firstName}
            placeholder="First"
            keyboardType="default"
            autoCapitalize="words"
            autoCorrect={false}
            autoCompleteType="name"
            maxLength={20}
            placeholderTextColor={c.themes[theme].text + 60}
          />
        </View>
        <View style={[styles.row]}>
          <TextInput
            style={[
              styles.textInput,
              {
                color: c.themes[theme].text,
                borderColor: c.themes[theme].border,
              },
            ]}
            onChangeText={text => this.setState({lastName: text})}
            value={lastName}
            placeholder="Last"
            keyboardType="default"
            autoCapitalize="words"
            autoCorrect={false}
            autoCompleteType="name"
            maxLength={20}
            placeholderTextColor={c.themes[theme].text + 60}
          />
        </View>
        <View style={[styles.row]}>
          <TextInput
            style={[
              styles.textInput,
              {
                color: c.themes[theme].text,
                borderColor: c.themes[theme].border,
              },
            ]}
            onChangeText={text => this.setState({preferredName: text})}
            value={preferredName}
            placeholder="Preferred"
            keyboardType="default"
            autoCapitalize="words"
            autoCorrect={false}
            autoCompleteType="name"
            maxLength={41}
            placeholderTextColor={c.themes[theme].text + 60}
          />
        </View>
      </>
    );
  }

  renderAddress() {
    let {theme} = this.props;
    let {street, city, province, country} = this.state;
    return (
      <>
        <View style={[styles.row, styles.subHeaderRow]}>
          <Text style={[styles.subHeaderText, {color: c.themes[theme].text}]}>
            Address
          </Text>
        </View>
        <View style={[styles.row]}>
          <TextInput
            style={[
              styles.textInput,
              {
                color: c.themes[theme].text,
                borderColor: c.themes[theme].border,
              },
            ]}
            onChangeText={text => this.setState({street: text})}
            value={street}
            keyboardType="default"
            autoCapitalize="words"
            autoCorrect={false}
            autoCompleteType="street-address"
            maxLength={60}
            placeholder="Street"
            placeholderTextColor={c.themes[theme].text + 60}
          />
        </View>
        <View style={[styles.row]}>
          <TextInput
            style={[
              styles.textInput,
              {
                color: c.themes[theme].text,
                borderColor: c.themes[theme].border,
              },
            ]}
            onChangeText={text => this.setState({city: text})}
            value={city}
            keyboardType="default"
            autoCapitalize="words"
            autoCorrect={false}
            autoCompleteType="name"
            maxLength={30}
            placeholder="City"
            placeholderTextColor={c.themes[theme].text + 60}
          />
        </View>
        <View style={[styles.row]}>
          <TextInput
            style={[
              styles.textInput,
              {
                color: c.themes[theme].text,
                borderColor: c.themes[theme].border,
              },
            ]}
            onChangeText={text => this.setState({province: text})}
            value={province}
            keyboardType="default"
            autoCapitalize="words"
            autoCorrect={false}
            autoCompleteType="name"
            maxLength={30}
            placeholder="Province/State"
            placeholderTextColor={c.themes[theme].text + 60}
          />
        </View>
        <View style={[styles.row]}>
          <TextInput
            style={[
              styles.textInput,
              {
                color: c.themes[theme].text,
                borderColor: c.themes[theme].border,
              },
            ]}
            onChangeText={text => this.setState({country: text})}
            value={country}
            keyboardType="default"
            autoCapitalize="words"
            autoCorrect={false}
            autoCompleteType="name"
            maxLength={30}
            placeholder="Country"
            placeholderTextColor={c.themes[theme].text + 60}
          />
        </View>
      </>
    );
  }

  renderPhoneInputs() {
    let {theme} = this.props;
    let {phoneCount} = this.state;
    let phoneRows = [];
    for (let i = 0; i < phoneCount; i++) {
      phoneRows.push(
        <View style={[styles.row]} key={i}>
          <TextInput
            style={[
              styles.textInput,
              {
                color: c.themes[theme].text,
                borderColor: c.themes[theme].border,
              },
            ]}
            onChangeText={text => this.setState({[`phone${i + 1}`]: text})}
            value={this.state[`phone${i + 1}`]}
            keyboardType="phone-pad"
            autoCapitalize="words"
            autoCorrect={false}
            autoCompleteType="tel"
            maxLength={60}
            placeholder={c.numberingNames[i]}
            placeholderTextColor={c.themes[theme].text + 60}
          />
        </View>,
      );
    }
    return phoneRows;
  }

  renderPhone() {
    let {theme} = this.props;
    let {phoneCount, phone} = this.state;
    return (
      <>
        <View style={[styles.row, styles.subHeaderRow]}>
          <Text style={[styles.subHeaderText, {color: c.themes[theme].text}]}>
            Phone
          </Text>

          <TouchableOpacity
            onPress={() =>
              this.setState({
                phoneCount: phoneCount === 10 ? phoneCount : phoneCount + 1,
              })
            }
            style={{height: 40, width: 40, borderRadius: 20, ...c.center}}>
            <MCIcons name="phone-plus" size={30} color={c.themes[theme].text} />
          </TouchableOpacity>
        </View>
        {this.renderPhoneInputs()}
      </>
    );
  }

  renderDob() {
    const thm = c.themes[this.props.theme];
    const sty = style(this.props.theme);
    return (
      <>
        <View style={[sty.row, sty.subHeaderRow]}>
          <Text style={sty.subHeaderText}>Date of Birth</Text>
        </View>

        <TouchableOpacity
          style={sty.rowButton}
          onPress={() => this.setState({showDobPicker: true})}>
          <Text style={{color: thm.text}}>{this.state.dob.toDateString()}</Text>
        </TouchableOpacity>
        {this.state.showDobPicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={this.state.dob}
            accentColor={thm.accent}
            mode="date"
            is24Hour={true}
            onChange={(e, date) =>
              this.setState({showDobPicker: false, dob: date})
            }
          />
        )}
      </>
    );
  }

  renderEdd() {
    const thm = c.themes[this.props.theme];
    const sty = style(this.props.theme);
    return (
      <>
        <View style={[sty.row, sty.subHeaderRow]}>
          <Text style={sty.subHeaderText}>Estimated Delivery Date</Text>
        </View>

        <TouchableOpacity
          style={sty.rowButton}
          onPress={() => this.setState({showEddPicker: true})}>
          <Text style={{color: thm.text}}>{this.state.edd.toDateString()}</Text>
        </TouchableOpacity>
        {this.state.showEddPicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={this.state.edd}
            accentColor={thm.accent}
            mode="date"
            is24Hour={true}
            onChange={(e, date) =>
              this.setState({showEddPicker: false, edd: date})
            }
          />
        )}
      </>
    );
  }

  renderRh() {
    const thm = c.themes[this.props.theme];
    const sty = style(this.props.theme);
    const active = type => type === this.state.rh;
    const rhTypes = [
      {name: 'positive', icon: 'plus'},
      {name: 'negative', icon: 'minus'},
      {name: 'unknown', icon: 'question'},
    ];
    return (
      <>
        <View style={[sty.row, sty.subHeaderRow]}>
          <Text style={sty.subHeaderText}>RH status</Text>
        </View>

        <View style={sty.row}>
          {rhTypes.map((type, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => this.setState({rh: type.name})}
              style={[
                sty.iconButton,
                active(type.name) && {backgroundColor: thm.accent},
              ]}>
              <MCIcons
                name={type.icon}
                size={15}
                color={active(type.name) ? thm.modal : thm.text}
              />
            </TouchableOpacity>
          ))}
        </View>
      </>
    );
  }

  renderGbs() {
    const thm = c.themes[this.props.theme];
    const sty = style(this.props.theme);
    const active = type => type === this.state.gbs;
    const gbsTypes = [
      {name: 'positive', icon: 'plus'},
      {name: 'negative', icon: 'minus'},
      {name: 'unknown', icon: 'question'},
    ];
    return (
      <>
        <View style={[sty.row, sty.subHeaderRow]}>
          <Text style={sty.subHeaderText}>GBS status</Text>
        </View>

        <View style={sty.row}>
          {gbsTypes.map((type, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => this.setState({gbs: type.name})}
              style={[
                sty.iconButton,
                active(type.name) && {backgroundColor: thm.accent},
              ]}>
              <MCIcons
                name={type.icon}
                size={15}
                color={active(type.name) ? thm.modal : thm.text}
              />
            </TouchableOpacity>
          ))}
        </View>
      </>
    );
  }

  render() {
    const thm = c.themes[this.props.theme];
    const sty = style(this.props.theme);
    return (
      <View style={sty.container}>
        <View style={sty.header}>
          <View style={{flex: 1, width: '100%', justifyContent: 'center'}}>
            <Text style={sty.title}>Add new client</Text>
          </View>
        </View>
        <ScrollView style={{width: '100%'}}>
          <View style={sty.sectionContainer}>
            {this.renderName()}
            {this.renderAddress()}
            {this.renderPhone()}
            {this.renderDob()}
            {this.renderEdd()}
            {this.renderRh()}
            {this.renderGbs()}
            {/*** RENDER SUBMIT ***/}
            <TouchableOpacity style={sty.submit} onPress={this.onPressSubmit}>
              <Text style={[{color: thm.lightText}]}>Submit</Text>
            </TouchableOpacity>
            {/*** RENDER SUBMIT ***/}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const style = (theme = 'light') => ({
  container: {
    height: '98%',
    width: '95%',
    overflow: 'hidden',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    elevation: 5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'absolute',
    alignSelf: 'center',
    bottom: 0,
    backgroundColor: c.themes[theme].background,
    borderColor: c.themes[theme].border,
  },
  header: {
    height: 100,
    width: '100%',
    backgroundColor: c.themes[theme].accent,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: c.themes[theme].lightText,
    fontSize: 36,
    marginLeft: 20,
    ...c.titleFont,
  },
  sectionContainer: {
    backgroundColor: c.themes[theme].modal,
    borderColor: c.themes[theme].border,
    flex: 0,
    width: '96%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    alignSelf: 'center',
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  row: {
    width: '100%',
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  iconButton: {
    height: 30,
    width: 30,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: c.themes[theme].border,
    backgroundColor: c.themes[theme].modal,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  rowButton: {
    width: '95%',
    minHeight: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 0.5,
    borderColor: c.themes[theme].border,
    backgroundColor: c.themes[theme].modal,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  subHeaderRow: {
    justifyContent: 'space-between',
    height: 40,
    paddingTop: 10,
  },
  subHeaderText: {
    color: c.themes[theme].text,
    fontSize: 20,
    ...c.titleFont,
  },
  textInput: {
    flex: 1,
    borderBottomWidth: 1,
    fontSize: 16,
    marginHorizontal: 10,
  },
  submit: {
    backgroundColor: c.themes[theme].accent,
    width: '95%',
    height: 40,
    borderRadius: 10,
    elevation: 2,
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});

const styles = {
  container: {
    height: '98%',
    width: '98%',
    overflow: 'hidden',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    elevation: 5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'absolute',
    alignSelf: 'center',
    bottom: 0,
  },
  header: {
    height: 100,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  body: {
    flex: 1,
    width: '100%',
  },
  sectionContainer: {
    flex: 0,
    width: '96%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    alignSelf: 'center',
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  row: {
    width: '100%',
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  subHeaderRow: {
    justifyContent: 'space-between',
    height: 40,
    paddingTop: 10,
  },
  subHeaderText: {
    fontSize: 20,
    ...c.titleFont,
  },
  textInput: {
    flex: 1,
    borderBottomWidth: 1,
    fontSize: 16,
    marginHorizontal: 10,
  },
  submit: {
    width: '95%',
    height: 50,
    borderRadius: 10,
    elevation: 2,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
};

export default AddClient;
