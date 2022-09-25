import {connect} from 'react-redux';
import * as actions from '../../actions';

import AddClient from './AddClient';

function mapStateToProps({settings, client, auth, notes}) {
  return {theme: settings.theme};
}

export default connect(mapStateToProps, actions)(AddClient);
