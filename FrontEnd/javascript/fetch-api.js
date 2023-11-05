//* Déclaration des variables *//
let worksData; //* Stock les données que j'obtiens via l'API *//
let categories; //* Ensemble pour stocker les catégories *//
let gallery;

//* Fonction - Récupération des travaux *//
async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  worksData = await response.json();
  console.table(worksData);

  gallery = document.querySelector('.gallery');

  worksData.forEach(work => {
    displayWork(work);
  });
}

//* Fonction - Récupération des catégories et création des filtres *//
async function getCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  const fetchedCategories = await response.json();
  console.table(fetchedCategories);

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
    console.log(categoryId);
    filterWorksByCategoryId(categoryId);
    setActiveFilter(categoryId);
  });

  categories = new Set();

  fetchedCategories.forEach(category => {
    const filtersBtn = document.createElement("button");
    filtersBtn.classList.add("btn");
    filtersBtn.innerText = category.name;
    filtersBtn.id = category.id;
    filterContainer.appendChild(filtersBtn);

    categories.add(category.name);

    filtersBtn.addEventListener('click', (event) => {
      const categoryId = event.target.id;
      console.log(categoryId);
      filterWorksByCategoryId(categoryId);
      setActiveFilter(categoryId)
    });
  });
}

//* Fonction pour filtrer les travaux *//
function filterWorksByCategoryId(categoryId) {
  console.log(categoryId);

  gallery = document.querySelector('.gallery');
  gallery.innerHTML = '';

  if (categoryId == "all") {
    console.log("all");
    worksData.forEach(work => {
      displayWork(work);
    });
  } else {
    console.log("un autre message");
    worksData.forEach(work => {
      console.log(work);
      if (categoryId == work.categoryId) {
        console.log("Message erreur");
        displayWork(work);
      }
    });
  }
}

//* Fonction pour créer les éléments HTML *//
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

//* Fonction d'ajout de la classe "active" *//
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

document.addEventListener("DOMContentLoaded", () => {
  getCategories();
  getWorks().then(() => {
    filterWorksByCategoryId("all");
    setActiveFilter('all'); // active le bouton "tous" par défaut //
  });
});


//* Mode édition *//

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

//* Mise en place de la déconnexion *//
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