document.addEventListener('DOMContentLoaded', function () {
    // Log pour s'assurer que le script se charge
    console.log('DOMContentLoaded fired: script.js is running.');

    // --- Gestion des onglets dans la section "Mes Offres" ---
    // Ces onglets sont de retour dans la section "Mes Offres"
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
    const sections = document.querySelectorAll('main section'); // Sélectionne toutes les sections principales
    const mainHeader = document.getElementById('mainHeader'); // L'élément header principal

    // Définition des variables CSS pour les tailles de l'en-tête
    // Ces valeurs DOIVENT correspondre à celles définies dans style.css
    // Elles représentent désormais la HAUTEUR TOTALE de l'en-tête, y compris la navigation
    const headerHeightInitial = 350; // Hauteur initiale de l'en-tête en px (incluant la nav)
    const headerHeightScrolled = 140; // Hauteur de l'en-tête après scroll en px (incluant la nav réduite)

    // Ajuste le padding-top du body pour éviter que le contenu ne soit masqué par l'en-tête fixe
    // Utilise directement la hauteur de l'en-tête car la navigation est maintenant intégrée
    document.body.style.paddingTop = `${headerHeightInitial}px`;

    // Met à jour l'année courante dans le pied de page
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

    // Logique pour le shrinking de l'en-tête au scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { // Un seuil de 50px est généralement suffisant pour détecter un début de scroll
            mainHeader.classList.add('scrolled');
            // Ajuste le padding-top du body pour la hauteur réduite de l'en-tête
            document.body.style.paddingTop = `${headerHeightScrolled}px`;
        } else {
            mainHeader.classList.remove('scrolled');
            // Réinitialise le padding-top du body à la hauteur initiale
            document.body.style.paddingTop = `${headerHeightInitial}px`;
        }
    });


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
                            'var(--gold-light)',
                            'var(--gold-medium)',
                            'var(--gold-dark)',
                            'var(--gold-light)',
                            'var(--gold-medium)',
                            'var(--gold-dark)'
                        ],
                        borderColor: [
                            'var(--gold-dark)', // Utilise une bordure plus foncée pour le contraste
                            'var(--gold-dark)',
                            'var(--gold-dark)',
                            'var(--gold-dark)',
                            'var(--gold-dark)',
                            'var(--gold-dark)'
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
                document.body.style.overflow = 'hidden'; // Désactive le défilement du corps
            }
        });
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const parentModal = this.closest('.project-modal');
            if (parentModal) {
                parentModal.classList.remove('active');
                projectModalBackdrop.classList.add('hidden');
                document.body.style.overflow = ''; // Active le défilement du corps
            }
        });
    });

    projectModalBackdrop.addEventListener('click', function() {
        projectModals.forEach(modal => modal.classList.remove('active'));
        this.classList.add('hidden');
        document.body.style.overflow = '';
    });

    // Ferme la modale avec la touche Échap
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            projectModals.forEach(modal => modal.classList.remove('active'));
            projectModalBackdrop.classList.add('hidden');
            document.body.style.overflow = '';
        }
    });

    /* --- Logique du Quiz RH --- */
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
        quizQuestionsContainer.innerHTML = ''; // Efface les questions précédentes
        quizQuestions.forEach((q, index) => {
            const questionDiv = document.createElement('div');
            // Ajout d'une classe dynamique pour le style des questions
            questionDiv.classList.add('quiz-question', `q${index + 1}`);
            
            // Création de l'élément p pour la question
            const questionTextElement = document.createElement('p');
            questionTextElement.innerHTML = `${index + 1}. ${q.question}`;
            questionDiv.appendChild(questionTextElement);

            const optionsDiv = document.createElement('div');
            optionsDiv.classList.add('quiz-options');
            optionsDiv.innerHTML = `
                ${q.options.map((option, optIndex) => `
                    <label class="option-${String.fromCharCode(65 + optIndex).toLowerCase()}">
                        <input type="radio" name="question${index}" value="${option}" data-question-index="${index}" data-option-index="${optIndex}">
                        <span>${option}</span>
                    </label>
                `).join('')}
            `;
            questionDiv.appendChild(optionsDiv);
            quizQuestionsContainer.appendChild(questionDiv);
        });
    }

    /**
     * Handles the quiz submission, calculates score, and displays results.
     */
    function submitQuiz() {
        let score = 0;
        quizResultsDiv.innerHTML = ''; // Efface les résultats précédents
        quizResultsDiv.classList.remove('success', 'fail'); // Efface le style précédent

        quizQuestions.forEach((q, index) => {
            const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
            const questionDiv = quizQuestionsContainer.children[index]; // Obtient le div de la question

            // Réinitialise les classes de feedback précédentes
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
                    // Met en évidence la bonne réponse si l'utilisateur s'est trompé
                    questionDiv.querySelector(`input[value="${q.answer}"]`).closest('label').classList.add('correct-answer');
                }
            } else {
                // Si aucune option n'a été sélectionnée, marque comme incorrect et affiche la bonne réponse
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
            quizResultsDiv.classList.add('fail'); // Peut utiliser un style neutre ici si désiré
        } else {
            resultText += " Vous pouvez encore vous améliorer. N'hésitez pas à consulter les ressources !";
            quizResultsDiv.classList.add('fail');
        }
        quizResultsDiv.textContent = resultText;
    }

    // Écouteur d'événement pour la soumission du quiz
    if (submitQuizButton) {
        submitQuizButton.addEventListener('click', submitQuiz);
    }

    // Affiche le quiz lorsque la section quiz-rh devient active
    const quizRhSection = document.getElementById('quiz-rh');
    if (quizRhSection) {
        const quizObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.target.id === 'quiz-rh') {
                    console.log('Quiz RH section is visible, rendering quiz.');
                    renderQuiz(); // Affiche le quiz lorsque la section est visible
                    quizObserver.unobserve(entry.target); // Arrête d'observer après le rendu initial
                }
            });
        }, { threshold: 0.1 }); // Se déclenche lorsque 10% de la section est visible

        quizObserver.observe(quizRhSection);
    }

});
