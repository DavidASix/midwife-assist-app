import React, { Component } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  ToastAndroid,
} from 'react-native';
//import DatePicker from 'react-native-date-picker';
const DatePicker = null;
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FFIcons from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';

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
      edd: new Date(Date.now() + 280 * c.t.day)
    };
  }

  onPressSubmit = () => {
    const {
      preferredName, firstName, lastName,
      street, city, province, country,
      phoneCount, rh, gbs, notes, dob, edd } = this.state;
    let phones = [];
    for (let i = 1; i <= phoneCount; i++) { if (this.state[`phone${i}`]) phones.push(this.state[`phone${i}`]); }
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
        country
      },
      dob: dob.getTime(),
      edd: edd.getTime(),
      rh: rh,
      gbs: gbs,
      delivered: false,
      phones,
      notes
    };
    if (!newClient.name.first || !newClient.name.last)  return Alert.alert('Please enter your clients name');
    this.props.storeNewClient(newClient);
    ToastAndroid.show('Client Saved', ToastAndroid.SHORT);
    this.props.navigation.navigate('clients');
  }

  renderName() {
    let { theme } = this.props;
    let { firstName, lastName, preferredName } = this.state;
    return (
      <>
        <View style={[styles.row, styles.subHeaderRow]}>
          <Text style={[styles.subHeaderText, { color: c.themes[theme].text }]}>
            Name
          </Text>
        </View>
        <View style={[styles.row]}>
          <TextInput
            style={[styles.textInput, { color: c.themes[theme].text, borderColor: c.themes[theme].border  }]}
            onChangeText={text => this.setState({ firstName: text })}
            value={firstName}
            placeholder='First'
            keyboardType='default'
            autoCapitalize='words'
            autoCorrect={false}
            autoCompleteType='name'
            maxLength={20}
            placeholderTextColor={c.themes[theme].text + 60} />
        </View>
        <View style={[styles.row]}>
          <TextInput
            style={[styles.textInput, { color: c.themes[theme].text, borderColor: c.themes[theme].border  }]}
            onChangeText={text => this.setState({ lastName: text })}
            value={lastName}
            placeholder='Last'
            keyboardType='default'
            autoCapitalize='words'
            autoCorrect={false}
            autoCompleteType='name'
            maxLength={20}
            placeholderTextColor={c.themes[theme].text + 60} />
        </View>
        <View style={[styles.row]}>
          <TextInput
            style={[styles.textInput, { color: c.themes[theme].text, borderColor: c.themes[theme].border  }]}
            onChangeText={text => this.setState({ preferredName: text })}
            value={preferredName}
            placeholder='Preferred'
            keyboardType='default'
            autoCapitalize='words'
            autoCorrect={false}
            autoCompleteType='name'
            maxLength={41}
            placeholderTextColor={c.themes[theme].text + 60} />
        </View>
      </>
    )
  }

  renderAddress() {
    let { theme } = this.props;
    let { street, city, province, country } = this.state;
    return (
      <>
        <View style={[styles.row, styles.subHeaderRow]}>
          <Text style={[styles.subHeaderText, { color: c.themes[theme].text }]}>
            Address
          </Text>
        </View>
        <View style={[styles.row]}>
          <TextInput
            style={[styles.textInput, { color: c.themes[theme].text, borderColor: c.themes[theme].border  }]}
            onChangeText={text => this.setState({ street: text })}
            value={street}
            keyboardType='default'
            autoCapitalize='words'
            autoCorrect={false}
            autoCompleteType='street-address'
            maxLength={60}
            placeholder='Street'
            placeholderTextColor={c.themes[theme].text + 60} />
        </View>
        <View style={[styles.row]}>
          <TextInput
            style={[styles.textInput, { color: c.themes[theme].text, borderColor: c.themes[theme].border  }]}
            onChangeText={text => this.setState({ city: text })}
            value={city}
            keyboardType='default'
            autoCapitalize='words'
            autoCorrect={false}
            autoCompleteType='name'
            maxLength={30}
            placeholder='City'
            placeholderTextColor={c.themes[theme].text + 60} />
        </View>
        <View style={[styles.row]}>
          <TextInput
            style={[styles.textInput, { color: c.themes[theme].text, borderColor: c.themes[theme].border  }]}
            onChangeText={text => this.setState({ province: text })}
            value={province}
            keyboardType='default'
            autoCapitalize='words'
            autoCorrect={false}
            autoCompleteType='name'
            maxLength={30}
            placeholder='Province/State'
            placeholderTextColor={c.themes[theme].text + 60} />
        </View>
        <View style={[styles.row]}>
          <TextInput
            style={[styles.textInput, { color: c.themes[theme].text, borderColor: c.themes[theme].border  }]}
            onChangeText={text => this.setState({ country: text })}
            value={country}
            keyboardType='default'
            autoCapitalize='words'
            autoCorrect={false}
            autoCompleteType='name'
            maxLength={30}
            placeholder='Country'
            placeholderTextColor={c.themes[theme].text + 60} />
        </View>
      </>
    );
  }

renderPhoneInputs() {
  let { theme } = this.props;
  let { phoneCount } = this.state;
  let phoneRows = [];
  for (let i = 0; i < phoneCount; i++) {
    phoneRows.push(
      <View style={[styles.row]} key={i}>
        <TextInput
          style={[styles.textInput, { color: c.themes[theme].text, borderColor: c.themes[theme].border  }]}
          onChangeText={text => this.setState({ [`phone${i + 1}`]: text })}
          value={this.state[`phone${i + 1}`]}
          keyboardType='phone-pad'
          autoCapitalize='words'
          autoCorrect={false}
          autoCompleteType='tel'
          maxLength={60}
          placeholder={c.numberingNames[i]}
          placeholderTextColor={c.themes[theme].text + 60} />
      </View>
    );
  }
  return phoneRows;
}

  renderPhone() {
    let { theme } = this.props;
    let { phoneCount, phone } = this.state;
    return (
      <>
        <View style={[styles.row, styles.subHeaderRow]}>
          <Text style={[styles.subHeaderText, { color: c.themes[theme].text }]}>
            Phone
          </Text>

          <TouchableOpacity
            onPress={() => this.setState({ phoneCount: phoneCount === 10 ? phoneCount : phoneCount + 1 })}
            style={{ height: 40, width: 40, borderRadius: 20, ...c.center }}>
            <MCIcons
              name='phone-plus'
              size={30}
              color={c.themes[theme].text} />
          </TouchableOpacity>
        </View>
        {this.renderPhoneInputs()}
      </>
    );
  }

  renderDob() {
    let { theme } = this.props;
    let { dob } = this.state;
    return (
      <>
        <View style={[styles.row, styles.subHeaderRow]}>
          <Text style={[styles.subHeaderText, { color: c.themes[theme].text }]}>
            Date of Birth
          </Text>
        </View>
        <View style={[styles.row, { justifyContent: 'center' }]}>
          <DatePicker
            mode='date'
            date={dob}
            textColor={c.themes[theme].text}
            fadeToColor={c.themes[theme].modal}
            style={{ height: 120 }}
            onDateChange={(newDate) => this.setState({ dob: newDate })} />
        </View>
      </>
    );
  }

  renderEdd() {
    let { theme } = this.props;
    let { edd } = this.state;
    return (
      <>
        <View style={[styles.row, styles.subHeaderRow]}>
          <Text style={[styles.subHeaderText, { color: c.themes[theme].text }]}>
            Estimated Delivery Date
          </Text>
        </View>
        <View style={[styles.row, { justifyContent: 'center' }]}>
          <DatePicker
            mode='date'
            date={edd}
            textColor={c.themes[theme].text}
            fadeToColor={c.themes[theme].modal}
            style={{ height: 120 }}
            onDateChange={(newDate) => this.setState({ edd: newDate })} />
        </View>
      </>
    );
  }

  renderRh() {
    let { theme } = this.props;
    let { rh } = this.state;
    const size = 31;
    return (
      <>
        <View style={[styles.row, styles.subHeaderRow]}>
          <Text style={[styles.subHeaderText, { color: c.themes[theme].text }]}>
            Rh status
          </Text>
        </View>
        <View style={[styles.row, { paddingVertical: 5, justifyContent: 'space-around' }]}>
          <TouchableOpacity
            onPress={() => this.setState({ rh: 'positive' })}
            style={{
              height: size,
              width: size,
              borderRadius: size / 2,
              backgroundColor: rh === 'positive' ? c.themes[theme].accent : c.themes[theme].text,
              ...c.center }}>
            <MCIcons
              name='plus'
              size={size / 2}
              color={rh === 'positive' ? c.themes[theme].lightText : c.themes[theme].modal} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.setState({ rh: 'negative' })}
            style={{
              height: size,
              width: size,
              borderRadius: size / 2,
              backgroundColor: rh === 'negative' ? c.themes[theme].accent : c.themes[theme].text,
              ...c.center }}>
            <MCIcons
              name='minus'
              size={size / 2}
              color={rh === 'negative' ? c.themes[theme].lightText : c.themes[theme].modal} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.setState({ rh: 'unknown' })}
            style={{
              height: size,
              width: size,
              borderRadius: size / 2,
              backgroundColor: rh === 'unknown' ? c.themes[theme].accent : c.themes[theme].text,
              ...c.center }}>
            <FFIcons
              name='question'
              size={size / 2}
              color={rh === 'unknown' ? c.themes[theme].lightText : c.themes[theme].modal} />
          </TouchableOpacity>
        </View>
      </>
    );
  }

  renderGbs() {
    let { theme } = this.props;
    let { gbs } = this.state;
    const size = 31;
    return (
      <>
        <View style={[styles.row, styles.subHeaderRow]}>
          <Text style={[styles.subHeaderText, { color: c.themes[theme].text }]}>
            GBS status
          </Text>
        </View>
        <View style={[styles.row, { paddingVertical: 5, justifyContent: 'space-around' }]}>
          <TouchableOpacity
            onPress={() => this.setState({ gbs: 'positive' })}
            style={{
              height: size,
              width: size,
              borderRadius: size / 2,
              backgroundColor: gbs === 'positive' ? c.themes[theme].accent : c.themes[theme].text,
              ...c.center }}>
            <MCIcons
              name='plus'
              size={size / 2}
              color={gbs === 'positive' ? c.themes[theme].lightText : c.themes[theme].modal} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.setState({ gbs: 'negative' })}
            style={{
              height: size,
              width: size,
              borderRadius: size / 2,
              backgroundColor: gbs === 'negative' ? c.themes[theme].accent : c.themes[theme].text,
              ...c.center }}>
            <MCIcons
              name='minus'
              size={size / 2}
              color={gbs === 'negative' ? c.themes[theme].lightText : c.themes[theme].modal} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.setState({ gbs: 'unknown' })}
            style={{
              height: size,
              width: size,
              borderRadius: size / 2,
              backgroundColor: gbs === 'unknown' ? c.themes[theme].accent : c.themes[theme].text,
              ...c.center }}>
            <FFIcons
              name='question'
              size={size / 2}
              color={gbs === 'unknown' ? c.themes[theme].lightText : c.themes[theme].modal} />
          </TouchableOpacity>
        </View>
      </>
    );
  }

  renderNotes() {
    let { theme } = this.props;
    let { notes } = this.state;
    return (
      <>
        <View style={[styles.row, styles.subHeaderRow]}>
          <Text style={[styles.subHeaderText, { color: c.themes[theme].text }]}>
            Notes
          </Text>
        </View>
        <View style={[styles.row]}>
          <TextInput
            style={[styles.textInput, { color: c.themes[theme].text, borderColor: c.themes[theme].border  }]}
            onChangeText={text => this.setState({ notes: text })}
            value={notes}
            keyboardType='default'
            autoCapitalize='sentences'
            autoCorrect={false}
            maxLength={300}
            multiline
            placeholder='Notes'
            placeholderTextColor={c.themes[theme].text + 60} />
        </View>
      </>
    );
  }

  renderSubmit() {
    let { theme } = this.props;
    return (
      <>
        <View style={[styles.row, { justifyContent: 'center' }]}>
          <TouchableOpacity
            style={[styles.submit, { backgroundColor: c.themes[theme].accent }]}
            onPress={this.onPressSubmit}>
            <Text style={[{ color: c.themes[theme].lightText }]}>
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  render() {
    let { theme } = this.props;
    return (
      <View style={[styles.container, { backgroundColor: c.themes[theme].background, borderColor: c.themes[theme].border }]}>
        <View style={[styles.header, { backgroundColor: c.themes[theme].accent }]}>
          <View style={{ flex: 1, width: '100%', justifyContent: 'center' }}>
            <Text style={[{ color: c.themes[theme].lightText, fontSize: 36, marginLeft: 20 }, c.titleFont]}>
              Add new client
            </Text>
          </View>
        </View>
        <ScrollView style={styles.body}>
          <View style={[styles.sectionContainer, { backgroundColor: c.themes[theme].modal, borderColor: c.themes[theme].border }]}>
            {this.renderName()}
            {this.renderAddress()}
            {this.renderPhone()}
            {this.renderDob()}
            {this.renderEdd()}
            {this.renderRh()}
            {this.renderGbs()}
            {this.renderSubmit()}
          </View>
        </ScrollView>
      </View>
    );
  }
}


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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subHeaderRow: {
    height: 40,
    paddingTop: 10,
  },
  subHeaderText: {
    fontSize: 20,
    ...c.titleFont
  },
  textInput: {
    flex: 1,
    borderBottomWidth: 1,
    fontSize: 16,
    marginHorizontal: 10
  },
  submit: {
    width: '95%',
    height: 50,
    borderRadius: 10,
    elevation: 2,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  }
}


export default AddClient;
