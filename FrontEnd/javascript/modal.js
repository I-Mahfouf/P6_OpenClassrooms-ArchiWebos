//* Fonction - Récupération des travaux pour la fenêtre modale *//
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

      const deleted = await ApiDeleteWork(workIdToDelete);
      if (deleted) {
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  getWorksForModal();
});

//* Faire apparaître les fenêtres modales *//
//* Lorsqu'on clique sur "modifier" la fenêtre modale apparaît *//
document.addEventListener("DOMContentLoaded", function () {
  const editBtn = document.querySelector(".modifBtn");
  const editModal = document.querySelector(".modalContainer");
  const closeIconModal = document.querySelector(".closeIcon");

  // Fonction pour afficher la fenêtre modale //
  function openEditModal() {
    editModal.style.display = "block";
  }

  // Fonction pour fermer la fenêtre modale //
  function closeIconEditModal() {
    editModal.style.display = "none";
  }

  // Lorsque l'utilisateur clique sur le bouton "modifier", la fonction openEditModal s'active //
  editBtn.addEventListener("click", openEditModal);

  // Et inversement //
  closeIconModal.addEventListener("click", closeIconEditModal);

  // Fermer la fenêtre modale lorsque l'utilisateur clique en dehors de celle-ci //
  window.addEventListener("click", function (event) {
    if (event.target === editModal) {
      closeIconEditModal();
    }
  });
});

//-------------------- Suppression --------------------//

//* Fonction pour supprimer les travaux *//
async function ApiDeleteWork(workId) {
  try {
    // Vérifiez d'abord si l'utilisateur est authentifié //
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      console.error('L-utilisateur n-est pas authentifié. Vous ne pouvez pas supprimer le travail.');
      return false;
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
    return true;
  } catch (error) {
    console.error('Erreur lors de la requête DELETE :', error);
    return false;
  }
}

//-------------------- Ajout --------------------//

//* Fonction pour ajouter des travaux *//
document.addEventListener("DOMContentLoaded", () => {
  const addWorkButton = document.querySelector('.modalGallery-addBtn');
  const modalGallery = document.querySelector('.modalGallery');
  const modalAdd = document.querySelector('.modalAddworks');
  const closeIconButton = document.querySelector(".closeIcon");

  addWorkButton.addEventListener('click', () => {
    modalGallery.style.display = 'none'; // je masque la galerie //
    modalAdd.style.display = 'block'; // j'affiche le formulaire //
  });

  closeIconButton.addEventListener("click", () => {
    modalGallery.style.display = 'block'; // j'affiche la galerie //
    modalAdd.style.display = 'none'; // je masque le formulaire //
  });
});

//* Fonction pour récupérer les catégories dans le formulaire *//
async function getCategoriesForForm() {
  const response = await fetch("http://localhost:5678/api/categories");
  const fetchedCategories = await response.json();
  console.table(fetchedCategories);

  // Sélectionne le champ de sélection dans le formulaire //
  const categorySelect = document.getElementById('category');

  // Efface les options existantes //
  categorySelect.innerHTML = '';

  // Rempli le champ de sélection avec les catégories récupérées //
  fetchedCategories.forEach(category => {
    const option = document.createElement("option");
    option.value = category.id; // Utilise l'ID de la catégorie comme valeur //
    option.text = category.name; // Utilise le nom de la catégorie comme texte //
    categorySelect.appendChild(option);
  });
}

// Appel de la fonction au chargement //
document.addEventListener("DOMContentLoaded", () => {
  getCategoriesForForm();
});

async function ApiAddWork(formData) {
  try {
    // Vérifie d'abord si l'utilisateur est authentifié //
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      console.error('L\'utilisateur n\'est pas authentifié. Vous ne pouvez pas ajouter de travail.');
      return false;
    }

    // Si l'utilisateur est authentifié, envoyez la requête POST à l'API //
    const response = await fetch("http://localhost:5678/api/works", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('La requête d\'ajout n\'a pas abouti.');
    }

    // Ajout réussi //
    return true;
  } catch (error) {
    console.error('Erreur lors de la requête POST :', error);
    return false;
  }
}

//* Fonction pour envoyer les travaux à l'API *//
document.addEventListener("DOMContentLoaded", () => {
  const addWorkForm = document.getElementById('addWorkForm');
  const modalGallery = document.querySelector('.gallery');

  addWorkForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const category = document.getElementById('category').value;
    const imageFileInput = document.getElementById('imageFile');

    // Vérifie si les champs sont correctement remplis //
    if (!title || !category || !imageFileInput.files[0]) {
      console.error('Veuillez remplir tous les champs du formulaire.');
      return;
    }

    // Créez un objet FormData pour envoyer les données au format multipart/form-data //
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('image', imageFileInput.files[0]);

    // Envoie des données au serveur en utilisant fetch avec une requête POST //
    const added = await ApiAddWork(formData);

    if (added) {
      // Mise à jour la galerie avec le nouveau travail //
      const newWork = {
        title: title,
        category: category,
        imageUrl: URL.createObjectURL(imageFileInput.files[0]), // Créez un aperçu de l'image //
      };
      displayWork(newWork);

      // Une fois que l'ajout est réussi, vous pouvez réinitialiser le formulaire //
      addWorkForm.reset();
    }
  });
});



