// Ètape 2.1 : Authentification de l'utilisateur *//

//* Ici j'utilise une fonction qui va gèrer l'authentification d'un utilisateur lorsqu'il soumet un formulaire de connexion *//
function authentificationUtl() {
    // Sélectionne le formulaire de connexion par sa classe CSS //
    const loginForm = document.querySelector(".userForm");

    // Ajoute un écouteur d'événements pour le formulaire lors de sa soumission //
    loginForm.addEventListener("submit", async function (event) {
        // Empêche le comportement par défaut du formulaire //
        event.preventDefault();

        // Récupère les valeurs des champs email et password du formulaire //
        const email = document.getElementById("email").value;
        const password = document.getElementById("pass").value;

        // Crée un objet avec les données à envoyer au serveur //
        const data = {
            email: email,
            password: password,
        };

        // Définit l'URL de l'API pour la requête d'authentification //
        const apiUrl = 'http://localhost:5678/api/users/login';

        // Options pour la requête fetch (méthode POST, en-têtes, corps JSON) //
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

        try {
            // Effectue la requête fetch vers l'API avec les options définies //
            const response = await fetch(apiUrl, options);

            // Vérifie si la requête a abouti //
            if (response.ok) {
                // Récupère les données JSON de la réponse //
                const data = await response.json();

                // Vérifie si la réponse contient un jeton (token) //
                if (data.token) {
                    // Stocke le jeton dans le LocalStorage du navigateur //
                    localStorage.setItem('authToken', data.token);
                    // Redirige l'utilisateur vers la page d'accueil //
                    window.location.href = "index.html";
                }
            } else {
                // En cas d'erreur, affiche un message d'erreur à l'utilisateur //
                console.error('Erreur lors de la soumission du formulaire');
                const messageError = document.querySelector("#messageError");
                messageError.style.display = "block";
            }
        } catch (error) {
            // En cas d'erreur inattendue, affiche l'erreur dans la console //
            console.error('Erreur de connexion :', error);
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    // Appelle la fonction d'authentification lors du chargement complet du DOM //
    authentificationUtl();
});
