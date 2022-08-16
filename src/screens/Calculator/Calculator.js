import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  UIManager,
  LayoutAnimation,
  Platform,
  TextInput,
  Animated,
  ScrollView,
  Button
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import SIcon from 'react-native-vector-icons/SimpleLineIcons';
const c = require('../../assets/constants');

import SlideUpModal from '../../SlideUpModal/';
import SVGIcon from '../../components/SVGIcon/';

const indicatorWidth = 0.8;

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
      showEddPicker: false,
    };
    this.state = this.initialState;
    this.pageScroll = null;
    this.scrollPosition = new Animated.ValueXY();
    this.from = ['EDD', 'GA', 'LMP'];
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
    let {weeks, days, lmpDate, eddDate, gaRecDate} = this.state;
    let res = {ga: `${0} weeks, ${0} days`, edd: '-', lmp: '-'};
    let date;
    let gams;
    /*
    // From GA
    // Check that either weeks or days is entered in the input
    if (!weeks && !days) return new Error('Check calc()');
    // Check if strings include anything other than Digits or blank space
    if (!weeks.match(/^(\s*|\d+)$/) || !days.match(/^(\s*|\d+)$/)) return new Error('Check calc()');
    gams =
      (parseInt(weeks || 0) * 7 + parseInt(days || 0)) * c.t.day +
      (Date.now() - gaRecDate);
    res.ga = {
      ga: `${Math.floor(gams / c.t.week) || 0} weeks, ${
        Math.floor((gams % c.t.week) / c.t.day) || 0
      } days`,
      edd: new Date(Date.now() - gams + 280 * c.t.day).toDateString(),
      lmp: new Date(Date.now() - gams).toDateString(),
    };

    // From LMP
    date = lmpDate;
    if (!date) return new Error('Check calc()');
    gams = Date.now() - date.getTime();
    res.lmp = {
      ga: `${Math.floor(gams / (c.t.day * 7))} weeks, ${Math.round(
        (gams % (c.t.day * 7)) / c.t.day,
      )} days`,
      edd: new Date(date.getTime() + 280 * c.t.day).toDateString(),
      lmp: new Date(date.getTime()).toDateString(),
    };

    */
    //From EDD
    //date is EDD expressed in MS at UTC 00:00 for that day
    date = Math.floor(eddDate.getTime() / c.t.day) * c.t.day;
    // gams is today at UTC 00:00, minus the EDD date at UTC 00:00 less 280 days, all in the end expressed in MS
    gams =
      (Math.floor(Date.now() / c.t.day) - (date / c.t.day - 280)) * c.t.day;

    res.edd = {
      ga: `${Math.floor(gams / (c.t.day * 7))} weeks, ${Math.round(
        (gams % (c.t.day * 7)) / c.t.day,
      )} days`,
      edd: new Date(date),
      lmp: new Date(eddDate - 280 * c.t.day),
    };

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

  onScroll = e => {
    let offset = e.nativeEvent.contentOffset.x;
    let calculatedOffset = (offset * indicatorWidth) / 3;
    let index = Math.round(offset / c.device.width);
    // If the scroll bar has crossed closer to the next item, switch the highlighted from
    let activeIndex = this.from.indexOf(this.state.from);
    if (index !== activeIndex) this.setState({from: this.from[index]});

    Animated.spring(this.scrollPosition, {
      toValue: {x: calculatedOffset, y: 0},
      useNativeDriver: false,
      speed: 35,
    }).start();
  };

  onPressFrom(from) {
    /*
    LayoutAnimation.configureNext({
      duration: 700,
      create: {type: 'spring', springDamping: 0.4, property: 'scaleY'},
      update: {type: 'spring', springDamping: 0.4},
    });
    LayoutAnimation.configureNext({
      duration: 50,
      delete: {type: 'easeIn', springDamping: 0.4, property: 'scaleY'},
    });*/
    this.setState({from});
    let index = this.from.indexOf(from);
    this.pageScroll.scrollTo({x: c.device.width * index, y: 0, animated: true});
  }

  render() {
    let {theme} = this.props;
    const {from} = this.state;
    let calc = this.calc();
    return (
      <>
        <View
          style={[
            styles.container,
            {backgroundColor: c.themes[theme].background},
          ]}>
          <View style={styles.header}>
            {/** background start **/}

            <View
              style={{
                height: '100%',
                width: '100%',
                position: 'absolute',
                top: 0,
                backgroundColor: c.themes[theme].accent,
              }}
            />
            {/** background end **/}
            {/** headerContent Start **/}
            <Text
              style={[
                {
                  color: c.themes[theme].lightText,
                  fontSize: 24,
                  marginLeft: 15,
                },
                c.titleFont,
              ]}>
              Calculate
            </Text>
            <SIcon
              name="info"
              onPress={() => this.calcInfo.onPressButton()}
              style={{position: 'absolute', right: 15, bottom: 5}}
              size={20}
              color={c.themes[theme].lightText}
            />
            {/** headerContent End **/}
          </View>
          <View style={{width: '100%', height: 26, alignItems: 'center'}}>
            <SVGIcon
              name="stackedWaves"
              color={c.themes[theme].accent}
              style={{
                transform: [{rotate: '180deg'}],
                position: 'absolute',
                width: '100%',
                height: '200%',
                top: 0,
              }}
            />
            <Text style={{color: c.themes[theme].lightText}}>
              I am entering the...
            </Text>
          </View>
          {/** indicator start **/}
          <View
            style={[
              styles.cardIndicatorContainer,
              {
                backgroundColor: c.themes[theme].modal,
              },
            ]}>
            <Animated.View
              style={[
                styles.indicator,
                {
                  backgroundColor: c.themes[theme].accent,
                  transform: this.scrollPosition.getTranslateTransform(),
                },
              ]}
            />
            {this.from.map((type, i) => (
              <TouchableOpacity
                key={i}
                style={{flex: 1, alignItems: 'center'}}
                onPress={() => this.onPressFrom(type)}>
                <Text
                  style={[
                    styles.indText,
                    {
                      color:
                        from === type
                          ? c.themes[theme].lightText
                          : c.themes[theme].text,
                    },
                  ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {/** indicator end **/}
          <ScrollView
            ref={ref => (this.pageScroll = ref)}
            showsHorizontalScrollIndicator={false}
            onScroll={evt => this.onScroll(evt)}
            horizontal
            pagingEnabled>
            <View style={styles.cardContainer}>
              <View
                style={[styles.card, {backgroundColor: c.themes[theme].modal}]}>
                <Text>Clients Estimated Due Date is...</Text>
                <TouchableOpacity
                  style={[
                    styles.inputButton,
                    {backgroundColor: c.themes[theme].modal},
                  ]}
                  onPress={() => this.setState({showEddPicker: true})}>
                  <Text>{calc.edd.edd.toDateString()}</Text>
                </TouchableOpacity>
                {this.state.showEddPicker && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={this.state.eddDate}
                    accentColor={c.themes[theme].accent}
                    mode="date"
                    is24Hour={true}
                    onChange={(e, date) =>
                      this.setState({showEddPicker: false, eddDate: date})
                    }
                  />
                )}
                <Text>Clients GA: {calc.edd.ga}</Text>
                <Text>Clients LMP: {calc.edd.lmp.toDateString()}</Text>
              </View>
            </View>
            <View style={styles.cardContainer}>
              <View
                style={[styles.card, {backgroundColor: c.themes[theme].modal}]}>
                <Text>Blah Blah Blah Blah </Text>
              </View>
            </View>
            <View style={styles.cardContainer}>
              <View
                style={[styles.card, {backgroundColor: c.themes[theme].modal}]}>
                <Text>Blah Blah Blah Blah </Text>
              </View>
            </View>
          </ScrollView>
          {/**}
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
          **/}
        </View>
        {this.renderSlidingPanel()}
      </>
    );
  }
}

const styles = {
  header: {
    height: 37,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardIndicatorContainer: {
    width: c.device.width * indicatorWidth,
    height: 25,
    borderRadius: 50,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  indText: {
    fontSize: 14,
  },
  indicator: {
    width: (c.device.width * indicatorWidth) / 3,
    height: '100%',
    borderRadius: 50,
    position: 'absolute',
  },
  cardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: c.device.width,
  },
  card: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '80%',
    width: '95%',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  inputButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 45,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  body: {
    flex: 1,
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderWidth: 1,
    borderRadius: 10,
    elevation: 1,
  },
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
