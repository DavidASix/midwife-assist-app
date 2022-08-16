import React from 'react';
import {Text} from 'react-native';

import StackedWaves from './svg/StackedWaves.js';
import TabBarDivider from './svg/TabBarDivider.js';

//Icons

export default function SVGIcon(props) {
  const icon = {
    stackedWaves: <StackedWaves {...props} />,
    tabBarDivider: <TabBarDivider {...props} />,
  };

  return icon[props.name] ? (
    icon[props.name]
  ) : (
    <Text style={{color: 'red'}}>⛔</Text>
  );
}
