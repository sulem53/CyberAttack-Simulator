const API_URL = '/api';

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../login.html';
        return;
    }

    await fetchCampaigns(token);
});

async function fetchCampaigns(token) {
    try {
        const response = await fetch(`${API_URL}/campaigns`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        if (response.ok) {
            renderCampaigns(data);
        } else {
            console.error('Failed to fetch campaigns');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        document.getElementById('loading').classList.add('hidden');
    }
}

function renderCampaigns(campaigns) {
    const list = document.getElementById('campaignList');
    list.innerHTML = '';

    if (campaigns.length === 0) {
        list.innerHTML = '<tr><td colspan="6" class="px-6 py-10 text-center text-slate-500">No campaigns found. Start by creating one!</td></tr>';
        return;
    }

    campaigns.forEach(c => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-white/5 transition cursor-pointer';
        
        const clickRate = c.stats.sent > 0 ? ((c.stats.clicked / c.stats.sent) * 100).toFixed(1) : '0.0';
        const statusClass = c.status === 'Active' ? 'status-active' : (c.status === 'Draft' ? 'status-draft' : 'status-completed');

        row.innerHTML = `
            <td class="px-6 py-4">
                <div class="font-bold">${c.name}</div>
                <div class="text-xs text-slate-500">Created: ${new Date(c.createdAt).toLocaleDateString()}</div>
            </td>
            <td class="px-6 py-4 text-slate-300">${c.type}</td>
            <td class="px-6 py-4"><span class="status-badge ${statusClass}">${c.status}</span></td>
            <td class="px-6 py-4 text-slate-300">${c.targets.length}</td>
            <td class="px-6 py-4 font-bold text-blue-400">${clickRate}%</td>
            <td class="px-6 py-4">
                ${c.status === 'Draft' ? `<button onclick="launchNow('${c._id}')" class="text-blue-400 hover:text-blue-300 font-bold text-sm">Launch</button>` : '<span class="text-slate-600 text-sm">Auditing</span>'}
            </td>
        `;
        list.appendChild(row);
    });
}

async function launchNow(id) {
    const token = localStorage.getItem('token');
    if (!confirm('Are you sure you want to launch this campaign now?')) return;

    try {
        const response = await fetch(`${API_URL}/campaigns/${id}/launch`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            alert('Campaign launched!');
            location.reload();
        } else {
            alert('Failed to launch');
        }
    } catch (error) {
        console.error('Error launching:', error);
    }
}
