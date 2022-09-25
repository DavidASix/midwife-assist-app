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
    this.initialState = {
      newNote: !this.props?.note?.id,
      title: this.props.note?.title || '',
      body: this.props.note?.body || '',
    };
    this.state = {...this.state, ...this.initialState};
  }

  onSubmit = () => {
    let {newNote, title, body} = this.state;
    let note = {
      ...this.props.note,
      title,
      body,
      editTime: Date.now(),
    };
    if (newNote) {
      note.editTime = undefined;
      note.id = c.randomString();
    }
    this.props.onPressSubmit(note);
  };

  render() {
    const thm = c.themes[this.props.theme];
    const sty = style(this.props.theme);
    return (
      <>
        <View style={sty.subHeaderRow}>
          <Text style={sty.subHeaderText}>Notes</Text>
        </View>
        <View style={sty.row}>
          <TextInput
            style={[sty.textInput, {fontSize: 20}]}
            onChangeText={title => this.setState({title})}
            value={this.state.title}
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect={true}
            maxLength={100}
            multiline
            placeholder="Note Title"
            placeholderTextColor={thm.text + 60}
          />
        </View>
        <View style={sty.row}>
          <TextInput
            style={sty.textInput}
            onChangeText={body => this.setState({body})}
            value={this.state.body}
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect={true}
            maxLength={512}
            multiline
            placeholder="Client Notes"
            placeholderTextColor={thm.text + 60}
          />
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
