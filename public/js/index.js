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
import { leaveReview, editReview, deleteReview } from './review';

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
const leaveReviewForm = document.querySelector('.form-leave-review');
const reviews = document.querySelector('.reviews');

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

if (leaveReviewForm) {
  leaveReviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const review = document.getElementById('review').value;
    const rating = document.getElementById('rating').value;
    const tourId = leaveReviewForm.dataset.tourId;

    leaveReview(review, rating, tourId);
  });
}

if (reviews) {
  reviews.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const button = e.target;
      const reviewCard = button.closest('.reviews__card');
      const reviews = reviewCard.parentNode;

      if (button.textContent === 'Delete') {
        const reviewId = button.dataset.reviewId;
        deleteReview(reviewId);
        setTimeout(() => {
          reviews.removeChild(reviewCard);
        }, 500);
      }

      if (button.textContent === 'Edit') {
        const reviewId = button.dataset.reviewId;
        const reviewText = reviewCard.querySelector('.reviews__text');
        const reviewRatingBox = reviewCard.querySelector('.reviews__rating');
        const deleteButton = reviewCard.querySelector('.review__delete');
        const activeStars = reviewCard.querySelectorAll(
          '.reviews__star--active'
        );

        // Remove delete button
        deleteButton.remove();

        // Cancel button
        let cancel = document.createElement('button');
        cancel.className = 'review__change review__cancel';
        cancel.id = 'review__cancel';
        cancel.textContent = 'Cancel';
        cancel.setAttribute('data-review-text', reviewText.textContent);
        cancel.setAttribute('data-review-id', reviewId);

        // Input review
        const inputReview = document.createElement('textarea');
        inputReview.style.width = '27rem';
        inputReview.className = 'reviews__text';
        inputReview.value = reviewText.textContent;

        // Input rating
        const inputRating = document.createElement('input');
        inputRating.style.height = '3rem';
        inputRating.type = 'number';
        inputRating.min = 1;
        inputRating.max = 5;
        inputRating.className = 'reviews__rating-input';
        inputRating.value = activeStars.length;

        reviewCard.insertBefore(inputReview, reviewText);
        reviewCard.insertBefore(inputRating, reviewRatingBox);
        reviewCard.removeChild(reviewText);
        reviewCard.querySelector('.reviews__change').append(cancel);

        button.textContent = 'Save';
        button.setAttribute('data-review-id', reviewId);
      } else if (button.textContent === 'Cancel') {
        const reviewId = button.dataset.reviewId;
        const inputReview = reviewCard.querySelector('.reviews__text');
        const inputRating = reviewCard.querySelector('.reviews__rating-input');
        const cancelBtn = reviewCard.querySelector('.review__cancel');
        const editBtn = reviewCard.querySelector('.review__edit');
        const reviewTextContent = cancelBtn.dataset.reviewText;

        // Recreate delete button
        let deleteButton = document.createElement('button');
        deleteButton.className = 'review__change review__delete';
        deleteButton.id = 'review__delete';
        deleteButton.textContent = 'Delete';
        deleteButton.setAttribute('data-review-id', reviewId);

        // Recreate review text element
        const reviewText = document.createElement('p');
        reviewText.className = 'reviews__text';
        reviewText.textContent = reviewTextContent;

        reviewCard.insertBefore(reviewText, inputReview);
        reviewCard.removeChild(inputReview);
        reviewCard.removeChild(inputRating);
        reviewCard.querySelector('.reviews__change').append(deleteButton);

        editBtn.textContent = 'Edit';
        cancelBtn.remove();
      } else if (button.textContent === 'Save') {
        const reviewId = button.dataset.reviewId;
        const inputReview = reviewCard.querySelector('.reviews__text');
        const inputRating = reviewCard.querySelector('.reviews__rating-input');
        const cancelBtn = reviewCard.querySelector('.review__cancel');
        const stars = reviewCard.querySelectorAll('.reviews__star');

        // Remove cancel button
        cancelBtn.remove();

        // Recreate delete button
        let deleteButton = document.createElement('button');
        deleteButton.className = 'review__change review__delete';
        deleteButton.id = 'review__delete';
        deleteButton.textContent = 'Delete';
        deleteButton.setAttribute('data-review-id', reviewId);

        // Recreate review text element
        const reviewText = document.createElement('p');
        reviewText.className = 'reviews__text';
        reviewText.textContent = inputReview.value;

        reviewCard.insertBefore(reviewText, inputReview);
        reviewCard.removeChild(inputReview);
        reviewCard.removeChild(inputRating);
        reviewCard.querySelector('.reviews__change').append(deleteButton);

        for (const star of stars) {
          star.classList.contains('reviews__star--active')
            ? star.classList.remove('reviews__star--active')
            : star.classList.remove('reviews__star--inactive');
        }

        for (let i = 0; i < 5; i++) {
          stars[i].classList.add(
            `reviews__star--${
              +inputRating.value >= i + 1 ? 'active' : 'inactive'
            }`
          );
        }

        editReview(reviewText.textContent, +inputRating.value, reviewId);

        button.textContent = 'Edit';
      }
    }
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
