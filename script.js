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

    /* --- Calendrier de Disponibilités --- */
    // Ces éléments ne sont plus utilisés pour un calendrier dynamique, mais pour la section "Planning"
    // const calendarDaysElement = document.getElementById('calendarDays');
    // const currentMonthYearElement = document.getElementById('currentMonthYear');
    // const prevMonthButton = document.getElementById('prevMonth');
    // const nextMonthButton = document.getElementById('nextMonth');

    // let currentMonth = new Date().getMonth();
    // let currentYear = new Date().getFullYear();

    // // Jours de repos fixes
    // const fixedDaysOff = {
    //     // 0=Dimanche, 1=Lundi, ..., 6=Samedi
    //     dayOfWeek: {
    //         0: true, // Dimanche
    //         6: true // Samedi
    //     },
    //     // 'YYYY-MM-DD'
    //     // Ces dates prévalent sur les jours de la semaine si elles sont spécifiées.
    //     specificDates: {
    //         // Lundi matin (réunion interne)
    //         '2025-06-02': { morning: false, afternoon: true }, // Lundi 2 juin (matin off, apm dispo)
    //         '2025-06-09': { morning: false, afternoon: true },
    //         '2025-06-16': { morning: false, afternoon: true },
    //         '2025-06-23': { morning: false, afternoon: true },
    //         '2025-06-30': { morning: false, afternoon: true },
    //         // Vendredi après-midi (repos)
    //         '2025-06-06': { morning: true, afternoon: false }, // Vendredi 6 juin (matin dispo, apm off)
    //         '2025-06-13': { morning: true, afternoon: false },
    //         '2025-06-20': { morning: true, afternoon: false },
    //         '2025-06-27': { morning: true, afternoon: false },
    //     }
    // };


    // // Exemple de disponibilités pour les demi-journées de 4 heures (missions)
    // // Clé: 'YYYY-MM-DD', Valeur: { morning: true/false, afternoon: true/false }
    // // Ces données représentent les blocs de disponibilité *en clientèle* et peuvent être bloquées par les missions.
    // // Par défaut, Mardi/Mercredi/Jeudi sont "disponibles" SAUF si une mission spécifique les bloque.
    // const missionAvailability = {
    //     // Juin 2025 - Ces entrées représentent des *blocages* par des missions clients réelles.
    //     // Si une date n'est pas ici, elle est considérée comme disponible (sauf jours fixes).
    //     // Exemple de jours bloqués par une mission client (à adapter bien sûr)
    //     '2025-06-03': { morning: false, afternoon: false }, // Mardi 3 juin : Journée complète prise par un client
    //     '2025-06-11': { morning: true, afternoon: false }, // Mercredi 11 juin : Après-midi prise par un client
    //     '2025-06-19': { morning: false, afternoon: true }, // Jeudi 19 juin : Matin pris par un client
    // };


    // /**
    //  * Génère les jours du calendrier pour le mois et l'année donnés.
    //  * @param {number} month - Le mois (0-11).
    //  * @param {number} year - L'année.
    //  */
    // function generateCalendar(month, year) {
    //     if (!calendarDaysElement || !currentMonthYearElement) {
    //         console.warn("Calendar elements not found, skipping calendar generation.");
    //         return; // Sortir si les éléments du calendrier n'existent pas
    //     }

    //     calendarDaysElement.innerHTML = ''; // Vide le calendrier existant
    //     currentMonthYearElement.textContent = new Date(year, month).toLocaleString('fr-FR', { month: 'long', year: 'numeric' });

    //     const firstDayOfMonth = new Date(year, month, 1);
    //     // getDay() renvoie 0 pour dimanche, 1 pour lundi, etc. Nous voulons que lundi soit 0 pour notre grille.
    //     const startingDayIndex = (firstDayOfMonth.getDay() === 0) ? 6 : firstDayOfMonth.getDay() - 1; // 0=Lun, 1=Mar... 6=Dim

    //     const daysInMonth = new Date(year, month + 1, 0).getDate();

    //     // Ajouter les jours vides du mois précédent
    //     for (let i = 0; i < startingDayIndex; i++) {
    //         const emptyDay = document.createElement('div');
    //         emptyDay.classList.add('empty');
    //         calendarDaysElement.appendChild(emptyDay);
    //     }

    //     // Ajouter les jours du mois actuel
    //     for (let day = 1; day <= daysInMonth; day++) {
    //         const dayElement = document.createElement('div');
    //         const dateObj = new Date(year, month, day);
    //         const dayOfWeek = dateObj.getDay(); // 0=Dimanche, 1=Lundi...
    //         const fullDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    //         dayElement.classList.add('calendar-day');
    //         dayElement.classList.add('current-month');
    //         dayElement.innerHTML = `<span class="day-number">${day}</span>`;

    //         let morningAvailable = true;
    //         let afternoonAvailable = true;

    //         // Appliquer les jours de repos fixes (Samedi, Dimanche, Lundi matin, Vendredi après-midi)
    //         if (fixedDaysOff.dayOfWeek[dayOfWeek]) { // Samedi et Dimanche sont toujours "pris"
    //             morningAvailable = false;
    //             afternoonAvailable = false;
    //         } else if (fixedDaysOff.specificDates[fullDateStr]) { // Gérer les spécificités Lundi/Vendredi
    //             morningAvailable = fixedDaysOff.specificDates[fullDateStr].morning;
    //             afternoonAvailable = fixedDaysOff.specificDates[fullDateStr].afternoon;
    //         }

    //         // Appliquer les indisponibilités dues aux missions (ces BLOCAGES prévalent)
    //         // Si une entrée existe dans missionAvailability pour cette date, cela signifie que le créneau est pris par un client.
    //         if (missionAvailability[fullDateStr]) {
    //             if (missionAvailability[fullDateStr].morning === false) { // Si explicitement marqué comme false
    //                 morningAvailable = false;
    //             }
    //             if (missionAvailability[fullDateStr].afternoon === false) { // Si explicitement marqué comme false
    //                 afternoonAvailable = false;
    //             }
    //         }


    //         // Ajouter les créneaux
    //         const morningSlot = document.createElement('div');
    //         morningSlot.classList.add('availability-slot', morningAvailable ? 'morning' : 'booked');
    //         morningSlot.textContent = morningAvailable ? 'Matin' : 'Matin (Pris)';
    //         dayElement.appendChild(morningSlot);

    //         const afternoonSlot = document.createElement('div');
    //         afternoonSlot.classList.add('availability-slot', afternoonAvailable ? 'afternoon' : 'booked');
    //         afternoonSlot.textContent = afternoonAvailable ? 'Après-midi' : 'Après-midi (Pris)';
    //         dayElement.appendChild(afternoonSlot);
            
    //         // Si le jour entier est "pris" (weekend ou autre blocage total), ajouter une classe visuelle
    //         if (!morningAvailable && !afternoonAvailable) {
    //             dayElement.classList.add('full-day-booked');
    //         } else if (morningAvailable || afternoonAvailable) {
    //             dayElement.classList.add('has-slots'); // Pour la couleur de fond spécifiée dans CSS
    //         }


    //         calendarDaysElement.appendChild(dayElement);
    //     }
    // }

    // Gérer le changement de mois
    // if (prevMonthButton) {
    //     prevMonthButton.addEventListener('click', () => {
    //         currentMonth--;
    //         if (currentMonth < 0) {
    //             currentMonth = 11;
    //             currentYear--;
    //         }
    //         generateCalendar(currentMonth, currentYear);
    //     });
    // }

    // if (nextMonthButton) {
    //     nextMonthButton.addEventListener('click', () => {
    //         currentMonth++;
    //         if (currentMonth > 11) {
    //             currentMonth = 0;
    //             currentYear++;
    //         }
    //         generateCalendar(currentMonth, currentYear);
    //     });
    // }

    // Observer pour le calendrier (désactivé car le calendrier statique est retiré)
    // const observerCalendar = new IntersectionObserver((entries) => {
    //     entries.forEach(entry => {
    //         if (entry.isIntersecting && entry.target.id === 'planning-disponibilites') {
    //             console.log('Planning section is visible, generating calendar.');
    //             generateCalendar(currentMonth, currentYear); // Générer le calendrier quand la section est visible
    //             observerCalendar.unobserve(entry.target); // Arrêter d'observer après la génération initiale
    //         }
    //     });
    // }, { threshold: 0.5 }); // Déclencher quand 50% de la section est visible

    // const planningSection = document.getElementById('planning-disponibilites');
    // if (planningSection) {
    //     observerCalendar.observe(planningSection);
    // }

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
