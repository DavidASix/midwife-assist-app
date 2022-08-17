import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  UIManager,
  Platform,
  TextInput,
  Animated,
  ScrollView,
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
      weeks: 0,
      days: 0,
      lmpDate: new Date(Date.now() - 280 * c.t.day),
      eddDate: new Date(Date.now() + 280 * c.t.day),
      gaRecDate: new Date(Date.now()),
      showEddPicker: false,
      showLmpPicker: false,
    };
    this.state = this.initialState;
    this.pageScroll = null;
    this.scrollPosition = new Animated.ValueXY();
    this.from = ['EDD', 'GA', 'LMP'];
  }

  // LMP = now - GA
  // LMP = EDD-280days
  // EDD = LMP + 280

  calc() {
    let {weeks, days, lmpDate, eddDate, gaRecDate} = this.state;
    let res = {ga: `${0} weeks, ${0} days`, edd: '-', lmp: '-'};
    let date;
    let gams;
    /**/
    // From GA
    // Check that either weeks or days is entered in the input
    if (!weeks) weeks = '0';
    if (!days) days = '0';
    // Check if strings include anything other than Digits or blank space
    if (!weeks.match(/^(\s*|\d+)$/)) weeks = '';
    if (!days.match(/^(\s*|\d+)$/)) days = '';
    gams =
      (parseInt(weeks || 0) * 7 + parseInt(days || 0)) * c.t.day +
      (Date.now() - gaRecDate);
    res.ga = {
      ga: `${Math.floor(gams / c.t.week) || 0} weeks, ${
        Math.floor((gams % c.t.week) / c.t.day) || 0
      } days`,
      edd: new Date(Date.now() - gams + 280 * c.t.day),
      lmp: new Date(Date.now() - gams),
    };

    // From LMP
    date = lmpDate;
    gams = Date.now() - date.getTime();
    res.lmp = {
      ga: `${Math.floor(gams / (c.t.day * 7))} weeks, ${Math.round(
        (gams % (c.t.day * 7)) / c.t.day,
      )} days`,
      edd: new Date(date.getTime() + 280 * c.t.day),
      lmp: new Date(date),
    };

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
    this.setState({from});
    let index = this.from.indexOf(from);
    this.pageScroll.scrollTo({x: c.device.width * index, y: 0, animated: true});
  }

  onEnterDay(text) {
    if (parseInt(text) > 6) {
      this.setState({
        weeks: `${(parseInt(this.state.weeks) || 0) + 1}`,
        days: `${parseInt(text) % 7}`,
      });
    } else {
      this.setState({days: text});
    }
  }

  render() {
    const thm = c.themes[this.props.theme];
    const {from} = this.state;
    const {weeks, days, lmpDate, eddDate, gaRecDate} = this.state;
    const textColor = {color: thm.text};
    let calc = this.calc();
    return (
      <>
        <View style={[sty.container, {backgroundColor: thm.background}]}>
          <View style={sty.header}>
            {/** background start **/}

            <View
              style={{
                height: '100%',
                width: '100%',
                position: 'absolute',
                top: 0,
                backgroundColor: thm.accent,
              }}
            />
            {/** background end **/}
            {/** headerContent Start **/}
            <Text
              style={[
                {
                  color: thm.lightText,
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
              color={thm.lightText}
            />
            {/** headerContent End **/}
          </View>
          <View style={{width: '100%', height: 26, alignItems: 'center'}}>
            <SVGIcon
              name="stackedWaves"
              color={thm.accent}
              style={{
                transform: [{rotate: '180deg'}],
                position: 'absolute',
                width: '100%',
                height: '200%',
                top: 0,
              }}
            />
            <Text style={{color: thm.lightText}}>I am entering the...</Text>
          </View>
          {/** indicator start **/}
          <View
            style={[sty.cardIndicatorContainer, {backgroundColor: thm.modal}]}>
            <Animated.View
              style={[
                sty.indicator,
                {
                  backgroundColor: thm.accent,
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
                    sty.indText,
                    {color: from === type ? thm.lightText : thm.text},
                  ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {/** indicator end **/}
          {/** Card Scrollview Start **/}
          <ScrollView
            ref={ref => (this.pageScroll = ref)}
            showsHorizontalScrollIndicator={false}
            onScroll={evt => this.onScroll(evt)}
            horizontal
            pagingEnabled>
            {/** EDD Card Render **/}
            <View style={sty.cardContainer}>
              <View style={[sty.card, {backgroundColor: thm.modal}]}>
                <Text style={[sty.inputTitle, {color: thm.text}]}>
                  My client's estimated due date is...
                </Text>
                <TouchableOpacity
                  style={[sty.inputButton, {backgroundColor: thm.modal}]}
                  onPress={() => this.setState({showEddPicker: true})}>
                  <Text style={{fontSize: 18}}>
                    {calc.edd.edd.toDateString()}
                  </Text>
                </TouchableOpacity>
                {this.state.showEddPicker && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={this.state.eddDate}
                    accentColor={thm.accent}
                    mode="date"
                    is24Hour={true}
                    onChange={(e, date) =>
                      this.setState({showEddPicker: false, eddDate: date})
                    }
                  />
                )}
                <View style={[sty.spacer, {borderColor: thm.border}]} />
                {/** Output Verbiage **/}
                <Text style={sty.outputTitle}>
                  Their babies gestational age is roughly:
                </Text>
                <Text style={{alignSelf: 'center'}}>{calc.edd.ga}</Text>

                <Text style={sty.outputTitle}>
                  The client's last mensteral period started on
                </Text>
                <Text style={{alignSelf: 'center'}}>
                  {calc.edd.lmp.toDateString()}
                </Text>
                {/** Output Verbiage End **/}
              </View>
            </View>
            {/** EDD Card Render END **/}

            {/** GA Card Render **/}
            <View style={sty.cardContainer}>
              <View style={[sty.card, {backgroundColor: thm.modal}]}>
                <Text style={[sty.inputTitle, {color: thm.text}]}>
                  The baby's gestational age is...
                </Text>
                {/** GA Input Row **/}
                <View style={sty.row}>
                  <TextInput
                    style={[sty.ti, {borderColor: thm.border, color: thm.text}]}
                    onChangeText={text => this.setState({weeks: text})}
                    value={weeks}
                    keyboardType="decimal-pad"
                    maxLength={2}
                    placeholder="10"
                    keyboardAppearance={this.props.theme}
                    placeholderTextColor={thm.text + 60}
                  />
                  <Text style={{marginHorizontal: 10, color: thm.text}}>
                    Weeks
                  </Text>
                  <TextInput
                    style={[sty.ti, {borderColor: thm.border, color: thm.text}]}
                    onChangeText={text => this.onEnterDay(text)}
                    value={days}
                    keyboardType="decimal-pad"
                    maxLength={1}
                    placeholder="4"
                    keyboardAppearance={this.props.theme}
                    placeholderTextColor={thm.text + 60}
                  />
                  <Text style={{marginHorizontal: 10, color: thm.text}}>
                    Days
                  </Text>
                </View>
                {/** GA Input Row END **/}
                <View style={[sty.spacer, {borderColor: thm.border}]} />
                {/** Output Verbiage **/}
                <Text style={sty.outputTitle}>
                  The client's estimated due date is:
                </Text>
                <Text style={{alignSelf: 'center'}}>
                  {calc.ga.edd.toDateString()}
                </Text>

                <Text style={sty.outputTitle}>
                  The client's last mensteral period started on
                </Text>
                <Text style={{alignSelf: 'center'}}>
                  {calc.ga.lmp.toDateString()}
                </Text>
                {/** Output Verbiage End **/}
              </View>
            </View>
            {/** GA Card Render END **/}

            {/** LMP Card Render **/}
            <View style={sty.cardContainer}>
              <View style={[sty.card, {backgroundColor: thm.modal}]}>
                <Text style={[sty.inputTitle, {color: thm.text}]}>
                  My client's last menstral period was...
                </Text>
                <TouchableOpacity
                  style={[sty.inputButton, {backgroundColor: thm.modal}]}
                  onPress={() => this.setState({showLmpPick: true})}>
                  <Text style={{fontSize: 18}}>
                    {calc.lmp.lmp.toDateString()}
                  </Text>
                </TouchableOpacity>
                {this.state.showLmpPick && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={this.state.lmpDate}
                    accentColor={thm.accent}
                    mode="date"
                    is24Hour={true}
                    onChange={(e, date) =>
                      this.setState({showLmpPick: false, lmpDate: date})
                    }
                  />
                )}
                <View style={[sty.spacer, {borderColor: thm.border}]} />
                {/** Output Verbiage **/}
                <Text style={sty.outputTitle}>
                  Their babies gestational age is roughly:
                </Text>
                <Text style={{alignSelf: 'center'}}>{calc.lmp.ga}</Text>

                <Text style={sty.outputTitle}>
                  The client's estimated due date is:
                </Text>
                <Text style={{alignSelf: 'center'}}>
                  {calc.lmp.edd.toDateString()}
                </Text>
                {/** Output Verbiage End **/}
              </View>
            </View>
            {/** LMP Card Render END **/}
          </ScrollView>
        </View>
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
            backgroundColor: thm.background,
            borderColor: thm.border,
          }}
          peek={0}>
          <View style={sty.infoRow}>
            <Text style={[sty.infoRowText, textColor, {flex: 1}, c.titleFont]}>
              GA:
            </Text>
            <Text
              style={[sty.infoRowText, textColor, {flex: 3, fontSize: 16}]}>
              Gestational Age
            </Text>
          </View>
          <View style={sty.infoRow}>
            <Text style={[sty.infoRowText, textColor, {flex: 1}, c.titleFont]}>
              LMP:
            </Text>
            <Text
              style={[sty.infoRowText, textColor, {flex: 3, fontSize: 16}]}>
              Last Mensteral Period
            </Text>
          </View>
          <View style={sty.infoRow}>
            <Text style={[sty.infoRowText, textColor, {flex: 1}, c.titleFont]}>
              EDD:
            </Text>
            <Text
              style={[sty.infoRowText, textColor, {flex: 3, fontSize: 16}]}>
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
                backgroundColor: thm.border,
              }}
            />
          </View>

          <View style={sty.infoRow}>
            <Text style={[sty.infoRowTextSmall, textColor, {flex: 1}]}>
              These calculations use the same method as "pregnancy wheels".
            </Text>
          </View>
          <View style={sty.infoRow}>
            <Text style={[sty.infoRowTextSmall, textColor, {flex: 1}]}>
              Accuracy of the calculation depends on the accuracy of the inputted
              information.
            </Text>
          </View>
          <View style={sty.infoRow}>
            <Text style={[sty.infoRowTextSmall, textColor, {flex: 1}]}>
              Because of this calculations may be subject to margin of error.
            </Text>
          </View>
        </SlideUpModal>
      </>
    );
  }
}

const sty = {
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '100%',
    width: c.device.width,
    paddingVertical: 10,
  },
  card: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flex: 0,
    width: '95%',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
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
    alignSelf: 'center',
    width: 200,
    height: 45,
    marginVertical: 5,
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
  inputTitle: {
    fontSize: 16,
    marginVertical: 5,
  },
  outputTitle: {
    fontSize: 16,
    marginVertical: 5,
  },
  spacer: {
    borderTopWidth: 1,
    width: '80%',
    alignSelf: 'center',
    marginVertical: 10,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  ti: {
    flex: 1,
    borderBottomWidth: 1,
    textAlign: 'center',
    fontSize: 20,
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
