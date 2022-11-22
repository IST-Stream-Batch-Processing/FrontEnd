import {getOr} from 'lodash/fp';
import history from './history';
import {getRoles, getToken} from "./token";

const paths = {
  'Customer': '/home',
  'Developer': '/developer',
  'Admin': '/admin',
};

const path2role = {
  'home': 'Customer',
  'developer': 'Developer',
  'admin': 'Admin',
};

// 根据role决定跳转到什么主页
export const routeWithRole = (role, myRole) => {
  if (role !== myRole) {
    history.replace(getOr('/login')(myRole)(paths));
  }
};

// 跳转到当前首页
export const route2home = () => {
  const pathList = history.location.pathname.split("/").filter(item => item !== '');
  const role = pathList.length > 0 ? getOr("")(pathList[0])(path2role) : "";
  const roles = JSON.parse(getRoles(getToken()));
  if (roles.indexOf(role) > -1) {
    history.replace(getOr('/login')(role)(paths));
  } else routeWithRole("", roles[0]);
};

export default {routeWithRole, route2home};
