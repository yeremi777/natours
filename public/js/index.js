/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './leaflet';
import { login } from './login';
import { logout } from './logout';
import { updateData, updatePassword } from './updateSettings';
import { displayPhoto } from './displayPhoto';
import { bookTour } from './stripe';

// DOM ELEMENTS
const leaflet = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const userImg = document.querySelector('.form__user-photo');
const userImgInput = document.querySelector('#photo');
const bookBtn = document.getElementById('book-tour');

// DELEGATION
if (leaflet) {
  const locations = JSON.parse(
    document.getElementById('map').dataset.locations
  );
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm) {
  displayPhoto(userImg, userImgInput);

  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();

    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateData(form);
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btnSavePassword = document.querySelector('.btn--save-password');
    btnSavePassword.textContent = 'Updating...';
    btnSavePassword.setAttribute('disabled', true);
    btnSavePassword.style.cursor = 'not-allowed';

    const currentPassword = document.getElementById('password-current').value;
    const newPassword = document.getElementById('password').value;
    const newPasswordConfirmation =
      document.getElementById('password-confirm').value;
    await updatePassword(currentPassword, newPassword, newPasswordConfirmation);

    btnSavePassword.textContent = 'Save password';
    btnSavePassword.removeAttribute('disabled');
    btnSavePassword.removeAttribute('style');
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}
