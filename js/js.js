// 🔁 Mapeo de claves internas para los trimestres
// ----------------------

// Este objeto relaciona los nombres legibles de los trimestres con claves internas más cortas
// que se utilizan como identificadores únicos para los documentos en Firestore.
const clavesTrimestre = {
    "1er Trimestre": "t1",
    "2do Trimestre": "t2",
    "3er Trimestre": "t3"
};

// Este objeto es el inverso de 'clavesTrimestre' y se utiliza para mostrar los nombres legibles
// de los trimestres a partir de sus claves internas.
const nombresTrimestre = {
    t1: "1er Trimestre",
    t2: "2do Trimestre",
    t3: "3er Trimestre"
};

// Esta variable controla si el modo administrador está activado.
// Solo el administrador puede realizar acciones como agregar fechas o modificar asistencia.
let modoAdministradorActivo = false;

// ----------------------
// 🔐 Función para activar el modo administrador
// ----------------------

function activarModoAdministrador() {
    // Solicita al usuario una contraseña mediante un cuadro emergente
    const contrasena = prompt("Introduce la contraseña de administrador:");

    // Verifica si la contraseña ingresada es igual a 'admin123'
    if (contrasena === "admin123") {
        // Activa el modo administrador
        modoAdministradorActivo = true;
        alert("Modo administrador activado.");
    } else {
        // Si la contraseña es incorrecta, muestra un mensaje de error
        alert("Contraseña incorrecta.");
    }
}

// ----------------------
// 🧑‍🎓 Función para crear una lista predeterminada de 45 estudiantes
// ----------------------

function crearListaEstudiantesPorDefecto() {
    const estudiantes = [];
    // Bucle for: se repite desde 1 hasta 45
    for (let i = 1; i <= 45; i++) {
        // .push(): método de los arrays que agrega un nuevo elemento al final
        // Se agrega un objeto con dos propiedades:
        // nombre: un texto como "Estudiante 1", "Estudiante 2", etc.
        // asistencia: un objeto vacío que luego almacenará las marcas de asistencia por fecha
        estudiantes.push({ nombre: `Estudiante ${i}`, asistencia: {} });
    }
    return estudiantes; // Devuelve el arreglo completo de 45 estudiantes
}

// ----------------------
// 📚 Función para mostrar los años disponibles según la carrera seleccionada
// ----------------------

function mostrarAnios(carrera) {
    // document.getElementById(): método del DOM que selecciona un elemento HTML por su ID
    const contenido = document.getElementById('contenido');

    // .innerHTML: propiedad que permite reemplazar el contenido HTML de un elemento
    // En este caso, se inserta HTML con tres tarjetas para seleccionar los años escolares
    contenido.innerHTML = `
      <h2>${carrera}</h2>
      <div class='cuadricula'>
        <div class="tarjeta" onclick="mostrarTrimestres('${carrera}', '4to')">4to de Secundaria</div>
        <div class="tarjeta" onclick="mostrarTrimestres('${carrera}', '5to')">5to de Secundaria</div>
        <div class="tarjeta" onclick="mostrarTrimestres('${carrera}', '6to')">6to de Secundaria</div>
      </div>`;
}

// ----------------------
// 📅 Función para mostrar los trimestres disponibles según la carrera y el año
// ----------------------

function mostrarTrimestres(carrera, anio) {
    const contenido = document.getElementById('contenido');

    // Muestra tres botones (tarjetas) para seleccionar los trimestres de un año específico
    contenido.innerHTML = `
      <h2>${carrera} - ${anio}</h2>
      <div class='cuadricula'>
        <div class="tarjeta" onclick="mostrarTablaAsistencia('${carrera}', '${anio}', '1er Trimestre')">1er Trimestre</div>
        <div class="tarjeta" onclick="mostrarTablaAsistencia('${carrera}', '${anio}', '2do Trimestre')">2do Trimestre</div>
        <div class="tarjeta" onclick="mostrarTablaAsistencia('${carrera}', '${anio}', '3er Trimestre')">3er Trimestre</div>
      </div>`;
}
/**
 * Función principal que muestra la tabla de asistencia para un grupo específico.
 * Carga datos de Firestore, crea la tabla con fechas y estudiantes,
 * y maneja la interfaz para agregar fechas y marcar asistencia si el modo admin está activo.
 */
async function mostrarTablaAsistencia(carrera, anio, trimestre) {
    const contenido = document.getElementById('contenido');
    contenido.innerHTML = `<h2>${carrera} - ${anio} - ${trimestre}</h2>`; // Título de la tabla

    const clave = `${carrera}_${anio}_${clavesTrimestre[trimestre]}`; // Clave para Firestore
    const docRef = window.db.collection("asistencia").doc(clave); // Referencia al documento Firestore

    let datos;
    const snap = await docRef.get(); // Obtener documento de Firestore (espera la respuesta)
    if (snap.exists) {
        datos = snap.data(); // Si existe, obtener los datos
    } else {
        datos = {
            estudiantes: crearListaEstudiantesPorDefecto(), // Si no existe, crear lista por defecto
            fechas: [] // Y lista vacía de fechas
        };
        await docRef.set(datos); // Guardar datos iniciales en Firestore
    }

    // Si el modo administrador está activo, mostrar controles para agregar fechas
    if (modoAdministradorActivo) {
        const contenedorFecha = document.createElement('div'); // Crear un contenedor nuevo para fechas
        contenedorFecha.style.margin = '1rem 0'; // Margen arriba y abajo

        const entradaFecha = document.createElement('input'); // Crear input para seleccionar fecha
        entradaFecha.type = 'date'; // Tipo input: selector de fecha
        entradaFecha.valueAsDate = new Date(); // Valor por defecto: hoy
        entradaFecha.className = 'boton'; // Clase para estilizar como botón
        entradaFecha.style.marginRight = '0.5rem'; // Margen derecho para separar del botón

        const botonAgregarFecha = document.createElement('button'); // Crear botón para agregar fecha
        botonAgregarFecha.textContent = 'Agregar Fecha'; // Texto del botón
        botonAgregarFecha.className = 'boton'; // Clase CSS para estilos

        // Al hacer clic, agrega la fecha seleccionada si no está ya en la lista
        botonAgregarFecha.onclick = async() => {
            // La fecha viene en formato 'YYYY-MM-DD', la convertimos a 'DD/MM/YYYY'
            const fecha = entradaFecha.value.split('-').reverse().join('/');
            if (!datos.fechas.includes(fecha)) { // Verificar si la fecha no existe ya
                datos.fechas.push(fecha); // Agregar la fecha al array
                await docRef.update({ fechas: datos.fechas }); // Actualizar Firestore con nuevas fechas
                mostrarTablaAsistencia(carrera, anio, trimestre); // Recargar tabla para actualizar vista
            } else {
                alert("Esa fecha ya está registrada."); // Mensaje si la fecha ya está en la lista
            }
        };

        contenedorFecha.appendChild(entradaFecha); // Añadir input al contenedor
        contenedorFecha.appendChild(botonAgregarFecha); // Añadir botón al contenedor
        contenido.appendChild(contenedorFecha); // Añadir contenedor al contenido principal
    }

    // Crear tabla HTML para mostrar asistencia
    const tabla = document.createElement('table');
    const encabezado = document.createElement('thead');
    let filaEncabezado = '<tr><th>#</th><th>Nombre</th>'; // Primera fila con columnas # y Nombre

    // Añadir columnas de fechas
    datos.fechas.forEach((fecha, i) => {
        if (modoAdministradorActivo) {
            // En modo admin, mostrar fecha con botón para eliminar fecha
            filaEncabezado += `<th>${fecha}<br><button onclick="eliminarFecha('${clave}', ${i})" style="font-size:10px; color:red;">Eliminar</button></th>`;
        } else {
            // En modo usuario, solo mostrar fecha sin botones
            filaEncabezado += `<th>${fecha}</th>`;
        }
    });
    filaEncabezado += '</tr>';
    encabezado.innerHTML = filaEncabezado;
    tabla.appendChild(encabezado);

    // Crear cuerpo de la tabla para estudiantes y sus asistencias
    const cuerpo = document.createElement('tbody');

    // Por cada estudiante, crear una fila
    datos.estudiantes.forEach((est, i) => {
        const fila = document.createElement('tr');
        // Si modo admin activo, el nombre se muestra en un input editable
        let celdaNombre = modoAdministradorActivo ?
            `<input type="text" value="${est.nombre}" onchange="actualizarNombreEstudiante('${clave}', ${i}, this.value)" style="width: 100%; border: none; background: transparent; font-weight: bold;">` :
            est.nombre; // Si no, se muestra texto simple

        let contenidoFila = `<td>${i + 1}</td><td>${celdaNombre}</td>`; // Número y nombre del estudiante

        // Por cada fecha, mostrar asistencia o selector para cambiarla
        datos.fechas.forEach(fecha => {
            const marca = est.asistencia[fecha] || ''; // Obtener marca de asistencia para esa fecha (✓, X o vacío)
            if (modoAdministradorActivo) {
                // En admin, mostrar selector para marcar asistencia
                contenidoFila += `<td><select onchange="actualizarAsistencia('${clave}', ${i}, '${fecha}', this.value)">
                    <option value=""></option>
                    <option value="✓" ${marca === '✓' ? 'selected' : ''}>✓</option>
                    <option value="X" ${marca === 'X' ? 'selected' : ''}>X</option>
                </select></td>`;
            } else {
                // En usuario, solo mostrar la marca con color según tipo
                contenidoFila += `<td class="${marca === '✓' ? 'verde' : marca === 'X' ? 'rojo' : ''}">${marca}</td>`;
            }
        });

        fila.innerHTML = contenidoFila; // Insertar la fila completa en HTML
        cuerpo.appendChild(fila); // Añadir fila al cuerpo de la tabla
    });

    tabla.appendChild(cuerpo); // Añadir cuerpo a la tabla
    contenido.appendChild(tabla); // Mostrar tabla en el contenido principal
}

/**
 * Actualiza la asistencia de un estudiante en Firestore.
 * @param {string} clave - Documento Firestore (clave única).
 * @param {number} i - Índice del estudiante en el array.
 * @param {string} fecha - Fecha específica a modificar.
 * @param {string} valor - Nueva marca de asistencia ('✓', 'X' o '').
 */
async function actualizarAsistencia(clave, i, fecha, valor) {
    const ref = window.db.collection("asistencia").doc(clave); // Referencia al documento
    const snap = await ref.get(); // Obtener documento
    if (!snap.exists) return; // Si no existe, salir
    const data = snap.data(); // Obtener datos actuales
    data.estudiantes[i].asistencia[fecha] = valor; // Actualizar la asistencia en el objeto
    await ref.update({ estudiantes: data.estudiantes }); // Guardar cambios en Firestore
}

/**
 * Actualiza el nombre de un estudiante en Firestore.
 * @param {string} clave - Documento Firestore.
 * @param {number} i - Índice del estudiante.
 * @param {string} nombre - Nuevo nombre para el estudiante.
 */
async function actualizarNombreEstudiante(clave, i, nombre) {
    const ref = window.db.collection("asistencia").doc(clave);
    const snap = await ref.get();
    if (!snap.exists) return;
    const data = snap.data();
    data.estudiantes[i].nombre = nombre; // Cambiar nombre
    await ref.update({ estudiantes: data.estudiantes });
}

/**
 * Elimina una fecha de asistencia de Firestore y de todos los estudiantes.
 * @param {string} clave - Documento Firestore.
 * @param {number} iFecha - Índice de la fecha a eliminar.
 */
async function eliminarFecha(clave, iFecha) {
    const ref = window.db.collection("asistencia").doc(clave);
    const snap = await ref.get();
    if (!snap.exists) return;
    const data = snap.data();
    const fechaEliminada = data.fechas.splice(iFecha, 1)[0]; // Remover fecha del array
    data.estudiantes.forEach(e => delete e.asistencia[fechaEliminada]); // Eliminar la marca en cada estudiante
    await ref.update({ fechas: data.fechas, estudiantes: data.estudiantes }); // Actualizar Firestore

    // Extraer carrera, año y trimestre para recargar la tabla actualizada
    const [carrera, anio, codTri] = clave.split('_');
    mostrarTablaAsistencia(carrera, anio, nombresTrimestre[codTri]);
}