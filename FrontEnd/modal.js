//* Fonction - Récupération des travaux pour la fenêtre modale *//
async function getWorksForModal() {
    const response = await fetch("http://localhost:5678/api/works");
    worksData = await response.json();
  
    const modalGallery = document.querySelector('.modal-gallery');
    modalGallery.innerHTML ='';
  
    worksData.forEach(work => {
        const modalFigure = document.createElement('figure');
        modalFigure.classList.add('figureModal');
    
        const modalImg = document.createElement('img');
        modalImg.src = work.imageUrl;
        modalImg.classList.add('classImg');

        const trashIcon = document.createElement('i');
        trashIcon.classList.add('fa-solid', 'fa-trash-can', 'trash-icon');

        modalFigure.appendChild(trashIcon);        
        modalFigure.appendChild(modalImg);
        modalGallery.appendChild(modalFigure);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    getWorksForModal();
});


//* Lorsqu'on clique sur "modifier" la fenêtre modale apparaît *//
document.addEventListener("DOMContentLoaded", function() {
    const editBtn = document.querySelector(".edit-btn");
    const editModal = document.querySelector(".modal-container");
    const closeModal = document.querySelector(".close");
  
    // Fonction pour afficher la fenêtre modale //
    function openEditModal() {
      editModal.style.display = "block";
    }
  
    // Fonction pour fermer la fenêtre modale //
    function closeEditModal() {
      editModal.style.display = "none";
    }
  
    // Lorsque l'utilisateur clique sur le bouton "modifier" //
    editBtn.addEventListener("click", openEditModal);
  
    // Lorsque l'utilisateur clique sur le bouton de fermeture de la fenêtre modale (la croix) //
    closeModal.addEventListener("click", closeEditModal);
  });
