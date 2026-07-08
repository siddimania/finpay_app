export const ERROR_MESSAGES = {
  SIGN_IN_WITH_EMAIL_ERROR: "SignIn With EMAIL Failed. Please try again.",
  SIGN_IN_WITH_GOOGLE_ERROR: "SignIn With Google Failed. Please try again.",
  SIGN_UP_ERROR:
    "SignUp With Email Failed. Please try again or contact support.",
  SIGN_OUT_ERROR: "Something went wrong while logging out. Please try again.",

  DB_INSERT_ERROR:
    "Something went wrong while inserting the data. Please try again.",
  DB_FETCH_ERROR:
    "Something went wrong while fetching the data. Please try again.",

  SERVER_ERROR: "Something went wrong. Please try again or contact support.",

  PAYMENT_SYSTEM_INITIALIZE_FAILED:
    "Payment System failed to initialize. Please try again or contact support.",
  PAYMENT_CHECKOUT_ERROR:
    "Payment Checkout Error. Please refresh the page or contact support.",
  PAYMENT_FAILED: "Your payment failed. Please try again or contact support",
  PAYMENT_SUCCESS_FAILED_DB_INSERT: "We've received the payment but server failed on print generation. Please contact support.",
};

export const SUCCESS_MESSAGES = {
  SIGN_UP_VERIFY_LINK_SENT:
    "A verification link has been sent to your email. Please verify.",
  CONTACT_MESSAGE_RECEIVED: "We've received your message. We'll update you via email. Thank you!",
  SUBSCRIBED_NEWSLETTER: "Subscribed to our email list. Thank You :)",
};
