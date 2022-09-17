import React, {Component} from 'react';
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  ScrollView,
  Linking,
  Animated,
  Keyboard,
} from 'react-native';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AIcon from 'react-native-vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';
import EIcons from 'react-native-vector-icons/Entypo';
import Toast from 'react-native-toast-message';
import SlideUpModal from '../../components/SlideUpModal/';
import EditClientItem from './EditClientItem';

const c = require('../../assets/constants');

class ViewClient extends Component {
  constructor(props) {
    super(props);
    this.pageScroll = null;
    this.scrollPosition = new Animated.ValueXY();
    this.addNoteModal = null;
    this.client = undefined;
    this.editModal = undefined;
    /* Edit Types are used in the EditClientItem Modal to provide basic metadata */
    this.editTypes = {
      address: {title: 'Address'},
      phones: {title: 'Phone Numbers'},
      age: {title: 'Client Age'},
    };
    this.state = {
      showDobPicker: false,
      showEddPicker: false,
      selectedEdit: 'address',
      editKey: 'randomkey',
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

  edit(field) {
    // A random key is set for the edit component as this forces the current component to unmount
    // and remount, which will refresh the edit components internal state based on the new props provided
    // Essentially destroying, then creating a new editmodal child each time the modal is shown.
    this.setState({editKey: Math.random() + '', selectedEdit: field});
    this.editModal.changeVisibility();
  }

  onSubmitEdit(newDataObject) {
    console.log(newDataObject);
    Keyboard.dismiss();
    this.props.updateClient({...this.client, ...newDataObject});
    this.editModal.changeVisibility();
  }

  holdToEditToast(pos = 'bottom') {
    Toast.show({
      type: 'info',
      visibilityTime: 1500,
      position: 'bottom',
      text1: 'Hold to edit',
    });
  }

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

  renderDetails() {
    let {theme} = this.props;
    const thm = c.themes[theme];
    const sty = style(this.props.theme);
    let {client} = this;
    const {street, city} = client.address;
    const {dob, edd, phones} = client;
    let age;
    if (dob) {
      age = new Date(dob);
      age = new Date(Date.now() - age.getTime());
      age = Math.abs(age.getUTCFullYear() - 1970) + '';
    } else {
      age = client?.age || 'Add age';
    }
    let adrTxt = (street && `${street},`) + (city && `\n${city}`);
    const adrUrl = `https://www.google.ca/maps/search/${adrTxt.replace(
      /\s/g,
      '+',
    )}`;

    const activeRh = type => type === this.client.rh;
    // As Gbs is being added in after the app was released, some clients may not have a GBS value. For those clients, the value is 'unkown'
    const activeGbs = type => type === (this.client.gbs || 'unknown');
    // Status types for RH and GBS
    const statusTypes = [
      {name: 'positive', icon: 'plus'},
      {name: 'negative', icon: 'minus'},
      {name: 'unknown', icon: 'question'},
    ];
    return (
      <ScrollView showsVerticalScrollIndicator={false} style={sty.body}>
        <View style={sty.sectionContainer}>
          {/* Address */}
          <View style={sty.subHeaderRow}>
            <Text style={sty.subHeaderText}>Address</Text>
          </View>
          <TouchableOpacity
            onPress={() => adrTxt && Linking.openURL(adrUrl)}
            onLongPress={() => this.edit('address')}
            style={[sty.row]}>
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
          <View style={[sty.row]}>
            <MCIcons
              name="cake-variant-outline"
              size={25}
              color={c.themes[theme].accent}
            />
            <TouchableOpacity
              style={sty.clientInfo}
              onLongPress={() => this.edit('age')}>
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
                  this.props.updateClient({...client, dob: date, age: ''});
                }
              }}
            />
          )}

          {/* EDD */}
          <View style={sty.subHeaderRow}>
            <Text style={sty.subHeaderText}>Estimated Delivery Date</Text>
          </View>
          <TouchableOpacity
            style={sty.rowButton}
            onPress={() => this.setState({showEddPicker: true})}>
            <Text style={{color: thm.text}}>
              {client.edd
                ? new Date(client.edd).toDateString()
                : 'Press to enter EDD'}
            </Text>
          </TouchableOpacity>
          {this.state.showEddPicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={new Date(client.edd)}
              accentColor={thm.accent}
              mode="date"
              is24Hour={true}
              onChange={(e, date) => {
                this.setState({showEddPicker: false});
                if (date.toDateString() !== new Date(edd).toDateString()) {
                  this.props.updateClient({...client, edd: date});
                }
              }}
            />
          )}

          {/* RH STATUS */}
          <View style={sty.subHeaderRow}>
            <Text style={sty.subHeaderText}>Rh Status</Text>
          </View>
          <View style={[sty.row]}>
            {statusTypes.map((t, i) => (
              <TouchableOpacity
                key={i}
                onPress={this.holdToEditToast}
                onLongPress={() =>
                  this.props.updateClient({...client, rh: t.name})
                }
                style={[
                  sty.iconButton,
                  activeRh(t.name) && {backgroundColor: thm.accent},
                ]}>
                <AIcon
                  name={t.icon}
                  size={15}
                  color={activeRh(t.name) ? thm.modal : thm.text}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* GBS STATUS */}
          <View style={sty.subHeaderRow}>
            <Text style={sty.subHeaderText}>GBS Status</Text>
          </View>
          <View style={[sty.row, {marginBottom: 10}]}>
            {statusTypes.map((t, i) => (
              <TouchableOpacity
                key={i}
                onPress={this.holdToEditToast}
                onLongPress={() =>
                  this.props.updateClient({...client, gbs: t.name})
                }
                style={[
                  sty.iconButton,
                  activeGbs(t.name) && {backgroundColor: thm.accent},
                ]}>
                <AIcon
                  name={t.icon}
                  size={15}
                  color={activeGbs(t.name) ? thm.modal : thm.text}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[sty.sectionContainer, {marginBottom: 15, paddingVertical: 5}]}
          onPress={this.onPressDeleteClient}>
          <View style={[sty.row, {justifyContent: 'center'}]}>
            <MCIcons
              name="account-remove"
              size={25}
              color={thm.accent}
              style={{position: 'absolute', left: 0}}
            />
            <Text style={sty.subHeaderText}>Delete Client</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  renderNotes() {
    let {theme} = this.props;
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
          <View style={sty.pageContainer}>{this.renderDetails()}</View>
          <View style={sty.pageContainer}>{this.renderNotes()}</View>
        </ScrollView>
        <SlideUpModal
          ref={ref => (this.editModal = ref)}
          style={sty.editModal}
          peek={0}>
          <EditClientItem
            key={this.state.editKey || '1'}
            client={this.client}
            title={this.editTypes[this.state.selectedEdit].title}
            selectedEdit={this.state.selectedEdit}
            theme={this.props.theme}
            onPressSubmit={newDataObject => this.onSubmitEdit(newDataObject)}
          />
        </SlideUpModal>
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
    justifyContent: 'space-around',
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
  editModal: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '93%',
    flex: 0,
    padding: 5,
    borderRadius: 10,
    borderWidth: 0.5,
    elevation: 4,
    backgroundColor: c.themes[theme].modal,
    borderColor: c.themes[theme].border,
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
