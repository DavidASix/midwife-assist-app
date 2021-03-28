import React, { Component } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import DatePicker from 'react-native-date-picker'
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const c = require('../../assets/constants');

class CalculatorInfo extends Component {
  constructor(props) {
    super(props);
    this.initialState = {};
    this.state = this.initialState;
  }
  render() {
    const { theme } = this.props;
    const textColor = { color: c.themes[theme].text };
    return (
      <View style={styles.container}>
        <View style={[styles.modal, { backgroundColor: c.themes[theme].background, borderColor: c.themes[theme].border }]}>
          <TouchableOpacity style={[styles.row, c.center]} onPress={() => this.props.navigation.pop()}>
            <MCIcons
              name='chevron-down'
              size={40}
              color={c.themes[theme].accent} />
          </TouchableOpacity>
          <View style={styles.infoRow}>
            <Text style={[styles.infoRowText, textColor, { flex: 1 }]}>
              GA:
            </Text>
            <Text style={[styles.infoRowText, textColor, { flex: 3, fontSize: 16 }]}>
              Gestational Age
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoRowText, textColor, { flex: 1 }]}>
              LMP:
            </Text>
            <Text style={[styles.infoRowText, textColor, { flex: 3, fontSize: 16 }]}>
              Last Mensteral Period
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoRowText, textColor, { flex: 1 }]}>
              EDD:
            </Text>
            <Text style={[styles.infoRowText, textColor, { flex: 3, fontSize: 16 }]}>
              Estimated Delivery Date
            </Text>
          </View>

          <View style={{ flex: 1, width: '80%', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ height: 1, width: '100%', backgroundColor: c.themes[theme].border }} />
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoRowTextSmall, textColor, { flex: 1 }]}>
              These calculations use the same method as "pregnancy wheels".
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoRowTextSmall, textColor, { flex: 1 }]}>
              Accuracy of the calculation depends on the accuracy of the inputted information.
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoRowTextSmall, textColor, { flex: 1 }]}>
              Because of this calculations may be subject to margin of error.
            </Text>
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
    height: 320,
    position: 'absolute',
    bottom: 0
  },
  modal: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '93%',
    flex: 1,
    paddingHorizontal: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    elevation: 5
  },
  infoRow: {
    width: '100%',
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5
  },
  infoRowText: {

  },

  infoRowTextSmall: {
    fontSize: 12
  }
};

export default CalculatorInfo;
