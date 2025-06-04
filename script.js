document.addEventListener('DOMContentLoaded', function () {
    // Log pour s'assurer que le script se charge
    console.log('DOMContentLoaded fired: script.js is running.');

    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const sections = document.querySelectorAll('main section');

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

});
