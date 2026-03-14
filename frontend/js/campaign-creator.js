const API_URL = '/api';

document.getElementById('campaignForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveCampaign('Draft');
});

document.getElementById('launchBtn').addEventListener('click', async () => {
    const campaign = await saveCampaign('Draft');
    if (campaign && campaign._id) {
        await launchCampaign(campaign._id);
    }
});

async function saveCampaign(status) {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    const name = document.getElementById('name').value;
    const type = document.getElementById('type').value;
    const departments = document.getElementById('departments').value.split(',').map(d => d.trim()).filter(d => d !== '');
    const subject = document.getElementById('subject').value;
    const sender = document.getElementById('sender').value;
    const body = document.getElementById('body').value;

    try {
        const response = await fetch(`${API_URL}/campaigns`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name,
                type,
                targetDepartments: departments,
                template: { subject, sender, body }
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Campaign saved successfully!');
            return data;
        } else {
            alert(data.message || 'Failed to save campaign');
        }
    } catch (error) {
        console.error('Error saving campaign:', error);
        alert('An error occurred. Check server logs.');
    }
}

async function launchCampaign(id) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_URL}/campaigns/${id}/launch`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            alert('Campaign launched successfully!');
            window.location.href = 'campaign-management.html';
        } else {
            const data = await response.json();
            alert(data.message || 'Failed to launch');
        }
    } catch (error) {
        console.error('Error launching campaign:', error);
    }
}
