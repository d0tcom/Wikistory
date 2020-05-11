// Elements HTML
const btnMenu = document.getElementById('btn-menu');
const sideMenu = document.querySelector('.side-menu');
const iconBtnMenu = document.getElementById('icon');
const container = document.querySelector('.container');
const h1 = document.getElementById('todaysdate');
const h2 = document.getElementById('century');
const h3 = document.getElementById('category-title');
const daySelect = document.getElementById('day');
const monthSelect = document.getElementById('month');
const centurySelect = document.getElementById('century-select');
const categorySelect = document.getElementById('category');
// Date
const date = new Date();
const months_fr = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const months_us = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const month_fr = months_fr[date.getMonth()];
const month_us = months_us[date.getMonth()];
const day = date.getDate();

// URL de l'API
let api_url = `https://fr.wikipedia.org/api/rest_v1/page/mobile-sections/${day}_${month_fr}`; //https://fr.wikipedia.org/api/rest_v1/page/mobile-sections/${day}_${month_fr}      -     https://fr.wikipedia.org/api/rest_v1/page/summary/France

// Fonction qui affiche les événements : (fonction showEvents())
// - Afficher les Événements : startEvents = 'Événements', endEvents = 'Naissances'
// - Afficher les Naissances : startEvents = 'Naissances', endEvents = 'Décès'
// - Afficher les Décès      : startEvents = 'Décès', endEvents = 'Articles_connexes'



// Affichage des données, affiche les événements, naissances ou décès à une période donnée
// endOfData permet de spécifier où l'on veut que la boucle for s'arrête
async function showData(category = 'Événements', century = `${centurySelect.value}_siècle`, endOfData) {



    try {
        const response = await fetch(api_url);
        const data = await response.json();
        let extractedText = null;
        let sections = data.remaining.sections

        let startAndEndArray = [];  // ([Valeur 0, Valeur 1])  --> Valeur 0 : Début du tableau, Valeur 1 : Fin du tableau

        // Fonction qui permet de sectionner un tableau en deux parties (début et fin). Retourne un tableau avec la clé de début et de fin.
        function startEndArray(start = 'Naissances', end = 'Décès') {
            let startAndEnd = [];
            // Début tableau
            for (let j = 0; j < sections.length; j++) {
                if (sections[j].anchor == start) {
                    startAndEnd.push(j);
                }
            }
            // Fin tableau
            for (let i = 0; i < sections.length; i++) {
                if (sections[i].anchor == end) {
                    startAndEnd.push(i);
                }
            }
            return startAndEnd;
        }

        // Fonction qui affiche les événements : (fonction showEvents())
        // - Afficher les Événements : startEvents = 'Événements', endEvents = 'Naissances'
        // - Afficher les Naissances : startEvents = 'Naissances', endEvents = 'Décès'
        // - Afficher les Décès      : startEvents = 'Décès', endEvents = 'Articles_connexes'
        function showEvents(startEvents = 'Décès', endEvents = 'Articles_connexes') {
            startAndEndArray = startEndArray(start = startEvents, end = endEvents);
            // On parcours le tableau sections de 0 jusqu'à startAndEndArray et on affiche les Événements
            for (let i = startAndEndArray[0]; i < startAndEndArray[1]; i++) {
                if (sections[i].anchor == `${centurySelect.value}_siècle` || sections[i].anchor == `${centurySelect.value}_siècle_2` || sections[i].anchor == `${centurySelect.value}_siècle_3` || sections[i].anchor == `${centurySelect.value}_siècle_av._J.C.`) {
                    extractedText = sections[i].text;
                }
            }
        }

        showEvents(startEvents = category, endEvents = endOfData);

        // Créer une section avec du contenu 'xxxxxx'
        let newSection = document.createElement('section');
        container.appendChild(newSection).className = 'articles';
        newSection.innerHTML = `${extractedText}`;
        // Si le 1er ul existe alors on lui donne une classe 'first-ul
        let ul = document.getElementsByTagName('ul');
        if (ul) {
            ul[0].className = 'first-ul';
        }

    }


    catch (e) {
        console.log('Aucun événement n\'a été trouver pour cette période');
        alert(`Aucun événement n'a été trouver pour cette période`);
    }
}

// Refresh data au changement des select
function refreshData(category, endOfData) {




    if (categorySelect.value == 'Événements') {
        changeHeaderTitles(daySelect.value, monthSelect.value);
        api_url = `https://fr.wikipedia.org/api/rest_v1/page/mobile-sections/${daySelect.value}_${monthSelect.value}`;
        removeSection();
        showData(category = 'Événements', century = `${centurySelect.value}_siècle`, endOfData = 'Naissances');
    } else if (categorySelect.value == 'Naissances') {
        changeHeaderTitles(daySelect.value, monthSelect.value);
        api_url = `https://fr.wikipedia.org/api/rest_v1/page/mobile-sections/${daySelect.value}_${monthSelect.value}`;
        removeSection();
        showData(category = 'Naissances', century = `${centurySelect.value}_siècle`, endOfData = 'Décès');
    } else if (categorySelect.value == 'Morts') {
        changeHeaderTitles(daySelect.value, monthSelect.value);
        api_url = `https://fr.wikipedia.org/api/rest_v1/page/mobile-sections/${daySelect.value}_${monthSelect.value}`;
        removeSection();
        showData(category = 'Décès', century = `${centurySelect.value}_siècle`, endOfData = 'Articles_connexes');
    }


    // changeHeaderTitles(daySelect.value, monthSelect.value);
    // api_url = `https://fr.wikipedia.org/api/rest_v1/page/mobile-sections/${daySelect.value}_${monthSelect.value}`;
    // removeSection();
    // showData(category = 'Événements', century = `${centurySelect.value}_siècle`, endOfData = 'Naissances');
}
// Date d'aujourd'hui (Jour, mois)
function todaysDate() { 
    changeHeaderTitles(daySelect.value, monthSelect.value);
    h1.innerHTML = `Le ${day} ${month_fr}`;
    daySelect.value == day;
    daySelect.selectedIndex = day - 1;
    monthSelect.value == date.getMonth();
    monthSelect.selectedIndex = date.getMonth();
}
// Changer la date 
function changeHeaderTitles(day = day, month = month_fr) {
    h1.innerHTML = `Le ${day} ${month}`
    h2.innerHTML = centurySelect.value;
    h3.innerHTML = `Les ${categorySelect.value}`;
}
// Changer le siècle
function changeCentury(romanNumber = 'XXI') {
    h2.innerHTML = `${romanNumber}`;
}
// Clique sur le bouton Menu
btnMenu.addEventListener('click', function openCloseMenu() {
    sideMenu.classList.toggle('active');
    iconBtnMenu.classList.toggle('active');
})
// On écoute le changement du select "jour"
daySelect.addEventListener('change', function () {
    refreshData();
})
// On écoute le changement du select "mois"
monthSelect.addEventListener('change', function () {
    refreshData();
})
// On écoute le changement du select "Siècle"
centurySelect.addEventListener('change', function () {
    refreshData();
})
// On écoute le changement du select "Catégorie"
categorySelect.addEventListener('change', function () {
    refreshData();
})
// Supression de la section de class 'articles'
function removeSection(sectionClassname = '.articles') {
    const sectionArticles = document.querySelector('.articles');
    if (sectionArticles) {
        sectionArticles.remove();
    } else {
        alert('Aucune section a supprimé!');
    }
}


todaysDate();
// getData();
showData(category = 'Événements', century = `${centurySelect.value}_siècle`, endOfData = 'Naissances');
