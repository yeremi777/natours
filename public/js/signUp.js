/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const signUp = async (name, email, password, passwordConfirmation) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/sign-up',
      data: {
        name,
        email,
        password,
        passwordConfirmation,
      },
    });

    if (res.data.status === 'success') {
      showAlert(
        'success',
        'Sign up successfully! Please check email from us 😊'
      );
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
