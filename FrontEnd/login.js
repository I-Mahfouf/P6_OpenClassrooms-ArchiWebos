function authentificationUtl() {
    const loginForm = document.querySelector(".formulaireUtl");

    loginForm.addEventListener("submit", async function(event) {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("pass").value;

        const data = {
            email: email,
            password: password,
        };

        const apiUrl = 'http://localhost:5678/api/users/login';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

        try {
            console.log("Authentification")

            const response = await fetch(apiUrl, options);

            if (response.ok) {
                const data = await response.json();
                if (data.token) {
                    const authToken = data.token;
                    //* Stockez le token dans le LocalStorage *//
                    localStorage.setItem('authToken', authToken);
                    window.location.href = "index.html";
                }
            } else {
                console.error('Erreur');
                const errorMessage = document.querySelector("#errorMessage");
                errorMessage.style.display = "block";
            }
        } catch (error) {
            console.error('Erreur de connexion :', error);
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    authentificationUtl();
});


