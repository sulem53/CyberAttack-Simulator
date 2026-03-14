const API_URL = '/api';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            
            // Redirect based on role
            if (data.role === 'SuperAdmin' || data.role === 'Admin') {
                window.location.href = 'dashboards/admin.html';
            } else if (data.role === 'HR') {
                window.location.href = 'dashboards/hr.html';
            } else {
                window.location.href = 'dashboards/employee.html';
            }
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred. Please check if the server is running.');
    }
});
