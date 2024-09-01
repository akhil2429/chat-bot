document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const sendButton = document.getElementById('send-button');
    const userInput = document.getElementById('user-input');
    const imageUpload = document.getElementById('image-upload');
    const modeToggle = document.getElementById('mode-toggle');
    const menuToggle = document.getElementById('menu-toggle');
    const sideMenu = document.getElementById('side-menu');

    let darkMode = false;

    // Function to append a message to the chatbox
    function appendMessage(type, text, imageUrl) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;

        if (text) {
            const textDiv = document.createElement('div');
            textDiv.className = 'message-text';
            textDiv.innerHTML = text.replace(/\n/g, '<br>'); // Replace newlines with <br> for multi-paragraph support
            messageDiv.appendChild(textDiv);
        }

        if (imageUrl) {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.className = 'uploaded-image'; // Added class for styling
            messageDiv.appendChild(img);
        }

        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
    }

    // Function to send a message
    async function sendMessage() {
        const message = userInput.value.trim();

        if (message === '') return;

        appendMessage('user', message);
        userInput.value = '';

        try {
            const response = await fetch('/generate-answer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: message }),
            });

            const data = await response.json();
            appendMessage('bot', data.answer); // Display answer with support for paragraphs
        } catch (error) {
            console.error('Error:', error);
            appendMessage('bot', 'Sorry, something went wrong.');
        }
    }

    // Function to handle image upload
    async function uploadImage() {
        const file = imageUpload.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('/upload-image', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            // Display the uploaded image on the user side
            appendMessage('user', null, data.results.imageUrl); 
        } catch (error) {
            console.error('Error:', error);
            appendMessage('bot', 'Image recognition failed.');
        }
    }

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });

    imageUpload.addEventListener('change', uploadImage);

    modeToggle.addEventListener('click', () => {
        darkMode = !darkMode;
        document.body.classList.toggle('dark-mode', darkMode);
        modeToggle.innerHTML = darkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });

    menuToggle.addEventListener('click', () => {
        sideMenu.style.left = sideMenu.style.left === '0px' ? '-250px' : '0px';
    });

    // Add an initial message from the bot
    appendMessage('bot', 'Welcome! How can I assist you today?');
});

const imageUpload = document.getElementById('image-upload');
const chatBox = document.getElementById('chat-box');

// Show image upload when the attachment icon is clicked
document.querySelector('.attachment-icon').addEventListener('click', () => {
    imageUpload.click();
});

// Handle image upload and display
imageUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imgElement = document.createElement('img');
            imgElement.src = e.target.result;
            chatBox.appendChild(imgElement);
        };
        reader.readAsDataURL(file);
    }
});

// Optional: Functionality for the side menu toggle
const menuToggle = document.getElementById('menu-toggle');
const sideMenu = document.getElementById('side-menu');
menuToggle.addEventListener('click', () => {
    sideMenu.classList.toggle('open');
});
