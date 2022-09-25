import React, { Component } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert,
  ToastAndroid
} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FFIcons from 'react-native-vector-icons/FontAwesome5';
import AIcons from 'react-native-vector-icons/AntDesign';
import axios from 'axios';

const c = require('../../assets/constants');

class EditClient extends Component {
  constructor(props) {
    super(props);
    this.initialState = {
      title: "",
      body: ""
    };
    this.state = this.initialState;
  }

  componentDidMount() {
    const { params } = this.props.route;
    this.setState({ client: this.props.route.params.client });
  }

  onPressSave = () => {
    let { title, body, client } = this.state;
    if (title && body) {
      let note = {
        id: c.randomString(),
        clientId: this.state.client.id,
        title: this.state.title,
        body: this.state.body,
        time: Date.now()
      }
      this.props.storeNote(note)
      this.props.navigation.pop();
    } else {
      ToastAndroid.showWithGravityAndOffset(
        'Please enter a title & note',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50
      )
    }
  }

  render() {
    const { theme } = this.props;
    const textColor = { color: c.themes[theme].text };

    return (
      <View style={styles.container}>
        <View style={[styles.modal, { backgroundColor: c.themes[theme].background, borderColor: c.themes[theme].border }]}>
          <TouchableOpacity style={[styles.row, c.center, { justifyContent: 'space-between'}]} onPress={() => this.props.navigation.pop()}>
            <Text style={[styles.rowText, textColor, c.titleFont, { flex: 1 }]}>
              Add Note
            </Text>
            <MCIcons
              name='chevron-down'
              size={40}
              color={c.themes[theme].accent} />
          </TouchableOpacity>
          <View style={[styles.row]}>
            <TextInput
              style={[styles.textInput, { fontSize: 20, color: c.themes[theme].text, borderColor: c.themes[theme].border }]}
              onChangeText={text => this.setState({ title: text })}
              value={this.state.title}
              keyboardType='default'
              autoCapitalize='sentences'
              autoCorrect={true}
              maxLength={100}
              multiline
              placeholder='Note Title'
              placeholderTextColor={c.themes[theme].text + 60} />
          </View>
          <View style={[styles.row]}>
            <TextInput
              style={[styles.textInput, { color: c.themes[theme].text, borderBottomWidth: 0 }]}
              onChangeText={text => this.setState({ body: text })}
              value={this.state.body}
              keyboardType='default'
              autoCapitalize='sentences'
              autoCorrect={true}
              maxLength={512}
              multiline
              placeholder='Client Notes'
              placeholderTextColor={c.themes[theme].text + 60} />
          </View>

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
};

export default EditClient;
