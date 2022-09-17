import React, {Component} from 'react';
import {View, Text} from 'react-native';

const c = require('../../assets/constants');

class EditClientItem extends Component {
  constructor(props) {
    super(props);
    this.initialState = {};
    this.state = this.initialState;
  }

  render() {
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
});

export default EditClientItem;
