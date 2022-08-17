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
import { connect } from 'react-redux';
import * as actions from '../../actions';

const c = require('../../assets/constants');

class AddBaby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Baby',
      dob: new Date(Date.now()),
      sex: 'female',
      weeks: '',
      days: '',
      lb: '',
      oz: '',
      g: '',
      weightType: 'g'
    };
  }

  componentDidMount() {
    const mom = this.props.clients.find((client, i) => (client.id === this.props.route.params.motherId));
    let name = 'Baby ' + (mom.name.last || mom.name.first || mom.name.preferred);
    let ga = 0;
    const gams = Date.now() - (mom.edd - (280 * c.t.day));
    ga = {
        weeks: String(Math.floor(gams / (c.t.day * 7))),
        days: String(Math.round((gams % (c.t.day * 7)) / c.t.day))
      }
    this.setState({ mom, name, ...ga });
  }

  onPressSave = () => {
    const { name, dob, sex, weeks, days, g, lb, oz, weightType, mom } = this.state;
    const birthWeight = weightType === 'g' ? parseInt(g || 0) :
      ((parseInt(lb || 0) * 16) + parseInt(oz || 0)) * 28.3495;
    if (!birthWeight) return ToastAndroid.show('Enter Birth Weight', ToastAndroid.LONG);
    let baby = {
      motherId: mom.id,
      name,
      dob: dob.getTime(),
      sex,
      ga: { weeks, days },
      birthWeight,
      id: c.randomString()
    };
    this.props.storeNewBaby(baby);
    this.props.navigation.pop();
  }


  renderName() {
    let { theme } = this.props;
    let { name} = this.state;
    return (
      <>
        <View style={[styles.row, styles.subHeaderRow]}>
          <Text style={[styles.subHeaderText, { color: c.themes[theme].foreground }]}>
            Name
          </Text>
        </View>
        <View style={[styles.row]}>
          <TextInput
            style={[styles.textInput, { textAlign: undefined }]}
            onChangeText={text => this.setState({ name: text })}
            value={name}
            placeholder='First'
            keyboardType='default'
            autoCapitalize='words'
            autoCorrect={false}
            autoCompleteType='name'
            maxLength={20}
            placeholderTextColor={c.themes[theme].foreground + 60} />
        </View>
      </>
    )
  }

  renderSex() {
    let { theme } = this.props;
    const bg = (sex) => sex === this.state.sex ? c.themes[theme].accent : c.themes[theme].background;
    return (
      <>
        <View style={[styles.row, styles.subHeaderRow]}>
          <Text style={[styles.subHeaderText, { color: c.themes[theme].foreground }]}>
            Sex
          </Text>
        </View>
        <View style={[styles.row, c.center, { justifyContent: 'space-around' }]}>

          <TouchableOpacity
            style={[styles.sexButton, { backgroundColor: bg('female') }]}
            onPress={() => this.setState({ sex: 'female' })}>
            <Text style={[{ color: bg('male') }]}>
              Female
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sexButton, { backgroundColor: bg('male') }]}
            onPress={() => this.setState({ sex: 'male' })}>
            <Text style={[{ color: bg('female') }]}>
              Male
            </Text>
          </TouchableOpacity>

        </View>
      </>
    );
  }

  renderDob() {
    let { theme } = this.props;
    let { dob } = this.state;
    return (
      <>
        <View style={[styles.row, styles.subHeaderRow]}>
          <Text style={[styles.subHeaderText, { color: c.themes[theme].foreground }]}>
            Date of Birth
          </Text>
        </View>
        <View style={[styles.row, { justifyContent: 'center' }]}>
          <DatePicker
            mode='date'
            date={dob}
            fadeToColor={c.themes[theme].modal}
            style={{ height: 120 }}
            onDateChange={(newDate) => this.setState({ dob: newDate })} />
        </View>
      </>
    );
  }

  weightSwitch() {
    let { theme } = this.props;
    const { lb, oz, g, weightType } = this.state;
    if (weightType === 'lb') {
      return (
        <>
          <TextInput
            style={styles.textInput}
            onChangeText={text => this.setState({ lb: text })}
            value={lb}
            keyboardType='decimal-pad'
            maxLength={2}
            placeholder='10'
            placeholderTextColor={c.themes[theme].foreground + 60} />
          <Text style={{ marginHorizontal: 10 }}>
            pounds
          </Text>
          <TextInput
            style={styles.textInput}
            onChangeText={text => this.setState({ oz: text })}
            value={oz}
            keyboardType='decimal-pad'
            maxLength={5}
            placeholder='4'
            placeholderTextColor={c.themes[theme].foreground + 60} />
          <Text style={{ marginHorizontal: 10 }}>
            ounces
          </Text>
        </>
      )
    }
    return (
        <>
          <TextInput
            style={styles.textInput}
            onChangeText={text => this.setState({ g: text })}
            value={g}
            keyboardType='decimal-pad'
            maxLength={8}
            placeholder='8750.12'
            placeholderTextColor={c.themes[theme].foreground + 60} />
          <Text style={{ marginHorizontal: 10 }}>
            grams
          </Text>
        </>
    )
  }

  renderWeight() {
    let { theme } = this.props;
    const { lb, oz, weightType } = this.state;
    return (
      <>
        <View style={[styles.row, styles.subHeaderRow]}>
          <Text style={[styles.subHeaderText, { flex: 1, color: c.themes[theme].foreground }]}>
            Birth Weight
          </Text>
          <>
            <MCIcons
              name='weight-gram'
              color={weightType === 'g' ? c.themes[theme].accent : c.themes[theme].text}
              size={30}
              onPress={() => this.setState({ weightType: 'g' })} />
            <MCIcons
              name='weight-pound'
              color={weightType === 'lb' ? c.themes[theme].accent : c.themes[theme].text}
              size={30}
              onPress={() => this.setState({ weightType: 'lb' })} />
            </>
        </View>
        <View style={[styles.row, c.center, { justifyContent: 'space-around' }]}>
            {this.weightSwitch()}
        </View>
      </>
    );
  }

  renderGa() {
    let { theme } = this.props;
    let { weeks, days } = this.state;
    return (
      <>
        <View style={[styles.row, styles.subHeaderRow]}>
          <Text style={[styles.subHeaderText, { flex: 1, color: c.themes[theme].foreground }]}>
            Gestational Age at Birth
          </Text>
        </View>
        <View style={[styles.row, c.center, { justifyContent: 'space-around' }]}>
          <TextInput
            style={styles.textInput}
            onChangeText={text => this.setState({ weeks: text })}
            keyboardType='decimal-pad'
            maxLength={2}
            placeholder='10'
            value={weeks}
            placeholderTextColor={c.themes[theme].foreground + 60} />
          <Text style={{ marginHorizontal: 10 }}>
            Weeks
          </Text>
          <TextInput
            style={styles.textInput}
            onChangeText={text => this.setState({ days: text })}
            value={days}
            keyboardType='decimal-pad'
            maxLength={2}
            placeholder='4'
            placeholderTextColor={c.themes[theme].foreground + 60} />
          <Text style={{ marginHorizontal: 10 }}>
            Days
          </Text>
        </View>
      </>
    )
  }


  render() {
    let { theme } = this.props;
    return (
      <View style={[styles.container, { backgroundColor: c.themes[theme].background }]}>

        <View style={[styles.header, { backgroundColor: c.themes[theme].accent }]}>
          <View style={{ flex: 1, width: '100%', justifyContent: 'center' }}>
            <Text style={{ color: c.themes[theme].background, fontSize: 25, marginLeft: 20 }}>
              Add new baby
            </Text>

          </View>
        </View>

        <ScrollView style={styles.body}>
          <View style={[styles.sectionContainer, { backgroundColor: c.themes[theme].modal }]}>
            {this.renderName()}
            {this.renderDob()}
            {this.renderGa()}
            {this.renderWeight()}
            {this.renderSex()}
          </View>
          <TouchableOpacity
            style={[styles.submit, { backgroundColor: c.themes[theme].accent }]}
            onPress={this.onPressSave}>
            <Text style={[{ color: c.themes[theme].background }]}>
              Save
            </Text>
          </TouchableOpacity>
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
    marginTop: 10
  },
  subHeaderText: {
    fontSize: 20,
  },
  textInput: {
    flex: 1,
    borderBottomWidth: 0.5,
    fontSize: 16,
    marginHorizontal: 10,
    textAlign: 'center'
  },
  submit: {
    width: '80%',
    height: 40,
    borderRadius: 10,
    elevation: 2,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  sexButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 0.5,
    elevation: 3,
    marginVertical: 10,
    marginHorizontal:10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  }
}

export default AddBaby;
