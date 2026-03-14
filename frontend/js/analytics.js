document.addEventListener('DOMContentLoaded', () => {
    initCharts();
});

function initCharts() {
    // Dept Chart
    const deptCtx = document.getElementById('deptChart').getContext('2d');
    new Chart(deptCtx, {
        type: 'polarArea',
        data: {
            labels: ['IT', 'HR', 'Sales', 'Finance', 'Marketing'],
            datasets: [{
                data: [15, 30, 68, 25, 60],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.5)',
                    'rgba(16, 185, 129, 0.5)',
                    'rgba(239, 68, 68, 0.5)',
                    'rgba(245, 158, 11, 0.5)',
                    'rgba(139, 92, 246, 0.5)'
                ],
                borderWidth: 0
            }]
        },
        options: {
            scales: { r: { grid: { color: 'rgba(255,255,255,0.05)' }, border: { display: false } } },
            plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8' } } }
        }
    });

    // Trend Chart
    const trendCtx = document.getElementById('eventTrendChart').getContext('2d');
    new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [
                {
                    label: 'Opened',
                    data: [120, 150, 140, 180],
                    borderColor: '#94a3b8',
                    tension: 0.4
                },
                {
                    label: 'Clicked',
                    data: [80, 60, 45, 30],
                    borderColor: '#ef4444',
                    tension: 0.4
                }
            ]
        },
        options: {
            plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8' } } },
            scales: { 
                y: { grid: { color: 'rgba(255,255,255,0.05)' } },
                x: { grid: { display: false } }
            }
        }
    });
}
