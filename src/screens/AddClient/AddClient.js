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
import {Picker} from '@react-native-picker/picker';
import AIcon from 'react-native-vector-icons/AntDesign';

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
      phone1: '',
      phone2: '',
      phone3: '',
      rh: 'unknown',
      gbs: 'unknown',
      notes: '',
      age: '',
      dob: null, //new Date(Date.now() - 30 * c.t.year),
      edd: new Date(Date.now() + 280 * c.t.day),
      showEddPicker: false,
      showDobPicker: false,
      gravida: 0,
      parity: 0,
      bloodType: null,
    };
  }

  onPressSubmit = () => {
    const {
      preferredName,
      firstName,
      lastName,
      street,
      city,
      rh,
      gbs,
      notes,
      age,
      dob,
      edd,
      gravida,
      parity,
      bloodType,
    } = this.state;
    let phones = [this.state.phone1, this.state.phone2, this.state.phone3];
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
      },
      dob: dob?.getTime() || dob,
      age,
      edd: edd.getTime(),
      rh: rh,
      gbs: gbs,
      delivered: false,
      phones,
      notes,
      gravida,
      parity,
      bloodType,
    };
    if (!newClient.name.first || !newClient.name.last) {
      return Alert.alert('Please enter your clients name');
    }
    this.props.storeNewClient(newClient);
    ToastAndroid.show('Client Saved', ToastAndroid.SHORT);
    this.props.navigation.navigate('clients');
  };

  renderName() {
    const thm = c.themes[this.props.theme];
    const sty = style(this.props.theme);
    const names = [
      {var: 'firstName', title: 'First'},
      {var: 'lastName', title: 'Last'},
      {var: 'preferredName', title: 'Preferred'},
    ];
    return (
      <>
        <View style={[sty.row, sty.subHeaderRow]}>
          <Text style={sty.subHeaderText}>Name</Text>
        </View>
        {names.map((n, i) => (
          <View style={sty.row} key={i}>
            <TextInput
              style={sty.textInput}
              onChangeText={text => this.setState({[n.var]: text})}
              value={this.state[n.var]}
              placeholder={n.title}
              keyboardType="default"
              autoCapitalize="words"
              autoCorrect={false}
              autoCompleteType="name"
              maxLength={41}
              placeholderTextColor={thm.text + 60}
            />
          </View>
        ))}
      </>
    );
  }

  renderAddress() {
    const thm = c.themes[this.props.theme];
    const sty = style(this.props.theme);
    const types = [
      {var: 'street', title: 'Street', autoComplete: 'street-address'},
      {var: 'city', title: 'City', autoComplete: undefined},
    ];
    return (
      <>
        <View style={[sty.row, sty.subHeaderRow]}>
          <Text style={sty.subHeaderText}>Address</Text>
        </View>
        {types.map((type, i) => (
          <View style={[sty.row]} key={i}>
            <TextInput
              style={sty.textInput}
              onChangeText={text => this.setState({[type.var]: text})}
              value={this.state[type.var]}
              keyboardType="default"
              autoCapitalize="words"
              autoCorrect={false}
              autoCompleteType={type.autoComplete}
              maxLength={60}
              placeholder={type.title}
              placeholderTextColor={thm.text + 60}
            />
          </View>
        ))}
      </>
    );
  }

  renderPhone() {
    const thm = c.themes[this.props.theme];
    const sty = style(this.props.theme);
    const numberTypes = ['Primary', 'Secondary', 'Emergency'];
    return (
      <>
        <View style={[sty.row, sty.subHeaderRow]}>
          <Text style={sty.subHeaderText}>Phone</Text>
        </View>
        {/*** RENDER NUMBER INPUTS ***/}
        {[...Array(3).keys()].map(i => (
          <View style={[sty.row]} key={i}>
            <TextInput
              style={sty.textInput}
              onChangeText={text => this.setState({[`phone${i + 1}`]: text})}
              value={this.state[`phone${i + 1}`]}
              keyboardType="phone-pad"
              autoCapitalize="words"
              autoCorrect={false}
              autoCompleteType="tel"
              maxLength={60}
              placeholder={numberTypes[i]}
              placeholderTextColor={thm.text + 60}
            />
          </View>
        ))}
      </>
    );
  }

  renderAge() {
    const thm = c.themes[this.props.theme];
    const sty = style(this.props.theme);
    return (
      <>
        <View style={[sty.row, sty.subHeaderRow]}>
          <Text style={sty.subHeaderText}>Age</Text>
        </View>
        <View style={[sty.row]}>
          <TextInput
            style={sty.textInput}
            onChangeText={text => this.setState({age: text, dob: null})}
            value={this.state.age}
            keyboardType="number-pad"
            autoCorrect={false}
            maxLength={3}
            placeholder="32"
            placeholderTextColor={thm.text + 60}
          />
        </View>
      </>
    );
  }

  renderDob() {
    const thm = c.themes[this.props.theme];
    const sty = style(this.props.theme);
    const {dob} = this.state;
    return (
      <>
        <View style={[sty.row, sty.subHeaderRow]}>
          <Text style={sty.subHeaderText}>Date of Birth</Text>
        </View>

        <TouchableOpacity
          style={sty.rowButton}
          onPress={() => this.setState({showDobPicker: true})}>
          <Text style={{color: thm.text}}>
            {dob ? dob.toDateString() : 'Select Date of Birth'}
          </Text>
        </TouchableOpacity>
        {this.state.showDobPicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={this.state.dob || new Date(Date.now() - 30 * c.t.year)}
            accentColor={thm.accent}
            mode="date"
            is24Hour={true}
            onChange={(e, date) => {
              let age = new Date(Date.now() - date.getTime());
              age = Math.abs(age.getUTCFullYear() - 1970) + '';
              this.setState({showDobPicker: false, dob: date, age});
            }}
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

  renderBlood() {
    //const thm = c.themes[this.props.theme];
    const sty = style(this.props.theme);
    let bt = [{l: 'Please Select', v: null}];
    let b = {types: ['A', 'B', 'AB', 'O'], charges: ['+', '-']};
    b.types.forEach(
      t =>
        (bt = [
          ...bt,
          ...b.charges.map(ch => ({
            l: t + ch,
            v: t + ch,
          })),
        ]),
    );
    return (
      <>
        <View style={[sty.row, sty.subHeaderRow]}>
          <Text style={sty.subHeaderText}>Blood Type</Text>
        </View>

        <View style={[sty.rowButton, {flex: 1}]}>
          <Picker
            style={{flex: 1, width: '100%'}}
            selectedValue={this.state.bloodType}
            onValueChange={bloodType => this.setState({bloodType})}>
            {bt.map(t => (
              <Picker.Item label={t.l} value={t.v} />
            ))}
          </Picker>
        </View>
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
              <AIcon
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
              <AIcon
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

  renderGP() {
    const thm = c.themes[this.props.theme];
    const sty = style(this.props.theme);
    const gp = [
      {name: 'gravida', letter: 'G'}, //total pregnancies
      {name: 'parity', letter: 'P'}, //total pregnancies to viability (>=20weeks)
    ];
    return (
      <>
        <View style={[sty.row, sty.subHeaderRow]}>
          <Text style={sty.subHeaderText}>Gravida & Parity</Text>
        </View>

        <View style={sty.row}>
          {gp.map((type, i) => (
            <>
              <TouchableOpacity
                onPress={() =>
                  this.setState({[type.name]: this.state[type.name] - 1})
                }
                style={sty.iconButton}>
                <AIcon name="minus" size={15} color={thm.text} />
              </TouchableOpacity>
              <Text>{type.letter + this.state[type.name]}</Text>
              <TouchableOpacity
                onPress={() =>
                  this.setState({[type.name]: this.state[type.name] + 1})
                }
                style={sty.iconButton}>
                <AIcon name="plus" size={15} color={thm.text} />
              </TouchableOpacity>
            </>
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
        <ScrollView
          style={{width: '100%'}}
          showsVerticalScrollIndicator={false}>
          <View style={sty.sectionContainer}>
            {this.renderName()}
            {this.renderAddress()}
            {this.renderPhone()}
            {this.renderAge()}
            <Text style={sty.orText}>or</Text>
            {this.renderDob()}
            {this.renderEdd()}
            {this.renderBlood()}
            {this.renderRh()}
            {this.renderGbs()}
            {this.renderGP()}
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
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    alignSelf: 'center',
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
    borderColor: c.themes[theme].border,
    flex: 1,
    borderBottomWidth: 1,
    fontSize: 16,
    marginHorizontal: 10,
  },
  orText: {
    alignSelf: 'center',
    color: c.themes[theme].text + 60,
    fontSize: 10,
    marginTop: 10,
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

export default AddClient;
