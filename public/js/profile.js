document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('logout-button').addEventListener('click', () => {
        // Clear any user session data here if needed
        window.location.href = 'login.html'; // Redirect to login page
    });

    document.getElementById('menu-toggle').addEventListener('click', () => {
        document.getElementById('side-menu').style.left = document.getElementById('side-menu').style.left === '0px' ? '-250px' : '0px';
    });
});
