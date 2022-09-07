import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SectionList,
  AppState,
} from 'react-native';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const c = require('../../assets/constants');

class ClientList extends Component {
  constructor(props) {
    super(props);
    this.sortingOptions = [
      {value: 'Last Name', slug: 'lastAlpha'},
      {value: 'EDD 👇', slug: 'eddAsc'},
      {value: 'EDD ☝', slug: 'eddDsc'},
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
    let {theme} = this.props;
    const icon = client.delivered
      ? require('../../assets/images/unknown.png')
      : require('../../assets/images/pregnant.png');
    const row1 = client.delivered
      ? {
          label: "Baby's Date of Birth",
          data: new Date(client.edd).toDateString(),
        }
      : {
          label: 'Estimated Delivery Date',
          data: new Date(client.edd).toDateString(),
        };
    const row2 = client.address.street
      ? {label: 'Street Address', data: client.address.street}
      : client.phones.length
      ? {label: 'Phone Number', data: client.phones[0]}
      : {label: '', data: ''};
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('viewClient', {client})}
        style={[
          styles.card,
          {
            backgroundColor: c.themes[theme].modal,
            borderColor: c.themes[theme].border,
            zIndex: 30,
          },
        ]}>
        <View style={[styles.titleRow, {borderColor: c.themes[theme].border}]}>
          <View
            style={{
              ...c.center,
              height: 35,
              width: 35,
              borderRadius: 25,
              borderWidth: 1,
              borderColor: c.themes[theme].border,
              backgroundColor: c.themes[theme].background,
            }}>
            <Text
              style={[
                {fontSize: 16, color: c.themes[theme].text},
                c.titleFont,
              ]}>
              {client.name.first.charAt(0).toUpperCase()}
              {client.name.last.charAt(0).toUpperCase() || ''}
            </Text>
          </View>
          <Text
            style={[
              {fontSize: 20, color: c.themes[theme].text, marginHorizontal: 10},
              c.titleFont,
            ]}>
            <Text style={[{color: c.themes[theme].accent}, c.titleFont]}>
              {client.name.last ? client.name.last + ', ' : ''}
            </Text>
            {client.name.first}
          </Text>
        </View>
        <View style={styles.contentRow}>
          <View style={{flex: 3, height: '100%', justifyContent: 'center'}}>
            <View style={{marginVertical: 5}}>
              <Text style={{fontSize: 12, color: c.themes[theme].text}}>
                {row1.label}
              </Text>
              <Text
                style={{
                  marginLeft: 5,
                  fontSize: 16,
                  color: c.themes[theme].text,
                  textWrap: 'none',
                }}>
                {row1.data}
              </Text>
            </View>
            <View style={{marginVertical: 5}}>
              <Text style={{fontSize: 12, color: c.themes[theme].text}}>
                {row2.label}
              </Text>
              <Text
                style={{
                  marginLeft: 5,
                  fontSize: 16,
                  color: c.themes[theme].text,
                  textWrap: 'none',
                }}>
                {row2.data}
              </Text>
            </View>
          </View>
          <View style={{flex: 1, ...c.center}}>
            <View
              style={{
                ...c.center,
                height: 60,
                width: 60,
                borderRadius: 30,
                borderWidth: 1,
                borderColor: c.themes[theme].border,
                backgroundColor: c.themes[theme].background,
              }}>
              <Image
                source={icon}
                style={{height: 45, width: 60}}
                resizeMode="contain"
              />
            </View>
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
    let {theme} = this.props;
    return (
      <View
        style={[
          styles.container,
          {backgroundColor: c.themes[theme].background},
        ]}>
        <View
          style={[styles.header, {backgroundColor: c.themes[theme].accent}]}>
          <View style={{flex: 2, width: '100%', justifyContent: 'center'}}>
            <Text
              style={[
                c.titleFont,
                {
                  color: c.themes[theme].lightText,
                  fontSize: 36,
                  marginLeft: 20,
                },
              ]}>
              Clients
            </Text>
          </View>
          {/*<Dropdown
            containerStyle={{ flex: 1 }}
            textColor={c.themes[theme].lightText}
            selectedItemColor={'#222222'}
            itemColor={'#000000'}
            label='Sort By'
            dropdownPosition={0}
            data={this.sortingOptions}
            value={this.sortingOptions.find((option, i) => option.slug === this.props.sortType).value}
            onChangeText={(value, index, data) => this.props.changeSortType(data[index].slug)}/>*/}
        </View>
        <View style={styles.body}>
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
            style={[
              styles.addButton,
              {
                borderColor: c.themes[theme].border,
                backgroundColor: c.themes[theme].accent,
              },
            ]}>
            <MCIcons
              name="account-plus"
              size={30}
              color={c.themes[theme].lightText}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  header: {
    height: 65,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 99,
    elevation: 2,
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
  },
  card: {
    height: 200,
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2.5,
    borderRadius: 10,
    borderWidth: 0.5,
    elevation: 1,
    alignSelf: 'center',
  },
  titleRow: {
    height: 60,
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  contentRow: {
    flex: 1,
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
};

export default ClientList;
