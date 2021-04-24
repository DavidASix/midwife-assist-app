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
  Linking,
  Animated
} from 'react-native';
import DatePicker from 'react-native-date-picker'
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FFIcons from 'react-native-vector-icons/FontAwesome5';
import AIcons from 'react-native-vector-icons/AntDesign';
import EIcons from 'react-native-vector-icons/Entypo';
import axios from 'axios';

import SlideUpModal from '../../SlideUpModal/'
const c = require('../../assets/constants');

class ViewClient extends Component {
  constructor(props) {
    super(props);
    this.pageScroll = null;
    this.scrollPosition = new Animated.ValueXY();
    this.addNoteModal = null
    this.state = {
      babyId: false
    };
  }

  componentDidMount() {
    this.setState({
      ...this.state,
      client: this.props.route.params.client,
    });
  }

  //  ---  On Press Functions  ---  //

  onPressDeleteClient = () => {
  let { name, id } = this.state.client;
    Alert.alert(
      `Delete ${`${name.first} ${name.last}` || name.preferred || 'Client'}?`,
      'Are you sure you want to delete this client? You will not be able to recover their information.',
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel"
        },
        { text: 'Delete', onPress: () => {
          this.props.deleteClient(id);
          this.props.navigation.pop();
        }}
      ]
    );
  }

  onPressAddBaby = () => {
    let { theme, route } = this.props;
    const client = route.params.client;
    this.props.navigation.navigate('addBaby', { motherId: client.id })
  }

  onPressDeleteNote(noteId) {
    let { id } = this.state.client;
    Alert.alert(
      `Delete Note?`,
      'Are you sure you want to delete this note? You will not be able to recover the note.',
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel"
        },
        { text: 'Delete', onPress: () => {
          // if the note is a legacy note we overwrite the client object and remove the notes field
          if (noteId === 'legacy') {
            console.log('legacy note');
            this.props.updateClient({ ...this.state.client, notes: "" });
          } else {
            this.props.deleteNote(noteId);
          }
        }}
      ]
    );
  }

  onPressNewNote = () => {

  }


  //  ---  Render Functions  ---  //
  renderBabies() {
    let { theme, route, babies } = this.props;
    const client = route.params.client;
    let babyList = babies.filter((baby, i) => (baby.motherId === client.id));
    if (babyList.length) {
      return babyList.map((baby, i) => (
        <>
          <View
            style={[styles.row, { padding: 10, justifyContent: 'center' }]}>
              <Text>Name: {baby.name}</Text>
              <FFIcons style={{ marginHorizontal: 10 }} name='baby' size={30} color={c.themes[theme].text} />
          </View>
        </>
      ));
    }
  }


  renderPhoneNumbers(phones) {
    let { theme } = this.props;
    return phones.map((phone, i) => {
      return (
        <View style={[styles.row]}>
          <MCIcons
            name='phone'
            size={25}
            color={c.themes[theme].accent} />
          <TouchableOpacity
            style={[styles.textInput, { height: 40, justifyContent: 'center', borderColor: c.themes[theme].border }]}
            onPress={() => Linking.openURL(`tel:${phone}`)}>
            <Text style={[{ fontSize: 16, color: c.themes[theme].text }]}>
              {phone}
            </Text>
          </TouchableOpacity>
        </View>
      );
    })
  }

    renderRhIcon(rh) {
      let { theme } = this.props;
      const size = 31;
      switch(rh) {
        case 'positive': return (
          <MCIcons
            name='plus'
            size={20 / 2}
            color={c.themes[theme].lightText} />
        );
        case 'negative': return (
          <MCIcons
            name='minus'
            size={20 / 2}
            color={c.themes[theme].lightText} />
        );
        default: return (
          <FFIcons
            name='question'
            size={20 / 2}
            color={c.themes[theme].lightText} />
        );
      }
    }

    renderGbsIcon(gbs) {
      let { theme } = this.props;
      const size = 31;
      switch(gbs) {
        case 'positive': return (
          <MCIcons
            name='plus'
            size={20 / 2}
            color={c.themes[theme].lightText} />
        );
        case 'negative': return (
          <MCIcons
            name='minus'
            size={20 / 2}
            color={c.themes[theme].lightText} />
        );
        default: return (
          <FFIcons
            name='question'
            size={20 / 2}
            color={c.themes[theme].lightText} />
        );
      }
    }

  renderDetails() {

      let { theme, route } = this.props;
      // Client is defined via an IF because if the client is deleted, then while the modal is being dismissed reduxRefreshedClient will be null, breaking the component
      // With the IF we use a copy of client created on mount
      const reduxRefreshedClient = this.props.clients.find((cl, i) => (cl.id === route.params.client.id));
      let client = undefined;
      if (!reduxRefreshedClient) {
        client = this.state.client;
      } else { client = reduxRefreshedClient; }
      const { first, last, preferred } = client.name;
      const { street, city, province, country } = client.address
      const { dob, edd, rh, phones, gbs } = client;
      // As Gbs is being added in after the app was released, some clients may not have a GBS value. For those clients, the value is 'unkown'
      let scrubbedGbs = gbs || 'unknown';
      // Formatting of the address string is done here to avoid blank spaces created from extra \n
      let adrStr = street ? `${street},` : '';
      adrStr && city ? adrStr += `\n${city},` : adrStr += city;
      adrStr && province ? adrStr += `\n${province},` : adrStr += province;
      adrStr && country ? adrStr += `\n${country}` : adrStr += country;

      return (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.body}>

          <View style={[styles.sectionContainer, { backgroundColor: c.themes[theme].modal, borderColor: c.themes[theme].border }]}>
            {/* Address */}
            <View style={[styles.row, styles.subHeaderRow, { borderColor: c.themes[theme].border }]}>
              <Text style={[styles.subHeaderText, { color: c.themes[theme].text }]}>
                Address
              </Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('editClient', { edit: 'address', client })}
                style={{ height: 40, width: 40, borderRadius: 20, ...c.center }}>
                <FFIcons
                  name='edit'
                  size={20}
                  color={c.themes[theme].text} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => Linking.openURL(`https://www.google.ca/maps/search/${adrStr.replace(/\s/g, '+')}`)}
              style={[styles.row, { justifyContent: 'center' }]}>
              <EIcons
                name='address'
                size={25}
                color={c.themes[theme].accent} />
              <View style={[styles.textInput, { minHeight: 40, justifyContent: 'center', borderColor: c.themes[theme].border }]}>
                <Text style={[{ fontSize: 16, color: c.themes[theme].text }]}>
                  {adrStr}
                </Text>
              </View>
            </TouchableOpacity>
            {/* Phones */}
            <View style={[styles.row, styles.subHeaderRow]}>
              <Text style={[styles.subHeaderText, { color: c.themes[theme].text }]}>
                Phone Numbers
              </Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('editClient', { edit: 'phones', client })}
                style={{ height: 40, width: 40, borderRadius: 20, ...c.center }}>
                <FFIcons
                  name='edit'
                  size={20}
                  color={c.themes[theme].text} />
              </TouchableOpacity>
            </View>
            {this.renderPhoneNumbers(phones)}
            {/* DOB */}
            <View style={[styles.row, styles.subHeaderRow]}>
              <Text style={[styles.subHeaderText, { color: c.themes[theme].text }]}>
                Date of Birth
              </Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('editClient', { edit: 'dob', client })}
                style={{ height: 40, width: 40, borderRadius: 20, ...c.center }}>
                <FFIcons
                  name='edit'
                  size={20}
                  color={c.themes[theme].text} />
              </TouchableOpacity>
            </View>
            <View style={[styles.row, { justifyContent: 'center' }]}>
              <MCIcons
                name='calendar-star'
                size={25}
                color={c.themes[theme].accent} />
              <View style={[styles.textInput, { height: 40, justifyContent: 'center', borderColor: c.themes[theme].border }]}>
                <Text style={[{ fontSize: 16, color: c.themes[theme].text }]}>
                  {new Date(dob).toDateString()}
                </Text>
              </View>
            </View>
            {/* EDD */}
            <View style={[styles.row, styles.subHeaderRow]}>
              <Text style={[styles.subHeaderText, { color: c.themes[theme].text }]}>
                Estimated Delivery Date
              </Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('editClient', { edit: 'edd', client })}
                style={{ height: 40, width: 40, borderRadius: 20, ...c.center }}>
                <FFIcons
                  name='edit'
                  size={20}
                  color={c.themes[theme].text} />
              </TouchableOpacity>
            </View>
            <View style={[styles.row, { justifyContent: 'center' }]}>
              <MCIcons
                name='calendar-heart'
                size={25}
                color={c.themes[theme].accent} />
              <View style={[styles.textInput, { height: 40, justifyContent: 'center', borderColor: c.themes[theme].border }]}>
                <Text style={[{ fontSize: 16, color: c.themes[theme].text }]}>
                  {new Date(edd).toDateString()}
                </Text>
              </View>
            </View>
            {/* RH STATUS */}
            <>
              <View style={[styles.row, styles.subHeaderRow]}>
                <Text style={[styles.subHeaderText, { color: c.themes[theme].text }]}>
                  Rh Status
                </Text>

                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('editClient', { edit: 'rh', client })}
                  style={{ height: 40, width: 40, borderRadius: 20, ...c.center }}>
                  <FFIcons
                    name='edit'
                    size={20}
                    color={c.themes[theme].text} />
                </TouchableOpacity>
              </View>
              <View style={[styles.row, { justifyContent: 'center' }]}>
                <View
                  style={{
                    height: 20,
                    width: 20,
                    borderRadius: 20 / 2,
                    backgroundColor: c.themes[theme].accent,
                    ...c.center }}>
                  {this.renderRhIcon(rh)}
                </View>
                <View style={[styles.textInput, { height: 40, justifyContent: 'center', borderColor: c.themes[theme].border }]}>
                  <Text style={[{ fontSize: 16, color: c.themes[theme].text }]}>
                    {rh.charAt(0).toUpperCase() + rh.substr(1)}
                  </Text>
                </View>
              </View>
            </>

            {/* GBS STATUS */}
            <>
              <View style={[styles.row, styles.subHeaderRow]}>
                <Text style={[styles.subHeaderText, { color: c.themes[theme].text }]}>
                  GBS Status
                </Text>

                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('editClient', { edit: 'gbs', client })}
                  style={{ height: 40, width: 40, borderRadius: 20, ...c.center }}>
                  <FFIcons
                    name='edit'
                    size={20}
                    color={c.themes[theme].text} />
                </TouchableOpacity>
              </View>
              <View style={[styles.row, { justifyContent: 'center' }]}>
                <View
                  style={{
                    height: 20,
                    width: 20,
                    borderRadius: 20 / 2,
                    backgroundColor: c.themes[theme].accent,
                    ...c.center }}>
                  {this.renderGbsIcon(scrubbedGbs)}
                </View>
                <View style={[styles.textInput, { height: 40, justifyContent: 'center', borderColor: c.themes[theme].border }]}>
                  <Text style={[{ fontSize: 16, color: c.themes[theme].text }]}>
                    {scrubbedGbs.charAt(0).toUpperCase() + scrubbedGbs.substr(1)}
                  </Text>
                </View>
              </View>
            </>

          </View>

          {false && this.renderBabies()}
          {false &&
            // Removing show add baby for now
            (
              <TouchableOpacity
                style={[styles.sectionContainer, { backgroundColor: c.themes[theme].modal, borderColor: c.themes[theme].border }]}
                onPress={this.onPressAddBaby}>
                <View style={[styles.row, { padding: 10, justifyContent: 'center' }]}>
                    <FFIcons style={{ marginHorizontal: 10 }} name='plus' size={30} color={c.themes[theme].text} />
                    <FFIcons style={{ marginHorizontal: 10 }} name='baby' size={30} color={c.themes[theme].text} />
                </View>
              </TouchableOpacity>
            )}

          <TouchableOpacity
            style={[styles.sectionContainer, { backgroundColor: c.themes[theme].modal, borderColor: c.themes[theme].border }]}
            onPress={this.onPressDeleteClient}>
            <View style={[styles.row, { padding: 5, justifyContent: 'center' }]}>
                <MCIcons style={{ marginHorizontal: 10 }} name='account-remove' size={40} color={c.themes[theme].text} />
            </View>
          </TouchableOpacity>
        </ScrollView>
      );
    }

  renderNotes() {
    let { theme, route } = this.props;
    // Client is defined via an IF because if the client is deleted, then while the modal is being dismissed reduxRefreshedClient will be null, breaking the component
    // With the IF we use a copy of client created on mount
    const reduxRefreshedClient = this.props.clients.find((cl, i) => (cl.id === route.params.client.id));
    let client = undefined;
    if (!reduxRefreshedClient) {
      client = this.state.client;
    } else {
      client = reduxRefreshedClient;
    }
    // take the notes array from redux state and check if there is a legacy note from the previous schema available. if there is, add that to the array
    //console.log('notes state', this.props.notes);
    let formattedNoteArray =  this.props.notes.filter((note, i) => (note.clientId === this.props.route.params.client.id));
    formattedNoteArray = client.notes ? [
      ...formattedNoteArray,
      { id: `legacy`, clientId: client.id, title: "Previous Notes", body: client.notes, time: 0 }
    ] : formattedNoteArray;
    // Sort notes chonologicaly
    formattedNoteArray = formattedNoteArray.sort((a, b) => (a.time < b.time));
    const Notes = () => {
      if (!formattedNoteArray.length) {
        return (
          <View
            style={[styles.sectionContainer, { backgroundColor: c.themes[theme].modal, borderColor: c.themes[theme].border }]}>
              <View style={[styles.row]}>
                <View style={{ marginTop: 10 }}>
                  <Text style={[styles.subHeaderText, { color: c.themes[theme].text }]}>
                    Client notes go here!
                  </Text>
                </View>
              </View>

              <View style={[styles.row, { justifyContent: 'center' }]}>

                <View style={[styles.textInput, { minHeight: 40, paddingVertical: 5, borderBottomWidth: 0 }]}>
                  <Text style={[{ fontSize: 16, color: c.themes[theme].text }]}>
                    Click the button below to add this clients first note.
                  </Text>
                </View>
              </View>
          </View>
        )
      } else {
        return formattedNoteArray.map((note, i) => (
          <View
            style={[styles.sectionContainer, { backgroundColor: c.themes[theme].modal, borderColor: c.themes[theme].border }]}
            key={note.id}>
              <View style={[styles.row]}>
                <View style={{ marginTop: 10 }}>
                  <Text style={[styles.subHeaderText, { color: c.themes[theme].text }]}>
                    {note.title}
                  </Text>

                  {note.time !== 0 &&
                    <Text style={{ color: c.themes[theme].text, fontSize: 14 }}>
                      {new Date(note.time).toString().slice(4, 21)}
                    </Text>
                  }

                </View>

                <TouchableOpacity
                  onPress={() => this.onPressDeleteNote(note.id)}
                  style={{ height: 40, width: 40, borderRadius: 20, ...c.center }}>
                  <MCIcons
                    name='delete-forever'
                    size={30}
                    color={'red'} />
                </TouchableOpacity>
              </View>

              <View style={[styles.row, { justifyContent: 'center' }]}>

                <View style={[styles.textInput, { minHeight: 40, paddingVertical: 5, borderBottomWidth: 0 }]}>
                  <Text style={[{ fontSize: 16, color: c.themes[theme].text }]}>
                    {note.body}
                  </Text>
                </View>
              </View>
          </View>
        ))
      }
    }

    return (
      <>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.body}>
          <Notes />
        </ScrollView>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('addNote', { edit: 'notes', client })}
          style={[styles.addButton, { borderColor: c.themes[theme].border, backgroundColor: c.themes[theme].accent }]}>
          <MCIcons
            name='note-plus-outline'
            size={30}
            color={c.themes[theme].lightText} />
        </TouchableOpacity>
      </>
    );
  }

  render() {
    let { theme, route } = this.props;
    // Client is defined via an IF because if the client is deleted, then while the modal is being dismissed reduxRefreshedClient will be null, breaking the component
    // With the IF we use a copy of client created on mount
    const reduxRefreshedClient = this.props.clients.find((cl, i) => (cl.id === route.params.client.id));
    let client = undefined;
    if (!reduxRefreshedClient) {
      client = this.state.client;
    } else { client = reduxRefreshedClient; }
    const { first, last, preferred } = client.name;
    const { street, city, province, country } = client.address
    const { dob, edd, notes, rh, phones, gbs } = client;
    // As Gbs is being added in after the app was released, some clients may not have a GBS value. For those clients, the value is 'unkown'
    let scrubbedGbs = gbs || 'unknown';
    // Formatting of the address string is done here to avoid blank spaces created from extra \n
    let adrStr = street ? `${street},` : '';
    adrStr && city ? adrStr += `\n${city},` : adrStr += city;
    adrStr && province ? adrStr += `\n${province},` : adrStr += province;
    adrStr && country ? adrStr += `\n${country}` : adrStr += country;

    return (
      <View style={[styles.container, { backgroundColor: c.themes[theme].background, borderColor: c.themes[theme].border }]}>
        <View style={[styles.header, { backgroundColor: c.themes[theme].accent }]}>
          <View style={{ flex: 2, width: '90%', justifyContent: 'center', paddingLeft: 0, borderBottomWidth: 0.5, borderColor: c.themes[theme].border }}>
            <Text style={[{ color: c.themes[theme].lightText, fontSize: 25 }, c.titleFont]}>
              {first}{last ? ` ${last}` : ''}
            </Text>
            <Text style={[{ color: c.themes[theme].lightText, fontSize: 16 }, c.titleFont]}>
              {client.name.preferred}
            </Text>
            {/* NAME EDIT */}
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('editClient', { edit: 'name', client })}
              style={{ position: 'absolute', right: 10, height: 40, width: 40, borderRadius: 20, ...c.center }}>
              <FFIcons
                name='edit'
                size={20}
                color={c.themes[theme].lightText} />
            </TouchableOpacity>

          </View>

          <View style={{ flex: 1, width: '100%', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => this.pageScroll.scrollTo({ x: 0, y: 0, animated: true })}
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={[styles.subHeaderText, { color: c.themes[theme].lightText }]}>
                Client Details
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.pageScroll.scrollTo({ x: c.device.width , y: 0, animated: true })}
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={[styles.subHeaderText, { color: c.themes[theme].lightText }]}>
                Notes
              </Text>
            </TouchableOpacity>
            <Animated.View style={{
              position: 'absolute',
              width: '50%',
              justifyContent: 'center',
              alignItems: 'center',
              height: 4,
              bottom: 2,
              transform: this.scrollPosition.getTranslateTransform() }}>
              <View
              style={{
                width: '80%',
                height: 1.5,
                backgroundColor: c.themes[theme].lightText }} />
            </Animated.View>
          </View>

        </View>
        <ScrollView
          ref={(sv) => this.pageScroll = sv}
          showsHorizontalScrollIndicator={false}
          onScroll={(evt) => Animated.spring(this.scrollPosition, { toValue: { x: evt.nativeEvent.contentOffset.x / 2, y: 0 }, useNativeDriver: false }).start()}
          horizontal={true}
          pagingEnabled={true}>
        <View style={styles.pageContainer}>
          {this.renderDetails()}
        </View>
        <View style={styles.pageContainer}>
          {this.renderNotes()}
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
  pageContainer: {
    flex: 1,
    width: c.device.width * 0.9725,
  },
  body: {
    flex: 1,
    width: '98%',
    alignSelf: 'center'
  },
  sectionContainer: {
    flex: 0,
    width: '100%',
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
    marginTop: 10,
  },
  subHeaderText: {
    fontSize: 20,
    ...c.titleFont
  },
  textInput: {
    flex: 1,
    borderBottomWidth: 0.5,
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
  },
  addButton: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    position: 'absolute',
    bottom: 10,
    right: 5,
    elevation: 5,
    borderWidth: 1
  },
}


export default ViewClient;
