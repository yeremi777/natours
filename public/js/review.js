/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const leaveReview = async (review, rating, tourId) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/tours/${tourId}/reviews`,
      data: {
        review,
        rating,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Review has been successfully added.');
      window.setTimeout(() => {
        location.reload(true);
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const editReview = async (review, rating, reviewId) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/reviews/${reviewId}`,
      data: {
        review,
        rating,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Review has been successfully updated.');
      window.setTimeout(() => {
        location.reload(true);
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteReview = async (reviewId) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/reviews/${reviewId}`,
    });

    if (res.status === 204) {
      showAlert('success', 'Review has been successfully deleted.');
      window.setTimeout(() => {
        location.reload(true);
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
