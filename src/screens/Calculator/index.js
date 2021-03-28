import { connect } from 'react-redux';
import * as actions from '../../actions';
import CalculatorScreen from './Calculator';
import CalculatorInfoScreen from './CalculatorInfo';

function mapStateToProps ({ settings }) {
  return { theme: settings.theme };
};

export const Calculator = connect(mapStateToProps, actions)(CalculatorScreen);
export const CalculatorInfo = connect(mapStateToProps, actions)(CalculatorInfoScreen);
