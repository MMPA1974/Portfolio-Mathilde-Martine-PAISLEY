document.addEventListener('DOMContentLoaded', function () {
    // Log pour s'assurer que le script se charge
    console.log('DOMContentLoaded fired: script.js is running.');

    // --- Gestion des onglets dans la section "Mes Offres" ---
    const offerTabButtons = document.querySelectorAll('.tab-button');
    const offerTabContents = document.querySelectorAll('.tab-content');

    offerTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;

            offerTabContents.forEach(content => content.classList.add('hidden'));
            offerTabButtons.forEach(btn => btn.classList.remove('active'));

            document.getElementById(targetId).classList.remove('hidden');
            button.classList.add('active');
        });
    });

    // --- Gestion des onglets dans la section "À Propos" ---
    const aboutTabButtons = document.querySelectorAll('.tab-button-about');
    const aboutTabContents = document.querySelectorAll('.tab-content-about');

    aboutTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;

            aboutTabContents.forEach(content => content.classList.add('hidden'));
            aboutTabButtons.forEach(btn => btn.classList.remove('active'));

            document.getElementById(targetId).classList.remove('hidden');
            button.classList.add('active');
        });
    });

    // --- Gestion des onglets dans la section "Mes Réalisations" ---
    const realTabButtons = document.querySelectorAll('.tab-button-real');
    const realTabContents = document.querySelectorAll('.tab-content-real');

    realTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;

            realTabContents.forEach(content => content.classList.add('hidden'));
            realTabButtons.forEach(btn => btn.classList.remove('active'));

            document.getElementById(targetId).classList.remove('hidden');
            button.classList.add('active');
        });
    });

    // --- Gestion des onglets dans la section "Actualités" ---
    const actualTabButtons = document.querySelectorAll('.tab-button-actual');
    const actualTabContents = document.querySelectorAll('.tab-content-actual');

    actualTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;

            actualTabContents.forEach(content => content.classList.add('hidden'));
            actualTabButtons.forEach(btn => btn.classList.remove('active'));

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
                    const headerHeight = mainHeader ? mainHeader.offsetHeight : 0;
                    const offsetTop = targetSection.offsetTop - headerHeight;

                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });

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
    const headerHeightForObserver = mainHeader ? mainHeader.offsetHeight + 1 : 1;
    const observerOptions = {
        root: null,
        rootMargin: `-${headerHeightForObserver}px 0px 0px 0px`,
        threshold: 0.5
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${id}"], .mobile-nav-link[href="#${id}"]`);

            if (correspondingLink) {
                if (entry.isIntersecting) {
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

    // --- Gestion du Quiz RH (réintégré) ---
    const quizQuestions = [
        {
            question: "Quel est l'objectif principal de la DSN (Déclaration Sociale Nominative) ?",
            options: ["A) Simplifier le calcul des impôts sur le revenu.", "B) Remplacer toutes les déclarations sociales et fiscales.", "C) Transmettre les données sociales des salariés aux organismes de protection sociale.", "D) Gérer les plannings de travail des employés."],
            answer: "C) Transmettre les données sociales des salariés aux organismes de protection sociale."
        },
        {
            question: "Qu'est-ce que le précompte professionnel ?",
            options: ["A) Une avance sur salaire.", "B) L'impôt sur le revenu prélevé à la source sur le salaire.", "C) Une cotisation sociale patronale.", "D) Une prime de fin d'année."],
            answer: "B) L'impôt sur le revenu prélevé à la source sur le salaire."
        },
        {
            question: "Quelle est la durée légale du travail hebdomadaire en France pour un temps plein ?",
            options: ["A) 39 heures.", "B) 35 heures.", "C) 40 heures.", "D) 45 heures."],
            answer: "B) 35 heures."
        },
        {
            question: "Quel est le rôle principal d'un SIRH ?",
            options: ["A) Gérer la comptabilité de l'entreprise.", "B) Optimiser la gestion des ressources humaines via des outils informatiques.", "C) Automatiser la production industrielle.", "D) Assurer la sécurité informatique."],
            answer: "B) Optimiser la gestion des ressources humaines via des outils informatiques."
        },
        {
            question: "Qu'est-ce qu'une GPEC ?",
            options: ["A) Gestion Prévisionnelle des Emplois et des Compétences.", "B) Grande Entreprise de Prestations Externalisées et de Conseil.", "C) Groupe d'Étude des Politiques Économiques et Commerciales.", "D) Garantie de Paiement des Employés Contractuels."],
            answer: "A) Gestion Prévisionnelle des Emplois et des Compétences."
        },
        {
            question: "En cas d'accident du travail, qui est le premier organisme à indemniser le salarié ?",
            options: ["A) L'employeur.", "B) L'assurance chômage.", "C) La Sécurité Sociale (CPAM).", "D) La mutuelle complémentaire."],
            answer: "C) La Sécurité Sociale (CPAM)."
        },
        {
            question: "Qu'est-ce que la subrogation en matière de paie ?",
            options: ["A) Le remplacement d'un salarié absent par un autre.", "B) Le maintien de salaire par l'employeur qui perçoit directement les IJSS.", "C) La délégation de pouvoir à un subordonné.", "D) La compensation des heures supplémentaires par des jours de repos."],
            answer: "B) Le maintien de salaire par l'employeur qui perçoit directement les IJSS."
        },
        {
            question: "Quel document est obligatoire pour tout salarié à la fin de chaque mois ?",
            options: ["A) Le contrat de travail.", "B) Le règlement intérieur.", "C) Le bulletin de paie.", "D) L'attestation Pôle Emploi."],
            answer: "C) Le bulletin de paie."
        },
        {
            question: "Qu'est-ce que le solde de tout compte ?",
            options: ["A) Le montant total des salaires versés sur une année.", "B) Un document récapitulant les sommes versées au salarié à la rupture de son contrat.", "C) Le solde du compte bancaire de l'entreprise.", "D) Le total des congés payés restants."],
            answer: "B) Un document récapitulant les sommes versées au salarié à la rupture de son contrat."
        },
        {
            question: "Quelle est la principale fonction du logiciel Chronotime ?",
            options: ["A) La gestion de la paie.", "B) La gestion des temps et des activités (GTA).", "C) La gestion des recrutements.", "D) La gestion des carrières."],
            answer: "B) La gestion des temps et des activités (GTA)."
        }
    ];

    const quizContainer = document.getElementById('quiz-container');
    const submitQuizButton = document.getElementById('submit-quiz-actual'); // ID mis à jour
    const quizResultsDiv = document.getElementById('quiz-results-actual'); // ID mis à jour

    function renderQuiz() {
        if (!quizContainer) return;

        quizContainer.innerHTML = '';
        quizQuestions.forEach((q, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('mb-4', 'text-left'); // Alignement à gauche
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
    
    // Initialisation des onglets "Mes Offres" pour que le premier soit actif au chargement
    if (offerTabButtons.length > 0 && offerTabContents.length > 0) {
        offerTabButtons[0].click(); 
    }
    // Initialisation des onglets "À Propos" pour que le premier soit actif au chargement
    if (aboutTabButtons.length > 0 && aboutTabContents.length > 0) {
        aboutTabButtons[0].click(); 
    }
    // Initialisation des onglets "Mes Réalisations" pour que le premier soit actif au chargement
    if (realTabButtons.length > 0 && realTabContents.length > 0) {
        realTabButtons[0].click(); 
    }
    // Initialisation des onglets "Actualités" pour que le premier soit actif au chargement
    // Et déclenchement du rendu du quiz si l'onglet quiz est le premier ou est activé
    if (actualTabButtons.length > 0 && actualTabContents.length > 0) {
        actualTabButtons[0].click(); 
        // Si l'onglet "Quiz RH" est le premier onglet d'actualités, il faut le rendre
        if (actualTabButtons[0].dataset.target === 'quiz-rh-content') {
            renderQuiz();
        }
    }

    // Gestion du rendu du quiz lorsque l'onglet "Quiz RH" est activé (si ce n'est pas le premier par défaut)
    actualTabButtons.forEach(button => {
        if (button.dataset.target === 'quiz-rh-content') {
            button.addEventListener('click', () => {
                if (!quizContainer.hasChildNodes() || quizContainer.querySelector('p.text-gris-subtil-fonce')) {
                    renderQuiz();
                }
            });
        }
    });

});