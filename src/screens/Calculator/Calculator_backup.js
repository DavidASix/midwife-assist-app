import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  UIManager,
  LayoutAnimation,
  Platform,
  TextInput,
} from 'react-native';
import DatePicker from 'react-native-date-picker';

import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const c = require('../../assets/constants');

import SlideUpModal from '../../SlideUpModal/';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

class Calculator extends Component {
  constructor(props) {
    super(props);
    this.initialState = {
      from: 'EDD',
      weeks: '',
      days: '',
      lmpDate: new Date(Date.now() - 280 * c.t.day),
      eddDate: new Date(Date.now() + 280 * c.t.day),
      gaRecDate: new Date(Date.now()),
    };
    this.state = this.initialState;
  }

  onPressFrom(from) {
    LayoutAnimation.configureNext({
      duration: 700,
      create: {type: 'spring', springDamping: 0.4, property: 'scaleY'},
      update: {type: 'spring', springDamping: 0.4},
    });
    LayoutAnimation.configureNext({
      duration: 50,
      delete: {type: 'easeIn', springDamping: 0.4, property: 'scaleY'},
    });
    this.setState({from});
  }

  renderInputRow() {
    const {from, weeks, days, lmpDate, eddDate, gaRecDate} = this.state;
    const {theme} = this.props;
    // Change what is rendered depending on the type of input selected
    switch (from) {
      case 'GA': {
        // If you remove the borderWidth from the text input container view the app crashes when you switch to EDD
        // Doesn't happen when you switch to LMP.
        //Crash:
        // Attempt to invoke virtual method 'android.view.viewPareny.getParent()' on a null object ref

        return (
          <>
            <View
              style={[
                styles.row,
                {borderWidth: 1, borderColor: 'transparent'},
              ]}>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    borderColor: c.themes[theme].border,
                    color: c.themes[theme].text,
                  },
                ]}
                onChangeText={text => this.setState({weeks: text})}
                value={weeks}
                keyboardType="decimal-pad"
                maxLength={2}
                placeholder="10"
                keyboardAppearance={theme}
                placeholderTextColor={c.themes[theme].text + 60}
              />
              <Text style={{marginHorizontal: 10, color: c.themes[theme].text}}>
                Weeks
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    borderColor: c.themes[theme].border,
                    color: c.themes[theme].text,
                  },
                ]}
                onChangeText={text => {
                  if (parseInt(text) > 6) {
                    this.setState({
                      weeks: `${(parseInt(weeks) || 0) + 1}`,
                      days: `${parseInt(text) % 7}`,
                    });
                  } else {
                    this.setState({days: text});
                  }
                }}
                value={days}
                keyboardType="decimal-pad"
                maxLength={1}
                placeholder="4"
                keyboardAppearance={theme}
                placeholderTextColor={c.themes[theme].text + 60}
              />
              <Text style={{marginHorizontal: 10, color: c.themes[theme].text}}>
                Days
              </Text>
            </View>

            <View style={{flex: 1, justifyContent: 'center'}}>
              <Text style={{fontSize: 14, color: c.themes[theme].text}}>
                GA recorded on:
              </Text>
            </View>

            <DatePicker
              mode="date"
              date={gaRecDate}
              textColor={c.themes[theme].text}
              fadeToColor={c.themes[theme].modal}
              style={{height: 100}}
              onDateChange={newDate => this.setState({gaRecDate: newDate})}
            />
          </>
        );
      }
      case 'LMP': {
        return (
          <>
            <DatePicker
              mode="date"
              date={lmpDate}
              textColor={c.themes[theme].text}
              fadeToColor={c.themes[theme].modal}
              style={{height: 100}}
              onDateChange={newDate => this.setState({lmpDate: newDate})}
            />
          </>
        );
      }
      case 'EDD': {
        return (
          <>
            <DatePicker
              mode="date"
              date={eddDate}
              textColor={c.themes[theme].text}
              fadeToColor={c.themes[theme].modal}
              style={{height: 100}}
              onDateChange={newDate => this.setState({eddDate: newDate})}
            />
          </>
        );
      }
      default: {
        return <Text>Select a conversion</Text>;
      }
    }
  }

  // LMP = now - GA
  // LMP = EDD-280days
  // EDD = LMP + 280

  calc() {
    let {from, weeks, days, lmpDate, eddDate, gaRecDate} = this.state;
    let res = {ga: `${0} weeks, ${0} days`, edd: '-', lmp: '-'};
    let date;
    let gams;
    switch (from) {
      case 'GA': {
        // Check that either weeks or days is entered in the input
        if (!weeks && !days) break;
        // Check if strings include anything other than Digits or blank space
        if (!weeks.match(/^(\s*|\d+)$/) || !days.match(/^(\s*|\d+)$/)) break;
        gams =
          (parseInt(weeks || 0) * 7 + parseInt(days || 0)) * c.t.day +
          (Date.now() - gaRecDate);
        res = {
          ga: `${Math.floor(gams / c.t.week) || 0} weeks, ${
            Math.floor((gams % c.t.week) / c.t.day) || 0
          } days`,
          edd: new Date(Date.now() - gams + 280 * c.t.day).toDateString(),
          lmp: new Date(Date.now() - gams).toDateString(),
        };
        break;
      }
      case 'LMP': {
        date = lmpDate;
        if (!date) break;
        gams = Date.now() - date.getTime();
        res = {
          ga: `${Math.floor(gams / (c.t.day * 7))} weeks, ${Math.round(
            (gams % (c.t.day * 7)) / c.t.day,
          )} days`,
          edd: new Date(date.getTime() + 280 * c.t.day).toDateString(),
          lmp: new Date(date.getTime()).toDateString(),
        };
        break;
      }
      case 'EDD': {
        //date is EDD expressed in MS at UTC 00:00 for that day
        date = Math.floor(eddDate.getTime() / c.t.day) * c.t.day;
        if (!date) break;
        // gams is today at UTC 00:00, minus the EDD date at UTC 00:00 less 280 days, all in the end expressed in MS
        gams =
          (Math.floor(Date.now() / c.t.day) - (date / c.t.day - 280)) * c.t.day;

        res = {
          ga: `${Math.floor(gams / (c.t.day * 7))} weeks, ${Math.round(
            (gams % (c.t.day * 7)) / c.t.day,
          )} days`,
          edd: new Date(date).toDateString(),
          lmp: new Date(date - 280 * c.t.day).toDateString(),
        };
        break;
      }
      default: {
        break;
      }
    }
    return res;
  }

  renderResults() {
    let {theme} = this.props;
    const {from} = this.state;
    const res = this.calc();
    return (
      <View
        style={{
          flex: 2,
          width: '100%',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        <View style={[styles.row]}>
          <Text
            style={[
              {marginHorizontal: 10, color: c.themes[theme].text},
              c.titleFont,
            ]}>
            GA:
          </Text>
          <Text
            style={[
              styles.textInput,
              {
                borderColor: c.themes[theme].border,
                maxWidth: 200,
                marginHorizontal: 10,
                color: c.themes[theme].text,
              },
            ]}>
            {res.ga}
          </Text>
        </View>

        {from !== 'LMP' && (
          <View style={[styles.row]}>
            <Text
              style={[
                {marginHorizontal: 10, color: c.themes[theme].text},
                c.titleFont,
              ]}>
              LMP:
            </Text>
            <Text
              style={[
                styles.textInput,
                {
                  borderColor: c.themes[theme].border,
                  maxWidth: 200,
                  marginHorizontal: 10,
                  color: c.themes[theme].text,
                },
              ]}>
              {res.lmp}
            </Text>
          </View>
        )}

        {from !== 'EDD' && (
          <View style={[styles.row]}>
            <Text
              style={[
                {marginHorizontal: 10, color: c.themes[theme].text},
                c.titleFont,
              ]}>
              EDD:
            </Text>
            <Text
              style={[
                styles.textInput,
                {
                  borderColor: c.themes[theme].border,
                  maxWidth: 200,
                  marginHorizontal: 10,
                  color: c.themes[theme].text,
                },
              ]}>
              {res.edd}
            </Text>
          </View>
        )}
      </View>
    );
  }

  renderSlidingPanel() {
    const {theme} = this.props;
    const textColor = {color: c.themes[theme].text};
    return (
      <SlideUpModal
        ref={ref => (this.calcInfo = ref)}
        style={{
          justifyContent: 'flex-start',
          alignItems: 'center',
          width: '93%',
          minHeight: '55%',
          padding: 15,
          borderRadius: 10,
          borderWidth: 0.5,
          elevation: 4,
          backgroundColor: c.themes[theme].background,
          borderColor: c.themes[theme].border,
        }}
        peek={0}>
        <View style={styles.infoRow}>
          <Text style={[styles.infoRowText, textColor, {flex: 1}, c.titleFont]}>
            GA:
          </Text>
          <Text
            style={[styles.infoRowText, textColor, {flex: 3, fontSize: 16}]}>
            Gestational Age
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoRowText, textColor, {flex: 1}, c.titleFont]}>
            LMP:
          </Text>
          <Text
            style={[styles.infoRowText, textColor, {flex: 3, fontSize: 16}]}>
            Last Mensteral Period
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoRowText, textColor, {flex: 1}, c.titleFont]}>
            EDD:
          </Text>
          <Text
            style={[styles.infoRowText, textColor, {flex: 3, fontSize: 16}]}>
            Estimated Delivery Date
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            minHeight: 20,
            width: '80%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              height: 1,
              width: '100%',
              backgroundColor: c.themes[theme].border,
            }}
          />
        </View>

        <View style={styles.infoRow}>
          <Text style={[styles.infoRowTextSmall, textColor, {flex: 1}]}>
            These calculations use the same method as "pregnancy wheels".
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoRowTextSmall, textColor, {flex: 1}]}>
            Accuracy of the calculation depends on the accuracy of the inputted
            information.
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoRowTextSmall, textColor, {flex: 1}]}>
            Because of this calculations may be subject to margin of error.
          </Text>
        </View>
      </SlideUpModal>
    );
  }

  render() {
    let {theme} = this.props;
    const {from} = this.state;
    return (
      <>
        <View
          style={[
            styles.container,
            {backgroundColor: c.themes[theme].background},
          ]}>
          <View
            style={[styles.header, {backgroundColor: c.themes[theme].accent}]}>
            <View style={{flex: 1, width: '100%', justifyContent: 'center'}}>
              <Text
                style={[
                  {
                    color: c.themes[theme].lightText,
                    fontSize: 36,
                    marginLeft: 20,
                  },
                  c.titleFont,
                ]}>
                Calculate
              </Text>
              <MCIcons
                name="information-outline"
                onPress={() => this.calcInfo.onPressButton()}
                style={{position: 'absolute', right: 5}}
                size={35}
                color={c.themes[theme].lightText}
              />
            </View>
          </View>

          <View
            style={[
              styles.body,
              {
                backgroundColor: c.themes[theme].modal,
                borderColor: c.themes[theme].border,
              },
            ]}>
            <View
              style={{
                flex: 3,
                width: '100%',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}>
              <View style={[styles.row, {padding: 5, width: '100%'}]}>
                <Text
                  style={[
                    {color: c.themes[theme].text, fontSize: 24, marginLeft: 20},
                    c.titleFont,
                  ]}>
                  Enter
                </Text>
              </View>
              <View style={[styles.row]}>
                <TouchableOpacity
                  onPress={() => this.onPressFrom('EDD')}
                  style={[
                    styles.button,
                    {
                      borderColor: c.themes[theme].border,
                      backgroundColor: c.themes[theme].background,
                    },
                    from === 'EDD' && {elevation: 5},
                  ]}>
                  <Text
                    style={[
                      styles.buttonText,
                      {color: c.themes[theme].text},
                      from === 'EDD' && {color: c.themes[theme].accent},
                    ]}>
                    EDD
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => this.onPressFrom('GA')}
                  style={[
                    styles.button,
                    {
                      borderColor: c.themes[theme].border,
                      backgroundColor: c.themes[theme].background,
                    },
                    from === 'GA' && {elevation: 5},
                  ]}>
                  <Text
                    style={[
                      styles.buttonText,
                      {color: c.themes[theme].text},
                      from === 'GA' && {color: c.themes[theme].accent},
                    ]}>
                    GA
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => this.onPressFrom('LMP')}
                  style={[
                    styles.button,
                    {
                      borderColor: c.themes[theme].border,
                      backgroundColor: c.themes[theme].background,
                    },
                    from === 'LMP' && {elevation: 5},
                  ]}>
                  <Text
                    style={[
                      styles.buttonText,
                      {color: c.themes[theme].text},
                      from === 'LMP' && {color: c.themes[theme].accent},
                    ]}>
                    LMP
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputRow}>{this.renderInputRow()}</View>
            </View>

            <View
              style={{
                flex: 0.5,
                width: '80%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  height: 1,
                  width: '100%',
                  backgroundColor: c.themes[theme].border,
                }}
              />
            </View>

            {this.renderResults()}
          </View>
        </View>
        {this.renderSlidingPanel()}
      </>
    );
  }
}

const styles = {
  panel: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'relative',
    borderWidth: 2,
    width: '95%',
    justifySelf: 'center',
    alignSelf: 'center',
  },
  panelHeader: {
    height: 60,
    backgroundColor: '#b197fc',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  slider: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  header: {
    height: 65,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTop: {
    height: 40,
    width: '95%',
    justifyContent: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  body: {
    flex: 1,
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderWidth: 1,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 1,
  },
  inputRow: {
    width: '100%',
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  row: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  button: {
    height: 45,
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
  },
  textInput: {
    flex: 1,
    borderBottomWidth: 1,
    textAlign: 'center',
    fontSize: 20,
  },

  infoRow: {
    width: '100%',
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoRowText: {},
  infoRowTextSmall: {
    fontSize: 12,
  },
};

export default Calculator;
