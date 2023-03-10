import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Animated,
  ScrollView,
  BackHandler,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import SVGIcon from '../../components/SVGIcon/';

const c = require('../../assets/constants');
const indicatorWidth = 0.8;

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
    this.fromTypes = ['EDD', 'GA', 'LMP'];
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.state.backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => this.onPressBack(),
      );
    });
    this.blurListener = this.props.navigation.addListener('blur', () => {
      if (!!this.state.backHandler) this.state.backHandler.remove();
    });
  }

  componentWillUnmount() {
    this.focusListener();
    this.blurListener();
  }

  onPressBack() {
    return true;
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
    let activeIndex = this.fromTypes.indexOf(this.state.from);
    if (index !== activeIndex) this.setState({from: this.fromTypes[index]});

    Animated.spring(this.scrollPosition, {
      toValue: {x: calculatedOffset, y: 0},
      useNativeDriver: false,
      speed: 35,
    }).start();
  };

  onPressFrom(from) {
    this.setState({from});
    let index = this.fromTypes.indexOf(from);
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
    const sty = style(this.props.theme);
    const thm = c.themes[this.props.theme];
    let calc = this.calc();
    return (
      <View style={sty.container}>
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
                transform: this.scrollPosition.getTranslateTransform(),
              },
            ]}
          />
          {this.fromTypes.map((type, i) => (
            <TouchableOpacity
              key={i}
              style={{flex: 1, alignItems: 'center'}}
              onPress={() => this.onPressFrom(type)}>
              <Text
                style={[
                  sty.indText,
                  {color: this.state.from === type ? thm.lightText : thm.text},
                ]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {/** indicator end **/}
        {/** Card Scrollview Start **/}
        <View style={{flex: 3}}>
          <ScrollView
            ref={ref => (this.pageScroll = ref)}
            showsHorizontalScrollIndicator={false}
            onScroll={evt => this.onScroll(evt)}
            horizontal
            pagingEnabled>
            {/** EDD Card Render **/}
            <View style={sty.cardContainer}>
              <View style={sty.card}>
                <Text style={sty.inputTitle}>
                  My client's estimated due date is...
                </Text>
                <TouchableOpacity
                  style={[sty.inputButton, {backgroundColor: thm.modal}]}
                  onPress={() => this.setState({showEddPicker: true})}>
                  <Text style={{fontSize: 18, color: thm.text}}>
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
                <Text style={sty.outputTitle}>Their gestational age is:</Text>
                <Text style={sty.outputText}>{calc.edd.ga}</Text>

                <Text style={sty.outputTitle}>
                  The client's last mensteral period started on
                </Text>
                <Text style={sty.outputText}>
                  {calc.edd.lmp.toDateString()}
                </Text>
                {/** Output Verbiage End **/}
              </View>
            </View>
            {/** EDD Card Render END **/}

            {/** GA Card Render **/}
            <View style={sty.cardContainer}>
              <View style={sty.card}>
                <Text style={sty.inputTitle}>The gestational age is...</Text>
                {/** GA Input Row **/}
                <View style={sty.row}>
                  <TextInput
                    style={sty.ti}
                    onChangeText={text => this.setState({weeks: text})}
                    value={this.state.weeks}
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
                    style={sty.ti}
                    onChangeText={text => this.onEnterDay(text)}
                    value={this.state.days}
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
                <Text style={sty.outputText}>{calc.ga.edd.toDateString()}</Text>

                <Text style={sty.outputTitle}>
                  The client's last mensteral period started on
                </Text>
                <Text style={sty.outputText}>{calc.ga.lmp.toDateString()}</Text>
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
                  <Text style={{fontSize: 18, color: thm.text}}>
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
                <Text style={sty.outputTitle}>Their gestational age is:</Text>
                <Text style={sty.outputText}>{calc.lmp.ga}</Text>

                <Text style={sty.outputTitle}>
                  The client's estimated due date is:
                </Text>
                <Text style={sty.outputText}>
                  {calc.lmp.edd.toDateString()}
                </Text>
                {/** Output Verbiage End **/}
              </View>
            </View>
            {/** LMP Card Render END **/}
          </ScrollView>
        </View>

        <View style={[sty.card, sty.infoCard, {backgroundColor: thm.modal}]}>
          <Text style={[{color: thm.text, flex: 1}]}>Disclaimer</Text>
          <Text style={[sty.infoText, {color: thm.text, flex: 1.5}]}>
            These calculations use the same method as "pregnancy wheels".
          </Text>
          <Text style={[sty.infoText, {color: thm.text, flex: 1.5}]}>
            Accuracy of the calculation depends on the accuracy of the inputted
            information.
          </Text>
          <Text style={[sty.infoText, {color: thm.text, flex: 1.5}]}>
            Because of this calculations may be subject to margin of error.
          </Text>
        </View>
      </View>
    );
  }
}

const style = (theme = 'light') => ({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: c.themes[theme].background,
  },
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
    backgroundColor: c.themes[theme].accent,
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
    justifyContent: 'space-around',
    backgroundColor: c.themes[theme].modal,
    alignItems: 'flex-start',
    flex: 0,
    height: '100%',
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
  infoCard: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    flex: 1,
    elevation: 5,
    width: '85%',
  },
  infoText: {
    fontSize: 12,
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
    color: c.themes[theme].text,
    fontSize: 16,
    marginVertical: 5,
  },
  outputTitle: {
    color: c.themes[theme].text,
    fontSize: 16,
    marginVertical: 5,
  },
  outputText: {
    color: c.themes[theme].text,
    alignSelf: 'center',
  },
  spacer: {
    borderColor: c.themes[theme].border,
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
    borderColor: c.themes[theme].border,
    color: c.themes[theme].text,
    borderBottomWidth: 1,
    textAlign: 'center',
    fontSize: 20,
  },
});

export default Calculator;
