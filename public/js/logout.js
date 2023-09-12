/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:3000/api/v1/users/logout',
    });

    if (res.data.status === 'success') {
      location.reload(true);
      location.assign('/login');
    }
  } catch (err) {
    showAlert('error', 'Error logging out! Try again.');
  }
};
