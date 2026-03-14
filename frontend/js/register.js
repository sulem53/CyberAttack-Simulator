const API_URL = '/api';

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const companyName = document.getElementById('companyName').value;
    const domain = document.getElementById('domain').value;
    const industry = document.getElementById('industry').value;
    const adminName = document.getElementById('adminName').value;
    const adminEmail = document.getElementById('adminEmail').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                companyName, domain, industry, 
                adminName, adminEmail, password 
            })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            alert('Registration successful! Redirecting to dashboard...');
            window.location.href = 'dashboards/admin.html';
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('An error occurred. Please check if the server is running.');
    }
});
