document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded fired: script.js is running.');

    const mainHeader = document.querySelector('header');
    const headerHeight = mainHeader ? mainHeader.offsetHeight : 0;

    // Ajuste le padding-top du body pour compenser le header fixe
    // document.body.style.paddingTop = `${headerHeight}px`; // Déplacé dans le CSS pour plus de simplicité

    // --- Gestion du menu mobile ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // --- Gestion des onglets pour "Mes Offres" (sur mes-offres.html) ---
    const offerTabButtons = document.querySelectorAll('.tab-button');
    const offerTabContents = document.querySelectorAll('.tab-content');
    if (offerTabButtons.length > 0 && offerTabContents.length > 0) {
        offerTabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetId = button.dataset.target;
                offerTabContents.forEach(content => content.classList.add('hidden'));
                offerTabButtons.forEach(btn => btn.classList.remove('active'));
                document.getElementById(targetId).classList.remove('hidden');
                button.classList.add('active');
            });
        });
        offerTabButtons[0].click(); // Active le premier onglet au chargement de la page
    }

    // --- Gestion des onglets pour "À Propos" (sur a-propos.html) ---
    const aboutTabButtons = document.querySelectorAll('.tab-button-about');
    const aboutTabContents = document.querySelectorAll('.tab-content-about');
    if (aboutTabButtons.length > 0 && aboutTabContents.length > 0) {
        aboutTabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetId = button.dataset.target;
                aboutTabContents.forEach(content => content.classList.add('hidden'));
                aboutTabButtons.forEach(btn => btn.classList.remove('active'));
                document.getElementById(targetId).classList.remove('hidden');
                button.classList.add('active');
            });
        });
        aboutTabButtons[0].click(); // Active le premier onglet au chargement de la page
    }

    // --- Gestion des onglets pour "Mes Réalisations" (sur realisations.html) ---
    const realTabButtons = document.querySelectorAll('.tab-button-real');
    const realTabContents = document.querySelectorAll('.tab-content-real');
    if (realTabButtons.length > 0 && realTabContents.length > 0) {
        realTabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetId = button.dataset.target;
                realTabContents.forEach(content => content.classList.add('hidden'));
                realTabButtons.forEach(btn => btn.classList.remove('active'));
                document.getElementById(targetId).classList.remove('hidden');
                button.classList.add('active');
            });
        });
        realTabButtons[0].click(); // Active le premier onglet au chargement de la page
    }

    // --- Gestion des onglets pour "Actualités" (sur actualites.html) ---
    const actualTabButtons = document.querySelectorAll('.tab-button-actual');
    const actualTabContents = document.querySelectorAll('.tab-content-actual');
    if (actualTabButtons.length > 0 && actualTabContents.length > 0) {
        actualTabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetId = button.dataset.target;
                actualTabContents.forEach(content => content.classList.add('hidden'));
                actualTabButtons.forEach(btn => btn.classList.remove('active'));
                document.getElementById(targetId).classList.remove('hidden');
                button.classList.add('active');

                // Si l'onglet activé est le quiz, le rendre
                if (targetId === 'quiz-rh-content') {
                    renderQuiz();
                }
            });
        });
        actualTabButtons[0].click(); // Active le premier onglet au chargement de la page
        // Si le premier onglet est le quiz, le rendre
        if (actualTabButtons[0].dataset.target === 'quiz-rh-content') {
            renderQuiz();
        }
    }


    // --- Gestion du Quiz RH (uniquement sur actualites.html) ---
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
    const submitQuizButton = document.getElementById('submit-quiz-actual');
    const quizResultsDiv = document.getElementById('quiz-results-actual');

    function renderQuiz() {
        if (!quizContainer) return;

        quizContainer.innerHTML = '';
        quizQuestions.forEach((q, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('mb-4', 'text-left');
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
});