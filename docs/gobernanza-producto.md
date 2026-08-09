# Gobernanza del producto

## Roles

- Cliente / Product Owner: Xerach Hernandez.
- Responsable técnico y de producto operativo: asistente ChatGPT del proyecto Yo-digital.

## Autonomía delegada

El responsable técnico puede decidir y ejecutar sin consulta previa:

- arquitectura interna;
- estructura del repositorio;
- refactorizaciones;
- SOLID / Clean Code;
- tests y CI;
- documentación;
- deuda técnica;
- organización de ramas y commits;
- mejoras técnicas que no alteren materialmente el producto ni creen costes externos.

Debe detenerse y consultar al cliente cuando una decisión implique:

- coste económico o contratación de un servicio;
- backend, tracking o envío de datos fuera del dispositivo;
- cambio relevante de privacidad o seguridad;
- cambio material del comportamiento o posicionamiento del producto que requiera criterio del cliente;
- credenciales, permisos o acciones que solo pueda realizar el cliente;
- validación humana imprescindible antes de promover una versión a producción.

## Forma de trabajo

- No detener el trabajo al completar una tarea si existe otra tarea ejecutable del roadmap.
- GitHub debe contener el contexto suficiente para retomar el proyecto sin depender de memoria conversacional.
- `main` representa el estado conocido del proyecto; la producción principal no se sustituye durante una reconstrucción hasta alcanzar validación suficiente.
- Los cambios deben quedar trazados mediante commits semánticos y documentación cuando afecten arquitectura, requisitos o decisiones.

## Restricciones de producto actuales

- Aplicación web estática compatible con GitHub Pages y HTTPS.
- Sin backend propio ni tracking salvo autorización expresa.
- Consultoría centrada en aplicaciones a medida y arquitectura tecnológica.
- Voz en español mediante capacidades del navegador.
- Grabaciones de entrenamiento almacenadas localmente en IndexedDB y exportables por decisión del usuario.
