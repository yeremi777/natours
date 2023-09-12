/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const updateData = async (data) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/update-me',
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Data updated successfully!');
      // location.reload(true);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const updatePassword = async (
  currentPassword,
  newPassword,
  newPasswordConfirmation
) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/update-password',
      data: {
        currentPassword,
        password: newPassword,
        passwordConfirmation: newPasswordConfirmation,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Password updated successfully!');
      // location.reload(true);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
