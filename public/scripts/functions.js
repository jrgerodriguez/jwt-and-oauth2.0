import { eyeIcons, createUserForm, loginForm } from "./variables.js";
import Notification from "./classes/Notification.js";

export function changeInputType() {
  eyeIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const targetId = icon.dataset.target;
      const input = document.getElementById(targetId);

      if (input) {
        input.type = input.type === "password" ? "text" : "password";

        if (input.type === "text") {
          icon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
            </svg>
            `;
        } else {
          icon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
            <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>
            <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
            <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
            </svg>
            `;
        }
      }
    });
  });
}

export function createUsername() {
  createUserForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const createUsernameBtn = document.querySelector('#create-username-btn')

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Check that all fields have values
    if ([data.username, data.password, data.password2].some(field => field.trim() === '')) { // Check if at least one is missing after trimming.
      const notification = new Notification('All fields are required.') 
      notification.showNotification()
      return
    }

    // Checks if both passwords match
    if(data.password !== data.password2) {
      const notification = new Notification('Passwords do not match.') //Shows a notification, this classes was imported
      notification.showNotification()
      return
    }

    // Check if password or username are too short
    if(data.password.length < 6 || data.username.length < 5) {
      const notification = new Notification('Username or password too short.')
      notification.showNotification()
      return
    } 

    try {
      createUsernameBtn.disabled = true;

      const response = await fetch("/create-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json() // Covert the response into json so we can read the message the request response sent back.

      if (response.ok) {
        window.location.href = '/'
      } else {
        const notification = new Notification(result.message || 'Something went wrong.')
        notification.showNotification()
        createUsernameBtn.disabled = false;
      }
    } catch (error) {
      const notification = new Notification('Network error. Please try again.')
      notification.showNotification()
      createUsernameBtn.disabled = false;
    }
  });
}

export function processLogin() {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData);

    // Check that all fields have values
    if ([data.username, data.password].some(field => field.trim() === '')) { // Check if at least one is missing after trimming.
      const notification = new Notification('All fields are required.') 
      notification.showNotification()
      return
    }
    
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      }) 

      const result = await response.json()

      if(response.ok) {
        window.location.href = '/'
      } else {
        const notification = new Notification(result.message)
        notification.showNotification()
      }
    } catch (error) {
      const notification = new Notification('Network error. Please try again.')
      notification.showNotification()
    }
    
  })
}