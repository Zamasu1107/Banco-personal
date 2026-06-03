//---------------------------Codigo de carga de eventos y funciones-------------------------------------------------------------------------------------------------
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

     if (document.getElementById('pag-gastos')) {
         actualizarDatosInicio();

         actualizarChips(); 
         
         crearInterfazGasto();
         
         actualizarInterfazGasto();
 }

});

//---------------------------Codigo para ocultar y mostrar los botones radio-------------------------------------------------------------------------------------------------
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

//---------------------------Codigo para el abrir y cerrar los menus con click-------------------------------------------------------------------------------------------------
function toggleMenu(idRecibido) {
    // Buscamos el elemento usando el ID que llegó por el paréntesis
    let menu = document.getElementById(idRecibido);
    
    // Si el menú existe, le cambiamos la clase
    if (menu) {
        menu.classList.toggle("despegable-menu"); // Asegúrate que la clase sea la misma que en tu CSS
    }
}

//---------------------------Codigo para pintar ambas tablas en la pagina de ingresos-------------------------------------------------------------------------------------------------
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

//---------------------------Codigo para el corte del mes en la pagina de ingresos-------------------------------------------------------------------------------------------------
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

//---------------------------Codigo para ingresar el form de ingresos a las tablas y distribuirlo en las cajitas -------------------------------------------------------------------------------------------------
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
    let saldoCajitas = JSON.parse(localStorage.getItem('saldo_cajitas')) || {};

    // 2. Declaramos la variable para el dinero sobrante
    let dineroRestante = montoIngresado;

let idCajaGastos = Object.keys(cajitas).find(llave => {
    let nombreLimpio = (cajitas[llave].nombre || "").trim().toLowerCase();
    return nombreLimpio === 'gastos mensuales';
});

// 3. Creamos un bucle while para que mientras el dinero restante sea mayor a 0.01 el codigo cheque todo
while (dineroRestante > 0.01) {
    // 4. Filtramos solo las cajas que tienen espacio mientras que el saldo sea inferior al par meta en las cajitas
    let llavesDisponibles = Object.keys(cajitas).filter(llave => {
        return (saldoCajitas[llave] || 0) < cajitas[llave].meta;
    });

    // 5. Si las longitud de las cajas disponibles es igual a 0 entonces se ira al fondo de reserva
    if (llavesDisponibles.length === 0) {
    if (idCajaGastos) {
        // Le sumamos el excedente al ID dinámico que encontramos
        saldoCajitas[idCajaGastos] = (saldoCajitas[idCajaGastos] || 0) + dineroRestante;
    } else {
        // Opcional: Qué hacer si el usuario borró la caja por accidente
        console.warn("No existe la caja de Gastos Mensuales para absorber el excedente.");
    }
    break;
}

    // 6. CRUCIAL: Calculamos la suma total de los porcentajes de las cajas disponibles
    // Esto es para que el nuevo "100%" sean solo las cajas que quedan
    let sumaPorcentajesDisponibles = llavesDisponibles.reduce((acc, llave) => {
        return acc + cajitas[llave].montoporcentaje;
    }, 0);

    let dineroAcomodadoEnEstaVuelta = 0;
    let nuevoExcedente = 0;

    // 7. Creamos un foreach para que cada caja tenga su nuevo y respectivo porcentaje
    llavesDisponibles.forEach(llave => {
        // 8. Calculamos la porción proporcional basada solo en las cajas activas
        // Fórmula: (Porcentaje de la caja / Suma de porcentajes disponibles)
        let pesoRelativo = cajitas[llave].montoporcentaje / sumaPorcentajesDisponibles;
        let porcionProporcional = dineroRestante * pesoRelativo;

        let meta = cajitas[llave].meta;
        let saldoActual = saldoCajitas[llave] || 0;
        let espacio = meta - saldoActual;

        if (porcionProporcional > espacio) {
            saldoCajitas[llave] = meta;
            nuevoExcedente += (porcionProporcional - espacio);
        } else {
            saldoCajitas[llave] = saldoActual + porcionProporcional;
        }
    });

    // 9. El dinero restante para la siguiente vuelta es lo que sobró de las que se llenaron
    dineroRestante = nuevoExcedente;
    
    // 10. Si la suma de porcentajes es 0 (caso raro), evitamos bucle infinito
    if (sumaPorcentajesDisponibles === 0) break;
}

        // 11. Guardamos de vuelta en el storage los nuevos montos ya calculados
        localStorage.setItem('saldo_cajitas', JSON.stringify(saldoCajitas));

    });
}

//---------------------------Codigo de la configuracion de las cajitas iniciales-------------------------------------------------------------------------------------------------
let cajitas = JSON.parse(localStorage.getItem('config_cajas')) || {}

//---------------------------Codigo general para la creacion de cajas, interfaces de cajas, actualizar cajas y borrar cajas en ese orden-------------------------------------------------------------------------------------------------

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
            idmonto :  `monto-${id}`,
        }

        localStorage.setItem('config_cajas', JSON.stringify(cajitas));

        let saldoCajas = JSON.parse(localStorage.getItem('saldo_cajitas'))||{};
        saldoCajas[id] =  0;

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
                <button class="borrar-cajita" onclick="event.stopPropagation(); borrarCajita(${llave})">X</button>
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
                        <span class="total-caja" id="${cajitas[llave].idmonto}"></span>
                    </div>
                </div>
            </div>`

            contenedor.innerHTML += htmlCaja;
    }
}
}

function actualizarInterfazCajitas() {
    // 1. Sacamos los datos que tengamos guardados en los porcentajes
    let saldos = JSON.parse(localStorage.getItem('saldo_cajitas')) || {};
    let mostrarGasto = JSON.parse(localStorage.getItem('saldo_gastos')) || 0;

    let montoTotal = Object.values(saldos).reduce((acc, valor) => acc + valor, 0);
    
    // 2. Por cada meta en la cajita le asignamos una llave para actualizar su info
    for (let llave in cajitas) {
        let info = cajitas[llave];
        let saldoActual = saldos[llave] || 0;
        let metaFinalCaja = 0;
        let nombreLimpio = (info.nombre || "").trim().toLowerCase();

        if (nombreLimpio === 'gastos mensuales') {
            metaFinalCaja = mostrarGasto; // Toma el valor del storage
             info.meta = mostrarGasto;
        } else {
        // Si no es la de gastos, toma su propia meta. Si es inválida/0, le ponemos 1 para evitar NaN.
            metaFinalCaja = Number(info.meta) || 1; 
}

// 3. REEMPLAZAR TODAS LAS MENCIONES DE info.meta POR metaFinalCaja
        let porcentajeCaja = (saldoActual / metaFinalCaja) * 100;
        if (porcentajeCaja > 100) porcentajeCaja = 100;

        // 4. Actualizamos la Barra (CSS Dinámico)
        let barra = document.getElementById(info.idBarra);
        if (barra) barra.style.width = `${porcentajeCaja}%`;

        // 5. Actualizamos el Texto
        let texto = document.getElementById(info.idmonto);
        if (texto) texto.textContent = `Total: ${Math.floor(saldoActual)}/${metaFinalCaja}$`;

        let porcTotal = (saldoActual / montoTotal) * 100;
        let mostrarPorcentaje = document.getElementById('porc-' + llave)
        if (mostrarPorcentaje) mostrarPorcentaje.textContent = `${porcTotal.toFixed(1)}%`;

    }
        let mostrartotal = document.getElementById('monto-total');

        if (mostrartotal) {
            mostrartotal.textContent = `$${Math.round(montoTotal)}`;
        }

        localStorage.setItem('config_cajas', JSON.stringify(cajitas));
}

function borrarCajita(id) {
    if (confirm("Estas seguro de querer borrar la cajita?")) {
        
        let saldoCajita = JSON.parse(localStorage.getItem('saldo_cajitas'))||{};
        let dineroARepartir = saldoCajita[id] || 0;

        delete cajitas[id]
        delete saldoCajita[id]

        let borrarCajaV = document.getElementById(`caja-${id}`);
        if(borrarCajaV) {
            borrarCajaV.remove();
        }

        let llavesRestantes = Object.keys(cajitas);
        let cajasRestantes = llavesRestantes.length;

        if (cajasRestantes > 0 && dineroARepartir > 0) {
            let porcion = dineroARepartir / cajasRestantes;
            
            // Repartimos en el objeto saldos
            llavesRestantes.forEach(llave => {
                saldoCajita[llave] += porcion;
            });
            
            alert(`Se repartieron $${dineroARepartir.toFixed(2)} entre las ${cajasRestantes} cajas restantes.`);
        }
        
        actualizarInterfazCajitas();

        localStorage.setItem('config_cajas', JSON.stringify(cajitas));
        localStorage.setItem('saldo_cajitas', JSON.stringify(saldoCajita));

        location.reload();
    }
}

//---------------------------Codigo para crear y configurar la grafica de la pagina de cajas----------------------------------------------------------------------------------------------

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

//---------------------------Codigo para crear y configurar la linea del tiempo en la pagina de Gastos----------------------------------------------------------------------------------------------
const datosTarj = JSON.parse(localStorage.getItem('config-datos')) || [
    {
        name : "Corte de tarjeta Sears",
        descripcion : "El dia de corte de la tarjeta de Sears",
        fecha : "01/05/2026",
        classTarjeta : 'Sears'
    },
    {
        name : "Corte de tarjeta Banamex",
        descripcion : "El dia de corte de la tarjeta de Banamex",
        fecha : "05/05/2026",
        classTarjeta : 'Banamex'
    },
    {
        name : "Pago de BBVA",
        descripcion : "El dia de pago de la tarjeta de BBVA",
        fecha : "06/05/2026",
        classTarjeta : 'BBVA'
    },
    {
        name : "Pago al tio",
        descripcion : "El dia de pago a la deuda del tio",
        fecha : "09/05/2026",
        classTarjeta : 'Otros'
    },
    {
        name : "Corte de tarjeta Nu",
        descripcion : "El dia de corte de la tarjeta Nu",
        fecha : "16/05/2026",
        classTarjeta : 'Nu'
    },
    {
        name : "Corte de tarjeta BBVA",
        descripcion : "El dia de corte de la tarjeta BBVA",
        fecha : "16/05/2026",
        classTarjeta : 'BBVA'
    },
    {
        name : "Pago de tarjeta Banamex",
        descripcion : "El dia de pago de la tarjeta de Banamex",
        fecha : "25/05/2026",
        classTarjeta : 'Banamex'
    },
     {
        name : "Pago de tarjeta Nu",
        descripcion : "El dia de pago de la tarjeta Nu",
        fecha : "26/05/2026",
        classTarjeta : 'Nu'
    },
    {
        name : "Pago de tarjeta Sears",
        descripcion : "El dia de pago de la tarjeta Sears",
        fecha : "26/05/2026",
        classTarjeta : 'Sears'
    },
]

let timeline = document.getElementById('timeline');

function convertirAFecha(stringFecha) {
   const [dia, mes, año] = stringFecha.split('/').map(Number);
   return new Date(año, mes - 1, dia);
}

let html = "";
let ultimoMesAño = "";

// 1. Filtrar y Ordenar
let datosActualizados = false;
const hoyLimpio = new Date();
hoyLimpio.setHours(0,0,0,0);

datosTarj.forEach(evento => {
    let fechaEvento = convertirAFecha(evento.fecha);

    // Si la fecha del evento ya se quedó en el pasado
    if (fechaEvento < hoyLimpio) {
        // Magia: Le adelantamos exactamente 1 mes hacia el futuro
        fechaEvento.setMonth(fechaEvento.getMonth() + 1);

        // Reconstruimos el texto al formato DD/MM/YYYY para tu HTML
        let dia = String(fechaEvento.getDate()).padStart(2, '0');
        let mes = String(fechaEvento.getMonth() + 1).padStart(2, '0');
        let año = fechaEvento.getFullYear();

        evento.fecha = `${dia}/${mes}/${año}`;
        datosActualizados = true; // Activamos la bandera de que hubo cambios
    }
});

// Guardamos las fechas actualizadas en el disco duro para no hacer esto cada vez
if (datosActualizados) {
    localStorage.setItem('config-datos', JSON.stringify(datosTarj));
}

// 2. EL INTERRUPTOR: Filtramos y Ordenamos
const eventosFuturos = datosTarj.filter(d => {
    // Revisamos si el evento pertenece a una tarjeta real en tu base de datos
    
    let gastosFrescos = JSON.parse(localStorage.getItem('config_gastos')) || {};
    let tarjetaAsociada = gastosFrescos[d.classTarjeta];

    // Freno de mano: Si es una tarjeta y NO hay deudas (lista vacía), NO lo mostramos
    if (tarjetaAsociada && tarjetaAsociada.lista.length === 0) {
        return false; 
    }

    // Si sí hay deuda (o es otro tipo de evento), lo mostramos normal
    return convertirAFecha(d.fecha) >= hoyLimpio;

}).sort((a, b) => convertirAFecha(a.fecha) - convertirAFecha(b.fecha));

let estadosBancos = {};

// 2. Construir con separadores de Mes/Año
eventosFuturos.forEach(pers => {
    const fechaObj = convertirAFecha(pers.fecha);
    const mesAñoActual = fechaObj.toLocaleString('es-MX', { month: 'long', year: 'numeric' });

    // Si el mes cambió respecto al anterior, agregamos un título
    if (mesAñoActual !== ultimoMesAño) {
        html += `<div class="timeline-month">${mesAñoActual.toUpperCase()}</div>`;
        ultimoMesAño = mesAñoActual;
    }

    const hoyLimpio = new Date();
        hoyLimpio.setHours(0, 0, 0, 0);

// Dentro de tu bucle, después de crear fechaObj:
    const fechaEventoLimpia = new Date(fechaObj);
        fechaEventoLimpia.setHours(0, 0, 0, 0)

    let diff = Math.abs(fechaEventoLimpia - hoyLimpio);
    let diffTotal = Math.floor(diff / (1000 * 60 * 60 * 24))
    let aviso = "";

    if (diffTotal === 3) {
         aviso = "proxima";
    } else {
        if(diffTotal <= 2) {
            aviso= "urgente";
        } 
    } 

    html += `
        <div class='child ${aviso}'>
            <div class='content ${pers.classTarjeta}'>
                <h4>${pers.name}</h4>
                <p>${pers.descripcion}</p>
                <p><em>${pers.fecha}</em></p>
            </div>
        </div>`;

    let nombreBanco = "";
    if (pers.classTarjeta.includes("Sears")) nombreBanco = "Sears";
    if (pers.classTarjeta.includes("BBVA")) nombreBanco = "BBVA";
    if (pers.classTarjeta.includes("Nu")) nombreBanco = "Nu";
    if (pers.classTarjeta.includes("Banamex")) nombreBanco = "Banamex";

    // 3. Si encontramos un banco y el evento es urgente/próximo, lo guardamos
    if (nombreBanco !== "" && aviso !== "") {
        // Solo guardamos si es más importante que lo que ya había 
        // (Urgente le gana a Próxima)
        if (aviso === "urgente" || estadosBancos[nombreBanco] !== "urgente") {
            estadosBancos[nombreBanco] = aviso;
        }
    }
});

function actualizarChips(estados) {
    // Recorremos el objeto de estados que creamos arriba
    for (let banco in estados) {
        let nivelAlerta = estados[banco]; // Esto será "urgente" o "proxima"
        
        // Buscamos el chip por su ID (Recuerda ponerle ID a tus chips en el HTML)
        let chipElemento = document.getElementById(`chip-${banco}`);
        
        if (chipElemento) {
            // Aplicamos la clase que hiciste en CSS (chip-urgente o chip-proxima)
            chipElemento.classList.add(`chips-${nivelAlerta}`);
        }
    }
}

if (timeline) {
timeline.innerHTML = html;
actualizarChips(estadosBancos);
}

let _items = document.querySelectorAll(".child")

_items.forEach(element =>{
    if(element.offsetTop < 500)
        element.classList.add('_show')
})

const items = document.querySelectorAll('.child');

// 2. Configuramos el observador
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Si entra en pantalla, mostramos
            entry.target.classList.add('_show');
            entry.target.classList.remove('_hide');
        } else {
            // Opcional: si quieres que se escondan al salir
            entry.target.classList.add('_hide');
            entry.target.classList.remove('_show');
        }
    });
}, {
    threshold: 0.2, // Se activa cuando el 20% de la tarjeta es visible
    rootMargin: "0px 50px 0px 50px" // Margen para que cargue un poco antes
});

// 3. Empezamos a observar cada item
items.forEach(item => observer.observe(item));

const formGastos = document.getElementById('evento-form')

function crearEventoNuevo() {

    let nombEv = document.getElementById('nombr-nuevo').value;
    let descrbEv = document.getElementById('descr-event').value;
    let fechaEv = document.getElementById('fecha-event').value;
    let idEv = document.getElementById('tipo-gasto').value;


    let partes = fechaEv.split('-'); // Esto crea ['2026', '05', '08']
    let fechaFormateada = `${partes[2]}/${partes[1]}/${partes[0]}`;

    let nuevoEv = {
        name : nombEv,
        descripcion : descrbEv,
        fecha : fechaFormateada,
        classTarjeta : idEv
    }

    if (nuevoEv.trim !== "" && descrbEv !== "") {
        datosTarj.push(nuevoEv);
    }

    localStorage.setItem('config-datos', JSON.stringify(datosTarj));
    location.reload();
}

if(formGastos) {
        formGastos.addEventListener('submit', e=>{
            e.preventDefault();
            crearEventoNuevo();     
    })
}

//---------------------------Codigo para cambiar de seccion por tarjetas----------------------------------------------------------------------------------------------
window.addEventListener("hashchange", () => {
    // Quitamos la clase 'activa' de cualquier tarjeta que la tenga
    document.querySelector('.seccion-tarjeta.activa')?.classList.remove('activa');
});

let saldosGlobal = JSON.parse(localStorage.getItem('saldo_cajitas')) || [];
let vistaGlobal = document.getElementById('deuda-total');

let totalgastos = JSON.parse(localStorage.getItem('config_gastos')) || {
    Nu : { fechaCorte : 16,
        credito : 12000,
        lista : []
    },
    BBVA : { fechaCorte : 16,
        credito : 16100,
        lista : []
    },
    Banamex : { fechaCorte : 5,
        credito : 8900,
        lista : []
    },
    Sears : { fechaCorte : 1,
        credito : 16000,
        lista : []
    },
    Otros : { lista : []
    },
}

const formGastosG = document.getElementById('gasto-form');

function ingresarGastos() {

    let infoGastos = new FormData(formGastosG);
    // El nombre del gasto
    let infoGasto = infoGastos.get('gasto');
    // El monto total de gasto
    let infoMonto = infoGastos.get('monto');
    // El metodo de pago
    let infoMetodo = infoGastos.get('metodo');
    // La cantidad a MSI
    let infoMeses = infoGastos.get('cantidad-meses');
    // El tipo de tarjeta usada
    let infoTipo = infoGastos.get('tipo-gas');

    let limite = 0;
 
    limite = totalgastos[infoTipo].lista.reduce((acumulado, item) => {
        return acumulado + Number(item.montoT);
    }, 0)

    let proximaDeuda = limite + Number(infoMonto)

    if (proximaDeuda > totalgastos[infoTipo].credito) {
            alert("Has alcanzado el limite de credito")
            return;
        }

   const mesesnum = Number(infoMeses) || 1;
    let montoMeses = (infoMonto / mesesnum);

    function calcularFechaFinal(fechaInicio, mesesASumar) {
        // Crear una copia para no modificar la fecha original
        let fechaFin = new Date(fechaInicio);
        // setMonth maneja automáticamente el cambio de año
        fechaFin.setMonth(fechaFin.getMonth() + mesesASumar);
    
        return fechaFin;
}
const mesFinal = mesesnum === 1 ? 0 : mesesnum;
const diaActual = new Date().getDate();
let finCompra = "";
let fechaInicio = new Date();
if (diaActual <= totalgastos[infoTipo].fechaCorte) {
    finCompra = calcularFechaFinal(Date.now(), mesFinal);
} else {
    fechaInicio.setMonth(fechaInicio.getMonth() + 1)
    finCompra = calcularFechaFinal(fechaInicio, mesFinal);
}

const nombreMes = finCompra.toLocaleString('es-MX', { month: 'long' });
const mes = nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);

    let gastoNuevo = {
        gasto : infoGasto,
        montoT : Number(infoMonto),
        montoMSI : montoMeses.toFixed(2),
        tiempoMSi : infoMetodo === 'contado' ? 1 : infoMeses,
        fechaL : mes,
        metodoP : infoMetodo,
        mensualidadesPagadas : 0,
        montoPorPagar : Number(infoMonto),
}

totalgastos[infoTipo].lista.push(gastoNuevo);

localStorage.setItem('config_gastos', JSON.stringify(totalgastos));

    location.reload();
}

 if(formGastosG) {

    formGastosG.addEventListener('submit', function(evt) {
        evt.preventDefault();
        ingresarGastos();
    })
}

function crearInterfazGasto() {

    for (const llave in totalgastos) {

    let tarjetaG = document.querySelector(`.contenedor-${llave}`); 

    if(tarjetaG) {
        tarjetaG.innerHTML = "";

        totalgastos[llave].lista.forEach((gastoIndividual, index) => {

            let porcentajeBarra = (gastoIndividual.mensualidadesPagadas / gastoIndividual.tiempoMSi) * 100;
                if (porcentajeBarra > 100) porcentajeBarra = 100;

            let htmlGasto = `<li>
                        <div class="header-gasto">
                            <h3 class="titulo-tarj">${gastoIndividual.gasto}</h3>
        
                            <label class="checkbox">
                                <input type="checkbox" data-tarjeta="${llave}" data-indice="${index}">
                                    <span class="custom-checkmark"></span>
                            </label>
                        </div>
                        <div class="descrip-g">
                            <div class="monto-principal-contenedor">
                                <span>Monto por Pagar: $${gastoIndividual.montoPorPagar.toFixed(2)}</span>
                            </div>
                    
                            <div class="montos-secundarios-contenedor">
                                <span>Monto Total: $${gastoIndividual.montoT}</span>
                                <span>Saldo a Meses: $${gastoIndividual.montoMSI}</span>
                            </div>
                        </div>
                        <div class="descrip-deuda">
                            <span>Tiempo Restante:</span>
                            <span>${gastoIndividual.mensualidadesPagadas}/${gastoIndividual.tiempoMSi} (${gastoIndividual.fechaL})</span>
                        </div>

                        <div class="progress-barg">
                            <div class="progress-fillg" style="width: ${porcentajeBarra}%"></div>  
                            </div>
                        </div>
                </li>`

                

                tarjetaG.innerHTML += htmlGasto;

            })
        }
}
}

function actualizarInterfazGasto() {
    for(const llave in totalgastos) {
    let inicioBarra = document.getElementById(`barraDeudas-${llave}`)

        if(inicioBarra) {
            inicioBarra.innerHTML = "";

        let totales = totalgastos[llave].lista.reduce((acumulado, item) => {
            acumulado.mensual += Number(item.montoMSI);
            acumulado.totalDeuda += Number(item.montoPorPagar);
            return acumulado;
        }, { mensual: 0, totalDeuda: 0,});
            
        let mostrarTotal = document.getElementById(`duedaTotal-${llave}`);

        if (mostrarTotal) {
            mostrarTotal.textContent = `Pago mensual: $${totales.mensual.toFixed(2)}`;
        }
        
        let mostrarTotalD = document.getElementById(`duedaTotalD-${llave}`);

        if (mostrarTotalD) {
            mostrarTotalD.textContent = `Monto total a Pagar: $${totales.totalDeuda.toFixed(2)}`;
        }

        let porcentajeTotal = ( totales.totalDeuda / totalgastos[llave].credito) * 100;
        if (porcentajeTotal > 100) porcentajeTotal = 100;

        if(porcentajeTotal) {
        let htmlB = `<div class="progress-fillf" style="width: ${porcentajeTotal}%"></div>`
        inicioBarra.innerHTML = htmlB;
        }
        }
    }
}

function actualizarDatosInicio() {

    let sumaGlobal = 0;
    for(const llaves in totalgastos) {
     let subtotalTarjeta = totalgastos[llaves].lista.reduce((total, item) => {
            return total + Number(item.montoMSI);
        }, 0);

    sumaGlobal += subtotalTarjeta;
}

    let guardarSuma = localStorage.setItem('saldo_gastos', JSON.stringify(sumaGlobal));

    let configCajasInicio = JSON.parse(localStorage.getItem('config_cajas')) || {};

    let idCajaGastos = Object.keys(configCajasInicio).find(llave => {
    let nombreLimpio = (configCajasInicio[llave].nombre || "").trim().toLowerCase();
    return nombreLimpio === 'gastos mensuales';
});

// 3. Usamos la llave dinámica para sacar el dinero. 
// Si la caja no existe (idCajaGastos es undefined), usamos el fallback de 0.
    let dineroGastDiarios = idCajaGastos ? (saldosGlobal[idCajaGastos] || 0) : 0;

    let html = "";

    html += `<p id="deuda-total">${Math.floor(dineroGastDiarios)}/${sumaGlobal}$</p>` 
    
    vistaGlobal.innerHTML = html;

    let porcentajeBarra = (dineroGastDiarios / sumaGlobal) *100;

    let barra = document.getElementById('gastos-totalesf')
        if (barra) {
            barra.style.width = `${porcentajeBarra}%`;
        }
}

function pagarGastos() {
    let gastosCheck = document.querySelectorAll('.checkbox input[type="checkbox"]:checked')
    
    gastosCheck.forEach(checkbox => {
        let tarjetaSeleccionada = checkbox.dataset.tarjeta; 
        console.log(tarjetaSeleccionada);
        let posicionGasto = checkbox.dataset.indice;
console.log(posicionGasto);
    // 2. Apuntamos directamente a ese gasto en tu base de datos
        let gastoObjetivo = totalgastos[tarjetaSeleccionada].lista[posicionGasto];
        console.log(gastoObjetivo);
        

    // 3. Modificas las propiedades de ese gasto (sumar mes, restar saldo)
        gastoObjetivo.mensualidadesPagadas += 1;
        gastoObjetivo.montoPorPagar -= gastoObjetivo.montoMSI
        })

        for(const llave in totalgastos) {
            totalgastos[llave].lista = totalgastos[llave].lista.filter(item => {
            return item.mensualidadesPagadas < item.tiempoMSi
        });
        }
        location.reload();
    
    localStorage.setItem('config_gastos', JSON.stringify(totalgastos));
    actualizarInterfazGasto();
    actualizarDatosInicio();
}