import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SectionList,
  AppState,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import SSIcon from 'react-native-vector-icons/SimpleLineIcons';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const c = require('../../assets/constants');

class ClientList extends Component {
  constructor(props) {
    super(props);
    this.sortingOptions = [
      {label: 'Last Name', value: 'lastAlpha'},
      {label: 'EDD 👇', value: 'eddAsc'},
      {label: 'EDD ☝', value: 'eddDsc'},
    ];
    this.pregIcons = [
      require('../../assets/images/pregnant_woman1.png'),
      require('../../assets/images/pregnant_woman2.png'),
      require('../../assets/images/pregnant_woman3.png'),
      require('../../assets/images/pregnant_woman4.png'),
      require('../../assets/images/pregnant_woman5.png'),
    ];
    this.state = {
      showDropDown: false,
      sort: 'eddAsc',
    };
  }

  componentDidMount() {
    AppState.addEventListener('change', this.onAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.onAppStateChange);
  }

  onAppStateChange = newState => {
    let {authType, lastLogTime, navigation} = this.props;
    if (newState === 'active') {
      if (lastLogTime < Date.now() - 60000 * 10 && authType !== 'none') {
        navigation.navigate('auth');
      }
    } else {
      this.props.login();
    }
  };

  renderClient(i, client) {
    const sty = style(this.props.theme);
    const thm = c.themes[this.props.theme];
    const pastEdd = client.edd < Date.now();
    let iconNum =
      client.id
        .split('')
        .map(j => j.charCodeAt())
        .join('') % 5;
    iconNum = iconNum;
    const icon = pastEdd
      ? require('../../assets/images/baby_bottle.png')
      : this.pregIcons[iconNum];
    let rows = [
      {
        label: 'Estimated Delivery Date',
        data: new Date(client.edd).toDateString(),
      },
      {
        label: 'Street Address',
        data: client.address.street,
      },
    ];
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('viewClient', {client})}
        style={sty.card}>
        <View style={sty.titleRow}>
          <View style={sty.initialsContainer}>
            <Text style={[{fontSize: 16, color: thm.text}, c.titleFont]}>
              {client.name.first.charAt(0).toUpperCase()}
              {client.name.last.charAt(0).toUpperCase() || ''}
            </Text>
          </View>

          <Text style={sty.clientName}>
            <Text style={[{color: thm.accent}, c.titleFont]}>
              {client.name.last ? client.name.last + ', ' : ''}
            </Text>
            {client.name.first}
          </Text>
        </View>

        <View style={sty.contentRow}>
          <View style={{flex: 4, height: '100%', justifyContent: 'center'}}>
            {rows.map((row, j) => (
              <View key={j}>
                <Text style={sty.peekTextLabel}>{row.label}</Text>
                <Text style={sty.peekTextValue}>{row.data}</Text>
              </View>
            ))}
          </View>

          <View style={{flex: 1, ...c.center, height: '100%'}}>
            <Image source={icon} resizeMode="contain" style={sty.cardImage} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  renderSectionHeader(section) {
    let {theme} = this.props;
    return (
      <View
        style={{
          alignItems: 'center',
          alignSelf: 'center',
          flexDirection: 'row',
          height: 40,
          marginVertical: 2.5,
          width: '95%',
        }}>
        <View
          style={{
            ...c.center,
            elevation: 3,
            borderRadius: 20,
            height: 40,
            paddingHorizontal: 15,
            minWidth: 40,
            flex: 0,
            backgroundColor: c.themes[theme].accent,
          }}>
          <Text style={[{color: c.themes[theme].lightText}, c.titleFont]}>
            {section.title}
          </Text>
        </View>
      </View>
    );
  }

  getSections() {
    let {clients, sortType} = this.props;
    let sections = {};
    let sec = null;
    switch (sortType) {
      // NOTE: EDD Acsending and descending should be combined into one function

      case 'eddAsc': {
        // For each client in the list, add that client to an object (sections) under a key that correlates to the EDD.
        // Key schema is: "2020_11" to "2020_00"
        clients.forEach((client, i) => {
          // Add a leading zero to the month if it is under 10.
          // This is done as otherwise Sort recognizes 2020_8 as being alphabetically sorted before 2020_10
          let month =
            new Date(client.edd).getMonth() < 10
              ? `0${new Date(client.edd).getMonth()}`
              : new Date(client.edd).getMonth();
          let year = new Date(client.edd).getFullYear();
          // Set the section equal to either an array with just the new client, or an array with the exisint section and the new client
          sections[`${year}_${month}`] = sections[`${year}_${month}`]
            ? [...sections[`${year}_${month}`], client]
            : [client];
        });

        // Map the keys of the sections object to an array that matches the SectionList Schema
        // The "data" key is sorted from lowest EDD to highest EDD
        sections = Object.keys(sections).map((key, i) => ({
          title: `${key.split('_')[0]}, ${
            c.months[parseInt(key.split('_')[1])]
          }`,
          data: sections[key].sort((a, b) => (a.edd > b.edd ? 1 : -1)),
          sort: key,
        }));
        // Use the "sort" value to sort the sections from earliest EDD to latest
        return sections.sort((a, b) => (a.sort > b.sort ? 1 : -1));
      }
      case 'eddDsc': {
        // For each client in the list, add that client to an object (sections) under a key that correlates to the EDD.
        // Key schema is: "2020_11" to "2020_00"
        clients.forEach((client, i) => {
          // Add a leading zero to the month if it is under 10.
          // This is done as otherwise Sort recognizes 2020_8 as being alphabetically sorted before 2020_10
          let month =
            new Date(client.edd).getMonth() < 10
              ? `0${new Date(client.edd).getMonth()}`
              : new Date(client.edd).getMonth();
          let year = new Date(client.edd).getFullYear();
          // Set the section equal to either an array with just the new client, or an array with the exisint section and the new client
          sections[`${year}_${month}`] = sections[`${year}_${month}`]
            ? [...sections[`${year}_${month}`], client]
            : [client];
        });

        // Map the keys of the sections object to an array that matches the SectionList Schema
        // The "data" key is sorted from lowest EDD to highest EDD
        sections = Object.keys(sections).map((key, i) => ({
          title: `${key.split('_')[0]}, ${
            c.months[parseInt(key.split('_')[1])]
          }`,
          data: sections[key].sort((a, b) => (a.edd < b.edd ? 1 : -1)),
          sort: key,
        }));
        // Use the "sort" value to sort the sections from earliest EDD to latest
        return sections.sort((a, b) => (a.sort < b.sort ? 1 : -1));
      }
      default: {
        // Seperate clients into sections
        clients.forEach((client, i) => {
          sec = sections[client.name.last.charAt(0).toUpperCase()];
          sections[client.name.last.charAt(0).toUpperCase()] = sec
            ? [...sec, client]
            : [client];
        });
        // Format sections for section list
        sections = Object.keys(sections).map((key, i) => ({
          title: key,
          data: sections[key],
        }));
        // Sort sections alphabetically
        sections = sections.sort((a, b) => (a.title > b.title ? 1 : -1));
        // Sort data of each section by first name
        sections.forEach(
          (section, i) =>
            (sections[i].data = section.data.sort((a, b) =>
              a.name.last.toLowerCase() > b.name.last.toLowerCase() ? 1 : -1,
            )),
        );
        return sections;
      }
    }
  }

  render() {
    let {showDropDown} = this.state;
    const sty = style(this.props.theme);
    const thm = c.themes[this.props.theme];
    return (
      <View style={sty.container}>
        <View style={sty.header}>
          <View style={{flex: 3, width: '100%', justifyContent: 'center'}}>
            <Text style={[c.titleFont, sty.titleFont]}>Clients</Text>
          </View>
          <View style={{flex: 2}}>
            <DropDownPicker
              open={showDropDown}
              value={this.props.sortType}
              items={this.sortingOptions}
              setOpen={() => this.setState({showDropDown: !showDropDown})}
              setValue={value => this.props.changeSortType(value())}
              textStyle={{color: thm.lightText, fontSize: 16}}
              style={sty.dropdown}
              dropDownContainerStyle={sty.dropdown}
              TickIconComponent={() => (
                <MCIcons name="check" size={20} color={thm.lightText} />
              )}
              ArrowUpIconComponent={() => (
                <SSIcon name="arrow-up" size={15} color={thm.lightText} />
              )}
              ArrowDownIconComponent={() => (
                <SSIcon name="arrow-down" size={15} color={thm.lightText} />
              )}
            />
          </View>
        </View>
        <View style={sty.body}>
          <SectionList
            renderItem={({index, item}) => this.renderClient(index, item)}
            renderSectionHeader={({section}) =>
              this.renderSectionHeader(section)
            }
            ListHeaderComponent={() => (
              <View style={{height: 2.5, width: '100%'}} />
            )}
            ListFooterComponent={() => (
              <View style={{height: 2.5, width: '100%'}} />
            )}
            sections={this.getSections()}
            style={{width: '100%', flex: 1}}
          />
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('addClient')}
            style={sty.addButton}>
            <MCIcons name="account-plus" size={30} color={thm.lightText} />
          </TouchableOpacity>
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
    height: 65,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 99,
    elevation: 2,
    paddingRight: 10,
    backgroundColor: c.themes[theme].accent,
  },
  titleFont: {
    color: c.themes[theme].lightText,
    fontSize: 36,
    marginLeft: 20,
  },
  body: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  addButton: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    position: 'absolute',
    bottom: 10,
    right: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: c.themes[theme].border,
    backgroundColor: c.themes[theme].accent,
  },
  card: {
    minHeight: 200,
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2.5,
    borderRadius: 10,
    borderWidth: 0.5,
    elevation: 1,
    alignSelf: 'center',
    backgroundColor: c.themes[theme].modal,
    borderColor: c.themes[theme].border,
    zIndex: 30,
    overflow: 'hidden',
  },
  titleRow: {
    height: 60,
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: c.themes[theme].border,
  },
  initialsContainer: {
    ...c.center,
    height: 35,
    width: 35,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: c.themes[theme].border,
    backgroundColor: c.themes[theme].background,
  },
  clientName: {
    fontSize: 20,
    color: c.themes[theme].text,
    marginHorizontal: 10,
    ...c.titleFont,
  },
  contentRow: {
    flex: 1,
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'relative',
  },
  cardImage: {
    width: '200%',
    height: '150%',
  },
  peekTextLabel: {
    fontSize: 12,
    color: c.themes[theme].text,
  },
  peekTextValue: {
    marginLeft: 5,
    fontSize: 16,
    color: c.themes[theme].text,
    textWrap: 'none',
  },
  dropdown: {
    borderColor: c.themes[theme].lightText,
    backgroundColor: c.themes[theme].accent,
    color: '#fff',
  },
});

export default ClientList;
