// Loader
window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    const fillBar = document.querySelector(".progress-fill");
    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            gsap.to(loader, { opacity: 0, duration: 0.8, onComplete: () => {
                loader.style.display = "none";
                initScrollAnimations();
                startCounters();
            }});
        } else {
            width += Math.floor(Math.random() * 12) + 3;
            if (width > 100) width = 100;
            fillBar.style.width = width + "%";
        }
    }, 70);
});

function startCounters() {
    document.querySelectorAll(".stat-number").forEach(stat => {
        const target = parseInt(stat.getAttribute("data-target"));
        if(!target) return;
        let current = 0;
        const inc = target / 50;
        const update = () => {
            current += inc;
            if(current < target) {
                stat.innerText = Math.ceil(current);
                requestAnimationFrame(update);
            } else stat.innerText = target;
        };
        update();
    });
}

function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray(".fade-up, .fade-left, .fade-right").forEach(el => {
        gsap.fromTo(el, { opacity: 0, y: 40, x: el.classList.contains("fade-left") ? -40 : (el.classList.contains("fade-right") ? 40 : 0) }, {
            opacity: 1, y: 0, x: 0, duration: 1,
            scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" }
        });
    });
    gsap.fromTo(".service-card", { opacity: 0, y: 50 }, {
        opacity: 1, y: 0, stagger: 0.12, duration: 0.8,
        scrollTrigger: { trigger: ".services-grid", start: "top 80%" }
    });
    gsap.fromTo(".timeline-item", { opacity: 0, x: -30 }, {
        opacity: 1, x: 0, stagger: 0.2, duration: 0.8,
        scrollTrigger: { trigger: ".timeline", start: "top 80%" }
    });
}

// ---------- SKILLS MARQUEE ----------
const skillsArray = [
    { name: "HTML5", icon: "fab fa-html5" }, { name: "CSS3", icon: "fab fa-css3-alt" },
    { name: "JavaScript", icon: "fab fa-js" }, { name: "React", icon: "fab fa-react" },
    { name: "Node.js", icon: "fab fa-node-js" }, { name: "Tailwind CSS", icon: "fab fa-css3" },
    { name: "Git", icon: "fab fa-git-alt" }, { name: "Figma", icon: "fab fa-figma" },
    { name: "Adobe XD", icon: "fab fa-adobe" }, { name: "Webflow", icon: "fas fa-globe" }
];
const skillsTrack = document.getElementById("skillsTrack");
function buildSkillsMarquee() {
    let items = "";
    for(let i = 0; i < 2; i++) {
        skillsArray.forEach(s => {
            items += `<div class="skill-item"><i class="${s.icon}"></i> <span>${s.name}</span></div>`;
        });
    }
    skillsTrack.innerHTML = items;
}
buildSkillsMarquee();

// ---------- PROJECTS (12 items) ----------
const projectsList = [
    { title: "Aetherial Towers", desc: "Immersive 3D real estate platform", img: "images/BR logo.jpg" },
    { title: "Noir Vogue", desc: "High fashion e‑commerce experience", img: "images/BR logo.jpg" },
    { title: "Zenith Bank", desc: "Wealth management portal", img: "images/BR logo.jpg" },
    { title: "Lumos AI", desc: "Generative AI brand identity", img: "images/BR logo.jpg" },
    { title: "Golden Ratio", desc: "Minimalist architecture studio", img: "images/BR logo.jpg" },
    { title: "Velvet Riot", desc: "Interactive music festival hub", img: "images/BR logo.jpg" },
    { title: "Oraculum", desc: "Data-driven dashboard UI/UX", img: "images/BR logo.jpg" },
    { title: "Elysian Fields", desc: "Luxury resort digital booklet", img: "images/BR logo.jpg" },
    { title: "Neo Kyoto", desc: "Japanese whiskey brand world", img: "https://placehold.co/600x400/23232b/C69F3E?text=KYOTO" },
    { title: "Cyber Marmalade", desc: "Playful brand for creative agency", img: "https://placehold.co/600x400/23232b/C69F3E?text=MARMALADE" },
    { title: "Arcadia Labs", desc: "Future tech case study", img: "https://placehold.co/600x400/23232b/C69F3E?text=ARCADIA" },
    { title: "Stone & Ivy", desc: "Premium whiskey e‑commerce", img: "https://placehold.co/600x400/23232b/C69F3E?text=STONE" }
];
const projectsWrapper = document.getElementById("projectsWrapper");
projectsList.forEach(proj => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";
    slide.innerHTML = `<div class="project-card"><div class="project-img" style="background-image: url('${proj.img}');"></div><div class="project-info"><h3>${proj.title}</h3><p>${proj.desc}</p><button class="view-project-btn" data-title="${proj.title}">View Project <i class="fas fa-arrow-right"></i></button></div></div>`;
    projectsWrapper.appendChild(slide);
});
new Swiper('.projects-swiper', {
    slidesPerView: 1, spaceBetween: 24, loop: true,
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    pagination: { el: '.swiper-pagination', clickable: true },
    breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
});

// ---------- TESTIMONIALS (Original style) ----------
const testimonialsData = [
    { text: "Absolutely mind-blowing work. The attention to detail is unmatched — our brand perception skyrocketed.", name: "Sophia Loren", title: "Creative Director, Vogue Italy" },
    { text: "James delivered a digital masterpiece. The animations and luxury feel captured our essence perfectly.", name: "Marcus Chen", title: "CEO, Lumina Holdings" },
    { text: "One of the best frontend artists I've ever worked with. Professional, creative and extremely reliable.", name: "Elena Rodriguez", title: "Founder, Noir Agency" }
];
const testimonialsWrapper = document.getElementById("testimonialsWrapper");
testimonialsData.forEach(t => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";
    slide.innerHTML = `<div class="testimonial-slide"><i class="fas fa-quote-left quote-icon"></i><p>“${t.text}”</p><div class="client-info"><h4>${t.name}</h4><span>${t.title}</span></div></div>`;
    testimonialsWrapper.appendChild(slide);
});
new Swiper('.testimonials-swiper', {
    slidesPerView: 1, spaceBetween: 30, loop: true,
    autoplay: { delay: 4000, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    breakpoints: { 768: { slidesPerView: 2 } }
});

// ---------- VIEW PROJECT - OPEN PDF IN NEW TAB (NO CORS) ----------
document.querySelectorAll(".view-project-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        const projectName = btn.getAttribute("data-title");
        const pdfFileName = `${projectName.toLowerCase().replace(/\s/g, '_')}_specs.pdf`;
        const pdfPath = `pdf/${pdfFileName}`;
        window.open(pdfPath, '_blank');
    });
});

// ---------- ACCORDION ----------
document.querySelectorAll(".accordion-header").forEach(header => {
    header.addEventListener("click", () => {
        const parent = header.parentElement;
        parent.classList.toggle("active");
        document.querySelectorAll(".accordion-item").forEach(item => {
            if(item !== parent && item.classList.contains("active")) item.classList.remove("active");
        });
    });
});

// ---------- DARK/LIGHT MODE ----------
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
    const current = document.body.getAttribute("data-theme");
    document.body.setAttribute("data-theme", current === "dark" ? "light" : "dark");
});

// ---------- LANGUAGE SWITCHER ----------
const langButtons = document.querySelectorAll(".lang-btn");
const translations = {
    en: { home: "Home", about: "About", services: "Services", skills: "Skills", projects: "Projects", experience: "Experience", pricing: "Pricing", testimonials: "Testimonials", faq: "FAQ", contact: "Contact" },
    uz: { home: "Bosh sahifa", about: "Men haqimda", services: "Xizmatlar", skills: "Ko'nikmalar", projects: "Loyihalar", experience: "Tajriba", pricing: "Narxlar", testimonials: "Sharhlar", faq: "Savollar", contact: "Aloqa" }
};
function setLanguage(lang) {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if(translations[lang] && translations[lang][key]) el.innerText = translations[lang][key];
    });
    langButtons.forEach(btn => {
        if(btn.getAttribute("data-lang") === lang) btn.classList.add("active");
        else btn.classList.remove("active");
    });
}
langButtons.forEach(btn => {
    btn.addEventListener("click", () => setLanguage(btn.getAttribute("data-lang")));
});
setLanguage("uz");

// ---------- SMOOTH SCROLL + ACTIVE NAV ----------
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");
function updateActive() {
    let current = "";
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
        const top = section.offsetTop, height = section.offsetHeight;
        if(scrollPos >= top && scrollPos < top + height) current = section.getAttribute("id");
    });
    navLinks.forEach(link => {
        link.classList.remove("active");
        if(link.getAttribute("href") === "#" + current) link.classList.add("active");
    });
}
window.addEventListener("scroll", updateActive);
navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));
        if(target) target.scrollIntoView({ behavior: "smooth" });
        if(window.innerWidth <= 768) document.querySelector(".nav-links").classList.remove("active");
    });
});
document.getElementById("menuToggle").addEventListener("click", () => {
    document.querySelector(".nav-links").classList.toggle("active");
});

// ---------- FLOATING ANIMATIONS ----------
gsap.to(".floating-shape", { y: "random(-20,20)", duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut" });
gsap.to(".floating-badge", { y: "random(-10,10)", duration: 2.5, repeat: -1, yoyo: true });
document.querySelectorAll(".btn, .view-project-btn, .btn-pricing").forEach(btn => {
    btn.addEventListener("mouseenter", () => gsap.to(btn, { scale: 1.03, duration: 0.2 }));
    btn.addEventListener("mouseleave", () => gsap.to(btn, { scale: 1, duration: 0.2 }));
});

// ---------- FORM SUBMIT ----------
document.getElementById("premium-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("✨ Thank you! Your message has been received. I'll reach out within 24 hours. ✨");
    e.target.reset();
});

// ---------- TRIGGER COUNTERS ----------
if(document.querySelector(".stats-grid")) {
    ScrollTrigger.create({ trigger: ".stats-grid", start: "top 80%", once: true, onEnter: startCounters });
}
updateActive();