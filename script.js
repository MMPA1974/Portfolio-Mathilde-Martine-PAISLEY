document.addEventListener('DOMContentLoaded', function () {
    // Log pour s'assurer que le script se charge
    console.log('DOMContentLoaded fired: script.js is running.');

    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const sections = document.querySelectorAll('main section'); // Sélectionne toutes les sections principales

    // Log pour vérifier que les sections sont trouvées
    console.log('Sections found:', sections.length, sections);

    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Gestion du bouton du menu mobile
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function () {
            console.log('Mobile menu button clicked');
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('active');
            this.setAttribute('aria-expanded', mobileMenu.classList.contains('active'));
        });
    }

    /**
     * Affiche une section spécifique et masque toutes les autres.
     * Fait défiler la page vers le haut en douceur.
     * Met à jour la classe 'active' pour les liens de navigation.
     * @param {string} targetId - L'ID de la section à afficher (ex: '#accueil').
     */
    function showSection(targetId) {
        console.log('Attempting to show section:', targetId);
        // Masquer toutes les sections
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Afficher la section cible
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
            console.log('Section successfully activated:', targetId, targetSection);
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // Défilement doux vers le haut
            });
        } else {
            console.error('Target section not found:', targetId);
        }

        // Mettre à jour la classe 'active' pour les liens de navigation de bureau
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });

        // Mettre à jour la classe 'active' pour les liens de navigation mobile
        mobileNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });
    }

    // Ajouter des écouteurs de clic à tous les liens de navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Empêcher le comportement par défaut du lien d'ancrage
            const targetId = this.getAttribute('href');
            console.log('Nav link clicked, targetId:', targetId);
            showSection(targetId); // Appeler la fonction pour afficher la section

            // Fermer le menu mobile après avoir cliqué sur un lien s'il est ouvert
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                mobileMenu.classList.add('hidden');
                if (mobileMenuButton) {
                    mobileMenuButton.setAttribute('aria-expanded', false);
                }
            }
        });
    });

    // Afficher la section initiale en fonction du hachage de l'URL ou par défaut sur #accueil
    // Ceci s'exécute au chargement initial de la page
    if (window.location.hash && document.querySelector(window.location.hash)) {
        showSection(window.location.hash);
    } else {
        showSection('#accueil'); // Par défaut à la section d'accueil si pas de hachage ou hachage invalide
    }

    /**
     * Initialise le graphique Chart.js pour la section 'Mon Expertise'.
     * Cette fonction est conçue pour être appelée uniquement lorsque la section est visible.
     */
    function initializeSkillsChart() {
        const ctxSkills = document.getElementById('skillsChart');
        if (ctxSkills) {
            new Chart(ctxSkills.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: [
                        'Pilotage Projets SIRH', 'Expertise Paie & DSN', 'Maîtrise GTA',
                        'AMOA & Recette', 'Conduite du Changement', 'Droit Social & Veille'
                    ],
                    datasets: [{
                        label: 'Niveau de Maîtrise / Expérience (sur 5)',
                        data: [4.2, 4.5, 4.0, 4.3, 4.0, 4.0],
                        backgroundColor: [
                            'rgba(255, 215, 0, 0.7)',
                            'rgba(218, 165, 32, 0.7)',
                            'rgba(184, 134, 11, 0.7)',
                            'rgba(255, 215, 0, 0.7)',
                            'rgba(218, 165, 32, 0.7)',
                            'rgba(184, 134, 11, 0.7)'
                        ],
                        borderColor: [
                            'rgb(255, 215, 0)',
                            'rgb(218, 165, 32)',
                            'rgb(184, 134, 11)',
                            'rgb(255, 215, 0)',
                            'rgb(218, 165, 32)',
                            'rgb(184, 134, 11)'
                        ],
                        borderWidth: 1,
                        borderRadius: 5
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            beginAtZero: true,
                            max: 5,
                            ticks: {
                                color: 'var(--color-texte-principal)',
                                stepSize: 1,
                                callback: value => `${value}/5`
                            },
                            grid: {
                                color: 'rgba(0,0,0,0.05)'
                            }
                        },
                        y: {
                            ticks: {
                                color: 'var(--color-texte-principal)',
                                font: {
                                    size: 12,
                                    family: 'Montserrat'
                                },
                                autoSkip: false,
                                maxRotation: 0,
                                minRotation: 0,
                                callback: function (value) {
                                    const label = this.getLabelForValue(value);
                                    const words = label.split(' ');
                                    let lines = [];
                                    let currentLine = '';
                                    words.forEach(word => {
                                        if ((currentLine + word).length > 20 && currentLine.length > 0) {
                                            lines.push(currentLine.trim());
                                            currentLine = word + ' ';
                                        } else {
                                            currentLine += word + ' ';
                                        }
                                    });
                                    lines.push(currentLine.trim());
                                    return lines;
                                }
                            },
                            grid: {
                                display: false
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            callbacks: {
                                label: function (context) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.x != null) {
                                        label += `${context.parsed.x} / 5`;
                                    }
                                    return label;
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    const expertiseSection = document.getElementById('expertise');
    if (expertiseSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.target.id === 'expertise') {
                    console.log('Expertise section is visible, initializing skills chart.');
                    initializeSkillsChart();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(expertiseSection);
    }

    /* --- Gestion des Modales de Projets --- */
    const projectCards = document.querySelectorAll('.project-card');
    const projectModals = document.querySelectorAll('.project-modal');
    const projectModalBackdrop = document.getElementById('project-modal-backdrop');
    const closeModalButtons = document.querySelectorAll('.close-modal-button');

    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            const projectId = this.dataset.projectId;
            const targetModal = document.getElementById(`project-modal-${projectId}`);
            if (targetModal) {
                targetModal.classList.add('active');
                projectModalBackdrop.classList.remove('hidden');
                document.body.style.overflow = 'hidden'; // Disable scroll on body
            }
        });
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const parentModal = this.closest('.project-modal');
            if (parentModal) {
                parentModal.classList.remove('active');
                projectModalBackdrop.classList.add('hidden');
                document.body.style.overflow = ''; // Enable scroll on body
            }
        });
    });

    projectModalBackdrop.addEventListener('click', function() {
        projectModals.forEach(modal => modal.classList.remove('active'));
        this.classList.add('hidden');
        document.body.style.overflow = '';
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            projectModals.forEach(modal => modal.classList.remove('active'));
            projectModalBackdrop.classList.add('hidden');
            document.body.style.overflow = '';
        }
    });

    /* --- Quiz RH Logic --- */
    const quizQuestions = [
        {
            question: "Quel est l'objectif principal de la DSN (Déclaration Sociale Nominative) ?",
            options: [
                "A) Simplifier le calcul des impôts sur le revenu.",
                "B) Remplacer toutes les déclarations sociales et fiscales.",
                "C) Transmettre les données sociales des salariés aux organismes de protection sociale.",
                "D) Gérer les plannings de travail des employés."
            ],
            answer: "C) Transmettre les données sociales des salariés aux organismes de protection sociale."
        },
        {
            question: "Qu'est-ce que le précompte professionnel ?",
            options: [
                "A) Une avance sur salaire.",
                "B) L'impôt sur le revenu prélevé à la source sur le salaire.",
                "C) Une cotisation sociale patronale.",
                "D) Une prime de fin d'année."
            ],
            answer: "B) L'impôt sur le revenu prélevé à la source sur le salaire."
        },
        {
            question: "Quelle est la durée légale du travail hebdomadaire en France pour un temps plein ?",
            options: [
                "A) 39 heures.",
                "B) 35 heures.",
                "C) 40 heures.",
                "D) 45 heures."
            ],
            answer: "B) 35 heures."
        },
        {
            question: "Quel est le rôle principal d'un SIRH ?",
            options: [
                "A) Gérer la comptabilité de l'entreprise.",
                "B) Optimiser la gestion des ressources humaines via des outils informatiques.",
                "C) Automatiser la production industrielle.",
                "D) Assurer la sécurité informatique."
            ],
            answer: "B) Optimiser la gestion des ressources humaines via des outils informatiques."
        },
        {
            question: "Qu'est-ce qu'une GPEC ?",
            options: [
                "A) Gestion Prévisionnelle des Emplois et des Compétences.",
                "B) Grande Entreprise de Prestations Externalisées et de Conseil.",
                "C) Groupe d'Étude des Politiques Économiques et Commerciales.",
                "D) Garantie de Paiement des Employés Contractuels."
            ],
            answer: "A) Gestion Prévisionnelle des Emplois et des Compétences."
        },
        {
            question: "En cas d'accident du travail, qui est le premier organisme à indemniser le salarié ?",
            options: [
                "A) L'employeur.",
                "B) L'assurance chômage.",
                "C) La Sécurité Sociale (CPAM).",
                "D) La mutuelle complémentaire."
            ],
            answer: "C) La Sécurité Sociale (CPAM)."
        },
        {
            question: "Qu'est-ce que la subrogation en matière de paie ?",
            options: [
                "A) Le remplacement d'un salarié absent par un autre.",
                "B) Le maintien de salaire par l'employeur qui perçoit directement les IJSS.",
                "C) La délégation de pouvoir à un subordonné.",
                "D) La compensation des heures supplémentaires par des jours de repos."
            ],
            answer: "B) Le maintien de salaire par l'employeur qui perçoit directement les IJSS."
        },
        {
            question: "Quel document est obligatoire pour tout salarié à la fin de chaque mois ?",
            options: [
                "A) Le contrat de travail.",
                "B) Le règlement intérieur.",
                "C) Le bulletin de paie.",
                "D) L'attestation Pôle Emploi."
            ],
            answer: "C) Le bulletin de paie."
        },
        {
            question: "Qu'est-ce que le solde de tout compte ?",
            options: [
                "A) Le montant total des salaires versés sur une année.",
                "B) Un document récapitulant les sommes versées au salarié à la rupture de son contrat.",
                "C) Le solde du compte bancaire de l'entreprise.",
                "D) Le total des congés payés restants."
            ],
            answer: "B) Un document récapitulant les sommes versées au salarié à la rupture de son contrat."
        },
        {
            question: "Quelle est la principale fonction du logiciel Chronotime ?",
            options: [
                "A) La gestion de la paie.",
                "B) La gestion des temps et des activités (GTA).",
                "C) La gestion des recrutements.",
                "D) La gestion des carrières."
            ],
            answer: "B) La gestion des temps et des activités (GTA)."
        }
    ];

    const quizQuestionsContainer = document.getElementById('quiz-questions');
    const submitQuizButton = document.getElementById('submit-quiz');
    const quizResultsDiv = document.getElementById('quiz-results');

    /**
     * Renders the quiz questions and options into the HTML.
     */
    function renderQuiz() {
        if (!quizQuestionsContainer) {
            console.warn("Quiz container not found, skipping quiz rendering.");
            return;
        }
        quizQuestionsContainer.innerHTML = ''; // Clear previous questions
        quizQuestions.forEach((q, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('quiz-question');
            questionDiv.innerHTML = `
                <p>${index + 1}. ${q.question}</p>
                <div class="quiz-options">
                    ${q.options.map((option, optIndex) => `
                        <label>
                            <input type="radio" name="question${index}" value="${option}" data-question-index="${index}" data-option-index="${optIndex}">
                            ${option}
                        </label>
                    `).join('')}
                </div>
            `;
            quizQuestionsContainer.appendChild(questionDiv);
        });
    }

    /**
     * Handles the quiz submission, calculates score, and displays results.
     */
    function submitQuiz() {
        let score = 0;
        quizResultsDiv.innerHTML = ''; // Clear previous results
        quizResultsDiv.classList.remove('success', 'fail'); // Clear previous styling

        quizQuestions.forEach((q, index) => {
            const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
            const questionDiv = quizQuestionsContainer.children[index]; // Get the question div

            // Reset previous feedback classes
            questionDiv.classList.remove('correct', 'incorrect');
            questionDiv.querySelectorAll('label').forEach(label => {
                label.classList.remove('selected', 'correct-answer');
            });

            if (selectedOption) {
                const selectedLabel = selectedOption.closest('label');
                selectedLabel.classList.add('selected');

                if (selectedOption.value === q.answer) {
                    score++;
                    questionDiv.classList.add('correct');
                } else {
                    questionDiv.classList.add('incorrect');
                    // Highlight the correct answer if the user was wrong
                    questionDiv.querySelector(`input[value="${q.answer}"]`).closest('label').classList.add('correct-answer');
                }
            } else {
                // If no option was selected, mark as incorrect and show correct answer
                questionDiv.classList.add('incorrect');
                questionDiv.querySelector(`input[value="${q.answer}"]`).closest('label').classList.add('correct-answer');
            }
        });

        const totalQuestions = quizQuestions.length;
        const percentage = (score / totalQuestions) * 100;

        let resultText = `Vous avez obtenu ${score} bonnes réponses sur ${totalQuestions}.`;
        if (percentage >= 70) {
            resultText += " Excellent ! Vous avez une solide connaissance en RH.";
            quizResultsDiv.classList.add('success');
        } else if (percentage >= 50) {
            resultText += " Bien ! Continuez à approfondir vos connaissances.";
            quizResultsDiv.classList.add('fail'); // Can use a neutral style here if desired
        } else {
            resultText += " Vous pouvez encore vous améliorer. N'hésitez pas à consulter les ressources !";
            quizResultsDiv.classList.add('fail');
        }
        quizResultsDiv.textContent = resultText;
    }

    // Event listener for quiz submission
    if (submitQuizButton) {
        submitQuizButton.addEventListener('click', submitQuiz);
    }

    // Render the quiz when the quiz section becomes active
    const quizRhSection = document.getElementById('quiz-rh');
    if (quizRhSection) {
        const quizObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.target.id === 'quiz-rh') {
                    console.log('Quiz RH section is visible, rendering quiz.');
                    renderQuiz(); // Render the quiz when the section is visible
                    quizObserver.unobserve(entry.target); // Stop observing after initial render
                }
            });
        }, { threshold: 0.1 }); // Trigger when 10% of the section is visible

        quizObserver.observe(quizRhSection);
    }
});