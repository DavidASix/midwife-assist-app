import React, {Component} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';

const c = require('../../assets/constants');

class EditClientItem extends Component {
  constructor(props) {
    super(props);
    this.state = {stateRefreshed: false};
    this.resetState();
  }

  resetState() {
    let {client} = this.props;
    this.initialState = {
      street: client.address.street || '',
      city: client.address.city || '',
      phone0: client.phones[0] || '',
      phone1: client.phones[1] || '',
      phone2: client.phones[2] || '',
      age: client.age || '',
    };
    this.state = {...this.state, ...this.initialState};
  }

  onSubmit = () => {
    let editData = {
      address: {city: this.state.city, street: this.state.street},
      phones: [this.state.phone0, this.state.phone1, this.state.phone2],
      age: this.state.age,
      dob: this.state.age ? null : this.props.client.dob,
    };
    this.props.onPressSubmit(editData);
  };

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
              onChangeText={text => this.setState({[`phone${i}`]: text})}
              value={this.state[`phone${i}`]}
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
              placeholder={'32'}
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
      key={this.state.editKey || '1'}
      client={this.client}
      title={this.editTypes[this.state.selectedEdit].title}
      selectedEdit={this.state.selectedEdit}
      theme={this.props.theme}
      onPressSubmit={newDataObject => this.onSubmitEdit(newDataObject)}
    */
    return (
      <>
        <View style={sty.subHeaderRow}>
          <Text style={sty.subHeaderText}>{this.props.title}</Text>
        </View>
        {this.renderEditType()}
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

export default EditClientItem;
