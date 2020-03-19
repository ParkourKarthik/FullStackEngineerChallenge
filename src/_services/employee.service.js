import { authHeader } from '../_helpers/AuthHeader';
import { callApi } from './common.service';
import Storage from '../_helpers/Storage';

//#region authentication
export const Login = (username, password) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  };

  return callApi('authenticate', requestOptions).then(user => {
    // store user details and jwt token in local storage to keep user logged in between page refreshes
    Storage.saveUser(JSON.stringify(user));

    return user;
  });
};

export const Logout = () => {
  // remove user from local storage to log user out
  Storage.removeUser();
};
//#endregion

export const GetAll = () => {
  const requestOptions = {
    method: 'POST',
    headers: authHeader()
  };

  return callApi('employees', requestOptions);
};

export const AddEmployee = employee => {
  return callApi('employee', {
    method: 'POST',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(employee)
  });
};

export const UpdateEmployee = employee => {
  return callApi('employee', {
    method: 'PUT',
    headers: {
      ...authHeader(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(employee)
  });
};

export const DeleteEmployee = employee => {
  return callApi('employee/' + employee._id, {
    method: 'DELETE',
    headers: authHeader()
  });
};
