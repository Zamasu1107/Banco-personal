// 1. Seleccionamos los elementos que necesitamos
const radiosMetodo = document.querySelectorAll('input[name="metodo"]');
const contenedorMeses = document.getElementById('contenedor-meses');

// 2. Añadimos el "escuchador" a cada radio button
radiosMetodo.forEach(radio => {
    radio.addEventListener('change', function() {
        // 3. Verificamos cuál está seleccionado
        if (this.value === 'msi') {
            contenedorMeses.style.display = 'block'; // Mostramos
        } else {
            contenedorMeses.style.display = 'none';  // Ocultamos
        }
    });
});

function toggleMenu(idRecibido) {
    // Buscamos el elemento usando el ID que llegó por el paréntesis
    let menu = document.getElementById(idRecibido);
    
    // Si el menú existe, le cambiamos la clase
    if (menu) {
        menu.classList.toggle("despegable-menu"); // Asegúrate que la clase sea la misma que en tu CSS
    }
}

// 1. Capturamos el formulario del html en una variable 
const form = document.getElementById('ingre-form');

// 2. Se crea un if para comprobar si el form existe en la pagina
if (form) {
// 3. Se utiliza un evento para escuchar el submit y activar la funcion
form.addEventListener("submit", function(event) {
    event.preventDefault();
    
    // 4. Capturamos los datos del formulario
    let transformFormDatos = new FormData(form);
    let montoIngresado = Number(transformFormDatos.get('Sueldo'));

    // 5. Creamos un objeto con la información necesaria para guardarla en el json
    let nuevoIngreso = {
        fecha: new Date().toLocaleDateString(),
        monto: montoIngresado
    };

    // 6. IMPORTANTE: Guardar para que otras páginas lo vean 
    // Primero traemos lo que ya existe o creamos un array vacío si no hay nada
    let historial = JSON.parse(localStorage.getItem('banco_ingresos')) || [];
    
    // Agregamos el nuevo objeto al historial
    historial.push(nuevoIngreso);
    
    // Guardamos la lista actualizada convertida en texto (Stringify)
    localStorage.setItem('banco_ingresos', JSON.stringify(historial));

    alert("Ingreso guardado y enviado al historial.");
    form.reset(); // Limpia los inputs después de guardar
    });
}

// 1. Esta función debe ejecutarse cuando cargue ingresos.html
function cargarHistorialIngresos() {
    const tablaRef = document.getElementById('tabla-ingresos-body'); // 2. Capturamos el ID del tbody de la tabla
    // Solo si la tabla existe, la dibujamos
    if (tablaRef) {
        pintarTabla();
    }

    function pintarTabla() {
        // 3. Sacamos los datos guardados a sus valores normales 
        let historial = JSON.parse(localStorage.getItem('banco_ingresos')) || [];
        let acumulado = 0;
        
        tablaRef.innerHTML = ""; // Limpiar antes de pintar

        // 4. Creamos un forEach que hara que cada item del guardado se sume y agregue cada que llamamos la funcion
        historial.forEach(item => {
            // 5. Sumamos el monto inicial con el nuevo usando el objeto ya creado y sacando el monto recien guardado
            acumulado += item.monto;
            // 6. Insertamos una nueva fila abajo de la anterior
            let row = tablaRef.insertRow(-1);
            // 7. Insertamos una nueva celda contando desde el 0 dependiendo de su tipo de valor
            row.insertCell(0).textContent = item.fecha; // Primera celda: Hora
            row.insertCell(1).textContent = `$${item.monto}`; // Segunda celda: Monto
            row.insertCell(2).textContent = `$${acumulado}`; // Tercera celda: Suma de los montos
        });
    }
}
// Ejecutamos al cargar la ventana de Ingresos
window.onload = cargarHistorialIngresos;
