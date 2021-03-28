import React, { Component } from 'react';
import {
  Platform,
  Dimensions,
  StatusBar
} from 'react-native';

const iPhones = {
  default: {
    statusBar: 20,
    deviceHeight: 0,
    deviceWidth: 0
  },
  x: {
    statusBar: 44,
    deviceHeight: 812,
    deviceWidth: 375
  },
  xsMax: {
    statusBar: 44,
    deviceHeight: 896,
    deviceWidth: 414
  },
  i12: {
    statusBar: 47,
    deviceHeight: 844,
    deviceWidth: 390
  },
  i12Max: {
    statusBar: 47,
    deviceHeight: 926,
    deviceWidth: 428
  }
}

const { height, width } = Dimensions.get("window");

let sBarHeight = 0;

if (Platform.OS !== 'ios') {
  sBarHeight = StatusBar.currentHeight;
} else {
  sBarHeight = Object.keys(iPhones).find((device, i) => iPhones[device].deviceHeight === height && iPhones[device].deviceWidth === width);
  sBarHeight = sBarHeight ? sBarHeight.statusBar : iPhones.default.statusBar;
}

const StatusBarHeight = sBarHeight;

export default StatusBarHeight;
