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
    const sections = document.querySelectorAll('main section'); // Sélectionne toutes les sections principales
    const mainHeader = document.getElementById('mainHeader'); // L'élément header principal

    // Définition des variables CSS pour les tailles de l'entête
    // Ces valeurs doivent correspondre à celles définies dans style.css
    // Elles sont définies ici pour être utilisées dans le JS pour le padding du body
    const headerHeightInitial = 250; // Hauteur initiale de l'entête en px
    const headerHeightScrolled = 90; // Hauteur de l'entête après scroll en px
    const navBarTopHeight = 50; // Hauteur de la barre de navigation du haut (à ajuster si elle change dans CSS)

    // Ajuste le padding-top du body pour éviter que le contenu ne soit masqué par l'entête fixe
    // Cette valeur est calculée en fonction de la hauteur du header et de la barre de navigation fixe
    document.body.style.paddingTop = `${headerHeightInitial + navBarTopHeight}px`;

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

    // Logique pour le shrinking de l'entête au scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { // Un seuil de 50px est généralement suffisant pour détecter un début de scroll
            mainHeader.classList.add('scrolled');
            // Ajuste le padding-top du body pour la hauteur réduite de l'entête
            document.body.style.paddingTop = `${headerHeightScrolled + navBarTopHeight}px`;
        } else {
            mainHeader.classList.remove('scrolled');
            // Réinitialise le padding-top du body à la hauteur initiale
            document.body.style.paddingTop = `${headerHeightInitial + navBarTopHeight}px`;
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
     * Initializes Speech Synthesis Utterance for text-to-speech.
     * @param {string} text - The text to be spoken.
     */
    function speakText(text) {
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            // Optional: set language, voice, pitch, rate
            utterance.lang = 'fr-FR';
            window.speechSynthesis.speak(utterance);
        } else {
            console.warn("Speech synthesis not supported in this browser.");
        }
    }

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
            // Ajout d'une classe dynamique pour le style des questions
            questionDiv.classList.add('quiz-question', `q${index + 1}`);
            
            // Création de l'élément p pour la question
            const questionTextElement = document.createElement('p');
            questionTextElement.innerHTML = `${index + 1}. ${q.question}`;
            questionDiv.appendChild(questionTextElement);

            // Ajout du bouton d'écoute si la synthèse vocale est supportée
            if ('speechSynthesis' in window) {
                const listenButton = document.createElement('button');
                listenButton.classList.add('listen-button');
                listenButton.innerHTML = '🔊';
                listenButton.title = "Écouter la question";
                listenButton.addEventListener('click', function(e) {
                    e.stopPropagation(); // Empêche le clic de se propager aux options
                    speakText(q.question);
                });
                questionTextElement.prepend(listenButton); // Ajoute le bouton avant le texte de la question
            }

            const optionsDiv = document.createElement('div');
            optionsDiv.classList.add('quiz-options');
            optionsDiv.innerHTML = `
                ${q.options.map((option, optIndex) => `
                    <label class="option-${String.fromCharCode(65 + optIndex).toLowerCase()}">
                        <input type="radio" name="question${index}" value="${option}" data-question-index="${index}" data-option-index="${optIndex}">
                        <span>${option}</span>
                         ${'speechSynthesis' in window ? `<button class="listen-button-option" data-text="${option}" title="Écouter la proposition">🔊</button>` : ''}
                    </label>
                `).join('')}
            `;
            questionDiv.appendChild(optionsDiv);
            quizQuestionsContainer.appendChild(questionDiv);
        });

        // Ajouter les écouteurs pour les boutons de lecture des options
        document.querySelectorAll('.listen-button-option').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const textToSpeak = this.dataset.text;
                speakText(textToSpeak);
            });
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
        speakText(resultText); // Read out the quiz results
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

    /* --- General Audio Speaker Logic --- */
    // Select all elements with the 'listen-button' class that have a data-text attribute
    const generalListenButtons = document.querySelectorAll('.listen-button[data-text]');

    generalListenButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent clicks from propagating
            const textToSpeak = this.dataset.text;
            if (textToSpeak) {
                speakText(textToSpeak);
            }
        });
    });

    // Optional: Stop speech when navigating to a new section or scrolling significantly
    window.addEventListener('scroll', () => {
        if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
            // Stop speech if scrolling, to avoid reading irrelevant content
            // You might want to fine-tune this condition
            // window.speechSynthesis.cancel();
        }
    });

    // Stop speech when a new section is shown (triggered by nav links)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function() {
            if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
            }
        });
    });

});