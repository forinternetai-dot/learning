// ==================== GLOBAL ====================
let currentUser = null;
let coursesData = [];
let currentTest = { courseId: null, courseTitle: null, currentIndex: 0, answers: [], questions: [] };

// DOM
const app = document.getElementById('app');
const loader = document.getElementById('loader');
const loginRegisterBtn = document.getElementById('loginRegisterBtn');
const userInfoDiv = document.getElementById('userInfo');
const userNameSpan = document.getElementById('userNameDisplay');
const logoutBtn = document.getElementById('logoutBtn');
const authModal = document.getElementById('authModal');
const courseModal = document.getElementById('courseModal');
const testModal = document.getElementById('testModal');
const coursesGrid = document.getElementById('coursesGrid');

// ==================== LOADER ====================
let progress = 0;
const progressFill = document.querySelector('.progress-fill');
const interval = setInterval(() => {
    progress += Math.random() * 20;
    if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                app.style.display = 'block';
                initApp();
            }, 500);
        }, 300);
    }
    progressFill.style.width = progress + '%';
}, 200);

// ==================== KURSLAR MA'LUMOTLARI ====================
function initCourses() {
    coursesData = [
        // Dasturlash
        { id: "fullstack", title: "Full-Stack Dasturlash", category: "programming", icon: "💻", desc: "MERN stack, 6 oy", info: "JavaScript, React, Node.js, MongoDB. Loyihalar bilan yakunlanadi." },
        { id: "frontend", title: "Frontend Dasturlash", category: "programming", icon: "🎨", desc: "HTML, CSS, JS, React", info: "Veb interfeyslar yaratish. 25 ta test." },
        { id: "backend", title: "Backend Dasturlash", category: "programming", icon: "⚙️", desc: "Node.js, Python, API", info: "Server, ma'lumotlar bazasi, REST API." },
        { id: "foundation", title: "Foundation of Programming", category: "programming", icon: "📘", desc: "Dasturlash asoslari", info: "Algoritm, o‘zgaruvchilar, shartlar, sikllar." },
        { id: "computer_literacy", title: "Kompyuter Savodxonligi", category: "programming", icon: "🖥️", desc: "Asosiy kompyuter bilimlari", info: "Windows, Office, Internet xavfsizligi." },
        // Dizayn
        { id: "graphic_design", title: "Grafik Dizayn", category: "design", icon: "🎨", desc: "Photoshop, Illustrator", info: "Rang nazariyasi, tipografika, logotip." },
        { id: "web_design", title: "Web Dizayn", category: "design", icon: "🌐", desc: "Figma, Webflow", info: "Sayt interfeysi, prototiplash." },
        { id: "ux_ui_design", title: "UX/UI Dizayn", category: "design", icon: "📱", desc: "Foydalanuvchi tajribasi", info: "Research, wireframe, interaktiv prototip." },
        { id: "motion_graphics", title: "Motion Grafika", category: "design", icon: "✨", desc: "After Effects", info: "Animatsiya, video effektlar, 2D/3D harakat." },
        // Tillar
        { id: "grammar_english", title: "Grammar English", category: "languages", icon: "📖", desc: "Grammatika asoslari", info: "Zamonlar, gap tuzilishi, yozma amaliyot." },
        { id: "ielts", title: "IELTS", category: "languages", icon: "🎓", desc: "Xalqaro imtihonga tayyorgarlik", info: "Listening, Reading, Writing, Speaking." },
        { id: "cefr", title: "CEFR", category: "languages", icon: "🌍", desc: "A1 dan C1 gacha", info: "Evropa standarti bo‘yicha darajaviy ta'lim." },
        // Fanlar
        { id: "mathematics", title: "Matematika", category: "academic", icon: "📐", desc: "Algebra, geometriya", info: "Analitik fikrlash, tenglamalar, funksiyalar." },
        { id: "physics", title: "Fizika", category: "academic", icon: "⚛️", desc: "Mexanika, elektromagnetizm", info: "Olimpiada darajasida tayyorgarlik." }
    ];
}

function renderCourses(filter = "all") {
    let filtered = coursesData;
    if (filter !== "all") filtered = coursesData.filter(c => c.category === filter);
    coursesGrid.innerHTML = filtered.map(course => `
        <div class="service-card" data-course-id="${course.id}">
            <div class="service-icon">${course.icon}</div>
            <h3>${course.title}</h3>
            <p>${course.desc}</p>
            <button class="btn-link course-details-btn" data-id="${course.id}">Batafsil →</button>
        </div>
    `).join('');
    document.querySelectorAll('.course-details-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = btn.dataset.id;
            const course = coursesData.find(c => c.id === id);
            showCourseModal(course);
        });
    });
}

// ==================== MODAL VA TEST ====================
function showCourseModal(course) {
    const modalBody = document.getElementById('courseModalBody');
    modalBody.innerHTML = `
        <h2>${course.title}</h2>
        <p style="margin: 20px 0;">${course.info}</p>
        <button id="startTestFromModal" class="btn-primary">📝 Testni boshlash (25 savol)</button>
    `;
    courseModal.style.display = 'block';
    document.getElementById('startTestFromModal').onclick = () => {
        courseModal.style.display = 'none';
        startTest(course.id, course.title);
    };
}

async function startTest(courseId, courseTitle) {
    if (!currentUser) {
        alert("Iltimos, avval tizimga kiring!");
        authModal.style.display = 'block';
        return;
    }
    try {
        const response = await fetch(`questions/${courseId}.json`);
        if (!response.ok) throw new Error("Savollar topilmadi");
        const questions = await response.json();
        if (!questions.length) throw new Error("Savollar yo‘q");
        currentTest = {
            courseId: courseId,
            courseTitle: courseTitle,
            currentIndex: 0,
            answers: new Array(questions.length).fill(null),
            questions: questions
        };
        renderTestQuestion();
        testModal.style.display = 'block';
        document.getElementById("testCourseName").innerText = courseTitle;
    } catch (err) {
        alert("Test savollarini yuklab bo‘lmadi: " + err.message);
    }
}

function renderTestQuestion() {
    const q = currentTest.questions[currentTest.currentIndex];
    const selected = currentTest.answers[currentTest.currentIndex];
    const container = document.getElementById('questionArea');
    container.innerHTML = `
        <div style="margin-bottom:20px;"><strong>Savol ${currentTest.currentIndex+1}/${currentTest.questions.length}</strong><br>${q.text}</div>
        ${q.options.map((opt, idx) => `
            <div class="quiz-option ${selected === idx ? 'selected' : ''}" data-opt-index="${idx}">${opt}</div>
        `).join('')}
    `;
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.addEventListener('click', (e) => {
            const idx = parseInt(opt.dataset.optIndex);
            currentTest.answers[currentTest.currentIndex] = idx;
            renderTestQuestion();
        });
    });
    const controls = document.getElementById('testControls');
    controls.innerHTML = `
        <div class="test-nav">
            <button class="btn-outline" id="prevQ" ${currentTest.currentIndex === 0 ? 'disabled' : ''}>Oldingi</button>
            <button class="btn-primary" id="nextQ">${currentTest.currentIndex === currentTest.questions.length-1 ? "Yakunlash" : "Keyingi"}</button>
        </div>
    `;
    document.getElementById('prevQ')?.addEventListener('click', () => {
        if (currentTest.currentIndex > 0) {
            currentTest.currentIndex--;
            renderTestQuestion();
        }
    });
    document.getElementById('nextQ')?.addEventListener('click', () => {
        if (currentTest.currentIndex === currentTest.questions.length - 1) {
            finishTest();
        } else {
            currentTest.currentIndex++;
            renderTestQuestion();
        }
    });
}

function finishTest() {
    const correctCount = currentTest.answers.reduce((acc, ans, idx) => {
        return acc + (ans === currentTest.questions[idx].correct ? 1 : 0);
    }, 0);
    const percentage = Math.round((correctCount / currentTest.questions.length) * 100);
    // Save result
    let users = JSON.parse(localStorage.getItem('learning_users') || '[]');
    const userIndex = users.findIndex(u => u.login === currentUser.login);
    if (userIndex !== -1) {
        if (!users[userIndex].testResults) users[userIndex].testResults = {};
        users[userIndex].testResults[currentTest.courseId] = {
            score: correctCount,
            total: currentTest.questions.length,
            percentage: percentage,
            date: new Date().toISOString(),
            courseTitle: currentTest.courseTitle
        };
        localStorage.setItem('learning_users', JSON.stringify(users));
        currentUser = users[userIndex];
        saveCurrentUser(currentUser);
    }
    alert(`Test yakunlandi! Siz ${correctCount}/${currentTest.questions.length} (${percentage}%) to‘pladingiz.`);
    testModal.style.display = 'none';
    location.reload();
}

// ==================== AUTH ====================
function checkAuth() {
    const stored = localStorage.getItem('learning_currentUser');
    if (stored) {
        currentUser = JSON.parse(stored);
        showLoggedInUI();
    } else showLoggedOutUI();
}
function showLoggedInUI() {
    loginRegisterBtn.style.display = 'none';
    userInfoDiv.style.display = 'flex';
    userNameSpan.textContent = currentUser.fullName || currentUser.login;
}
function showLoggedOutUI() {
    loginRegisterBtn.style.display = 'block';
    userInfoDiv.style.display = 'none';
    currentUser = null;
    localStorage.removeItem('learning_currentUser');
}
function saveCurrentUser(user) {
    localStorage.setItem('learning_currentUser', JSON.stringify(user));
}
function register(login, password, fullName) {
    let users = JSON.parse(localStorage.getItem('learning_users') || '[]');
    if (users.find(u => u.login === login)) { alert("Bunday login mavjud!"); return false; }
    const newUser = { login, password, fullName, registeredAt: new Date().toISOString(), testResults: {} };
    users.push(newUser);
    localStorage.setItem('learning_users', JSON.stringify(users));
    currentUser = newUser;
    saveCurrentUser(currentUser);
    showLoggedInUI();
    return true;
}
function login(login, password) {
    const users = JSON.parse(localStorage.getItem('learning_users') || '[]');
    const user = users.find(u => u.login === login && u.password === password);
    if (user) { currentUser = user; saveCurrentUser(currentUser); showLoggedInUI(); return true; }
    alert("Login yoki parol xato!");
    return false;
}

// ==================== INIT & EVENT LISTENERS ====================
async function initApp() {
    initCourses();
    renderCourses();
    checkAuth();
    setupEventListeners();
    initSwiper();
    applyTheme();
}

function setupEventListeners() {
    loginRegisterBtn.onclick = () => authModal.style.display = 'block';
    logoutBtn.onclick = () => { showLoggedOutUI(); location.reload(); };
    document.querySelectorAll('.modal-close').forEach(close => {
        close.onclick = () => { authModal.style.display = 'none'; courseModal.style.display = 'none'; testModal.style.display = 'none'; };
    });
    window.onclick = (e) => {
        if (e.target === authModal) authModal.style.display = 'none';
        if (e.target === courseModal) courseModal.style.display = 'none';
        if (e.target === testModal) testModal.style.display = 'none';
    };
    // Tabs
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginFormDiv = document.getElementById('loginForm');
    const registerFormDiv = document.getElementById('registerForm');
    loginTab.onclick = () => { loginTab.classList.add('active'); registerTab.classList.remove('active'); loginFormDiv.style.display = 'block'; registerFormDiv.style.display = 'none'; };
    registerTab.onclick = () => { registerTab.classList.add('active'); loginTab.classList.remove('active'); loginFormDiv.style.display = 'none'; registerFormDiv.style.display = 'block'; };
    document.getElementById('doLoginBtn').onclick = () => {
        const username = document.getElementById('loginUsername').value;
        const pwd = document.getElementById('loginPassword').value;
        if (login(username, pwd)) { authModal.style.display = 'none'; location.reload(); }
    };
    document.getElementById('doRegisterBtn').onclick = () => {
        const fullName = document.getElementById('regFullName').value;
        const login = document.getElementById('regLogin').value;
        const pwd = document.getElementById('regPassword').value;
        if (fullName && login && pwd) { register(login, pwd, fullName); authModal.style.display = 'none'; location.reload(); }
        else alert("Barcha maydonlarni to‘ldiring!");
    };
    document.getElementById('registerPrompt')?.addEventListener('click', () => { authModal.style.display = 'block'; registerTab.click(); });
    document.getElementById('contactForm')?.addEventListener('submit', (e) => { e.preventDefault(); alert("Xabaringiz qabul qilindi."); e.target.reset(); });
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cat = btn.dataset.category;
            renderCourses(cat);
        });
    });
    // Theme
    document.getElementById('themeToggle').onclick = () => {
        const current = document.documentElement.getAttribute('data-theme');
        const newTheme = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };
    document.getElementById('menuToggle').onclick = () => { document.getElementById('navLinks').classList.toggle('active'); };
}

function applyTheme() {
    const saved = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
}
function initSwiper() {
    new Swiper('.testimonial-slider', { loop: true, pagination: { el: '.swiper-pagination', clickable: true }, autoplay: { delay: 4000 } });
}