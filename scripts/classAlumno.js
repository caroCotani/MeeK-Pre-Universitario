
/*Definimos el molde de nuestros objetos Alumnos con dos métodos.
El primero calcula un promedio ponderado según las notas que se le fueron cargado a cada estudiante
y el segundo método nos devuelve en la condición en la que se encuantra dicho estudiante frente a cierta materia
es decir, si el estudiante aprobó o no la asignatura*/ 

export class Alumno {
  constructor(objeto) {
    this.nombre = objeto.nombre.toUpperCase();
    this.apellido = objeto.apellido.toUpperCase();
    this.materia = objeto.materia.toUpperCase();
    this.nota1 = parseFloat(objeto.nota1);
    this.nota2 = parseFloat(objeto.nota2);
    this.nota3 = parseFloat(objeto.nota3);
    this.nota4 = parseFloat(objeto.nota4);
  }

  
  promedio() {
    return (
      this.nota1 * 0.1 +
      this.nota2 * 0.15 +
      this.nota3 * 0.25 +
      this.nota4 * 0.5
    );
  }

  
  condicion(promedio) {
    return promedio >= 7 ? "Aprobado" : "Desaprobado";
  }

  
}
