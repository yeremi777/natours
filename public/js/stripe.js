/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const bookTour = async (tourId, startDateId) => {
  const stripe = Stripe(
    'pk_test_51Non8ZFMCUqSDWAFwUkxz9gKOD2dsMQQPWYmIUzmhtT77FCUiRRzhoi5fUinz0t5NXB8ixNPQDOGpBKj031WtP8F00CVYhEMNM'
  );

  try {
    // 1. Get checkout session from API
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}/${startDateId}`
    );

    // 2. Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
