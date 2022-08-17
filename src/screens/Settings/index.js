import {connect} from 'react-redux';
import Settings from './Settings';
import * as actions from '../../actions';

function mapStateToProps({settings, auth}) {
  return {
    theme: settings.theme,
    authType: auth.authType,
  };
}

export default connect(mapStateToProps, actions)(Settings);
