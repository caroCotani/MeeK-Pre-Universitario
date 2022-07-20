import * as estudiante from "./classAlumno.js";
import * as fun from "./utilidades.js";
document.addEventListener("DOMContentLoaded", function () {
  /* Bienvenidos a MeeK preUniversitario.
  La siquiente aplicación es una aplicación que simula el guardado de alumnos de una institución con sus
  respectivas calificaciones y condiciones que se encuentran en una determinada materia
  */
  /* Realizamos el llamado de la función iniciar sesión, cerrar sesión y manejo de la imagen que "bloquea" 
 a la aplicación web*/
  fun.iniciarSesion();
  fun.cerrarSesion();
  fun.manejoImagen();

  /*
 Se crea una lista de alumnos en la cual se guardaran los estudiantes correspondientes a una materia 
 o a todos los estudiantes que se encuentran en el LocalStorage dependiendo del usuario que inicio sesión 
 */
  let listaAlumno = [];
  let bntMateriasNav = document.getElementById("nav-materias");
  let usuario = JSON.parse(localStorage.getItem("user"));
  if (localStorage.getItem("listaAlumnos")) {
    let aux = JSON.parse(localStorage.getItem("listaAlumnos"));
    for (const alumno of aux) {
      if (usuario.materia == null) {
        listaAlumno.push(new estudiante.Alumno(alumno));
      } else if (usuario.materia == alumno.materia) {
        listaAlumno.push(new estudiante.Alumno(alumno));
      }
    }
    fun.agregarTabla(listaAlumno);
    let divBorrar = document.getElementById("borrarTabla");
    divBorrar.innerHTML =
      '<button type="button" class="btn btn-danger" button id="btnTabla">Eliminar Estudiantes</button>';
  }
  /*Si es usuario no es el administrador no tendra acceso a TODOS los estudiantes sino que sólo podra trabajar
con aquellos que se encuentra en su curso, es por eso que la opcion de agrupar estudiantes por materias 
no podrá utilizar entonces se desabilita dicho boton. Además mostramos en el DOM la información del usuario*/
  let divAside = document.getElementById("aside-user");
  let infoUser = document.createElement("p");
  if (usuario.materia != null) {
    bntMateriasNav.setAttribute("hidden", "");
    infoUser.innerText = `${usuario.nombre} ${usuario.apellido} \n Encargado docente de: ${usuario.materia}
                          Email: ${usuario.email}`;
    divAside.appendChild(infoUser);
  }else{
    infoUser.innerText = `${usuario.nombre} ${usuario.apellido} \n Encargada de Administración
                          Email: ${usuario.email}`;
    divAside.appendChild(infoUser);
  }

  
  
  

  /*Se hace el llamado de todas las funciones necesarias para el funcionamiento de la aplicación*/
  fun.materiaDOM(listaAlumno, usuario);
  fun.guardarAlumno(listaAlumno);

  fun.eliminarTabla();
  fun.OrdenAlfabetico();
  fun.editarEliminarEstudiante(listaAlumno);
  fun.condicion(listaAlumno);
  fun.buscarAlumno(listaAlumno);
});
