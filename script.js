document.addEventListener('DOMContentLoaded', function () {
    // Log pour s'assurer que le script se charge
    console.log('DOMContentLoaded fired: script.js is running.');

    // --- Gestion des onglets dans la section "Mes Offres" ---
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;

            // Masquer tous les contenus des onglets et désactiver tous les boutons d'onglets
            tabContents.forEach(content => content.classList.add('hidden'));
            tabButtons.forEach(btn => btn.classList.remove('active'));

            // Afficher le contenu cible et activer le bouton cliqué
            document.getElementById(targetId).classList.remove('hidden');
            button.classList.add('active');
        });
    });

    // --- Gestion du menu mobile et de la navigation par section ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const sections = document.querySelectorAll('main section');
    const mainHeader = document.querySelector('header');

    // Toggle du menu mobile
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Gestion du défilement fluide et de l'activation des liens de navigation
    function smoothScrollAndActiveClass(links, menuToClose = null) {
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    // Calculer l'offset pour tenir compte du header fixe
                    const headerHeight = mainHeader ? mainHeader.offsetHeight : 0;
                    const offsetTop = targetSection.offsetTop - headerHeight;

                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });

                    // Ferme le menu mobile si ouvert
                    if (menuToClose) {
                        menuToClose.classList.add('hidden');
                    }
                }
            });
        });
    }

    smoothScrollAndActiveClass(navLinks);
    smoothScrollAndActiveClass(mobileNavLinks, mobileMenu);

    // Observer pour changer la classe 'active' des liens de navigation au défilement
    // Utilise une hauteur de header dynamique pour le rootMargin
    const headerHeightForObserver = mainHeader ? mainHeader.offsetHeight + 1 : 1; // +1 pour éviter les chevauchements
    const observerOptions = {
        root: null, // viewport
        rootMargin: `-${headerHeightForObserver}px 0px 0px 0px`, // La section devient active quand elle touche le bas du header
        threshold: 0.5 // Au moins 50% de la section est visible
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${id}"], .mobile-nav-link[href="#${id}"]`);

            if (correspondingLink) {
                if (entry.isIntersecting) {
                    // Supprime active de tous les liens pour éviter les doublons si le seuil est atteint pour plusieurs sections
                    navLinks.forEach(link => link.classList.remove('active'));
                    mobileNavLinks.forEach(link => link.classList.remove('active'));
                    correspondingLink.classList.add('active');
                } else {
                    correspondingLink.classList.remove('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- Gestion du Quiz RH ---
    const quizQuestions = [
        {
            question: "Quelle est la durée légale du travail hebdomadaire en France (sauf accord d'entreprise ou de branche) ?",
            options: ["35 heures", "39 heures", "40 heures"],
            answer: "35 heures"
        },
        {
            question: "Quel document obligatoire est remis au salarié à la fin de son contrat de travail ?",
            options: ["Un contrat de travail", "Un certificat de travail", "Une lettre de motivation"],
            answer: "Un certificat de travail"
        },
        {
            question: "Qu'est-ce que la DSN ?",
            options: ["Déclaration Sociale Nominative", "Déclaration Simplifiée Nationale", "Données Sociales Numériques"],
            answer: "Déclaration Sociale Nominative"
        },
        {
            question: "Quel est le rôle principal de la GTA (Gestion des Temps et Activités) ?",
            options: ["Gérer les entretiens annuels", "Suivre les horaires de travail et les absences des salariés", "Calculer les salaires"],
            answer: "Suivre les horaires de travail et les absences des salariés"
        },
        {
            question: "Quel est le nom de l'organisme qui collecte les cotisations sociales en France ?",
            options: ["Pôle Emploi", "URSSAF", "CAF"],
            answer: "URSSAF"
        }
    ];

    const quizContainer = document.getElementById('quiz-container');
    const submitQuizButton = document.getElementById('submit-quiz');
    const quizResultsDiv = document.getElementById('quiz-results');

    function renderQuiz() {
        if (!quizContainer) return;

        quizContainer.innerHTML = '';
        quizQuestions.forEach((q, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('mb-4');
            questionDiv.innerHTML = `<p class="font-semibold mb-2">${index + 1}. ${q.question}</p>`;

            q.options.forEach(option => {
                const label = document.createElement('label');
                label.classList.add('block', 'mb-1');
                label.innerHTML = `
                    <input type="radio" name="question${index}" value="${option}" class="mr-2">
                    ${option}
                `;
                questionDiv.appendChild(label);
            });
            quizContainer.appendChild(questionDiv);
        });
    }

    function submitQuiz() {
        let score = 0;
        quizQuestions.forEach((q, index) => {
            const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
            if (selectedOption && selectedOption.value === q.answer) {
                score++;
            }
        });

        const percentage = (score / quizQuestions.length) * 100;
        let resultText = `Vous avez obtenu ${score} sur ${quizQuestions.length} (${percentage.toFixed(0)}%).`;

        quizResultsDiv.classList.remove('success', 'fail');

        if (percentage >= 80) {
            resultText += " Excellent ! Vous avez une solide connaissance en RH.";
            quizResultsDiv.classList.add('success');
        } else if (percentage >= 50) {
            resultText += " Bien ! Continuez à approfondir vos connaissances.";
            quizResultsDiv.classList.add('fail');
        } else {
            resultText += " Vous pouvez encore vous améliorer. N'hésitez pas à consulter les ressources !";
            quizResultsDiv.classList.add('fail');
        }
        quizResultsDiv.textContent = resultText;
    }

    if (submitQuizButton) {
        submitQuizButton.addEventListener('click', submitQuiz);
    }

    const quizRhSection = document.getElementById('quiz-rh');
    if (quizRhSection) {
        const quizObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.target.id === 'quiz-rh') {
                    console.log('Quiz RH section is visible, rendering quiz.');
                    renderQuiz();
                    quizObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        quizObserver.observe(quizRhSection);
    }

});