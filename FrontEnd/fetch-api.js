fetch("http://localhost:5678/api/works")
.then(response => response.json())
.then(responseApi => {
    console.table(responseApi);

    const gallery = document.querySelector('.gallery');

    responseApi.forEach(works => {
        const figureElement = document.createElement('figure');

        const imgElement = document.createElement ('img');
        imgElement.src = works.imageUrl;

        const figcaptionElement = document.createElement ('figcaption');
        figcaptionElement.textContent = works.title;

        figureElement.appendChild(imgElement);
        figureElement.appendChild(figcaptionElement);

        gallery.appendChild(figureElement);
    });
})


