/* Ètape 1.1 : Récupérer les données de l'API avec Fetch et afficher les travaux */

//* Déclaration des variables : Trois variables sont déclarées pour stocker les données récupérées depuis l'API *//
let worksData; // Stock les données que j'obtiens via l'API //
let categories; // Ensemble pour stocker les catégories //
let gallery; // Conteneur pour afficher les travaux //

//* Fonction - Récupération des travaux : cette fonction utilise fetch pour récupérer les données des travaux depuis l'API *//
// Les données sont stockées dans la variable worksData //
// Ensuite, la fonction affiche ces travaux en appelant une autre fonction displayWork pour chaque travail //
async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  worksData = await response.json();

  gallery = document.querySelector('.gallery');

  worksData.forEach(work => {
    displayWork(work);
  });
}

/*----------------------------------------------------------------------*/

//* Fonction - Récupération des catégories : cette fonction utilise fetch pour récupérer les catégories des travaux depuis l'API // 
// Les catégories sont stockées dans la variable fetchedCategories //
// Ensuite, la fonction prépare un conteneur pour les filtres en sélectionnant l'élément avec l'ID "filterContainer" et le vide //
async function getCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  const fetchedCategories = await response.json();

  const filterContainer = document.querySelector('#filterContainer');
  filterContainer.innerHTML = '';

  // Création du bouton "Tous" //
  const allBtn = document.createElement("button");
  allBtn.classList.add("btn");
  allBtn.innerText = "Tous";
  allBtn.id = "all";
  filterContainer.appendChild(allBtn);

  // Appel setActiveFilter avec l'ID "all" pour activer le bouton "tous" par défaut //
  setActiveFilter("all");

  allBtn.addEventListener('click', (event) => {
    const categoryId = event.target.id;
    filterWorksByCategoryId(categoryId);
    setActiveFilter(categoryId);
  });

  categories = new Set();

  // La fonction parcourt les catégories récupérées et crée un bouton pour chaque catégorie // 
  // Elle l'ajoute au conteneur de filtres et ajoute un écouteur d'événements pour filtrer les travaux par catégorie lorsque le bouton est *cliqué* // 
  // Les catégories sont également stockées dans un ensemble (categories) //
  fetchedCategories.forEach(category => {
    const filtersBtn = document.createElement("button");
    filtersBtn.classList.add("btn");
    filtersBtn.innerText = category.name;
    filtersBtn.id = category.id;
    filterContainer.appendChild(filtersBtn);

    categories.add(category.name);

    filtersBtn.addEventListener('click', (event) => {
      const categoryId = event.target.id;
      filterWorksByCategoryId(categoryId);
      setActiveFilter(categoryId)
    });
  });
}

/*----------------------------------------------------------------------*/

/* Ètape 1.2 : Créer les filtres */

//* Fonction pour filtrer les travaux : cette fonction filtre les travaux en fonction de la catégorie sélectionnée //
// Si la catégorie est "all", tous les travaux sont affichés // 
// Sinon, seuls les travaux appartenant à la catégorie sélectionnée sont affichés //
function filterWorksByCategoryId(categoryId) {

  gallery = document.querySelector('.gallery');
  gallery.innerHTML = '';

  if (categoryId == "all") {
    worksData.forEach(work => {
      displayWork(work);
    });
  } else {
    worksData.forEach(work => {
      if (categoryId == work.categoryId) {
        displayWork(work);
      }
    });
  }
}

//* Fonction pour créer les éléments HTML : Cette fonction crée des éléments HTML pour afficher un travail // 
// Elle utilise les données d'un travail pour créer un élément figure, qui va contenir l'image et la légende // 
// Puis, elle ajoute cette figure à l'élément de la galerie //
function displayWork(work) {
  const figureElement = document.createElement('figure');
  const imgElement = document.createElement('img');
  imgElement.src = work.imageUrl;

  const figcaptionElement = document.createElement('figcaption');
  figcaptionElement.textContent = work.title;

  figureElement.appendChild(imgElement);
  figureElement.appendChild(figcaptionElement);

  gallery.appendChild(figureElement);
}

//* Fonction d'ajout de la classe "active" : cette fonction ajoute la classe "btn_active" au bouton actuellement actif // 
// Elle supprime cette classe de tous les autres boutons. Cela permet de styliser visuellement le bouton actif //
function setActiveFilter(categoryId) {
  const ButtonsContainer = document.querySelectorAll('.btn');
  ButtonsContainer.forEach(button => {
    // Supprime la classe "btn_active" de tous les boutons //
    button.classList.remove('btn_active');
    if (button.id === categoryId) {
      // Ajoute la classe "btn_active" uniquement au bouton actif //
      button.classList.add('btn_active');
    }
  });
}

// Cette partie du code utilise un écouteur d'événements pour attendre que le DOM soit entièrement chargé //
// Une fois le DOM chargé, il appelle les fonctions getCategories et getWorks // 
// Puis filtre les travaux par catégorie "all" et active le bouton "tous" par défaut //
document.addEventListener("DOMContentLoaded", () => {
  getCategories();
  getWorks().then(() => {
    filterWorksByCategoryId("all");
    setActiveFilter('all'); // active le bouton "tous" par défaut //
  });
});

/*----------------------------------------------------------------------*/

//* Ètape 2.2 : Mise en place de la déconnexion *//

document.addEventListener("DOMContentLoaded", function () {
  const loginButton = document.getElementById("loginBtn");

  // Vérifiez si l'utilisateur est authentifié en vérifiant la présence du token dans le localStorage //
  const authToken = localStorage.getItem('authToken');

  // Si l'utilisateur est authentifié, changez le texte du bouton en "logout" //
  if (authToken) {
    loginButton.textContent = "logout";
  }

  // Ajoutez un gestionnaire d'événements pour gérer la connexion/déconnexion //
  loginButton.addEventListener("click", function () {
    // Si l'utilisateur est authentifié, déconnectez-le en supprimant le token du localStorage //
    if (authToken) {
      localStorage.removeItem('authToken');
      loginButton.textContent = "Login"; // Changez le texte en "Login"
    } else {
      // Si l'utilisateur n'est pas authentifié, redirigez-le vers la page de connexion //
      window.location.href = "login.html";
    }
  });
});

/*----------------------------------------------------------------------*/

//* Ètape 3.1 : Le mode édition *//

//* Apparition du mode éditon aprés authentification *//
document.addEventListener("DOMContentLoaded", function () {
  // Vérifie si l'utilisateur est authentifié //
  const authToken = localStorage.getItem('authToken');
  const elementsDisplay = document.querySelectorAll(".modeEdition-banner, .modifBtn");
  const allFilters = document.getElementById("filterContainer");

  if (authToken) {
    // L'utilisateur est authentifié, afficher les éléments "modeEdition-banner" et "modifBtn" //
    elementsDisplay.forEach(element => {
      element.style.display = "flex";
    })

    // Masquer les filtres //
    allFilters.style.display = "none";
  } else {
    // L'utilisateur n'est pas authentifié, masquer les éléments "modeEdition-banner" et "modifBtn" //
    elementsDisplay.forEach(element => {
      element.style.display = "none";
    })

    // Afficher les boutons de filtre //
    allFilters.style.display = "flex";
  }
});

