import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StatusBar,
  BackHandler,
  Alert,
  Linking,
  TouchableOpacity
} from 'react-native';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { connect } from 'react-redux';
import * as actions from '../actions';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, TransitionPresets  } from '@react-navigation/stack';

import c from '../assets/constants';

import Auth from '../screens/Auth/';
import { Client, AddBaby, AddClient, ViewClient, EditClient, AddNote } from '../screens/Client/';
import { Calculator, CalculatorInfo } from '../screens/Calculator/';
import { Tutorial } from '../screens/Tutorial/';
import Settings from '../screens/Settings/';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function mapStateToProps ({ settings }) {
  return { theme: settings.theme };
};


const CalcStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: true, ...TransitionPresets.ModalSlideFromBottomIOS  }}
      initialRouteName="calc" >
      <Stack.Screen
        name="calc"
        component={Calculator}
        options={({ navigation, route }) => ({ title: 'Calculator' })} />
      <Stack.Screen
        name="calcInfo"
        component={CalculatorInfo}
        options={{ cardStyle: { backgroundColor: 'transparent' }}}/>
    </Stack.Navigator>
  );
}

const ClientStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        ...TransitionPresets.ModalSlideFromBottomIOS
      }}
      initialRouteName="clients" >
      <Stack.Screen
        name="clients"
        component={Client}
        options={{ title: 'Clients' }} />
      <Stack.Screen
        name="addClient"
        component={AddClient}
        options={{ cardStyle: { backgroundColor: 'transparent' }}}/>
      <Stack.Screen
        name="viewClient"
        component={ViewClient}
        options={{ cardStyle: { backgroundColor: 'transparent' }}}/>
      <Stack.Screen
        name="editClient"
        component={EditClient}
        options={{ cardStyle: { backgroundColor: 'transparent' }}}/>
      <Stack.Screen
        name="addNote"
        component={AddNote}
        options={{ cardStyle: { backgroundColor: 'transparent' }}}/>
      <Stack.Screen
        name="addBaby"
        component={AddBaby}
        options={{ cardStyle: { backgroundColor: 'transparent' }}}/>
    </Stack.Navigator>
  );
}

const TabStateless = (props) => {
  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => { console.log('back pressed tabs'); return true; });
    return () => backHandler.remove();
  }, []);
  return (
    <Tab.Navigator
      initialRouteName="calcStack"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          switch (route.name) {
            case 'calcStack': return <MCIcons name='calculator-variant' size={size} color={color} />;
            case 'clientStack': return <MCIcons name='contacts' size={size} color={color} />;
            case 'settings': return <MCIcons name='settings' size={size} color={color} />;
            default: return null;
          }
        },
      })}
      tabBarOptions={{
        activeTintColor: c.themes[props.theme].accent,
        inactiveTintColor: c.themes[props.theme].foreground,
        style: {
          backgroundColor: c.themes[props.theme].background,
          borderColor: c.themes[props.theme].border,
          elevation: 10,
          height: 60
         }
      }}>
      <Tab.Screen name="calcStack" component={CalcStack} options={{ title: 'Calculator' }} />
      <Tab.Screen name="clientStack" component={ClientStack} options={{ title: 'Clients' }} />
      <Tab.Screen name="settings" component={Settings} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
};

const TabNav = connect(mapStateToProps, actions)(TabStateless);

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: false, ...TransitionPresets.ModalSlideFromBottomIOS  }}
      initialRouteName="tutorial" >
      <Stack.Screen
        name="tutorial"
        component={Tutorial}
        options={({ navigation, route }) => ({ title: 'Tutorial' })} />
      <Stack.Screen
        name="auth"
        component={Auth}
        options={({ navigation, route }) => ({ title: 'Authentication' })} />
      <Stack.Screen
        name="tabs"
        component={TabNav} />
    </Stack.Navigator>
  );
}

const Router = () => {
  return (
    <NavigationContainer>
      <AuthStack />
    </NavigationContainer>
  );
}



export default Router;
