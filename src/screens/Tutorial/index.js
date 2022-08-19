import {connect} from 'react-redux';
import * as actions from '../../actions';

import TutorialScreen from './Tutorial';

function mapStateToProps({settings, client}) {
  return {
    theme: settings.theme,
    firstLogin: settings.firstLogin,
    clients: client.clients,
    babies: client.babies,
  };
}

export const Tutorial = connect(mapStateToProps, actions)(TutorialScreen);
