/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './leaflet';
import { signUp } from './signup';
import { login } from './login';
import { logout } from './logout';
import { updateData, updatePassword } from './updateSettings';
import { displayPhoto } from './displayPhoto';
import { bookTour } from './stripe';
import { showAlert } from './alert';

// DOM ELEMENTS
const leaflet = document.getElementById('map');
const signUpForm = document.querySelector('.form--signUp');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const userImg = document.querySelector('.form__user-photo');
const userImgInput = document.querySelector('#photo');
const bookBtn = document.getElementById('book-tour');
const selectedBookDate = document.querySelector('.selectStartDate');

// DELEGATION
if (leaflet) {
  const locations = JSON.parse(
    document.getElementById('map').dataset.locations
  );
  displayMap(locations);
}

if (signUpForm) {
  signUpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--signUp').textContent = 'Processing...';
    document.querySelector('.btn--signUp').setAttribute('disabled', true);
    document.querySelector('.btn--signUp').cursor = 'not-allowed';

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirmation = document.getElementById(
      'passwordConfirmation'
    ).value;

    await signUp(name, email, password, passwordConfirmation);

    document.querySelector('.btn--signUp').textContent = 'Sign up';
    document.querySelector('.btn--signUp').removeAttribute('disabled');
    document.querySelector('.btn--signUp').removeAttribute('style');
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logoutBtn) logoutBtn.addEventListener('click', logout);

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
  bookBtn.addEventListener('click', async (e) => {
    e.target.textContent = 'Processing...';
    e.target.setAttribute('disabled', true);
    e.target.style.cursor = 'not-allowed';

    const { tourId } = e.target.dataset;
    const startDateId = selectedBookDate.value;
    await bookTour(tourId, startDateId);

    e.target.textContent = 'Book tour now!';
    e.target.removeAttribute('disabled');
    e.target.removeAttribute('style');
  });
}

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) {
  showAlert('success', alertMessage, 10);

  const url = window.location.href;
  const newUrl = new URL(url);
  newUrl.search = '';

  window.setTimeout(() => {
    location.assign(newUrl.toString());
  }, 10500);
}
