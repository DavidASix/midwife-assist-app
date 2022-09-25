import {connect} from 'react-redux';
import * as actions from '../../actions';

import ViewClientScreen from './ViewClient';
import AddNoteScreen from './AddNote';
import EditClientScreen from './EditClient';

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

export const ViewClient = connect(mapStateToProps, actions)(ViewClientScreen);
export const AddNote = connect(mapStateToProps, actions)(AddNoteScreen);
export const EditClient = connect(mapStateToProps, actions)(EditClientScreen);
