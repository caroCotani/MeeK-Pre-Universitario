import * as estudiante from "./classAlumno.js";

/*La función iniciarSesion busca en el archivo usuarios.json al usuario que intenta logiarse, si dicho
usuario coincide con algun objeto de la lista JSON dicho usuario será guardado en el localStorage bajo 
la key "user".Además se habilitará el boton cerrar sesión*/
export function iniciarSesion() {
  let login = document.getElementById("sesion");
  let aux;
  let cerrar = document.getElementById("cerrar");
  
  if (!localStorage.getItem("user")) {
    login.removeAttribute("hidden", "");

    login.addEventListener("click", function (e) {
      e.preventDefault();
      fetch("./assets/data/usuarios.json")
        .then((resp) => resp.json())
        .then((data) => {
          Swal.fire({
            title: "Iniciar sesion",
            html: `<input type="text" id="login" class="swal2-input" placeholder="Username">
                <input type="password" id="password" class="swal2-input" placeholder="Password">`,
            confirmButtonText: "Iniciar",
            focusConfirm: false,
            preConfirm: () => {
              const user = Swal.getPopup().querySelector("#login").value;
              const password = Swal.getPopup().querySelector("#password").value;
              if (!user || !password) {
                Swal.showValidationMessage(
                  `Porfavor ingrese usuario y contraseña`
                );
              }
              aux = { user: user, password: password };

              for (const usuario of data) {
                if (usuario.user == aux.user) {
                  Swal.fire(`Binvenido ${usuario.nombre}`);
                  login.setAttribute("hidden", "");
                  localStorage.setItem("user", JSON.stringify(usuario));
                  cerrar.removeAttribute("hidden", "");
                  cerrar.innerHTML = `<a href=" ">Cerrar</a>`;
                  
                  break;
                } else {
                  Swal.fire(`Usuario y contraseña incorrectos`);
                }
              }
              setTimeout(function () {
                window.location.reload()
              },1500);
            },
          });
        });
    });
  }
}

/*La siguiente función realiza el proceso inverso al de iniciar sesión y elimina del localStorage
la key "user"*/
export function cerrarSesion() {
  let cerrar = document.getElementById("cerrar");
  let inicio = document.getElementById("sesion");
  if (localStorage.getItem("user")) {
    cerrar.removeAttribute("hidden", "");
    cerrar.innerHTML = `<a href=" ">Cerrar</a>`;
    cerrar.addEventListener("click", function (e) {
      e.preventDefault();
      Swal.fire({
        title: "Desea cerrar sesion?",
        showDenyButton: true,
        confirmButtonText: "SI",
        denyButtonText: `NO`,
      }).then((result) => {
        if (result.isConfirmed) {
          cerrar.setAttribute("hidden", "");
          inicio.removeAttribute("hidden", "");
          localStorage.removeItem("user");
          window.location.reload();
        } else if (result.isDenied) {
        }
      });
    });
  }
}
/* Esta función maneja la imagen que "bloquea" a toda la app. Investiga el LocalStorage y busca la key "use",
si la encuentra quiere decir que un usuario inició sesión entonces setea el atributo hidden de la imagen. De lo
contrario, si no existe esa key en el local siguinifica que han cerrado sesión o que aun no ingresa nadie 
por lo tanto se remuebe hidden*/
export function manejoImagen() {
  let fondo = document.getElementById("modal-inicio");
  if (localStorage.getItem("user")) {
    fondo.setAttribute("hidden", "");
  } else {
    fondo.removeAttribute("hidden", "");
  }
}

//Funcion que validad que la nota no sea negativa ni mayor a 10
function validarNota(nota) {
  if (nota < 0 || nota > 10 || isNaN(nota) || !nota) {
    return false;
  } else {
    return true;
  }
}

//Funcion validar ingreso solo String para nombre y apellido de los estudiantes
function validarString(cadena) {
  if (!isNaN(cadena) || cadena == null) {
    return false;
  } else {
    return true;
  }
}

//La siguiente validación comprueba si un alumno ya esta en la lista. No solo se comprueba nombre y apellido
//sino que también se comprueba la materia ya que un mismo alumno puede estar cursando más de una materia
function alumReprtido(nombre, apellido, materia, lista) {
  return lista.some(
    (elem) =>
      elem.nombre == nombre &&
      elem.apellido == apellido &&
      elem.materia == materia
  );
}

/* Con la siguiente función podemos dibujar el DOM de la ventana modal que nos muestra la informaciónde cierto
estudiante solicitado en el buscador */
function modalBuscarAlumno(lista) {
  let tabla = document.getElementById("tablaBuscar");
  tabla.innerHTML = "";
  for (const alum of lista) {
    let tr = document.createElement("tr");
    let prom = alum.promedio();
    let cond = alum.condicion(prom);
    tr.innerHTML = `<td>${alum.apellido}</td>
                    <td>${alum.nombre}</td>
                    <td>${alum.materia}</td>
                    <td>${alum.nota1}</td> 
                    <td>${alum.nota2}</td>
                    <td>${alum.nota3}</td>
                    <td>${alum.nota4}</td>
                    <td>${prom}</td>
                    <td>${cond}</td>`;
    tabla.appendChild(tr);
  }
}

/*Busca a un estudiante que contengan la cadena de caracteres ingresados en el buscador tanto en el nombre 
como en el apellido. Cabe destacar que la lista en la que busca dicho estudiantes es la correspondiente a cada
usuario. Por ejemplo, si se ingreso como matematica solo buscara sobre alumnos que cursan matematica, pero si se
ingresó como admin entonces buscara entre todos los estudiantes de todo el instituto*/
export function buscarAlumno(lista) {
  let busacador = document.getElementById("formBuscar");
  let divModal = document.getElementById("divBuscar");
  let cerrar = document.getElementById("cerrarModal");
  busacador.addEventListener("submit", function (e) {
    e.preventDefault();
    let imput = document.getElementById("busacar").value.toUpperCase();

    if (
      lista.some(
        (alumno) =>
          alumno.nombre.includes(imput) || alumno.apellido.includes(imput)
      )
    ) {
      let alumnosEncontrado = lista.filter(
        (alumno) =>
          alumno.nombre.includes(imput) || alumno.apellido.includes(imput)
      );
      modalBuscarAlumno(alumnosEncontrado);
      divModal.removeAttribute("hidden", "");
      busacador.reset();
    } else {
      Swal.fire({
        icon: 'error',
        text: `No se ha encontrado ningún estuiante en la lista`
      })
      
    }
  });
  cerrar.addEventListener("click", function (e) {
    e.preventDefault();
    divModal.setAttribute("hidden", "");
  });
}

/* Esta función tambien dibuja en el DOM pero a diferencia de la anterior, esta dibuja en la tabla principal
a los estudiantes y agrega a cada uno los botones editar y eliminar*/
export function agregarTabla(lista) {
  let tabla = document.getElementById("tablaAgregados");
  let idAlumno = localStorage.length;
  let num = 0;
  for (const alum of lista) {
    let tr = document.createElement("tr");
    let prom = alum.promedio();
    let cond = alum.condicion(prom);
    tr.id = `alum${idAlumno}`;
    num = idAlumno - 1;
    tr.className = "filas";
    tr.innerHTML = `<td>${num} </td>
                    <td class="alum${idAlumno}">${alum.apellido}</td>
                    <td class="alum${idAlumno}">${alum.nombre}</td>
                    <td class="alum${idAlumno}">${alum.materia}</td>
                    <td class="alum${idAlumno}">${alum.nota1}</td> 
                    <td class="alum${idAlumno}">${alum.nota2}</td>
                    <td class="alum${idAlumno}">${alum.nota3}</td>
                    <td class="alum${idAlumno}">${alum.nota4}</td>
                    <td class="alum${idAlumno}">${prom}</td>
                    <td class="alum${idAlumno}">${cond}</td>
                    <td><button type="button" class="btn btn-dark" id="edit${idAlumno}">Editar</button></td>
                    <td><button type="button" class="btn btn-danger" id="elim${idAlumno}">Eliminar</button></td>`;
    tabla.appendChild(tr);
    idAlumno++;
  }
}

/* Aqui escribiremos la lista de las materias en el boton del nav Materias y en el selec del formulario según
las materias disponibles en el JSON de materias.
Si el usuario es un profesor espesifico en el formulario solo se habilitará la materia que le corresponde.
Además el boton Materias del nav,que sólo estará habilitado para el administrador, lo que hace es agrupar
a los estudiantes por materias*/
export function materiaDOM(lista, usuario) {
  let porMateria = [];

  let divTabla = document.getElementById("alumnosCondicion");
  let divTablaGeneral = document.getElementById("tablaAlumnos");
  let titulo = document.getElementById("titulocondicion");
  let btnVolver = document.getElementById("btnTodos");
  let materia = document.getElementById("materia");

  if (usuario.materia != null) {
    let opcMateria = document.createElement("option");
    opcMateria.innerHTML = usuario.materia;
    materia.appendChild(opcMateria);
  }
  fetch("./assets/data/materias.json")
    .then((resp) => resp.json())
    .then((data) => {
      let i = 0;
      for (const mat of data) {
        //listado de materias en el boton selec
        if (usuario.materia == null) {
          let opcion = document.createElement("option");
          opcion.innerHTML = `${mat}`;
          materia.appendChild(opcion);
        }

        //listado de materias en el nav
        let materiaNav = document.getElementById("materiaNav");
        let li = document.createElement("li");
        li.className = "liMateria";
        li.id = `mat${i++}`;
        li.innerHTML = `<a href="">${mat}</a>`;

        materiaNav.appendChild(li);
        li.addEventListener("click", function (e) {
          e.preventDefault();
          if (lista.some((alum) => alum.materia == mat)) {
            porMateria = lista.filter((alum) => alum.materia == mat);
            titulo.innerText = `Estudiantes cursando la materia ${mat}`;
            DOMsubtabla(porMateria);
            divTabla.removeAttribute("hidden", "");
            divTablaGeneral.setAttribute("hidden", "");

            btnVolver.addEventListener("click", function (e) {
              e.preventDefault();
              volver();
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: `No se encuentra ningún estudiante cursando la materia ${mat}`,
            });
          }
        });
      }
    });
}

/* En la siguiente función validamos los datos ingresados por fomularios, y si son correctos agregamos el nuevo
estudiante a nuestra lista de trabajo,lo guardamos en el localStorage y lo dibujamos en nustra tabla a traves
de la función agregar tabla*/
export function guardarAlumno(lista) {
  let formulario = document.getElementById("formularioAlumno");
  let alum;
  let alumAux;
  formulario.addEventListener("submit", (evento) => {
    let listAux = [];
    evento.preventDefault();
    let nombre1 = document.getElementById("nombre").value;
    let apellido1 = document.getElementById("apellido").value;
    let materia1 = document.getElementById("materia").value;
    let nota11 = document.getElementById("nota1").value;
    let nota12 = document.getElementById("nota2").value;
    let nota13 = document.getElementById("nota3").value;
    let nota14 = document.getElementById("nota4").value;
    let errorNom = document.getElementById("errorNom");
    let errorApe = document.getElementById("errorApe");
    let errorMat = document.getElementById("errorMat");
    let errorN1 = document.getElementById("errorN1");
    let errorN2 = document.getElementById("errorN2");
    let errorN3 = document.getElementById("errorN3");
    let errorN4 = document.getElementById("errorN4");
    errorNom.innerHTML = "";
    errorApe.innerHTML = "";
    errorMat.innerHTML = "";
    errorN1.innerHTML = "";
    errorN2.innerHTML = "";
    errorN3.innerHTML = "";
    errorN4.innerHTML = "";

    if (!validarString(nombre1)) {
      errorNom.innerText = "Ingrese nombre válido";
    } else if (!validarString(apellido1)) {
      errorApe.innerText = "Ingrese apellido válido";
    } else if (!validarString(materia1)) {
      errorMat.innerText = "Ingrese materia válido";
    } else if (!validarNota(nota11)) {
      errorN1.innerText = "Ingrese nota válido";
    } else if (!validarNota(nota12)) {
      errorN2.innerText = "Ingrese nota válido";
    } else if (!validarNota(nota13)) {
      errorN3.innerText = "Ingrese nota válido";
    } else if (!validarNota(nota14)) {
      errorN4.innerText = "Ingrese nota válido";
    } else {
      alumAux = {
        nombre: nombre1,
        apellido: apellido1,
        materia: materia1,
        nota1: nota11,
        nota2: nota12,
        nota3: nota13,
        nota4: nota14,
      };
      alum = new estudiante.Alumno(alumAux);
      listAux.push(alum);
      Swal.fire({
        position: "top",
        icon: "success",
        title: "Estudiante guardado con éxito",
        showConfirmButton: false,
        timer: 2000,
      });
      setTimeout(function () {
        window.location.reload()
      },2000);
     
      formulario.reset();

      if (lista.length == 1) {
        let divBorrar = document.getElementById("borrarTabla");
        divBorrar.innerHTML =
          '<button type="button" class="btn btn-danger" button id="btnTabla">Eliminar Estudiantes</button>';
      }
      if (alumReprtido(alum.nombre, alum.apellido, alum.materia, lista)) {
        Swal.fire({
          title: "El estudiante ya Existe en la lista ",
          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp",
          },
        });
      } else {
        agregarTabla(listAux);
        lista.push(alum);
        let local = [];
        if (localStorage.getItem("listaAlumnos")) {
          local = JSON.parse(localStorage.getItem("listaAlumnos"));
          local.push(alum);
          setLocal(local);
        } else {
          setLocal(listAux);
        }
      }
    }
  });
}

//Funcion guardar lista de alumnos en LocalStorage
const setLocal = (lista) => {
  localStorage.setItem("listaAlumnos", JSON.stringify(lista));
};

/* Aqui usaremos esta función para dibujar la tabla que nos mostrará a los alumnos agrupados ya 
sea por materias o por condición(aprobados o desaprobados)*/
function DOMsubtabla(lista) {
  let tabla = document.getElementById("tablaCondicion");
  tabla.innerHTML = "";
  for (const alum of lista) {
    let tr = document.createElement("tr");
    let prom = alum.promedio();
    let cond = alum.condicion(prom);
    tr.innerHTML = `<td>${alum.apellido}</td>
                    <td>${alum.nombre}</td>
                    <td>${alum.materia}</td>
                    <td>${alum.nota1}</td> 
                    <td>${alum.nota2}</td>
                    <td>${alum.nota3}</td>
                    <td>${alum.nota4}</td>
                    <td>${prom}</td>
                    <td>${cond}</td>`;
    tabla.appendChild(tr);
  }
}

/*La función condición nos permite realizar dos listas, una con los alumnos aprobado y una con los alumnos
en condición de desaprobados (recordar que se trabaja con la lista de estudiantes correspondiente 
a cada usuario). Aqui se analiza la tabla donde estan todos los estudiantes dibujados debido a que los 
alumnos como objetos no tienen atributo condición sino que es un metodo de dicho objeto, entonces
debemos filtrar a los alumnos a través de la tabla. Además aqui definimos los eventos para que se muestren
dichas listas en la tabla auxiliar y ocultando la tabla principal de los alumnos y el evento para volver 
a la  tabla principal*/
export function condicion(lista) {
  let aprobados = [];
  let desaprobados = [];

  let estudiante;
  let apellido;
  let nombre;
  let materia;
  let condicion;
  let btnaprobado = document.getElementById("aprobados");
  let btndesaprobado = document.getElementById("desaprobados");
  let btntodos = document.getElementById("todos");
  let tabla = document.getElementById("tablaAgregados");
  let filas = tabla.getElementsByClassName("filas");
  let divTabla = document.getElementById("alumnosCondicion");
  let divTablaGeneral = document.getElementById("tablaAlumnos");
  let titulo = document.getElementById("titulocondicion");
  let btnVolver = document.getElementById("btnTodos");

  for (let i = 2; i < filas.length + 2; i++) {
    estudiante = document.getElementsByClassName(`alum${i}`);
    apellido = estudiante[0].textContent;
    nombre = estudiante[1].textContent;
    materia = estudiante[2].textContent;
    condicion = estudiante[8].textContent;
    if (condicion == "Aprobado") {
      for (const iter of lista) {
        if (
          iter.apellido === apellido &&
          iter.nombre === nombre &&
          iter.materia === materia
        ) {
          aprobados.push(iter);
        }
      }
    } else {
      for (const iter of lista) {
        if (
          iter.apellido === apellido &&
          iter.nombre === nombre &&
          iter.materia === materia
        ) {
          desaprobados.push(iter);
        }
      }
    }
  }

  btnaprobado.onclick = (e) => {
    e.preventDefault();
    titulo.innerText = "Etudiantes Aprobados";
    DOMsubtabla(aprobados);
    divTabla.removeAttribute("hidden", "");
    divTablaGeneral.setAttribute("hidden", "");
  };

  btndesaprobado.onclick = (e) => {
    e.preventDefault();
    titulo.innerText = "Estudiantes Desaprobados";
    DOMsubtabla(desaprobados);
    divTabla.removeAttribute("hidden", "");
    divTablaGeneral.setAttribute("hidden", "");
  };

  btntodos.addEventListener("click", (e) => {
    e.preventDefault();
    volver();
  });

  btnVolver.addEventListener("click", (e) => {
    e.preventDefault();
    volver();
  });
}
//Funcion que habilita la tabla auxiliar y inhabilita la tabla principal
function volver() {
  let divTabla = document.getElementById("alumnosCondicion");
  let divTablaGeneral = document.getElementById("tablaAlumnos");
  divTabla.setAttribute("hidden", "");
  divTablaGeneral.removeAttribute("hidden", "");
}

//Funcion eliminar a todos los estudiantes de la tabla
export function eliminarTabla() {
  let boton = document.getElementById("borrarTabla");
  boton.addEventListener("click", () => {
    Swal.fire({
      title: "¿Desea borrar la lista de estudiantes?",
      text: "Se borrá por completo la lista",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Borrado", "", "success");
        localStorage.removeItem("listaAlumnos");
        setTimeout(function () {
          window.location.reload()
        },1500);
      }
    });
  });
}

//Función para ordenar a la lista por orden alfabético según el apellido de los estudiantes
function ordenPorApellido(lista) {
  lista.sort((o1, o2) => {
    if (o1.apellido > o2.apellido) {
      return 1;
    } else if (o1.apellido < o2.apellido) {
      return -1;
    } else {
      return 0;
    }
  });
  return lista;
}
/* Con la siguiente función realizamos el evento del boton ordenar por apellido a los estudiantes en la tabla*/
export function OrdenAlfabetico() {
  let boton1 = document.getElementById("ordenTabla");
  let lista = [];
  let auxlista = [];
  lista = JSON.parse(localStorage.getItem("listaAlumnos"));
  for (const alumno of ordenPorApellido(lista)) {
    auxlista.push(new estudiante.Alumno(alumno));
  }
  boton1.addEventListener("click", () => {
    localStorage.removeItem("listaAlumnos");
    setLocal(auxlista);
    DOMsubtabla(auxlista);
    window.location.reload();
  });
}

/*Aqui definimos los eventos para eliminar y editar aca estudiante.
El evento editar nos permitirá editar las notas de un estudiante específico y el evento eliminar, como lo
dice el boton eliminará a cierto estudiante*/
export function editarEliminarEstudiante(lista) {
  let tabla = document.getElementById("tablaAgregados");
  let filas = tabla.getElementsByClassName("filas");
  let estudiante;
  let editar;
  let eliminar;
  let nombre;
  let apellido;
  let materia;
  let aux;
  for (let i = 2; i < filas.length + 2; i++) {
    editar = document.getElementById(`edit${i}`);
    eliminar = document.getElementById(`elim${i}`);

    editar.onclick = function () {
      estudiante = document.getElementsByClassName(`alum${i}`);
      apellido = estudiante[0].textContent.toLocaleUpperCase();
      nombre = estudiante[1].textContent.toLocaleUpperCase();
      materia = estudiante[2].textContent.toLocaleUpperCase();

      for (const iter of lista) {
        if (
          iter.apellido === apellido &&
          iter.nombre === nombre &&
          iter.materia === materia
        ) {
          Swal.fire({
            title:
              `${iter.nombre} ${iter.apellido}\n` + ` Materia: ${iter.materia}`,
            html: `<input type="text" id="p1" class="swal2-input" placeholder="Parcial 1">
                <input type="text" id="p2" class="swal2-input" placeholder="Parcial 2">
                <input type="text" id="f1" class="swal2-input" placeholder="Final 1">
                <input type="text" id="f2" class="swal2-input" placeholder="Final 2">`,
            confirmButtonText: "Editar",

            preConfirm: () => {
              iter.nota1 = parseInt(document.getElementById("p1").value);
              iter.nota2 = parseInt(document.getElementById("p2").value);
              iter.nota3 = parseInt(document.getElementById("f1").value);
              iter.nota4 = parseInt(document.getElementById("f2").value);
              localStorage.removeItem("listaAlumnos");
              setLocal(lista);
              tabla.innerHTML = "";
              agregarTabla(lista);
            },
          });
        }
      }
    };

    eliminar.addEventListener("click", () => {
      estudiante = document.getElementsByClassName(`alum${i}`);
      apellido = estudiante[0].textContent.toLocaleUpperCase();
      nombre = estudiante[1].textContent.toLocaleUpperCase();
      materia = estudiante[2].textContent.toLocaleUpperCase();
      for (const iter of lista) {
        if (
          iter.apellido === apellido &&
          iter.nombre === nombre &&
          iter.materia === materia
        ) {
          aux = iter;
        }
      }

      Swal.fire({
        title: `Usted eliminará al estudiante `,
        showDenyButton: true,
        confirmButtonText: "OK",
        denyButtonText: `Cancelar`,
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("Eliminado!", "", "success");
          let index = lista.indexOf(aux);
          if (index !== -1) {
            lista.splice(index, 1);
          }
          localStorage.removeItem("listaAlumnos");
          setLocal(lista);
          agregarTabla(lista);
        }
        setTimeout(function () {
          window.location.reload()
        },1500);
      });
    });
  }
}
