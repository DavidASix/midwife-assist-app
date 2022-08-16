import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const TabBarDivider = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || props?.style?.width || '100%'}
    height={props.size || props?.style?.height || '100%'}
    preserveAspectRatio="none"
    viewBox="0 0 350 15"
    {...props}>
    <Path
      d="M0 2a843.844 843.844 0 0 0 105 7c13.171 0 69.851-6.791 126-8 59.879-1.289 119 12 119 12v2H0V2Z"
      style={{
        fill: props.color || '#82b983',
        fillRule: 'evenodd',
      }}
    />
  </Svg>
);

export default TabBarDivider;
