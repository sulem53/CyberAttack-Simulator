const API_URL = '/api';

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../login.html';
        return;
    }

    await fetchEmployees(token);
});

async function fetchEmployees(token) {
    try {
        const response = await fetch(`${API_URL}/employees`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        if (response.ok) {
            renderEmployees(data);
            updateStats(data);
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        const loading = document.getElementById('loading');
        if (loading) loading.classList.add('hidden');
    }
}

function renderEmployees(employees) {
    const list = document.getElementById('employeeList');
    list.innerHTML = '';

    employees.forEach(e => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-white/5 transition';
        
        row.innerHTML = `
            <td class="px-6 py-4">${e.fullName}</td>
            <td class="px-6 py-4 text-slate-400">${e.email}</td>
            <td class="px-6 py-4">${e.department || 'N/A'}</td>
            <td class="px-6 py-4 font-bold ${e.riskScore > 70 ? 'text-red-400' : (e.riskScore > 40 ? 'text-yellow-400' : 'text-green-400')}">${e.riskScore}</td>
            <td class="px-6 py-4">
                <button onclick="removeEmployee('${e._id}')" class="text-red-500 hover:text-red-400 text-sm font-bold">Remove</button>
            </td>
        `;
        list.appendChild(row);
    });
}

function updateStats(employees) {
    const highRisk = employees.filter(e => e.riskScore > 80).length;
    const avgRisk = employees.length > 0 ? (employees.reduce((acc, curr) => acc + curr.riskScore, 0) / employees.length).toFixed(1) : '0.0';

    document.getElementById('deptAvg').textContent = avgRisk;
    document.getElementById('highRiskCount').textContent = highRisk;
}

function toggleModal(id) {
    const modal = document.getElementById(id);
    modal.classList.toggle('hidden');
}

// Add Single Employee
document.getElementById('addEmployeeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const fullName = document.getElementById('addName').value;
    const email = document.getElementById('addEmail').value;
    const department = document.getElementById('addDept').value;

    try {
        const response = await fetch(`${API_URL}/employees`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ fullName, email, department })
        });

        if (response.ok) {
            alert('Employee added!');
            location.reload();
        } else {
            const data = await response.json();
            alert(data.message || 'Error adding employee');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Bulk Upload
document.getElementById('processBulkBtn').addEventListener('click', async () => {
    const token = localStorage.getItem('token');
    const rawData = document.getElementById('bulkData').value;
    
    try {
        const employees = JSON.parse(rawData);
        const response = await fetch(`${API_URL}/employees/bulk`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ employees })
        });

        const result = await response.json();
        alert(`Upload Complete!\nSuccess: ${result.success}\nFailed: ${result.failed}`);
        location.reload();
    } catch (error) {
        alert('Invalid JSON format or network error');
    }
});

async function removeEmployee(id) {
    if (!confirm('Are you sure you want to remove this employee?')) return;
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(`${API_URL}/employees/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            location.reload();
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
