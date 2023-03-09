import React from 'react';
import {BackHandler} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../actions';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

import BottomTabBar from './BottomTabBar';

import Auth from '../screens/Auth/';
import ViewClient from '../screens/ViewClient/';
import AddClient from '../screens/AddClient/';
import ClientList from '../screens/ClientList/';
import Calculator from '../screens/Calculator/';
import {Tutorial} from '../screens/Tutorial/';
import Settings from '../screens/Settings/';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function mapStateToProps({settings}) {
  return {theme: settings.theme};
}

const ClientStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        presentation: 'transparentModal',
        ...TransitionPresets.ModalSlideFromBottomIOS,
      }}
      initialRouteName="clients">
      <Stack.Screen
        name="clients"
        component={ClientList}
        options={{title: 'Clients'}}
      />
      <Stack.Screen name="addClient" component={AddClient} />
      <Stack.Screen name="viewClient" component={ViewClient} />
    </Stack.Navigator>
  );
};

const TabStateless = props => {
   return (
    <Tab.Navigator
      initialRouteName="clientStack"
      tabBar={navProps => <BottomTabBar {...props} {...navProps} />}
      screenOptions={{headerShown: false}}>
      <Tab.Screen
        name="calcStack"
        component={Calculator}
        options={{title: 'Calculator'}}
      />
      <Tab.Screen
        name="clientStack"
        component={ClientStack}
        options={{title: 'Clients'}}
      />
      <Tab.Screen
        name="settings"
        component={Settings}
        options={{title: 'Settings'}}
      />
    </Tab.Navigator>
  );
};

const TabNav = connect(mapStateToProps, actions)(TabStateless);

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        ...TransitionPresets.ModalSlideFromBottomIOS,
      }}
      initialRouteName="tutorial">
      <Stack.Screen
        name="tutorial"
        component={Tutorial}
        options={({navigation, route}) => ({title: 'Tutorial'})}
      />
      <Stack.Screen
        name="auth"
        component={Auth}
        options={({navigation, route}) => ({title: 'Authentication'})}
      />
      <Stack.Screen name="tabs" component={TabNav} />
    </Stack.Navigator>
  );
};

const Router = () => {
  return (
    <NavigationContainer>
      <AuthStack />
    </NavigationContainer>
  );
};

export default Router;
