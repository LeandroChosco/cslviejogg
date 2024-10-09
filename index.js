let allRows = []; // Guardar todas las filas cargadas
const rowsLimit = 10; // Límite de filas visibles por defecto

// Función para cargar los datos desde MongoDB
function cargarDatos(url) {
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cliente: "ViejoGG" }) // Parámetro cliente
    })
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById("itemsTable").getElementsByTagName("tbody")[0];
        tableBody.innerHTML = ""; // Limpiar filas existentes

        // Recorrer los datos y agregarlos a la tabla
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.userAlbion}</td>
                <td>${item.items}</td>
                <td>${item.estado}</td>
                <td>${item.fecha}</td>
            `;
            tableBody.appendChild(row);
        });

        // Guardar todas las filas cargadas en el array
        allRows = Array.from(tableBody.getElementsByTagName('tr'));

        // Mostrar solo las filas limitadas
        mostrarFilasLimitadas();
    })
    .catch(error => console.error('Error al cargar los datos:', error));
}

// Función para mostrar solo las filas limitadas (50)
function mostrarFilasLimitadas() {
    const tableBody = document.getElementById("itemsTable").getElementsByTagName("tbody")[0];

    // Mostrar solo las primeras `rowsLimit` filas
    allRows.forEach((row, index) => {
        if (index < rowsLimit) {
            row.style.display = ''; // Mostrar fila
        } else {
            row.style.display = 'none'; // Ocultar fila
        }
    });
}

// Función para filtrar dinámicamente la tabla en base al input
function filtrarTabla() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const tableBody = document.getElementById("itemsTable").getElementsByTagName("tbody")[0];
    
    // Filtrar las filas que coinciden con el filtro de búsqueda
    let visibleCount = 0; // Contador de filas visibles
    allRows.forEach((row, index) => {
        const cell = row.getElementsByTagName('td')[0]; // Primera celda con el "Nick de Albion"
        const textValue = cell.textContent || cell.innerText;

        // Determinar si la fila debe ser visible o no
        if (textValue.toLowerCase().includes(input) && visibleCount < rowsLimit) {
            row.style.display = ''; // Mostrar fila que coincida
            visibleCount++;
        } else {
            row.style.display = 'none'; // Ocultar fila que no coincida
        }
    });

    // Si se borra el input, asegurarse de mostrar las filas limitadas
    if (input === '') {
        mostrarFilasLimitadas(); // Mostrar las filas limitadas nuevamente
    }
}

// Event listener para búsqueda dinámica
document.getElementById('searchInput').addEventListener('input', filtrarTabla);

// Cargar los datos al inicio
cargarDatos('https://backendsorteos.vercel.app/api/users/getAll');
