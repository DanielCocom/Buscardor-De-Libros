const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsDiv = document.getElementById('results');
// Evento para manejar la búsqueda

let currentPage = 1;
let tamañoPagina = 12;

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    const searchType = document.querySelector('input[name="search-type"]:checked').value;
    if (!query) return;

    let url = `https://openlibrary.org/search.json?`;
    if (searchType === 'isbn') {
        url += `isbn=${encodeURIComponent(query)}`;
    } else if (searchType === 'author') {
        url += `author=${encodeURIComponent(query)}`;
    } else {
        url += `title=${encodeURIComponent(query)}`;
    }


    
    try {
        const response = await fetch(url);
        const data = await response.json();
       CargarDatosTabla(data.docs)
    } catch (error) {
        resultsDiv.innerHTML = '<p>Ocurrió un error al buscar. Por favor, intenta de nuevo.</p>';
        console.error(error);
    }
});




function CargarDatosTabla(archivos, paginaActual = 1) {
    if (archivos.length > 0) {

        document.getElementById('container-botones-paginacion').innerHTML ='';
        document.getElementById('c-resultados').innerHTML ='';   
        // DEFINIR VARIABLE tamanoPagina
        const DatosPaginados = PaginarDatos(paginaActual, archivos, tamañoPagina);
        archivosPaginaActual = DatosPaginados;
        displayResults(DatosPaginados, "results");
        RenderPagination(archivos, tamañoPagina, paginaActual);
        MostrarNumeroResult("c-resultados", archivos.length);
    }
    else{
        // LIMPIAR CONTENEDORES 
           resultsDiv.innerHTML = '<p class = "fw-bold text-center">No hubo resultados en su busqueda</p>';
           document.getElementById('container-botones-paginacion').innerHTML ='';
            document.getElementById('c-resultados').innerHTML ='';   
    }
    //MOSTRAR QUE NO HUBO RESULTADOS
}


function PaginarDatos(pagina, datos, TamañoPagina) {
    const inicioIndex = (pagina - 1) * TamañoPagina;
    const finalIndice = inicioIndex + TamañoPagina;
    return datos.slice(inicioIndex, finalIndice);
}


function RenderPagination(totalItems, pageSize, currentPage) {
    const totalPages = Math.ceil(totalItems.length / pageSize);
    const paginationContainer = document.getElementById(
        "container-botones-paginacion"
    );
    paginationContainer.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.classList.add("btn");
        button.classList.add("btn-outline-dark");
        button.textContent = i;
        if (i === currentPage) {
            button.disabled = true;
        }
        button.addEventListener("click", () => CargarDatosTabla(totalItems, i));
        paginationContainer.appendChild(button);
    }
}

function MostrarNumeroResult(htmlElement, numberElement) {
    const element = document.getElementById(htmlElement);
    if (element) {
        element.textContent = "Resultados: " + numberElement;
    }
}

function displayResults(books, container) {
    const resultsDiv = document.getElementById(container);

    resultsDiv.innerHTML = '';
    if (books.length === 0) {
        resultsDiv.innerHTML = '<p>No se encontraron libros.</p>';
        return;
    }
    books.forEach((book) => {
        const bookElement = document.createElement('div');
        bookElement.classList.add('col-md-4', 'col-sm-6', 'mb-4');

        const coverImage = book.cover_i 
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` 
            : 'https://placehold.co/150x200/png';

            const isbn = book.isbn ? book.isbn[0] : 'No disponible';
        bookElement.innerHTML = ` 
            <div class="card h-100">
                <img src="${coverImage}" class="card-img-top" alt="${book.title}">
                <div class="card-body">
                    <h5 class="card-title">${book.title}</h5>
                    <p class="card-text"><strong>Autor:</strong> ${book.author_name ? book.author_name.join(', ') : 'Desconocido'}</p>
                    <p class="card-text"><strong>Año:</strong> ${book.first_publish_year || 'Desconocido'}</p>
                    <p class="card-text"><strong>ISBN:</strong> ${isbn}</p>
                </div>
            </div>
        `;
        resultsDiv.appendChild(bookElement);
    });
}