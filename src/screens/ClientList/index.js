import {connect} from 'react-redux';
import * as actions from '../../actions';

import ClientList from './ClientList';

function mapStateToProps({settings, client, auth, notes}) {
  return {
    theme: settings.theme,
    clients: client.clients,
    notes: notes.notes,
    babies: client.babies,
    sortType: client.sortType,
    authType: auth.authType,
    lastLogTime: auth.lastLogTime,
  };
}

export default connect(mapStateToProps, actions)(ClientList);
