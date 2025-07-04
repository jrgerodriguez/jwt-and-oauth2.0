import { form } from "../variables.js"

export default class Notification {
    constructor(text) {
        this.text = text
    }

    showNotification() {
        const notificationContainer = document.createElement('DIV')
        notificationContainer.classList.add('notification-container')
        
        const existingNotification = document.querySelector('.notification-container')
        existingNotification?.remove() //Check if there is an existing alert and removes it.

        const notification = document.createElement('P')
        notification.classList.add('notification')
        notification.textContent = this.text        

        notificationContainer.appendChild(notification)

        form.parentElement.insertBefore(notificationContainer, form)

        setTimeout(() => {
            notificationContainer.remove()
        }, 3000);
    }
}