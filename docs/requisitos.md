# Requisitos funcionales base

Estos requisitos describen el comportamiento heredado que debe preservarse durante la reconstrucción.

## RF-01 Modos de consulta
El usuario puede elegir entre:
- App a medida.
- Consultoría/arquitectura.

Cambiar de modo reinicia la sesión de consulta.

## RF-02 Cualificación
Cada modo realiza cinco preguntas. Deben cubrir, como mínimo:
- negocio/contexto;
- problema o dolor;
- volumen/escala;
- stack o herramientas actuales;
- objetivo esperado.

Las preguntas pueden tener variantes para evitar una experiencia repetitiva.

## RF-03 Respuestas
El usuario puede responder por texto y, cuando el navegador lo soporte, por voz.

## RF-04 Resultado
Al completar la cualificación se genera una propuesta con:
- diagnóstico;
- arquitectura/recomendación;
- roadmap;
- siguientes pasos.

## RF-05 Voz de salida
El usuario puede activar o desactivar la lectura hablada de las respuestas mediante `speechSynthesis` cuando esté disponible.

## RF-06 Compatibilidad de voz
El reconocimiento debe usar español (`es-ES`) y degradarse correctamente cuando SpeechRecognition no esté soportado.

## RF-07 Entrenamiento de voz
El usuario puede activar un modo de entrenamiento que permita:
- grabar muestras desde el micrófono;
- visualizar la señal durante la grabación;
- conservar muestras localmente;
- listar y eliminar grabaciones;
- exportar el dataset.

## RF-08 Privacidad
- El chat no debe persistirse en backend propio.
- No se introducirán cookies analíticas ni tracking sin autorización explícita.
- Las muestras de entrenamiento pueden persistir únicamente de forma local en IndexedDB hasta borrado/exportación.

## RF-09 GitHub Pages
La aplicación debe poder desplegarse como sitio estático sobre HTTPS en GitHub Pages.

## RF-10 Responsive
La experiencia principal debe ser utilizable en móvil y escritorio.

## Fuera de alcance actual

- Backend propio.
- Autenticación.
- CRM o almacenamiento remoto de conversaciones.
- LLM remoto.
- Clonación real de voz mediante servicio externo.
- Analytics/tracking.

Cualquier incorporación de estos elementos requiere una decisión de producto explícita.
