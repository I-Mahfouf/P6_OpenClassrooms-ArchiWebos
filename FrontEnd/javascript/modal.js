
//* Ètape 3.2 : Afficher la fenêtre modale *//

async function getWorksForModal() {
  const response = await fetch("http://localhost:5678/api/works");
  worksData = await response.json();

  const modalGallery = document.querySelector('.modalGallery-gallery');
  modalGallery.innerHTML = '';

  worksData.forEach(work => {
    const modalFigure = document.createElement('figure');
    modalFigure.classList.add('figureModal');

    const modalImg = document.createElement('img');
    modalImg.src = work.imageUrl;
    modalImg.classList.add('classImg');

    const trashIcon = document.createElement('i');
    trashIcon.classList.add('fa-solid', 'fa-trash-can', 'trashIcon');

    trashIcon.setAttribute('data-workid', work.id);

    modalFigure.appendChild(trashIcon);
    modalFigure.appendChild(modalImg);
    modalGallery.appendChild(modalFigure);
  });

  const trashIcons = document.querySelectorAll(".trashIcon");

  trashIcons.forEach(trashIcon => {
    trashIcon.addEventListener("click", async () => {
      const workIdToDelete = trashIcon.getAttribute('data-workid');

      await ApiDeleteWork(workIdToDelete);
    });
  });
}

document.addEventListener("DOMContentLoaded", getWorksForModal);

//* Faire apparaître les fenêtres modales *//
//* Lorsqu'on clique sur "modifier" la fenêtre modale apparaît *//
document.addEventListener("DOMContentLoaded", function () {
  const editBtn = document.querySelector(".modifBtn");
  const editModal = document.querySelector(".modalContainer");
  const addWorkButton = document.querySelector(".modalGallery-addBtn");
  const modalGallery = document.querySelector(".modalGallery");
  const modalAdd = document.querySelector(".modalAddworks");
  const goBackIcon = document.querySelector(".arrowIcon");
  const closeIconModal = document.querySelector(".closeIcon");

  // Fonction pour afficher la fenêtre modale //
  function openEditModal() {
    editModal.style.display = "block";
  }

  // Fonction pour fermer la fenêtre modale //
  function closeEditModal() {
    editModal.style.display = "none";
  }

  // Lorsque l'utilisateur clique sur le bouton "modifier", la fonction openEditModal s'active //
  editBtn.addEventListener("click", openEditModal);

  // Lorsqu'il clique sur la croix, la fonction closeEditModal s'active //
  closeIconModal.addEventListener("click", closeEditModal);

  // Fermer la fenêtre modale lorsque l'utilisateur clique en dehors de celle-ci //
  window.addEventListener("click", function (event) {
    if (event.target === editModal) {
      closeEditModal();
    }
  });

  // Fonctionnement du passage d'une fenêtre à l'autre //
  addWorkButton.addEventListener('click', () => {
    modalGallery.style.display = 'none'; // je masque la galerie //
    modalAdd.style.display = 'block'; // j'affiche le formulaire //
  });

  goBackIcon.addEventListener("click", () => {
    modalGallery.style.display = 'block'; // j'affiche la galerie //
    modalAdd.style.display = 'none'; // je masque le formulaire //
  });
});


//* Ètape 3.3 : Supprimer les travaux *//

async function ApiDeleteWork(workId) {
  try {
    // Vérifiez d'abord si l'utilisateur est authentifié //
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      console.error('L-utilisateur n-est pas authentifié. Vous ne pouvez pas supprimer le travail.');
      return;
    }

    // Si l'utilisateur est authentifié, envoi la requête DELETE //
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      }
    });

    if (!response.ok) {
      throw new Error('La requête de suppression n-a pas abouti.');
    }

    // Suppression réussie //
  } catch (error) {
    console.error('Erreur lors de la requête DELETE :', error);
  }
}

//* Ètape 3.4 : Ajouter des travaux //

//* Fonction pour récupérer les catégories depuis l'API et les ajouter au formulaire *//
async function getCategoriesForForm() {
  try {
    // Envoie une requête GET pour récupérer les catégories depuis l'API
    const response = await fetch("http://localhost:5678/api/categories");
    const fetchedCategories = await response.json();

    // Sélectionne le champ de sélection dans le formulaire
    const categorySelect = document.getElementById('category');

    // Efface les options existantes
    categorySelect.innerHTML = '';

    // Remplit le champ de sélection avec les catégories récupérées
    fetchedCategories.forEach(category => {
      const option = document.createElement("option");
      option.value = category.id;
      option.text = category.name;
      categorySelect.appendChild(option);
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories :', error);
  }
}

//* Fonction pour envoyer une requête POST à l'API avec fetch *//
const apiAddWork = async (url, authToken, formData) => {
  try {
    // Envoie une requête POST à l'API avec le token d'authentification et les données du formulaire
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      body: formData,
    });

    return response;
  } catch (error) {
    console.error('Erreur lors de la requête POST :', error);
    return null;
  }
};

//* Fonction pour ajouter un travail via l'API *//
const submit = async (formData) => {
  // Récupère le token d'authentification depuis le localStorage
  const authToken = localStorage.getItem('authToken');

  //* Vérifie les conditions pour l'ajout d'un travail *//
  if (
    isImageSelected(formData.get('image')) &&
    isImageSizeValid(formData.get('image').size) &&
    isImageTypeValid(formData.get('image').type) &&
    isUserAuthenticated(authToken)
  ) {
    // Appelle la fonction pour envoyer la requête POST à l'API
    await apiAddWork("http://localhost:5678/api/works", authToken, formData);
  } else {
    // Affiche une erreur si les conditions ne sont pas remplies
    displayError('Erreur lors de la requête POST.');
    return false;
  }
};

/*----------------------------------------------------------------------*/

// Fonction pour vérifier si l'utilisateur est authentifié
const isUserAuthenticated = (authToken) => {
  // Vérifie la présence du token d'authentification
  if (!authToken) {
    // Affiche un message d'erreur et empêche l'ajout de travail
    displayError('L\'utilisateur n\'est pas authentifié. Vous ne pouvez pas ajouter de travail.');
    return false;
  }
  return true;
};

// Fonction pour vérifier si une image a été sélectionnée
const isImageSelected = (imageFile) => {
  // Vérifie la présence d'un fichier image
  if (!imageFile) {
    // Affiche un message d'erreur et empêche l'ajout de travail
    displayError('Aucun fichier image n\'a été sélectionné.');
    return false;
  }
  return true;
};

// Fonction pour vérifier si le type d'image est valide (jpg ou png)
const isImageTypeValid = (imageType) => {
  // Vérifie que le type d'image est jpg ou png
  if (!['image/jpg', 'image/png'].includes(imageType)) {
    // Affiche un message d'erreur et empêche l'ajout de travail
    displayError('Le fichier doit être en format jpg ou png.');
    return false;
  }
  return true;
};

// Fonction pour vérifier si la taille de l'image est valide (inférieure ou égale à 4 Mo)
const isImageSizeValid = (imageSize) => {
  // Définit la taille maximale autorisée à 4 Mo
  const maxSize = 4 * 1024 * 1024;

  // Vérifie que la taille de l'image est inférieure ou égale à la taille maximale
  if (imageSize > maxSize) {
    // Affiche un message d'erreur et empêche l'ajout de travail
    displayError('La taille du fichier est supérieure à 4 Mo.');
    return false;
  }
  return true;
};

/*----------------------------------------------------------------------*/

//* Fonction pour afficher le message d'erreur *//
const displayError = (errorMessage) => {
  // Affiche le message d'erreur dans la console
  console.error(errorMessage);

  // Sélectionne l'élément pour afficher l'erreur dans l'interface utilisateur
  const fieldError = document.querySelector("#fieldError");
  fieldError.style.display = "block";
};

//* Fonction pour mettre à jour l'état du bouton de soumission en fonction des champs du formulaire *//
const updateSubmitButtonState = () => {
  // Récupère les valeurs des champs du formulaire
  const title = document.getElementById('title').value;
  const category = document.getElementById('category').value;
  const imageFileInput = document.getElementById('imageFile');

  // Sélectionne le bouton de soumission
  const submitBtn = document.querySelector('.submitBtn');

  // Vérifie si tous les champs nécessaires sont remplis
  if (title && category && imageFileInput.files[0]) {
    // Active le bouton si tous les champs sont remplis
    submitBtn.classList.add('submitBtnActive');
  } else {
    // Désactive le bouton si certains champs sont vides
    submitBtn.classList.remove('submitBtnActive');
  }
};

/*----------------------------------------------------------------------*/

//* Événement au chargement de la page *//
document.addEventListener("DOMContentLoaded", () => {
  // Appelle la fonction pour récupérer les catégories au chargement de la page
  getCategoriesForForm();

  // Sélectionne les éléments du formulaire et ajoute des écouteurs d'événements
  const addWorkForm = document.getElementById('addWorkForm');
  const imageFileInput = document.getElementById('imageFile');
  const imagePreview = document.getElementById('imagePreview');
  const imageAddContainer = document.querySelector('.addWorkForm-imageAdd_content');

  // Ajoute un écouteur d'événements pour le changement de fichier image //
  imageFileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    // Gestion de l'aperçu de l'image et de la visibilité des éléments
    // Ajoute un écouteur d'événements au champ de fichier image du formulaire. 
    // Lorsque l'utilisateur sélectionne un fichier, le code réagit en affichant un aperçu de l'image.
    reader.onload = function(e) {
      // Met à jour l'attribut src de l'élément img avec les données de l'image
      imagePreview.src = e.target.result;
    };

    // Le code utilise un objet FileReader pour lire le contenu du fichier image sélectionné.
    // Puis met à jour l'attribut src de l'élément image (imagePreview) avec les données de l'image. 
    // Il gère également la visibilité des éléments associés à l'aperçu de l'image.
    if (file) {
      reader.readAsDataURL(file);
      imagePreview.style.display = 'block';
      imageAddContainer.style.display = 'none';
    } 
    updateSubmitButtonState();
  });

  // Ajoute des écouteurs d'événements pour mettre à jour l'état du bouton lors de la saisie et de la soumission //
  addWorkForm.addEventListener('input', () => {
    updateSubmitButtonState();
  });

  addWorkForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Cette ligne empêche le comportement par défaut du formulaire, qui serait de recharger la page //

    // Récupère les valeurs des champs du formulaire
    const title = document.getElementById('title').value;
    const category = document.getElementById('category').value;

    // Si tous les champs nécessaires sont remplis, le code crée un objet FormData contenant les données du formulaire (titre, catégorie, fichier image). //
    if (!title || !category || !imageFileInput.files[0]) {
      // Affiche une erreur si certains champs sont vides //
      displayError('Erreur lors de la requête POST.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('image', imageFileInput.files[0]);

    // Ensuite, il récupère le jeton d'authentification à partir du stockage local (localStorage) //
    const authToken = localStorage.getItem('authToken');

    // Puis il appelle la fonction submit(formData). 
    await submit(formData); // Cette fonction est chargée d'envoyer les données du formulaire à l'API pour l'ajout du travail. //
  });
});