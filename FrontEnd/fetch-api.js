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

  const filterContainer = document.querySelector('#filter-container');
  filterContainer.innerHTML = '';

  //* Création du bouton "Tous" *//
  const allBtn = document.createElement("button");
  allBtn.classList.add("btn");
  allBtn.innerText = "Tous";
  allBtn.id = "all";
  filterContainer.appendChild(allBtn);

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

    //* Ajoutez la catégorie à l'ensemble categories *//
    categories.add(category.name);

    filtersBtn.addEventListener('click', (event) => {
      const categoryId = event.target.id;
      console.log(categoryId);
      filterWorksByCategoryId(categoryId);
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

document.addEventListener("DOMContentLoaded", () => {
  getCategories();
  getWorks().then(() => {
  filterWorksByCategoryId("all");
  });
});