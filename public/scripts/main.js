import { changeInputType, createUsername, processLogin } from "./functions.js";
import Notification from "./classes/Notification.js";

document.addEventListener("DOMContentLoaded", () => {
  changeInputType();

  //Check if there is an alert in the url after attempting to access without a token
  const params = new URLSearchParams(window.location.search);
  if(params.get('alert') === 'login_required') {
    const notification = new Notification('Please log in to continue.')
    notification.showNotification()
  }

  if (document.querySelector("#form-create-username")) {
    createUsername();
  }

  if (document.querySelector("#form-login")) {
    processLogin();
  }
});
