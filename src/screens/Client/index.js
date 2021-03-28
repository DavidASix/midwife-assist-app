import { connect } from 'react-redux';
import * as actions from '../../actions';

import ClientScreen from './Client';
import ViewClientScreen from './ViewClient';
import AddClientScreen from './AddClient';
import EditClientScreen from './EditClient';
import AddBabyScreen from './AddBaby';

function mapStateToProps ({ settings, client, auth }) {
  return {
    theme: settings.theme,
    clients: client.clients,
    babies: client.babies,
    sortType: client.sortType,
    authType: auth.authType,
    lastLogTime: auth.lastLogTime
  };
};

export const Client = connect(mapStateToProps, actions)(ClientScreen);
export const ViewClient = connect(mapStateToProps, actions)(ViewClientScreen);
export const AddClient = connect(mapStateToProps, actions)(AddClientScreen);
export const EditClient = connect(mapStateToProps, actions)(EditClientScreen);
export const AddBaby = connect(mapStateToProps, actions)(AddBabyScreen);
