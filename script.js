document.addEventListener('DOMContentLoaded', function() {
    "use strict";

    // ========== 1. МОДАЛЬНОЕ ОКНО (ЗАПИСЬ) ==========
    const appointmentBtn = document.getElementById('appointmentBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeModal = document.getElementById('closeModal');
    const appointmentForm = document.getElementById('appointmentForm');

    if (appointmentBtn && modalOverlay && closeModal) {
        appointmentBtn.addEventListener('click', function(e) {
            e.preventDefault();
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        closeModal.addEventListener('click', function() {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // ========== 2. ОТПРАВКА ФОРМЫ В TELEGRAM ==========
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = {
                name: document.getElementById('name')?.value.trim() || '',
                phone: document.getElementById('phone')?.value.trim() || '',
                email: document.getElementById('email')?.value.trim() || '',
                service: document.getElementById('service')?.value || '',
                message: document.getElementById('message')?.value.trim() || '',
                date: new Date().toLocaleString('ru-RU')
            };

            const botToken = '8160715153:AAHuMwJCCKuqiiyUhfJY93CPHWtq9NlWZlM';
            const chatId = '-1003316496578';

            const message = `
🎯 *НОВАЯ ЗАЯВКА С САЙТА АКАЛАН*
📅 ${formData.date}

👤 *Имя:* ${formData.name}
📞 *Телефон:* ${formData.phone}
📧 *Email:* ${formData.email}
💼 *Услуга:* ${formData.service || 'Не указана'}
📝 *Сообщение:* ${formData.message || 'Не указано'}

📍 *Источник:* сайт akalan.ru
⏰ *Время:* ${new Date().toLocaleTimeString('ru-RU')}
            `.trim();

            const encodedMessage = encodeURIComponent(message);
            const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodedMessage}&parse_mode=Markdown`;

            const submitBtn = document.querySelector('.submit-btn');
            const originalText = submitBtn?.innerHTML || 'Отправить';
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
                submitBtn.disabled = true;
            }

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.ok) {
                        alert('✅ Заявка успешно отправлена! Мы свяжемся с вами в течение 24 часов.');
                        modalOverlay?.classList.remove('active');
                        appointmentForm.reset();
                        document.body.style.overflow = 'auto';
                    } else {
                        throw new Error(data.description || 'неизвестная ошибка');
                    }
                })
                .catch(error => {
                    console.error(error);
                    alert(`⚠️ Ошибка отправки:\n${error.message}\n\nПожалуйста, отправьте заявку вручную на почту: akalan.HQ@yandex.ru`);
                    modalOverlay?.classList.remove('active');
                    appointmentForm.reset();
                    document.body.style.overflow = 'auto';
                })
                .finally(() => {
                    if (submitBtn) {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }
                });
        });
    }

    // ========== 3. ПЛАВНАЯ ПРОКРУТКА К ЯКОРЯМ ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId) return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight || 80;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========== 4. МОБИЛЬНОЕ МЕНЮ ==========
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav-links');

    if (mobileBtn && nav) {
        const overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 999;
            display: none;
            opacity: 0;
            transition: opacity 0.3s;
        `;
        document.body.appendChild(overlay);

        function openMenu() {
            nav.style.display = 'flex';
            nav.style.flexDirection = 'column';
            nav.style.position = 'absolute';
            nav.style.top = '100%';
            nav.style.left = '0';
            nav.style.width = '100%';
            nav.style.backgroundColor = 'white';
            nav.style.padding = '20px';
            nav.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            nav.style.gap = '15px';
            nav.style.zIndex = '1000';
            overlay.style.display = 'block';
            setTimeout(() => overlay.style.opacity = '1', 10);
            document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
            nav.style.display = 'none';
            overlay.style.display = 'none';
            overlay.style.opacity = '0';
            document.body.style.overflow = 'auto';
        }

        mobileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (nav.style.display === 'flex') {
                closeMenu();
            } else {
                openMenu();
            }
        });

        overlay.addEventListener('click', closeMenu);

        nav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    closeMenu();
                }
            });
        });

        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                nav.style.display = '';
                nav.style.flexDirection = '';
                nav.style.position = '';
                nav.style.top = '';
                nav.style.left = '';
                nav.style.width = '';
                nav.style.backgroundColor = '';
                nav.style.padding = '';
                nav.style.boxShadow = '';
                nav.style.gap = '';
                nav.style.zIndex = '';
                overlay.style.display = 'none';
                overlay.style.opacity = '0';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // ========== 5. АНИМАЦИЯ ПРИ ПРОКРУТКЕ ==========
    const animatedElements = document.querySelectorAll('.service-card, .feature, .stat-item, .benefit, .team-card, .blog-card, .case-card');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    function animateOnScroll() {
        const screenPosition = window.innerHeight / 1.2;
        animatedElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    // ========== 6. КНОПКА «НАВЕРХ» ==========
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-top';
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollTopBtn);

    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }
    });

    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ========== 7. COOKIE CONSENT ==========
    const cookieConsent = document.getElementById('cookieConsent');
    const acceptBtn = document.getElementById('acceptCookies');

    if (cookieConsent && acceptBtn) {
        if (!localStorage.getItem('cookiesAccepted')) {
            cookieConsent.classList.remove('hidden');
        }

        acceptBtn.addEventListener('click', function() {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieConsent.classList.add('hidden');
        });
    }

    // ========== 8. ПОДЕЛИТЬСЯ В СОЦСЕТЯХ ==========
    function initShareButtons() {
        const shareBtns = document.querySelectorAll('.share-btn');
        const pageUrl = encodeURIComponent(window.location.href);
        const pageTitle = encodeURIComponent(document.title);

        shareBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const social = this.dataset.social;
                let shareUrl = '';

                switch (social) {
                    case 'vk':
                        shareUrl = `https://vk.com/share.php?url=${pageUrl}&title=${pageTitle}`;
                        break;
                    case 'telegram':
                        shareUrl = `https://t.me/share/url?url=${pageUrl}&text=${pageTitle}`;
                        break;
                    case 'whatsapp':
                        shareUrl = `https://wa.me/?text=${pageTitle}%20${pageUrl}`;
                        break;
                }

                window.open(shareUrl, '_blank', 'width=600,height=400');
            });
        });
    }
    initShareButtons();

    // ========== 9. ХЛЕБНЫЕ КРОШКИ ==========
    function initBreadcrumbs() {
        const breadcrumbList = document.getElementById('breadcrumbList');
        if (!breadcrumbList) return;

        const sectionNames = {
            'services': 'Услуги',
            'about': 'О нас',
            'business': 'Как работаем',
            'team': 'Команда',
            'career': 'Карьера',
            'cases': 'Портфолио',
            'blog': 'Новости',
            'faq': 'Вопросы',
            'footer': 'Контакты'
        };

        function updateBreadcrumbs() {
            let hash = window.location.hash.substring(1);
            let html = '<li><a href="index.html">Главная</a></li>';
            if (hash && sectionNames[hash]) {
                html += `<li><span class="current">${sectionNames[hash]}</span></li>`;
            }
            breadcrumbList.innerHTML = html;
        }

        updateBreadcrumbs();
        window.addEventListener('hashchange', updateBreadcrumbs);
    }
    initBreadcrumbs();

    // ========== 10. ПЕРЕКЛЮЧАТЕЛЬ ЯЗЫКА ==========
    const enLangBtn = document.getElementById('enLangBtn');
    if (enLangBtn) {
        enLangBtn.addEventListener('click', function() {
            const modal = document.createElement('div');
            modal.className = 'lang-modal';
            modal.innerHTML = `
                <div class="lang-modal-content">
                    <span class="lang-modal-close">&times;</span>
                    <div class="lang-modal-icon">🌍</div>
                    <h3>English version coming soon!</h3>
                    <p>We are working hard to bring you the English version of our website.<br>Stay tuned!</p>
                    <button class="lang-modal-btn">OK</button>
                </div>
            `;
            document.body.appendChild(modal);
            setTimeout(() => modal.classList.add('active'), 10);
            const closeBtn = modal.querySelector('.lang-modal-close');
            const okBtn = modal.querySelector('.lang-modal-btn');
            function closeModal() {
                modal.classList.remove('active');
                setTimeout(() => modal.remove(), 300);
            }
            closeBtn.addEventListener('click', closeModal);
            okBtn.addEventListener('click', closeModal);
            modal.addEventListener('click', function(e) {
                if (e.target === modal) closeModal();
            });
        });
    }

    // ========== 11. ФИЛЬТРАЦИЯ УСЛУГ ==========
    const filterButtons = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');

    if (filterButtons.length && serviceCards.length) {
        serviceCards.forEach(card => card.classList.remove('hidden'));

        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const filterValue = this.dataset.filter;
                serviceCards.forEach(card => {
                    if (filterValue === 'all') {
                        card.classList.remove('hidden');
                    } else {
                        const cardCategory = card.dataset.category;
                        card.classList.toggle('hidden', cardCategory !== filterValue);
                    }
                });
            });
        });
    }

    // ========== 12. FAQ АККОРДЕОН ==========
    function initFaq() {
        const faqItems = document.querySelectorAll('.faq-item');
        if (!faqItems.length) return;
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                item.classList.toggle('active');
            });
        });
    }
    initFaq();

    // ========== 13. ПРОГРЕСС-БАР ==========
    function initProgressBar() {
        const progressBar = document.getElementById('progressBar');
        if (!progressBar) return;
        function updateProgress() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (scrollTop / docHeight) * 100 || 0;
            progressBar.style.width = scrolled + '%';
        }
        window.addEventListener('scroll', updateProgress);
        window.addEventListener('resize', updateProgress);
        updateProgress();
    }
    initProgressBar();

    // ========== 14. АНИМИРОВАННЫЕ СЧЁТЧИКИ ==========
    function initCounters() {
        const counters = document.querySelectorAll('.stat-number');
        let animated = false;
        function animateCounters() {
            if (animated) return;
            const statsSection = document.querySelector('.stats');
            if (!statsSection) return;
            const sectionTop = statsSection.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (sectionTop < windowHeight - 100) {
                animated = true;
                counters.forEach(counter => {
                    const targetAttr = counter.dataset.target;
                    if (!targetAttr) return;
                    const target = parseInt(targetAttr, 10);
                    if (isNaN(target)) return;
                    let suffix = '';
                    if (counter.innerText.includes('+')) suffix = '+';
                    else if (counter.innerText.includes('%')) suffix = '%';
                    let current = 0;
                    const increment = Math.ceil(target / 50);
                    function updateCounter() {
                        current += increment;
                        if (current < target) {
                            counter.innerText = current + suffix;
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target + suffix;
                        }
                    }
                    requestAnimationFrame(updateCounter);
                });
            }
        }
        window.addEventListener('scroll', animateCounters);
        animateCounters();
    }
    initCounters();

    // ========== 15. КНОПКА КОПИРОВАНИЯ EMAIL ==========
    function initCopyEmail() {
        const copyBtn = document.getElementById('copyEmailBtn');
        const emailLink = document.getElementById('emailLink');
        if (!copyBtn || !emailLink) return;
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.textContent = 'Email скопирован!';
        document.body.appendChild(notification);
        copyBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            const email = emailLink.textContent.trim();
            try {
                await navigator.clipboard.writeText(email);
                copyBtn.classList.add('copied');
                copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                notification.classList.add('show');
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                    notification.classList.remove('show');
                }, 2000);
            } catch (err) {
                console.error(err);
                alert('Не удалось скопировать email. Скопируйте вручную.');
            }
        });
    }
    initCopyEmail();

    // ========== 16. ЛЕНИВАЯ ЗАГРУЗКА ==========
    function initLazyLoading() {
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach(img => img.setAttribute('loading', 'lazy'));
    }
    initLazyLoading();

    // ========== 17. ОБНОВЛЕНИЕ ГОДА ==========
    const yearElement = document.querySelector('.footer-legal span:first-child');
    if (yearElement) {
        yearElement.textContent = '© 2023–2026 ООО «АКАЛАН». Все права защищены.';
    }

});
