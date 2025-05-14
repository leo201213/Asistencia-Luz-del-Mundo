// ----------------------
// 🔁 Mapeo de claves internas para los trimestres
// ----------------------

// Un objeto literal que mapea el nombre legible del trimestre a una clave corta interna (string)
const clavesTrimestre = {
    "1er Trimestre": "t1",
    "2do Trimestre": "t2",
    "3er Trimestre": "t3"
};

// Otro objeto literal, pero esta vez mapea de clave interna a nombre completo
const nombresTrimestre = {
    t1: "1er Trimestre",
    t2: "2do Trimestre",
    t3: "3er Trimestre"
};

// ----------------------
// 🔐 Variable booleana que indica si el modo administrador está activo
// ----------------------
let modoAdministradorActivo = false;

// ----------------------
// 🔑 Función para activar el modo administrador solicitando una contraseña
// ----------------------
function activarModoAdministrador() {
    // prompt() muestra un cuadro de entrada de texto y devuelve lo que el usuario escribe
    const contraseña = prompt("Introduce la contraseña de administrador:");

    // Condicional if-else para validar la contraseña
    if (contraseña === "admin123") {
        // Si es correcta, activamos el modo admin
        modoAdministradorActivo = true;
        alert("Modo administrador activado.");
    } else {
        alert("Contraseña incorrecta.");
    }
}

// ----------------------
// 🧰 Función para mostrar el panel de administración (interfaz de selección)
// ----------------------
function mostrarPanelAdministrador() {
    // Verificamos si el modo administrador está activo
    if (!modoAdministradorActivo) {
        alert("Debes activar el modo administrador.");
        return; // interrumpe la ejecución de la función si no se cumple la condición
    }

    // Seleccionamos el elemento del DOM donde se mostrará el contenido dinámico
    const contenido = document.getElementById('contenido');

    // Insertamos directamente HTML dentro del contenedor con innerHTML
    contenido.innerHTML = `
        <h2>🛠 Panel de Administración</h2>
        <p>Selecciona la carrera, año y trimestre que deseas reiniciar.</p>
        <label>Carrera:
            <select id="adminCarrera">
                <option>Sistemas Informáticos</option>
                <option>Electrónica</option>
                <option>Transformación de Alimentos</option>
                <option>Contaduría General</option>
            </select>
        </label>
        <br><br>
        <label>Año:
            <select id="adminAnio">
                <option>4to</option>
                <option>5to</option>
                <option>6to</option>
            </select>
        </label>
        <br><br>
        <label>Trimestre:
            <select id="adminTrimestre">
                <option>1er Trimestre</option>
                <option>2do Trimestre</option>
                <option>3er Trimestre</option>
            </select>
        </label>
        <br><br>
        <button onclick="reiniciarDesdePanel()" class="boton" style="background-color: #d9534f;">❌ Eliminar datos</button>
    `;
}

// ----------------------
// 🧹 Función que elimina los datos almacenados para una combinación específica
// ----------------------
function reiniciarDesdePanel() {
    // Obtenemos los valores seleccionados por el administrador
    const carrera = document.getElementById('adminCarrera').value;
    const anio = document.getElementById('adminAnio').value;
    const trimestre = document.getElementById('adminTrimestre').value;

    // Creamos la clave completa que se utiliza como identificador único en localStorage
    const clave = `${carrera}_${anio}_${trimestre}`;

    // confirm() muestra una ventana de confirmación (OK o Cancelar)
    const confirmar = confirm(`¿Seguro que deseas eliminar todos los datos de asistencia para:\n\n${clave} ?`);
    if (!confirmar) return; // si se cancela, detenemos la función

    // Eliminamos del almacenamiento local la lista de estudiantes y las fechas
    localStorage.removeItem(clave);
    localStorage.removeItem(clave + '_fechas');

    alert(`Datos eliminados para ${clave}`);
    mostrarAnios(carrera); // Volvemos a la vista de los años para esa carrera
}

// ----------------------
// 📋 Función que crea una lista por defecto con 45 estudiantes ficticios
// ----------------------
function crearListaEstudiantesPorDefecto() {
    const estudiantes = [];

    // for loop: itera del 1 al 45
    for (let i = 1; i <= 45; i++) {
        estudiantes.push({
            nombre: `Estudiante ${i}`,
            asistencia: {} // objeto vacío que almacenará fechas como claves y ✓/X como valores
        });
    }

    return estudiantes;
}

// ----------------------
// 🗂 Función que muestra los años escolares disponibles para una carrera
// ----------------------
function mostrarAnios(carrera) {
    const contenido = document.getElementById('contenido');
    contenido.innerHTML = `
        <h2>${carrera}</h2>
        <div class='cuadricula'>
            <div class="tarjeta" onclick="mostrarTrimestres('${carrera}', '4to')">4to de Secundaria</div>
            <div class="tarjeta" onclick="mostrarTrimestres('${carrera}', '5to')">5to de Secundaria</div>
            <div class="tarjeta" onclick="mostrarTrimestres('${carrera}', '6to')">6to de Secundaria</div>
        </div>`;
}

// ----------------------
// 🧭 Función que muestra los tres trimestres disponibles para un año y carrera
// ----------------------
function mostrarTrimestres(carrera, anio) {
    const contenido = document.getElementById('contenido');
    contenido.innerHTML = `
        <h2>${carrera} - ${anio}</h2>
        <div class='cuadricula'>
            <div class="tarjeta" onclick="mostrarTablaAsistencia('${carrera}', '${anio}', '1er Trimestre')">1er Trimestre</div>
            <div class="tarjeta" onclick="mostrarTablaAsistencia('${carrera}', '${anio}', '2do Trimestre')">2do Trimestre</div>
            <div class="tarjeta" onclick="mostrarTablaAsistencia('${carrera}', '${anio}', '3er Trimestre')">3er Trimestre</div>
        </div>`;
}
// Esta función permite reiniciar (eliminar) los datos de asistencia de una combinación específica de carrera, año y trimestre
function reiniciarDesdePanel() {
    // Obtenemos los valores seleccionados del panel de administración usando la propiedad `.value`
    const carrera = document.getElementById('adminCarrera').value;
    const anio = document.getElementById('adminAnio').value;
    const trimestre = document.getElementById('adminTrimestre').value;

    // Creamos una clave única concatenando los valores seleccionados
    // Esta clave será usada para identificar los datos en `localStorage`
    const clave = `${carrera}_${anio}_${trimestre}`;

    // Confirmamos con el usuario si realmente desea eliminar los datos
    const confirmar = confirm(`¿Seguro que deseas eliminar todos los datos de asistencia para:\n\n${clave} ?`);
    if (!confirmar) return; // Si el usuario cancela, terminamos la función

    // Eliminamos los datos del almacenamiento local usando `localStorage.removeItem`
    localStorage.removeItem(clave); // Elimina la lista de estudiantes
    localStorage.removeItem(clave + '_fechas'); // Elimina las fechas asociadas

    alert(`Datos eliminados para ${clave}`); // Mostramos confirmación
    mostrarAnios(carrera); // Redirigimos a la vista de años de esa carrera
}

// Esta función genera una lista por defecto de 45 estudiantes con nombres genéricos y sin asistencia
function crearListaEstudiantesPorDefecto() {
    const estudiantes = []; // Creamos un arreglo vacío
    for (let i = 1; i <= 45; i++) {
        // Usamos `push` para insertar objetos con nombre y un objeto vacío para la asistencia
        estudiantes.push({
            nombre: `Estudiante ${i}`,
            asistencia: {} // Objeto vacío que se llenará con las fechas y marcas
        });
    }
    return estudiantes; // Retornamos la lista generada
}

// Esta función muestra los años escolares para una carrera seleccionada
function mostrarAnios(carrera) {
    const contenido = document.getElementById('contenido'); // Obtenemos el contenedor principal

    // Inyectamos HTML dinámicamente al contenedor
    contenido.innerHTML = `
        <h2>${carrera}</h2>
        <div class='cuadricula'>
            <div class="tarjeta" onclick="mostrarTrimestres('${carrera}', '4to')">4to de Secundaria</div>
            <div class="tarjeta" onclick="mostrarTrimestres('${carrera}', '5to')">5to de Secundaria</div>
            <div class="tarjeta" onclick="mostrarTrimestres('${carrera}', '6to')">6to de Secundaria</div>
        </div>`;
}

// Esta función muestra los trimestres disponibles para una carrera y año seleccionados
function mostrarTrimestres(carrera, anio) {
    const contenido = document.getElementById('contenido'); // Referencia al div principal

    // Se genera el contenido HTML con tarjetas que permiten elegir cada trimestre
    contenido.innerHTML = `
        <h2>${carrera} - ${anio}</h2>
        <div class='cuadricula'>
            <div class="tarjeta" onclick="mostrarTablaAsistencia('${carrera}', '${anio}', '1er Trimestre')">1er Trimestre</div>
            <div class="tarjeta" onclick="mostrarTablaAsistencia('${carrera}', '${anio}', '2do Trimestre')">2do Trimestre</div>
            <div class="tarjeta" onclick="mostrarTablaAsistencia('${carrera}', '${anio}', '3er Trimestre')">3er Trimestre</div>
        </div>`;
}
/******************************************************************
 * FUNCIONES PARA ACTUALIZAR, EDITAR Y ELIMINAR DATOS DE ASISTENCIA
 ******************************************************************/

/*
 * Función: actualizarAsistencia
 * Descripción: Actualiza el estado de asistencia de un estudiante específico para una fecha dada.
 * Parámetros:
 *   - claveAlmacenamiento: string que identifica el grupo de estudiantes (ej: 'Sistemas_4to_t1').
 *   - indiceEstudiante: posición del estudiante en la lista (índice del array).
 *   - fecha: string que representa la fecha a actualizar (ej: '2025-05-06').
 *   - valor: string que puede ser "✓", "X" o "" para indicar presente, ausente o sin marcar.
 */
function actualizarAsistencia(claveAlmacenamiento, indiceEstudiante, fecha, valor) {
    // Obtiene la lista de estudiantes desde el localStorage (como string)
    const listaEstudiantes = JSON.parse(localStorage.getItem(claveAlmacenamiento));

    // Modifica el valor de asistencia para la fecha indicada en el estudiante seleccionado
    listaEstudiantes[indiceEstudiante].asistencia[fecha] = valor;

    // Guarda la lista actualizada en localStorage, convirtiendo el objeto en string
    localStorage.setItem(claveAlmacenamiento, JSON.stringify(listaEstudiantes));
}

/*
 * Función: actualizarNombreEstudiante
 * Descripción: Cambia el nombre de un estudiante según su posición en el array.
 * Parámetros:
 *   - claveAlmacenamiento: string que identifica al grupo (como 'Contaduria_6to_t2').
 *   - indiceEstudiante: número (posición en la lista de estudiantes).
 *   - nuevoNombre: string con el nuevo nombre que se desea asignar.
 */
function actualizarNombreEstudiante(claveAlmacenamiento, indiceEstudiante, nuevoNombre) {
    // Carga los estudiantes del almacenamiento local
    const listaEstudiantes = JSON.parse(localStorage.getItem(claveAlmacenamiento));

    // Cambia el nombre del estudiante
    listaEstudiantes[indiceEstudiante].nombre = nuevoNombre;

    // Guarda la lista con el nombre actualizado
    localStorage.setItem(claveAlmacenamiento, JSON.stringify(listaEstudiantes));
}

/*
 * Función: eliminarFecha
 * Descripción: Elimina una fecha del registro de asistencia y remueve ese dato para todos los estudiantes.
 * Parámetros:
 *   - claveAlmacenamiento: string del grupo (ej. 'Electronica_5to_t3').
 *   - indiceFecha: índice (posición) de la fecha a eliminar en el array de fechas.
 */
function eliminarFecha(claveAlmacenamiento, indiceFecha) {
    // Obtiene el array de fechas del almacenamiento o lo inicializa vacío si no existe
    const fechas = JSON.parse(localStorage.getItem(claveAlmacenamiento + '_fechas')) || [];

    // Elimina la fecha en la posición indicada del array
    const fechaEliminada = fechas.splice(indiceFecha, 1)[0]; // [0] obtiene el string eliminado

    // Actualiza el array de fechas en el almacenamiento
    localStorage.setItem(claveAlmacenamiento + '_fechas', JSON.stringify(fechas));

    // Obtiene la lista actual de estudiantes
    const listaEstudiantes = JSON.parse(localStorage.getItem(claveAlmacenamiento));

    // Recorre a cada estudiante y elimina la propiedad de asistencia correspondiente a la fecha
    listaEstudiantes.forEach(estudiante => {
        // delete es una palabra clave de JavaScript que elimina una propiedad de un objeto
        delete estudiante.asistencia[fechaEliminada];
    });

    // Guarda la lista de estudiantes sin la fecha eliminada
    localStorage.setItem(claveAlmacenamiento, JSON.stringify(listaEstudiantes));

    // Extrae los datos de carrera, año y trimestre desde la clave (ej. 'Transformacion_6to_t2')
    const [carrera, anio, claveTrimestre] = claveAlmacenamiento.split('_');

    // Vuelve a mostrar la tabla actualizada, usando el nombre real del trimestre
    mostrarTablaAsistencia(carrera, anio, nombresTrimestre[claveTrimestre]);
}

function mostrarTablaAsistencia(carrera, anio, trimestre) {
    const contenido = document.getElementById('contenido');
    contenido.innerHTML = `<h2>${carrera} - ${anio} - ${trimestre}</h2>`;

    const claveTrimestre = clavesTrimestre[trimestre];
    const claveAlmacenamiento = `${carrera}_${anio}_${claveTrimestre}`;

    // Cargar estudiantes
    let listaEstudiantes = JSON.parse(localStorage.getItem(claveAlmacenamiento));
    if (!listaEstudiantes) {
        listaEstudiantes = crearListaEstudiantesPorDefecto(); // genera 45 estudiantes
        localStorage.setItem(claveAlmacenamiento, JSON.stringify(listaEstudiantes));
    }

    // Cargar fechas
    const fechas = JSON.parse(localStorage.getItem(claveAlmacenamiento + '_fechas')) || [];

    // ✅ Bloque para agregar fechas si está activo el modo administrador
    if (modoAdministradorActivo) {
        const contenedorFecha = document.createElement('div');
        contenedorFecha.style.margin = '1rem 0';

        const entradaFecha = document.createElement('input');
        entradaFecha.type = 'date';
        entradaFecha.valueAsDate = new Date();
        entradaFecha.style.marginRight = '0.5rem';
        entradaFecha.className = 'boton';

        const botonAgregarFecha = document.createElement('button');
        botonAgregarFecha.textContent = 'Agregar Fecha';
        botonAgregarFecha.className = 'boton';

        // ✅ Evento correctamente asignado (sin duplicar)
        botonAgregarFecha.onclick = () => {
            const fechaSeleccionada = entradaFecha.value;
            if (fechaSeleccionada) {
                const [anioStr, mesStr, diaStr] = fechaSeleccionada.split('-');
                const fechaObjeto = new Date(parseInt(anioStr), parseInt(mesStr) - 1, parseInt(diaStr));

                const dia = String(fechaObjeto.getDate()).padStart(2, '0');
                const mes = String(fechaObjeto.getMonth() + 1).padStart(2, '0');
                const anioFecha = fechaObjeto.getFullYear();
                const fechaFormateada = `${dia}/${mes}/${anioFecha}`; // DD/MM/YYYY

                let fechasActualizadas = JSON.parse(localStorage.getItem(claveAlmacenamiento + '_fechas')) || [];

                if (!fechasActualizadas.includes(fechaFormateada)) {
                    fechasActualizadas.push(fechaFormateada);
                    localStorage.setItem(claveAlmacenamiento + '_fechas', JSON.stringify(fechasActualizadas));

                    // ✅ Volvemos a cargar la tabla con la nueva fecha
                    mostrarTablaAsistencia(carrera, anio, trimestre);
                } else {
                    alert("Esa fecha ya está en la lista.");
                }
            }
        };

        contenedorFecha.appendChild(entradaFecha);
        contenedorFecha.appendChild(botonAgregarFecha);
        contenido.appendChild(contenedorFecha);
    }

    // Crear tabla
    const tabla = document.createElement('table');

    // ---------- ENCABEZADO ----------
    const encabezado = document.createElement('thead');
    let filaEncabezado = '<tr><th>#</th><th>Nombre</th>';

    fechas.forEach((fecha, indiceFecha) => {
        if (modoAdministradorActivo) {
            filaEncabezado += `<th>${fecha}<br>
                <button onclick="eliminarFecha('${claveAlmacenamiento}', ${indiceFecha})" style="font-size:10px; color:red;">Eliminar</button>
            </th>`;
        } else {
            filaEncabezado += `<th>${fecha}</th>`;
        }
    });

    filaEncabezado += '</tr>';
    encabezado.innerHTML = filaEncabezado;
    tabla.appendChild(encabezado);

    // ---------- CUERPO ----------
    const cuerpo = document.createElement('tbody');

    listaEstudiantes.forEach((estudiante, indice) => {
        const fila = document.createElement('tr');

        let celdaNombre;
        if (modoAdministradorActivo) {
            celdaNombre = `<input type="text" value="${estudiante.nombre}" 
                onchange="actualizarNombreEstudiante('${claveAlmacenamiento}', ${indice}, this.value)" 
                style="width: 100%; border: none; background: transparent; font-weight: bold;">`;
        } else {
            celdaNombre = estudiante.nombre;
        }

        let contenidoFila = `<td>${indice + 1}</td><td>${celdaNombre}</td>`;

        fechas.forEach(fecha => {
            const marca = estudiante.asistencia[fecha] || '';

            if (modoAdministradorActivo) {
                contenidoFila += `<td><select onchange="actualizarAsistencia('${claveAlmacenamiento}', ${indice}, '${fecha}', this.value)">
                    <option value=""></option>
                    <option value="✓" ${marca === '✓' ? 'selected' : ''}>✓</option>
                    <option value="X" ${marca === 'X' ? 'selected' : ''}>X</option>
                </select></td>`;
            } else {
                contenidoFila += `<td class="${marca === '✓' ? 'verde' : marca === 'X' ? 'rojo' : ''}">${marca}</td>`;
            }
        });

        fila.innerHTML = contenidoFila;
        cuerpo.appendChild(fila);
    });

    tabla.appendChild(cuerpo);
    contenido.appendChild(tabla);
}