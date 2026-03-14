document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!user || !token) {
        window.location.href = '../login.html';
        return;
    }

    // Role check
    if (user.role !== 'SuperAdmin' && user.role !== 'Admin') {
        alert('Unauthorized access');
        window.location.href = '../login.html';
        return;
    }

    // Update UI
    document.getElementById('userName').textContent = user.fullName;
    document.getElementById('userRole').textContent = user.role;
    document.getElementById('userInitial').textContent = user.fullName.charAt(0);

    // Fetch Stats
    fetchStats(token);

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.clear();
        window.location.href = '../login.html';
    });

    // Initialize Charts
    initCharts();
});

async function fetchStats(token) {
    try {
        const response = await fetch('/api/org/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        if (response.ok) {
            document.getElementById('orgName').textContent = data.orgName;
            document.getElementById('statEmployees').textContent = data.totalEmployees;
            document.getElementById('statRisk').textContent = data.avgRiskScore.toFixed(1);
            document.getElementById('statCampaigns').textContent = data.activeCampaigns;
            document.getElementById('statAlerts').textContent = data.highRiskAlerts;
        }
    } catch (error) {
        console.error('Error fetching stats:', error);
    }
}

function initCharts() {
    const riskCtx = document.getElementById('riskChart').getContext('2d');
    new Chart(riskCtx, {
        type: 'bar',
        data: {
            labels: ['Low', 'Medium', 'High', 'Critical'],
            datasets: [{
                label: 'Employees',
                data: [12, 19, 3, 5],
                backgroundColor: ['#10b981', '#f59e0b', '#f97316', '#ef4444'],
                borderRadius: 8
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } } }
        }
    });

    const campaignCtx = document.getElementById('campaignChart').getContext('2d');
    new Chart(campaignCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Clicks (%)',
                data: [45, 38, 30, 22, 18, 12],
                borderColor: '#3b82f6',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(59, 130, 246, 0.1)'
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } } }
        }
    });
}
