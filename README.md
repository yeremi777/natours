# Natours App

A simple tour booking application that created with Node.js, Express.js, MongoDB and Mongoose.

<sub><sup>Made from Jonas Schmedtmann's course on udemy.com</sup></sub>

## Features

These are the features that provided by Natours website:

+ Users feature (log in, sign up and manage account)
+ Tour bookings using stripe (fake transaction)
+ Receive an email after sign up

Following the challenges from the course, i added additional features to this project:

+ Implement sign up feature
+ Implement restriction that users can only review a tour that booked by them
+ Implement nested bookings routes that related with tours and users
+ Implement select tour date when booking and restriction if the tour has already full of participants
+ Prevent duplicate tour booking if the user has already booked that tour before
+ Allow users to leave a review directly on the tour page
+ Different "Book Tour Now" button in different situations
+ Implement "My Review" page, where all reviews displayed
+ Implement edit and delete review feature

## Run this project

Before run this project in directory, don't forget to:
+ run `npm install`
+ set config environment for yourself (create "config.env" file in directory)

### config.env
1. NODE_ENV=development (default value for development)
2. PORT=3000 (default port used, can be changed)
3. DATABASE, DATABASE_USERNAME, DATABASE_PASSWORD (MongoDB configuration)
4. JWT_SECRET (JWT secret key)
5. JWT_EXPIRES_IN (JWT expiration day)
6. JWT_COOKIE_EXPIRES_IN (JWT expiration day in cookie)
7. EMAIL_USERNAME, EMAIL_PASSWORD, EMAIL_HOST, EMAIL_PORT (Nodemailer configuration)
8. BREVO_HOST, BREVO_PORT, BREVO_USERNAME, BREVO_PASSWORD, BREVO_APIKEY (Brevo configuration)
9. STRIPE_SECRET_KEY (Stripe secret key)
10. STRIPE_WEBHOOK_SECRET (Stripe webhook secret key)

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
