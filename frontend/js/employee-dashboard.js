document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = '../login.html';
        return;
    }

    document.getElementById('empName').textContent = user.fullName;
    
    // Update Risk Score UI
    updateRiskUI(user.riskScore || 0);

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.clear();
        window.location.href = '../login.html';
    });
});

function updateRiskUI(score) {
    const circle = document.getElementById('riskCircle');
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    const offset = circumference - (score / 100) * circumference;
    circle.style.strokeDashoffset = offset;

    const valueText = document.getElementById('riskValue');
    valueText.textContent = score;

    const levelText = document.getElementById('riskLevel');
    if (score > 80) {
        levelText.textContent = 'Critical';
        levelText.className = 'text-sm font-semibold uppercase tracking-widest text-red-500';
        circle.style.stroke = '#ef4444';
    } else if (score > 50) {
        levelText.textContent = 'Warnings';
        levelText.className = 'text-sm font-semibold uppercase tracking-widest text-yellow-500';
        circle.style.stroke = '#f59e0b';
    } else {
        levelText.textContent = 'Secure';
        levelText.className = 'text-sm font-semibold uppercase tracking-widest text-green-400';
        circle.style.stroke = '#10b981';
    }
}
