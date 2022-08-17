import React, { Component } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../../actions';
//import DatePicker from 'react-native-date-picker'
const DatePicker = null;
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FFIcons from 'react-native-vector-icons/FontAwesome5';
import AIcons from 'react-native-vector-icons/AntDesign';
import axios from 'axios';

const c = require('../../assets/constants');

class EditClient extends Component {
  constructor(props) {
    super(props);
    this.editTypes = {
      name: { title: 'Name' },
      address: { title: 'Address' },
      rh: { title: 'Rh Status' },
      notes: { title: 'Add New Note' },
      dob: { title: 'Date of Birth' },
      edd: { title: 'Estimated Delivery Date' },
      gbs: { title: 'Group B Streptococcus' },
      phones: { title: 'Phone Numbers' },
      dob: { title: 'Date of Birth' },
    }
    this.initialState = {};
    this.state = this.initialState;
  }

  componentDidMount() {
    const { params } = this.props.route;
    let phones = {};
    params.client.phones.forEach((phone, i) => phones[`phone${i}`] = phone );
    this.setState({
      ...this.state,
      ...params.client,
      ...params.client.name,
      ...params.client.address,
      ...phones,
      edit: params.edit
    });
  }

  onPressSave = () => {
    const { id, first, last, preferred, street, city, province,
      country, dob, edd, rh, gbs, delivered, phones, notes } = this.state;
    // iterate over the phones array and retrieve the phone object from State
    // This is done because you cannot update an array in state, so each phone number is stored as an object item
    let formattedPhones = phones.map((ph, i) => this.state[`phone${i}`]);
    let updatedClient = {
      id,
      name: {
        first,
        last,
        preferred,
      },
      address: {
        street,
        city,
        province,
        country
      },
      dob: new Date(dob).getTime(),
      edd: new Date(edd).getTime(),
      rh,
      gbs,
      delivered,
      phones: formattedPhones,
      notes
    };
    this.props.updateClient(updatedClient);
    this.props.navigation.pop();
  }

  onPressDeletePhone = (phone, i) => {
  let { phones } = this.state;
    Alert.alert(
      `Delete ${phone}?`,
      'Are you sure you want to delete this number?',
      [
        { text: "Cancel", onPress: () => {}, style: "cancel" },
        { text: 'Delete', onPress: () => {
          // as each phone number has an indivdual input which need to update state when it changes,
          //but phone numbers are stored as an array in the DB, if a number is deleted we need to reiterate the phone objects
          // into state so taht they can be updated again in text inputs
          let phObject = { [`phone${i}`]: '' };
          phones.filter((ph, j) => j !== i).forEach((phone, k) => phObject[`phone${k}`] = phone );
          this.setState({ phones: phones.filter((ph, j) => j !== i), ...phObject })
        }}
    ]);
  }

  renderEditType() {
    const { theme } = this.props;
    const { edit, first, last, preferred, notes, rh, gbs, street, city, province, country, phones } = this.state;
    // As Gbs is being added in after the app was released, some clients may not have a GBS value. For those clients, the value is 'unkown'
    let scrubbedGbs = gbs || 'unknown';
    const size = 31;
    switch(this.state.edit) {
      case 'dob': {
        return (
          <View style={styles.row}>
            <DatePicker
              mode='date'
              date={this.state.dob}
              textColor={c.themes[theme].text}
              fadeToColor={c.themes[theme].background}
              style={{ height: 120 }}
              onDateChange={(newDate) => this.setState({ dob: newDate })} />
          </View>
        );
      }
      case 'edd': {
        return (
          <View style={styles.row}>
            <DatePicker
              mode='date'
              date={this.state.edd}
              textColor={c.themes[theme].text}
              fadeToColor={c.themes[theme].background}
              style={{ height: 120 }}
              onDateChange={(newDate) => this.setState({ edd: newDate })} />
          </View>
        );
      }
      case 'name': {
        return (
          <>
            <View style={[styles.row]}>
              <TextInput
                style={[styles.textInput, { color: c.themes[theme].text, borderColor: c.themes[theme].border  }]}
                onChangeText={text => this.setState({ first: text })}
                value={first}
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
                onChangeText={text => this.setState({ last: text })}
                value={last}
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
                onChangeText={text => this.setState({ preferred: text })}
                value={preferred}
                placeholder='Preferred'
                keyboardType='default'
                autoCapitalize='words'
                autoCorrect={false}
                autoCompleteType='name'
                maxLength={41}
                placeholderTextColor={c.themes[theme].text + 60} />
            </View>
          </>
        );
      }
      case 'notes': {
        return (
          <>
            <View style={[styles.row]}>
              <TextInput
                style={[styles.textInput, { color: c.themes[theme].text, borderBottomWidth: 0 }]}
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
        )
      }
      case 'rh': {
        return (
          <>
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
                  color={rh === 'unkown' ? c.themes[theme].lightText : c.themes[theme].modal} />
              </TouchableOpacity>
            </View>
          </>
        );
      }
      case 'gbs': {
        return (
          <>
            <View style={[styles.row, { paddingVertical: 5, justifyContent: 'space-around' }]}>
              <TouchableOpacity
                onPress={() => this.setState({ gbs: 'positive' })}
                style={{
                  height: size,
                  width: size,
                  borderRadius: size / 2,
                  backgroundColor: scrubbedGbs === 'positive' ? c.themes[theme].accent : c.themes[theme].text,
                  ...c.center }}>
                <MCIcons
                  name='plus'
                  size={size / 2}
                  color={scrubbedGbs === 'positive' ? c.themes[theme].lightText : c.themes[theme].modal} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.setState({ gbs: 'negative' })}
                style={{
                  height: size,
                  width: size,
                  borderRadius: size / 2,
                  backgroundColor: scrubbedGbs === 'negative' ? c.themes[theme].accent : c.themes[theme].text,
                  ...c.center }}>
                <MCIcons
                  name='minus'
                  size={size / 2}
                  color={scrubbedGbs === 'negative' ? c.themes[theme].lightText : c.themes[theme].modal} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.setState({ gbs: 'unknown' })}
                style={{
                  height: size,
                  width: size,
                  borderRadius: size / 2,
                  backgroundColor: scrubbedGbs === 'unknown' ? c.themes[theme].accent : c.themes[theme].text,
                  ...c.center }}>
                <FFIcons
                  name='question'
                  size={size / 2}
                  color={scrubbedGbs === 'unkown' ? c.themes[theme].lightText : c.themes[theme].modal} />
              </TouchableOpacity>
            </View>
          </>
        );
      }
      case 'address': {
        return (
          <>
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
      case 'phones': {
        return phones.map((phone, i) => {
          return (
            <View style={[styles.row]} key={i}>
              <TextInput
                style={[styles.textInput, { color: c.themes[theme].text, borderColor: c.themes[theme].border  }]}
                onChangeText={text => this.setState({ [`phone${i}`]: text })}
                value={this.state[`phone${i}`]}
                keyboardType='phone-pad'
                autoCapitalize='words'
                autoCorrect={false}
                autoCompleteType='tel'
                maxLength={60}
                placeholder={c.numberingNames[i]}
                placeholderTextColor={c.themes[theme].text + 60} />
              <TouchableOpacity
                onPress={() => this.onPressDeletePhone(phone, i)}
                style={{ height: 40, width: 40, borderRadius: 20, ...c.center, justifyContent: 'flex-end' }}>
                <MCIcons
                  name='trash-can-outline'
                  size={25}
                  color={c.themes[theme].text} />
              </TouchableOpacity>
            </View>
          );
        });
      }
      default: {
        break;
      }
    }
  }

  renderAddPhone() {
    const { theme } = this.props;
    const { edit, phones } = this.state;
    if (edit !== 'phones') return null;
    return (
      <TouchableOpacity
        onPress={() => this.setState({ phones: [...phones, ''] })}
        style={{ height: 40, width: 40, borderRadius: 20, ...c.center }}>
        <MCIcons
          name='phone-plus'
          size={30}
          color={c.themes[theme].text} />
      </TouchableOpacity>
    );
  }

  render() {
    const { theme } = this.props;
    const { edit } = this.state;
    const textColor = { color: c.themes[theme].text };
    if (!edit) return null;
    return (
      <View style={styles.container}>
        <View style={[styles.modal, { backgroundColor: c.themes[theme].background, borderColor: c.themes[theme].border }]}>
          <TouchableOpacity style={[styles.row, c.center, { justifyContent: 'space-between'}]} onPress={() => this.props.navigation.pop()}>
            <Text style={[styles.rowText, textColor, c.titleFont, { flex: 1 }]}>
              {this.editTypes[edit].title}
            </Text>
            <MCIcons
              name='chevron-down'
              size={40}
              color={c.themes[theme].accent} />
            {this.renderAddPhone()}
          </TouchableOpacity>

          {this.renderEditType()}

          <View style={[styles.row, c.center, { justifyContent: 'space-around' }]}>

            <TouchableOpacity
              style={[styles.submit, { backgroundColor: c.themes[theme].accent }]}
              onPress={() => this.props.navigation.pop()}>
              <Text style={[c.titleFont, { color: c.themes[theme].lightText }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submit, { backgroundColor: c.themes[theme].accent }]}
              onPress={this.onPressSave}>
              <Text style={[c.titleFont, { color: c.themes[theme].lightText }]}>
                Save
              </Text>
            </TouchableOpacity>

          </View>

        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'transparent',
    flex: 0,
    position: 'absolute',
    bottom: 0
  },
  modal: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '90%',
    flex: 1,
    paddingHorizontal: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    elevation: 5,
    paddingVertical: 10,
  },
  row: {
    width: '100%',
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10
  },
  textInput: {
    flex: 1,
    borderBottomWidth: 1,
    fontSize: 16,
    marginHorizontal: 10
  },
  submit: {
    width: '40%',
    height: 40,
    borderRadius: 10,
    elevation: 2,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  rowTextSmall: {
    fontSize: 12
  }
};

export default EditClient;
