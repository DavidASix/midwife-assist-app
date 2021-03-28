import { connect } from 'react-redux';
import Auth from './Auth';
import * as actions from '../../actions';

function mapStateToProps ({ settings, auth }) {
  return {
    theme: settings.theme,
    pin: auth.pin,
    authType: auth.authType
  };
};

export default connect(mapStateToProps, actions)(Auth);
