// Helper function to get users from localStorage
function getUsers() {
    let users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}

// Helper function to save users to localStorage
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Login form submission
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        alert('Login successful!');
        window.location.href = 'main.html';
    } else {
        alert('Invalid credentials. Please try again.');
    }
});

// Signup form submission
document.getElementById('signup-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const fullname = document.getElementById('signup-fullname').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    let users = getUsers();

    // Check if email already exists
    if (users.find(u => u.email === email)) {
        alert('Email already exists. Please login.');
        document.getElementById('signup-form').style.display = 'none';
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('form-title').textContent = 'Login';
        return;
    }

    // Add the new user to the list
    users.push({ fullname, email, password });
    saveUsers(users);

    alert('Signup successful! You can now login.');
    document.getElementById('signup-form').reset();
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('form-title').textContent = 'Login';
});

// Switch to signup form
document.getElementById('signup-link').addEventListener('click', function () {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
    document.getElementById('form-title').textContent = 'Sign Up';
});

// Switch to login form
document.getElementById('login-link').addEventListener('click', function () {
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('form-title').textContent = 'Login';
});
