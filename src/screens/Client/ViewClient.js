import React, {Component} from 'react';
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
  Animated,
} from 'react-native';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FFIcons from 'react-native-vector-icons/FontAwesome5';
import AIcons from 'react-native-vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';
import EIcons from 'react-native-vector-icons/Entypo';
import Toast from 'react-native-toast-message';
import axios from 'axios';

const c = require('../../assets/constants');

class ViewClient extends Component {
  constructor(props) {
    super(props);
    this.pageScroll = null;
    this.scrollPosition = new Animated.ValueXY();
    this.addNoteModal = null;
    this.client = undefined;
    this.state = {
      showDobPicker: false,
    };
  }

  componentDidMount() {
    this.setState({
      ...this.state,
      client: this.props.route.params.client,
      showDobPicker: false,
    });
    console.log(this.props.route.params.client);
  }

  //  ---  On Press Functions  ---  //

  onPressDeleteClient = () => {
    let {name, id} = this.state.client;
    Alert.alert(
      `Delete ${`${name.first} ${name.last}` || name.preferred || 'Client'}?`,
      'Are you sure you want to delete this client? You will not be able to recover their information.',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            this.props.deleteClient(id);
            this.props.navigation.pop();
          },
        },
      ],
    );
  };

  onPressDeleteNote(noteId) {
    let {id} = this.state.client;
    Alert.alert(
      'Delete Note?',
      'Are you sure you want to delete this note? You will not be able to recover the note.',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            // if the note is a legacy note we overwrite the client object and remove the notes field
            if (noteId === 'legacy') {
              this.props.updateClient({...this.state.client, notes: ''});
            } else {
              this.props.deleteNote(noteId);
            }
          },
        },
      ],
    );
  }

  onPressNewNote = () => {};

  //  ---  Render Functions  ---  //

  renderPhoneNumbers() {
    let {theme} = this.props;
    const sty = style(this.props.theme);
    let phones = this.client.phones;
    if (!phones.join(''))
      return (
        <TouchableOpacity
          onLongPress={() => this.edit('phones')}
          style={[styles.row]}>
          <MCIcons name="phone" size={25} color={c.themes[theme].accent} />
          <View style={sty.clientInfo}>
            <Text style={sty.infoText}>Hold to add phone</Text>
          </View>
        </TouchableOpacity>
      );
    return phones.map((phone, i) =>
      phone ? (
        <View style={[styles.row]}>
          <MCIcons
            name={i === 2 ? 'phone-alert' : 'phone'}
            size={25}
            color={c.themes[theme].accent}
          />
          <TouchableOpacity
            style={sty.clientInfo}
            onLongPress={() => this.edit('phones')}
            onPress={() => Linking.openURL(`tel:${phone}`)}>
            <Text style={sty.infoText}>{phone}</Text>
          </TouchableOpacity>
        </View>
      ) : null,
    );
  }

  renderRhIcon(rh) {
    let {theme} = this.props;
    const size = 31;
    switch (rh) {
      case 'positive':
        return (
          <MCIcons
            name="plus"
            size={20 / 2}
            color={c.themes[theme].lightText}
          />
        );
      case 'negative':
        return (
          <MCIcons
            name="minus"
            size={20 / 2}
            color={c.themes[theme].lightText}
          />
        );
      default:
        return (
          <FFIcons
            name="question"
            size={20 / 2}
            color={c.themes[theme].lightText}
          />
        );
    }
  }

  renderGbsIcon(gbs) {
    let {theme} = this.props;
    const size = 31;
    switch (gbs) {
      case 'positive':
        return (
          <MCIcons
            name="plus"
            size={20 / 2}
            color={c.themes[theme].lightText}
          />
        );
      case 'negative':
        return (
          <MCIcons
            name="minus"
            size={20 / 2}
            color={c.themes[theme].lightText}
          />
        );
      default:
        return (
          <FFIcons
            name="question"
            size={20 / 2}
            color={c.themes[theme].lightText}
          />
        );
    }
  }

  renderDetails() {
    let {theme} = this.props;
    const thm = c.themes[theme];
    const sty = style(this.props.theme);
    let {client} = this;
    const {street, city} = client.address;
    const {dob, edd, rh, phones, gbs} = client;
    let age;
    if (dob) {
      age = new Date(dob);
      age = new Date(Date.now() - age.getTime());
      age = Math.abs(age.getUTCFullYear() - 1970) + '';
    } else {
      age = client?.age || 'Add age';
    }
    // As Gbs is being added in after the app was released, some clients may not have a GBS value. For those clients, the value is 'unkown'
    let scrubbedGbs = gbs || 'unknown';
    let adrTxt = (street && `${street},`) + (city && `\n${city}`);
    const adrUrl = `https://www.google.ca/maps/search/${adrTxt.replace(
      /\s/g,
      '+',
    )}`;
    return (
      <ScrollView showsVerticalScrollIndicator={false} style={styles.body}>
        <View style={sty.sectionContainer}>
          {/* Address */}
          <View style={sty.subHeaderRow}>
            <Text style={sty.subHeaderText}>Address</Text>
          </View>
          <TouchableOpacity
            onPress={() => adrTxt && Linking.openURL(adrUrl)}
            onLongPress={() => this.edit('address')}
            style={[styles.row]}>
            <EIcons name="address" size={25} color={c.themes[theme].accent} />
            <View style={sty.clientInfo}>
              <Text style={sty.infoText}>
                {adrTxt || 'Hold to add address'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Phones */}
          <View style={sty.subHeaderRow}>
            <Text style={sty.subHeaderText}>Phone Numbers</Text>
          </View>
          {this.renderPhoneNumbers(phones)}

          {/* AGE */}
          <View style={sty.subHeaderRow}>
            <Text style={sty.subHeaderText}>Age</Text>
          </View>
          <View style={[styles.row]}>
            <MCIcons
              name="cake-variant-outline"
              size={25}
              color={c.themes[theme].accent}
            />
            <TouchableOpacity
              style={sty.clientInfo}
              onPress={() => this.edit('age')}>
              <Text style={sty.infoText}>{age}</Text>
            </TouchableOpacity>
          </View>

          {/* DOB */}
          <View style={sty.subHeaderRow}>
            <Text style={sty.subHeaderText}>Date of Birth</Text>
          </View>
          <TouchableOpacity
            style={sty.rowButton}
            onPress={() => this.setState({showDobPicker: true})}>
            <Text style={{color: thm.text}}>
              {client.dob
                ? new Date(client.dob).toDateString()
                : 'Press to enter DoB'}
            </Text>
          </TouchableOpacity>
          {this.state.showDobPicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={new Date(client.dob)}
              accentColor={thm.accent}
              mode="date"
              is24Hour={true}
              onChange={(e, date) => {
                this.setState({showDobPicker: false});
                if (date.toDateString() !== new Date(dob).toDateString()) {
                  this.props.updateClient({...client, dob: date});
                }
              }}
            />
          )}

          {/* EDD */}
          <View style={[styles.row, styles.subHeaderRow]}>
            <Text style={[styles.subHeaderText, {color: c.themes[theme].text}]}>
              Estimated Delivery Date
            </Text>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('editClient', {
                  edit: 'edd',
                  client,
                })
              }
              style={{height: 40, width: 40, borderRadius: 20, ...c.center}}>
              <FFIcons name="edit" size={20} color={c.themes[theme].text} />
            </TouchableOpacity>
          </View>
          <View style={[styles.row, {justifyContent: 'center'}]}>
            <MCIcons
              name="calendar-heart"
              size={25}
              color={c.themes[theme].accent}
            />
            <View
              style={[
                styles.textInput,
                {
                  height: 40,
                  justifyContent: 'center',
                  borderColor: c.themes[theme].border,
                },
              ]}>
              <Text style={[{fontSize: 16, color: c.themes[theme].text}]}>
                {new Date(edd).toDateString()}
              </Text>
            </View>
          </View>
          {/* RH STATUS */}
          <>
            <View style={[styles.row, styles.subHeaderRow]}>
              <Text
                style={[styles.subHeaderText, {color: c.themes[theme].text}]}>
                Rh Status
              </Text>

              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('editClient', {
                    edit: 'rh',
                    client,
                  })
                }
                style={{height: 40, width: 40, borderRadius: 20, ...c.center}}>
                <FFIcons name="edit" size={20} color={c.themes[theme].text} />
              </TouchableOpacity>
            </View>
            <View style={[styles.row, {justifyContent: 'center'}]}>
              <View
                style={{
                  height: 20,
                  width: 20,
                  borderRadius: 20 / 2,
                  backgroundColor: c.themes[theme].accent,
                  ...c.center,
                }}>
                {this.renderRhIcon(rh)}
              </View>
              <View
                style={[
                  styles.textInput,
                  {
                    height: 40,
                    justifyContent: 'center',
                    borderColor: c.themes[theme].border,
                  },
                ]}>
                <Text style={[{fontSize: 16, color: c.themes[theme].text}]}>
                  {rh.charAt(0).toUpperCase() + rh.substr(1)}
                </Text>
              </View>
            </View>
          </>

          {/* GBS STATUS */}
          <>
            <View style={[styles.row, styles.subHeaderRow]}>
              <Text
                style={[styles.subHeaderText, {color: c.themes[theme].text}]}>
                GBS Status
              </Text>

              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('editClient', {
                    edit: 'gbs',
                    client,
                  })
                }
                style={{height: 40, width: 40, borderRadius: 20, ...c.center}}>
                <FFIcons name="edit" size={20} color={c.themes[theme].text} />
              </TouchableOpacity>
            </View>
            <View style={[styles.row, {justifyContent: 'center'}]}>
              <View
                style={{
                  height: 20,
                  width: 20,
                  borderRadius: 20 / 2,
                  backgroundColor: c.themes[theme].accent,
                  ...c.center,
                }}>
                {this.renderGbsIcon(scrubbedGbs)}
              </View>
              <View
                style={[
                  styles.textInput,
                  {
                    height: 40,
                    justifyContent: 'center',
                    borderColor: c.themes[theme].border,
                  },
                ]}>
                <Text style={[{fontSize: 16, color: c.themes[theme].text}]}>
                  {scrubbedGbs.charAt(0).toUpperCase() + scrubbedGbs.substr(1)}
                </Text>
              </View>
            </View>
          </>
        </View>

        <TouchableOpacity
          style={[
            styles.sectionContainer,
            {
              backgroundColor: c.themes[theme].modal,
              borderColor: c.themes[theme].border,
            },
          ]}
          onPress={this.onPressDeleteClient}>
          <View style={[styles.row, {padding: 5, justifyContent: 'center'}]}>
            <MCIcons
              style={{marginHorizontal: 10}}
              name="account-remove"
              size={40}
              color={c.themes[theme].text}
            />
          </View>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  renderNotes() {
    let {theme, route} = this.props;
    let {client} = this;
    // take the notes array from redux state and check if there is a legacy note from the previous schema available. if there is, add that to the array
    let formattedNoteArray = this.props.notes.filter(
      (note, i) => note.clientId === this.props.route.params.client.id,
    );
    formattedNoteArray = client.notes
      ? [
          ...formattedNoteArray,
          {
            id: 'legacy',
            clientId: client.id,
            title: 'Previous Notes',
            body: client.notes,
            time: 0,
          },
        ]
      : formattedNoteArray;
    // Sort notes chonologicaly
    formattedNoteArray = formattedNoteArray.sort((a, b) => a.time < b.time);
    const Notes = () => {
      if (!formattedNoteArray.length) {
        return (
          <View
            style={[
              styles.sectionContainer,
              {
                backgroundColor: c.themes[theme].modal,
                borderColor: c.themes[theme].border,
              },
            ]}>
            <View style={[styles.row]}>
              <View style={{marginTop: 10}}>
                <Text
                  style={[styles.subHeaderText, {color: c.themes[theme].text}]}>
                  Client notes go here!
                </Text>
              </View>
            </View>

            <View style={[styles.row, {justifyContent: 'center'}]}>
              <View
                style={[
                  styles.textInput,
                  {minHeight: 40, paddingVertical: 5, borderBottomWidth: 0},
                ]}>
                <Text style={[{fontSize: 16, color: c.themes[theme].text}]}>
                  Click the button below to add this clients first note.
                </Text>
              </View>
            </View>
          </View>
        );
      } else {
        return formattedNoteArray.map((note, i) => (
          <View
            style={[
              styles.sectionContainer,
              {
                backgroundColor: c.themes[theme].modal,
                borderColor: c.themes[theme].border,
              },
            ]}
            key={note.id}>
            <View style={[styles.row]}>
              <View style={{marginTop: 10}}>
                <Text
                  style={[styles.subHeaderText, {color: c.themes[theme].text}]}>
                  {note.title}
                </Text>

                {note.time !== 0 && (
                  <Text style={{color: c.themes[theme].text, fontSize: 14}}>
                    {new Date(note.time).toString().slice(4, 21)}
                  </Text>
                )}
              </View>

              <TouchableOpacity
                onPress={() => this.onPressDeleteNote(note.id)}
                style={{height: 40, width: 40, borderRadius: 20, ...c.center}}>
                <MCIcons name="delete-forever" size={30} color={'red'} />
              </TouchableOpacity>
            </View>

            <View style={[styles.row, {justifyContent: 'center'}]}>
              <View
                style={[
                  styles.textInput,
                  {minHeight: 40, paddingVertical: 5, borderBottomWidth: 0},
                ]}>
                <Text style={[{fontSize: 16, color: c.themes[theme].text}]}>
                  {note.body}
                </Text>
              </View>
            </View>
          </View>
        ));
      }
    };

    return (
      <>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.body}>
          <Notes />
        </ScrollView>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('addNote', {edit: 'notes', client})
          }
          style={[
            styles.addButton,
            {
              borderColor: c.themes[theme].border,
              backgroundColor: c.themes[theme].accent,
            },
          ]}>
          <MCIcons
            name="note-plus-outline"
            size={30}
            color={c.themes[theme].lightText}
          />
        </TouchableOpacity>
      </>
    );
  }

  edit(field) {
    // Client is defined via an IF because if the client is deleted, then while the modal is being dismissed reduxRefreshedClient will be null, breaking the component
    // With the IF we use a copy of client created on mount
    const reduxRefreshedClient = this.props.clients.find(
      (cl, i) => cl.id === this.props.route.params.client.id,
    );
    let client;
    if (!reduxRefreshedClient) {
      client = this.state.client;
    } else {
      client = reduxRefreshedClient;
    }

    this.props.navigation.navigate('editClient', {
      edit: field,
      client,
    });
  }

  holdToEditToast(pos = 'bottom') {
    Toast.show({
      type: 'info',
      visibilityTime: 1500,
      position: 'bottom',
      text1: 'Hold to edit',
    });
  }
  /***
  Client should appear static, but on press of info a change event happens.
  If the stringified body of the client data changes, a save button sould appaer
  user must press save button for data to be saved
***/
  clientVariableSet() {
    // Client is defined via an IF because if the client is deleted, then while the modal is being dismissed reduxRefreshedClient will be null, breaking the component
    // With the IF we use a copy of client created on mount
    // reduxRefreshedClient is the most recently updated version of our client in redux
    const reduxRefreshedClient = this.props.clients.find(
      (cl, i) => cl.id === this.props.route.params.client.id,
    );
    this.client = reduxRefreshedClient || this.state.client;
  }

  render() {
    this.clientVariableSet();
    const sty = style(this.props.theme);
    const thm = c.themes[this.props.theme];
    const scrollTo = this?.pageScroll?.scrollTo;
    const scrollTrans = this.scrollPosition.getTranslateTransform();
    const {first, last, preferred} = this.client.name;
    return (
      <View style={sty.container}>
        <View style={sty.header}>
          <TouchableOpacity
            style={sty.nameContainer}
            onPress={this.holdToEditToast}
            onLongPress={() => this.edit('name')}>
            <Text style={[sty.title, {fontSize: 25}]}>
              {first}
              {last ? ` ${last}` : ''}
            </Text>
            {preferred && <Text style={sty.title}>{preferred}</Text>}
          </TouchableOpacity>

          <View style={sty.headerButtonContainer}>
            <TouchableOpacity
              onPress={() => scrollTo({x: 0, animated: true})}
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={[sty.subHeaderText, {color: thm.lightText}]}>
                Client Details
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => scrollTo({x: c.device.width, animated: true})}
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={[sty.subHeaderText, {color: thm.lightText}]}>
                Notes
              </Text>
            </TouchableOpacity>

            <Animated.View style={[sty.indContainer, {transform: scrollTrans}]}>
              <View style={sty.indicator} />
            </Animated.View>
          </View>
        </View>

        <ScrollView
          ref={sv => (this.pageScroll = sv)}
          showsHorizontalScrollIndicator={false}
          onScroll={evt =>
            Animated.spring(this.scrollPosition, {
              toValue: {x: evt.nativeEvent.contentOffset.x / 2, y: 0},
              useNativeDriver: false,
            }).start()
          }
          horizontal={true}
          pagingEnabled={true}>
          <View style={styles.pageContainer}>{this.renderDetails()}</View>
          <View style={styles.pageContainer}>{this.renderNotes()}</View>
        </ScrollView>
      </View>
    );
  }
}

const style = (theme = 'light') => ({
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
    backgroundColor: c.themes[theme].background,
    borderColor: c.themes[theme].border,
  },
  header: {
    height: 100,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: c.themes[theme].accent,
  },
  nameContainer: {
    flex: 2,
    width: '90%',
    justifyContent: 'center',
    paddingLeft: 0,
    borderBottomWidth: 0.5,
    borderColor: c.themes[theme].border,
  },
  headerButtonContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  title: {
    ...c.titleFont,
    color: c.themes[theme].lightText,
    fontSize: 16,
  },
  indContainer: {
    position: 'absolute',
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 4,
    bottom: 2,
  },
  indicator: {
    width: '80%',
    height: 1.5,
    backgroundColor: c.themes[theme].lightText,
  },
  pageContainer: {
    flex: 1,
    width: c.device.width * 0.9725,
  },
  body: {
    flex: 1,
    width: '98%',
    alignSelf: 'center',
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
    backgroundColor: c.themes[theme].modal,
    borderColor: c.themes[theme].border,
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
    color: c.themes[theme].text,
    ...c.titleFont,
  },
  clientInfo: {
    flex: 1,
    borderBottomWidth: 0.5,
    fontSize: 16,
    marginHorizontal: 10,
    minHeight: 40,
    justifyContent: 'center',
    borderColor: c.themes[theme].border,
  },
  infoText: {
    fontSize: 16,
    color: c.themes[theme].text,
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
  textInput: {
    flex: 1,
    borderBottomWidth: 0.5,
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
    borderWidth: 1,
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
  pageContainer: {
    flex: 1,
    width: c.device.width * 0.9725,
  },
  body: {
    flex: 1,
    width: '98%',
    alignSelf: 'center',
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
    ...c.titleFont,
  },
  textInput: {
    flex: 1,
    borderBottomWidth: 0.5,
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
    borderWidth: 1,
  },
};

export default ViewClient;
