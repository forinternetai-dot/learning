const ADMIN_CRED = { login: 'admin', password: 'admin123' };
document.getElementById('adminLoginBtn').addEventListener('click', () => {
    const login = document.getElementById('adminUser').value;
    const pass = document.getElementById('adminPass').value;
    if (login === ADMIN_CRED.login && pass === ADMIN_CRED.password) {
        document.getElementById('adminLogin').style.display = 'none';
        document.getElementById('adminData').style.display = 'block';
        loadAdminData();
    } else alert("Login yoki parol xato!");
});
function loadAdminData() {
    const users = JSON.parse(localStorage.getItem('learning_users') || '[]');
    let html = '<table class="admin-table"><tr><th>Login</th><th>Ism</th><th>Ro‘yxat sanasi</th><th>Test natijalari</th><th></th></tr>';
    users.forEach((user, idx) => {
        let resultsHtml = '';
        if (user.testResults) {
            for (const [course, res] of Object.entries(user.testResults)) {
                resultsHtml += `<div><strong>${res.courseTitle || course}</strong>: ${res.score}/${res.total} (${res.percentage}%) - ${new Date(res.date).toLocaleDateString()}</div>`;
            }
        } else resultsHtml = "Test topshirilmagan";
        html += `<tr><td>${user.login}</td><td>${user.fullName || ''}</td><td>${new Date(user.registeredAt).toLocaleDateString()}</td><td>${resultsHtml}</td><td><button class="delete-btn" data-index="${idx}">O‘chirish</button></td></tr>`;
    });
    html += '</table>';
    document.getElementById('usersTable').innerHTML = html;
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            let usersArr = JSON.parse(localStorage.getItem('learning_users') || '[]');
            usersArr.splice(parseInt(btn.dataset.index), 1);
            localStorage.setItem('learning_users', JSON.stringify(usersArr));
            loadAdminData();
        });
    });
}
document.getElementById('clearAllData').addEventListener('click', () => {
    if (confirm("Barcha ma'lumotlar tozalanadi?")) {
        localStorage.removeItem('learning_users');
        localStorage.removeItem('learning_currentUser');
        loadAdminData();
        alert("Tozalandi.");
    }
});
document.getElementById('logoutAdmin').addEventListener('click', () => {
    document.getElementById('adminLogin').style.display = 'block';
    document.getElementById('adminData').style.display = 'none';
});