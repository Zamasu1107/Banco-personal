// Este código se ejecuta SIEMPRE que se carga el script
document.addEventListener('DOMContentLoaded', () => {
    // Si existe la tabla mensual, píntala
    if (document.getElementById('tabla-ingresos-body')) {
        pintarTabla(); // La función que ya tienes
    }
    
    // Si existe la tabla anual, píntala
    if (document.getElementById('tabla-ingresos-bodyA')) {
        pintarTablaAnual();
    }

    // Si se abre la pagina de cajitas que la actualice e inicie
    if(document.getElementById('pag-cajas')) {
        crearInterfazCajita();

        actualizarInterfazCajitas();

        inicializarGrafica();
    }
    
});

//----------------------------------------------------------------------------------------------------------------------
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

//----------------------------------------------------------------------------------------------------------------------
function toggleMenu(idRecibido) {
    // Buscamos el elemento usando el ID que llegó por el paréntesis
    let menu = document.getElementById(idRecibido);
    
    // Si el menú existe, le cambiamos la clase
    if (menu) {
        menu.classList.toggle("despegable-menu"); // Asegúrate que la clase sea la misma que en tu CSS
    }
}
//---------------------------------------------------------------------------------------------------------------------------

function pintarTabla() {
    // 1. Capturamos el ID del tbody de la tabla
    const tablaRefMensual = document.getElementById('tabla-ingresos-body');  
        if (!tablaRefMensual) return; // Solo si la tabla existe, la dibujamos
    
    // 2. Sacamos los datos guardados a sus valores normales 
    let historialMensual = JSON.parse(localStorage.getItem('banco_ingresos')) || [];
    let acumulado = 0;
        
        tablaRefMensual.innerHTML = ""; // Limpiar antes de pintar

    // 3. Creamos un forEach que hara que cada item del guardado se sume y agregue cada que llamamos la funcion
        historialMensual.forEach(item => {
            // 4. Sumamos el monto inicial con el nuevo usando el objeto ya creado y sacando el monto recien guardado
            acumulado += item.monto;
            // 5. Insertamos una nueva fila abajo de la anterior
            let row = tablaRefMensual.insertRow(-1);
            // 6. Insertamos una nueva celda contando desde el 0 dependiendo de su tipo de valor
            row.insertCell(0).textContent = item.fecha; // Primera celda: Hora
            row.insertCell(1).textContent = `$${item.monto}`; // Segunda celda: Monto
            row.insertCell(2).textContent = `$${acumulado}`; // Tercera celda: Suma de los montos
        });

    // 7. Obtenemos el tfoot de la tabla para ingresar el total
        const tablaFootRefM = document.getElementById('tabla-ingresos-foot');
        // Si la tabla esta que agregue el valor acumulado.
        if(tablaFootRefM) {
            tablaFootRefM.textContent = `$${acumulado}`;
        }    
    }

function pintarTablaAnual() {
    // 1. Capturamos el ID del tbody de la tabla anual
    const tablaRefAnual = document.getElementById('tabla-ingresos-bodyA'); 
        if (!tablaRefAnual) return; // Solo si la tabla existe, la dibujamos
    
    // 2. Conseguimos los datos guardados del localStorage y los transformamos
    let historialAnual = JSON.parse(localStorage.getItem('anual_ingresos')) || [];
    let finalMonto = 0;

    tablaRefAnual.innerHTML = ""; // Limpiar antes de escribir

    // 3. Creamos un forEach que hara que cada item del guardado se sume y agregue cada que llamamos la funcion
     historialAnual.forEach(item => {
        // 4.Sumamos el monto final con cada monto agregado del guardado
            finalMonto += item.montoA;
            // 5. Insertamos una nueva fila abajo de la anterior
            let row = tablaRefAnual.insertRow(-1);
            // 6. Insertamos una nueva celda contando desde el 0 dependiendo de su tipo de valor
            row.insertCell(0).textContent = item.fechaA; // Primera celda: Hora
            row.insertCell(1).textContent = `$${item.montoA}`; // Segunda celda: Monto
            row.insertCell(2).textContent = `$${finalMonto}`; // Tercera celda: Suma de los montos
        });

        // 7. Obtenemos el tfoot de la tabla para escribir el total
        const tablaFARef = document.getElementById('tabla-Aingresos-foot');
        //Si la tabla existe agregamos el monto final
        if(tablaFARef) {
            tablaFARef.textContent = `$${finalMonto}`;
        }   
     } 

//----------------------------------------------------------------------------------------------------------------------------
// 1. Obtenemos nuestro boton para hacer el corte del mes
const botonCierre = document.getElementById('boton-cierre');
// Si el boton existe le asignamos un event listener
if(botonCierre) {
    botonCierre.addEventListener('click', function() { // El boton al momento de hacer click correra la siguiente funcion
    
    // 2. Sacamos la tabla del mes para hacer el corte ya armado
    let finDeMes = JSON.parse(localStorage.getItem('banco_ingresos')) || [];
    
    // 3. Usamos el metodo reduce para sumar todos los montos y asignarlos a total
    let totalMes = finDeMes.reduce((total, item) => total + item.monto, 0);

    // 4. Creamos el objeto con los datos que vamos a obtener 
     let cierreAnual = {
        fechaA : new Date().toLocaleString('default', { month: 'long' }),
        montoA : totalMes
     }

    // 5. Sacamos los datos del guardado anual para ingresarlos al cierreAnual (objeto)
    let historialAnual = JSON.parse(localStorage.getItem('anual_ingresos')) || [];
    historialAnual.push(cierreAnual)
     // 6. Guardamos de vuelta el historial con el nuevo onjeto y datos
    localStorage.setItem('anual_ingresos', JSON.stringify(historialAnual)) || [];
    // 7. Reiniciamos o removemos la tabla del mes junto con sus datos guardados
    localStorage.removeItem('banco_ingresos');

    // 8. Actualizamos la interfaz de inmediato
    location.reload();
});
}

//----------------------------------------------------------------------------------------------------------------------------
// 1. Capturamos el formulario del html de ingresos en una variable 
const form = document.getElementById('ingre-form');

// 2. Se crea un if para comprobar si el form existe en la pagina
if (form) {
// 3. Se utiliza un evento para escuchar el submit y activar la funcion
form.addEventListener("submit", function(event) {
    event.preventDefault(); // Evitamos que la pagina se reinicie al darle enviar
    
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

    form.reset(); // Limpia los inputs después de guardar
    pintarTabla(); 

    // 1. Sacamos lo que tengamos ahorrado en cada cajita y si no hay nada empezamos en ceros
    let saldoCajitas = JSON.parse(localStorage.getItem('saldo_cajitas')) || 
                   { gastos: 0, coche: 0, laptop: 0, trjNvidea: 0, japon: 0 };

    // 2. Usamos un for in para recorrer cada meta en las cajitas y asignarle una llave
    for (let llave in cajitas) {
        // 3. Multiplicamos cada monto por cada uno de los porcentajes de las respectivas metas usando la llave que asignamos antes
        let montoParaCaja = montoIngresado * cajitas[llave].montoporcentaje;
        // 4. Guardamos cada monto en todas las metas o llaves en las cajitas
        saldoCajitas[llave] += montoParaCaja;
    }
        // 5. Guardamos de vuelta en el storage los nuevos montos ya calculados
        localStorage.setItem('saldo_cajitas', JSON.stringify(saldoCajitas));

    });
}

let cajitas = JSON.parse(localStorage.getItem('config_cajas')) || {
    gastos: { nombre: 'Gastos Diarios', descripcion: 'El dinero guardado para los gastos del dia a dia', montoporcentaje: 0.40, meta: 3000, idBarra: 'bar-gasto', idmonto: 'montoTG', idPorcentaje: 'porcentajeG' },
    coche : { nombre: 'Auto', descripcion: 'El dinero guardado para los gastos del auto y las mejoras y servicios por hacerle', montoporcentaje: 0.20, meta: 5000, idBarra: 'bar-auto', idmonto: 'montoTA', idPorcentaje: 'porcentajeA' },
    trjNvidea : { nombre: 'Tarjeta Grafica', descripcion: 'El dinero guardado una nueva tarjeta de video Nvidea 5060 ti 16gb', montoporcentaje: 0.15, meta: 12500, idBarra: 'bar-nvidea', idmonto: 'montoTNV', idPorcentaje: 'porcentajeNTV' },
    laptop: { nombre: 'Laptop', descripcion: 'El dinero guardado para una nueva laptop para la escuela', montoporcentaje: 0.15, meta: 10000, idBarra: 'bar-laptop', idmonto: 'montoTL', idPorcentaje: 'porcentajeL' },
    japon : { nombre: 'Viaje a Japon', descripcion: 'El dinero guardado para el viaje a japon incluyendo boleto y dinero extra', montoporcentaje: 0.10, meta: 80000, idBarra: 'bar-japon', idmonto: 'montoTJ', idPorcentaje: 'porcentajeJ' },
}

const formCajas = document.getElementById('caja-form');

function crearCajitaNueva() {

        let infoCaja = new FormData(formCajas);
        let infoNom = infoCaja.get('Nombre')
        let infoDesc = infoCaja.get('Descripcion')
        let infoMeta = Number(infoCaja.get('Meta'))
        let infoPorc = Number(infoCaja.get('Porcentaje'))
        let id = Date.now();

        cajitas[id] = {
            nombre : infoNom,
            descripcion : infoDesc,
            meta : infoMeta,
            montoporcentaje : infoPorc,
            idBarra : `bar-${id}`,
            idmonto :  `monto-${toString.apply(id)}`,
        }

        localStorage.setItem('config_cajas', JSON.stringify(cajitas));

        let saldoCajas = JSON.parse(localStorage.getItem('saldo_cajitas'));
        saldoCajas[id] = 0;

        localStorage.setItem('saldo_cajitas', JSON.stringify(saldoCajas));

        location.reload();
    }

    if (formCajas) {
    formCajas.addEventListener('submit', function(event){
        event.preventDefault();
        crearCajitaNueva();
    })
}
localStorage.setItem('config_cajas', JSON.stringify(cajitas));

function crearInterfazCajita() {
    let contenedor = document.querySelector('.contenedor-cajas');
    if(contenedor) {
        contenedor.innerHTML = "";

    for (const llave in cajitas) {
        let htmlCaja =`<div id="caja-${llave}" class="cajas" onclick="toggleMenu('subAhorroMenu-${llave}')">
                <h3>${cajitas[llave].nombre}</h3>

                <div class="cajas-diseño despegable-menu" id="subAhorroMenu-${llave}" >
                    <p class="desc-cajas">${cajitas[llave].descripcion}</p>
                    
                    <div class="bar-baground">
                        <div class="progress-bar">
                            <div class="progress-fill" id=${cajitas[llave].idBarra}></div>
                        </div>
                    </div>
                    <div class="porcentajes-descrip">
                        <span class="porcentaje" id="porc-${llave}">0%</span>
                        <span class="total-caja" id="${cajitas[llave].idmonto}">Total: 0/${cajitas[llave].meta}$ </span>
                    </div>
                </div>
            </div>`

            contenedor.innerHTML += htmlCaja;
    }
}
}

//-------------------------------------------------------------------------------------------------------------------------
function actualizarInterfazCajitas() {
    // 1. Sacamos los datos que tengamos guardados en los porcentajes
    let saldos = JSON.parse(localStorage.getItem('saldo_cajitas')) || {};

    let montoTotal = Object.values(saldos).reduce((acc, valor) => acc + valor, 0);
    
    // 2. Por cada meta en la cajita le asignamos una llave para actualizar su info
    for (let llave in cajitas) {
        let info = cajitas[llave];
        let saldoActual = saldos[llave] || 0;
        
        // 3. Cálculamos el porcentaje para la barra 
        let porcentajeCaja = (saldoActual / info.meta) * 100;
        if (porcentajeCaja > 100) porcentajeCaja = 100; // Tope visual

        // 4. Actualizamos la Barra (CSS Dinámico)
        let barra = document.getElementById(info.idBarra);
        if (barra) barra.style.width = `${porcentajeCaja}%`;

        // 5. Actualizamos el Texto
        let texto = document.getElementById(info.idmonto);
        if (texto) texto.textContent = `Total: ${Math.floor(saldoActual)}/${info.meta}$`;

        let porcTotal = (saldoActual / montoTotal) * 100;
        let spanPorcentaje = document.getElementById(info.idPorcentaje);
        if (spanPorcentaje) spanPorcentaje.textContent = `${Math.round(porcTotal)}%`;

        let mostrarPorcentaje = document.getElementById('porc-' + llave)
        if (mostrarPorcentaje) mostrarPorcentaje.textContent = `${Math.round(porcTotal)}%`;

    }
        let mostrartotal = document.getElementById('monto-total');

        if (mostrartotal) {
            mostrartotal.textContent = `$${Math.round(montoTotal)}`;
        }

}

//-------------------------------------------------------------------------------------------------------------------------

function inicializarGrafica() {
    const ctx = document.getElementById('doughnut').getContext('2d');
    if (ctx) {
    if (!ctx) return;

    const saldos = JSON.parse(localStorage.getItem('saldo_cajitas')) || [];
    let montosGraf = Object.values(saldos);

    const label = JSON.parse(localStorage.getItem('config_cajas')) || [];
    let nombreGraf = Object.values(label).map(cajita => cajita.nombre);
    
    // Extraemos solo los valores numéricos para la gráfica
    const dataValues = montosGraf;
    
    // Creamos un degradado para que no se vea plano
    const gradient = ctx.createRadialGradient(250, 250, 50, 250, 250, 250);
    gradient.addColorStop(0, '#2ECC71'); // Verde brillante al centro
    gradient.addColorStop(1, '#1E8449'); // Verde oscuro al borde

const doughnut = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels : nombreGraf,
        datasets: [{
           label: 'Distribución de Ahorros',
                data: dataValues,
            backgroundColor: [
                '#2ECC71', // Esmeralda vivo
                '#27AE60', // Verde bosque
                '#1E8449', // Verde profundo
                '#52BE80'  // Verde suave
            ],
            hoverOffset: 20, // Hace que el segmento resalte al tocarlo
            borderColor: '#0D0F12',
            borderWidth: 2,
            hoverBorderColor: '#2ECC71'
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
            left: 20,
            right: 20,
            top: 10,
            bottom: -10 // Espacio extra abajo para la leyenda
        }
        },
        plugins: {
            legend: {
                position: 'bottom', // Mueve la leyenda abajo para ganar ancho
                align: 'center' ,
                labels: { color: '#E0E0E0', font: { size: 14 } }
            }
        }
    }
});
}
}
