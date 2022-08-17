import {connect} from 'react-redux';
import * as actions from '../../actions';
import CalculatorScreen from './Calculator';

function mapStateToProps({settings}) {
  return {theme: settings.theme};
}

const Calculator = connect(mapStateToProps, actions)(CalculatorScreen);

export default Calculator;
