import React, {Component} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';

const c = require('../../assets/constants');

class NoteModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.resetState();
  }

  resetState() {
    this.initialState = {};
    this.state = {...this.state, ...this.initialState};
  }

  onSubmit = () => {
    let editData = {};
    this.props.onPressSubmit(editData);
  };

  render() {
    const thm = c.themes[this.props.theme];
    const sty = style(this.props.theme);
    return (
      <>
        <View style={sty.subHeaderRow}>
          <Text style={sty.subHeaderText}>Notes</Text>
        </View>
        <TouchableOpacity style={sty.submit} onPress={this.onSubmit}>
          <Text style={[{color: thm.lightText}]}>Submit</Text>
        </TouchableOpacity>
      </>
    );
  }
}

const style = (theme = 'light') => ({
  subHeaderRow: {
    height: 40,
    marginTop: 10,
  },
  subHeaderText: {
    fontSize: 20,
    color: c.themes[theme].text,
    ...c.titleFont,
  },
  row: {
    width: '100%',
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  textInput: {
    borderColor: c.themes[theme].border,
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

export default NoteModal;
