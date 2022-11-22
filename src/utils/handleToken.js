import {getRoles, getToken} from './token';
import history from './history';
import {routeWithRole} from './routeUtil';

export default (props) => {
  const token = getToken();
  if (token == null) {
    history.replace('/login');
  } else {
    const roles = getRoles(token);
    if (!(roles.indexOf(props.currentModel) > -1)) {
      routeWithRole(props.currentModel, roles[0]);
    }
  }
};
