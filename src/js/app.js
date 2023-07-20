let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

//OBJETO DE CITAS
const cita = {
  id: "",
  nombre: "",
  fecha: "",
  hora: "",
  servicios: [],
};

document.addEventListener("DOMContentLoaded", function () {
  iniciarApp();
});

function iniciarApp() {
  mostrarMenu();
  tabs();
  botonesPaginador();
  paginaAnterior();
  paginaSiguiente();
  consultarAPI();
  idCliente(); //SE OBTIENE EL ID DEL USUARIO
  nombreCliente();
  fechaCita();
  horaCita();
  mostrarResumen();

  //EVENTOS DEL LOGIN
  loginEvent();
}

function tabs() {
  // Agrega y cambia la variable de paso según el tab seleccionado
  const botones = document.querySelectorAll(".tabs button");
  botones.forEach((boton) => {
    boton.addEventListener("click", (e) => {
      paso = parseInt(e.target.dataset.paso);
      mostrarMenu();
      botonesPaginador();
    });
  });
}

function mostrarMenu() {
  // Ocultar la sección que tenga la clase de mostrar
  const seccionAnterior = document.querySelector(".mostrar");
  if (seccionAnterior) {
    seccionAnterior.classList.remove("mostrar");
  }

  // Seleccionar la sección con el paso...
  const pasoSelector = `#paso-${paso}`;
  const seccion = document.querySelector(pasoSelector);
  seccion.classList.add("mostrar");

  // Quita la clase de actual al tab anterior
  const tabAnterior = document.querySelector(".actual");
  if (tabAnterior) {
    tabAnterior.classList.remove("actual");
  }

  // Resalta el tab actual
  const tab = document.querySelector(`[data-paso="${paso}"]`);
  tab.classList.add("actual");
}

function botonesPaginador() {
  const paginaAnterior = document.querySelector("#anterior");
  const paginaSiguiente = document.querySelector("#siguiente");

  if (paso === 1) {
    paginaAnterior.classList.add("ocultar");
    paginaSiguiente.classList.remove("ocultar");
  } else if (paso === 3) {
    paginaAnterior.classList.remove("ocultar");
    paginaSiguiente.classList.add("ocultar");
    mostrarResumen();
  } else {
    paginaAnterior.classList.remove("ocultar");
    paginaSiguiente.classList.remove("ocultar");
  }

  mostrarMenu();
}

function paginaAnterior() {
  const paginaAnterior = document.querySelector("#anterior");
  paginaAnterior.addEventListener("click", function () {
    if (paso <= pasoInicial) return;
    paso--;

    botonesPaginador();
  });
}

function paginaSiguiente() {
  const paginaSiguiente = document.querySelector("#siguiente");
  paginaSiguiente.addEventListener("click", function () {
    if (paso >= pasoFinal) return;
    paso++;

    botonesPaginador();
  });
}

async function consultarAPI() {
  try {
    const url = "http://localhost:3000/api/servicios";
    const resultado = await fetch(url);
    const servicios = await resultado.json();

    mostrarServicios(servicios);
  } catch (error) {
    console.log(error);
  }
}

function mostrarServicios(servicios) {
  servicios.forEach((servicio) => {
    const { id, nombre, precio } = servicio;

    const nombreServicio = document.createElement("P");
    nombreServicio.classList.add("nombre-servicio");
    nombreServicio.textContent = nombre;

    const precioServicio = document.createElement("P");
    precioServicio.classList.add("precio-servicio");
    precioServicio.textContent = `$${precio}`;

    const servicioDiv = document.createElement("DIV");
    servicioDiv.classList.add("servicio");
    servicioDiv.dataset.idServicio = id;
    servicioDiv.onclick = function () {
      seleccionarServicio(servicio);
    };

    servicioDiv.appendChild(nombreServicio);
    servicioDiv.appendChild(precioServicio);

    document.querySelector("#servicios").appendChild(servicioDiv);
  });
}

function seleccionarServicio(servicio) {
  const { id } = servicio;
  const { servicios } = cita;

  // Identificar el elemento al que se le da click
  const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);

  // Comprobar si un servicio ya fue agregado
  if (servicios.some((agregado) => agregado.id === id)) {
    // SOBREESCRIBE LOS SERVICIOS DEL OBJETO CON LOS DATOS QUE SEAN DIFERENTES AL ID DEL PRODUCTO QUE SE DESEA QUITAR
    cita.servicios = servicios.filter((agregado) => agregado.id !== id);
    divServicio.classList.remove("seleccionado");
  } else {
    // Agregarlo
    cita.servicios = [...servicios, servicio];
    divServicio.classList.add("seleccionado");
  }
}

function nombreCliente() {
  cita.nombre = document.querySelector("#nombre").value;
}

function idCliente() {
  cita.id = document.querySelector("#id").value;
}

function fechaCita() {
  const fechaFormulario = document.querySelector("#fecha");

  fechaFormulario.addEventListener("input", (e) => {
    //BOTIENE EL DIA DE LA SEMAN EN NUMERO
    const dia = new Date(e.target.value).getUTCDay();

    //VERIFICA SI EL DATO DIA ESTA INCLUIDO EN EL ARRAY
    if ([6, 0].includes(dia)) {
      //SI ES ASI ELIMINA LA FECHA SELECCIONADA
      mostrarAlerta("Dias no laborables", "error", ".formulario");
      e.target.value = "";
    } else {
      //LO AGREGA A NUESTRO OBJETO CITA
      cita.fecha = e.target.value;
    }
  });
}

function horaCita() {
  const hora = document.querySelector("#hora");
  hora.addEventListener("input", (e) => {
    const hora = e.target.value;

    //DESCOMPONE NUESTRO ARRAY DE HORA EN DOS DATOS [10,15]
    const arrayHora = hora.split(":")[0];

    if (arrayHora < 10 || arrayHora > 19) {
      e.target.value = "";
      mostrarAlerta("Hora no válida", "error", ".formulario");
    } else {
      cita.hora = e.target.value;
    }
  });
}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true) {
  //VERIFICAMOS QUE NO EXISTA YA LA ALERTA
  const alertaInicio = document.querySelector(".alerta");
  if (alertaInicio) {
    alertaInicio.remove();
  }

  // Scripting para crear la alerta
  const alerta = document.createElement("DIV");
  alerta.textContent = mensaje;
  alerta.classList.add("alerta");
  alerta.classList.add(tipo);

  const seleccion = document.querySelector(elemento);
  //EXTRAEMOS EL PRIMER HIJO Y LO AGREGAMOS ANTES
  var inicio = seleccion.firstChild;
  seleccion.insertBefore(alerta, inicio);

  if (desaparece) {
    //BORRAMOS LUEGO DE 300MS
    setTimeout(() => {
      alerta.remove();
    }, 3000);
  }
}

function mostrarResumen() {
  const resumen = document.querySelector(".contenido-resumen");

  while (resumen.firstChild) {
    resumen.removeChild(resumen.firstChild);
  }

  //VERIFICA QUE EL OBJETO NO INCLUYA UN VALOR VACIO
  if (Object.values(cita).includes("") || cita.servicios.length === 0) {
    mostrarAlerta(
      "faltan servicios, fecha u hora",
      "error",
      ".contenido-resumen",
      false
    );

    return;
  }

  const { nombre, fecha, hora, servicios } = cita;

  // Heading para Servicios en Resumen
  const headingServicios = document.createElement("H3");
  headingServicios.textContent = "Resumen de Servicios";
  resumen.appendChild(headingServicios);

  //RECORREMOS EL ARRAY DE SERVICIOS
  servicios.forEach((servicio) => {
    const { id, nombre, precio } = servicio;
    const contenedorServicio = document.createElement("DIV");
    contenedorServicio.classList.add("contenedor-servicio");

    const textoServicio = document.createElement("P");
    textoServicio.textContent = nombre;

    const precioServicio = document.createElement("P");
    precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;

    contenedorServicio.appendChild(textoServicio);
    contenedorServicio.appendChild(precioServicio);

    resumen.appendChild(contenedorServicio);
  });

  // Heading para Cita en Resumen
  const headingCita = document.createElement("H3");
  headingCita.textContent = "Resumen de Cita";
  resumen.appendChild(headingCita);

  const nombreCliente = document.createElement("P");
  nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;

  //FORMATEAMOS LA FECHA  PARA QUE SALGA (DIA/MES/AÑO)
  const fechaObj = new Date(fecha);
  const mes = fechaObj.getMonth();
  const dia = fechaObj.getDate() + 2;
  const year = fechaObj.getFullYear();

  const fechaUTC = new Date(Date.UTC(year, mes, dia));

  //CAMBIA LOS DIAS A TEXTO AL GIAUL QUE LOS MESES
  const opciones = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const fechaFormateada = fechaUTC.toLocaleDateString("es-MX", opciones);

  const fechaCita = document.createElement("P");
  fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;

  const horaCita = document.createElement("P");
  horaCita.innerHTML = `<span>Hora:</span> ${hora} Horas`;

  // Boton para Crear una cita
  const paginacion = document.querySelector(".paginacion");
  const botonReservar = document.createElement("BUTTON");
  botonReservar.classList.add("boton");
  botonReservar.textContent = "Reservar Cita";
  botonReservar.onclick = reservarCita;

  paginacion.appendChild(botonReservar);
  resumen.appendChild(nombreCliente);
  resumen.appendChild(fechaCita);
  resumen.appendChild(horaCita);
}

async function reservarCita() {
  //DESTRUCTION DE CITA
  const { id, nombre, fecha, hora, servicios } = cita;

  const idServicio = servicios.map((servicio) => servicio.id);

  //IMPLEMTAMOS FETCH
  const datos = new FormData();
  datos.append("usuarioId", id);
  datos.append("fecha", fecha);
  datos.append("hora", hora);
  datos.append("servicios", idServicio);

  try {
    //ENLACE CON PHP
    const url = "http://localhost:3000/api/citas";
    const respuesta = await fetch(url, {
      method: "POST",
      body: datos,
    });

    const resumenFinal = await respuesta.json();

    if (resumenFinal.resultado) {
      Swal.fire({
        icon: "success",
        title: "Cita creada",
        text: "Tu cita fue creada correctamente",
        button: "Ok",
      }).then(() => {
        window.location.reload();
      });
    }
  } catch (error) {
    //SI EXITE ALGUN ERROR CON LA PETICION
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Hubo un error al guardar la cita",
      button: "Ok",
    }).then(() => {
      window.location.reload();
    });
  }
}

async function loginEvent() {
  
}
