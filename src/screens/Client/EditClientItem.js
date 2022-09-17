import React, {Component} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';

const c = require('../../assets/constants');

class EditClientItem extends Component {
  constructor(props) {
    super(props);
    this.initialState = {};
    this.state = this.initialState;
  }

  renderEditType() {
    const thm = c.themes[this.props.theme];
    const sty = style(this.props.theme);
    const types = [
      {var: 'street', title: 'Street', autoComplete: 'street-address'},
      {var: 'city', title: 'City', autoComplete: undefined},
    ];
    const numberTypes = ['Primary', 'Secondary', 'Emergency'];
    switch (this.props.selectedEdit) {
      case 'address':
        return types.map((type, i) => (
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
        ));
      case 'phones':
        return [...Array(3).keys()].map(i => (
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
        ));
      case 'age':
        return (
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
        );
      default:
        return <Text>Something went wrong, please select a field to edit</Text>;
    }
  }

  render() {
    const thm = c.themes[this.props.theme];
    const sty = style(this.props.theme);
    /* Receives the following props:
      title={this.editTypes[this.state.selectedEdit].title}
      itemType={this.state.selectedEdit}
      theme={this.props.theme}
      onPressSubmit={body => console.log(body)}
    */
    /*
    Will send back just the edited data into onPressSubmit, which will be added to the current client obj and submitted to the db
    */
    return (
      <>
        <View style={sty.subHeaderRow}>
          <Text style={sty.subHeaderText}>{this.props.title}</Text>
        </View>
        {this.renderEditType()}
        <TouchableOpacity style={sty.submit} onPress={this.onPressSubmit}>
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

export default EditClientItem;
