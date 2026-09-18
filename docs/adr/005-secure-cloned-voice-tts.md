# ADR-005 · Integración segura de TTS con voz clonada

Estado: **aceptado para la reconstrucción / endpoint seguro pendiente de despliegue**  
Fecha: 2026-09-18

## Contexto

El propietario ha autorizado y ejecutado una prueba externa de clonación de su propia voz con Fish Audio. La prueba ha producido una voz privada reutilizable y la calidad percibida por el propietario es buena.

La aplicación sigue publicada como sitio estático en GitHub Pages. Por tanto, una credencial privada del proveedor no puede formar parte del JavaScript cliente, del HTML publicado ni del repositorio.

El audio generado por TTS debe poder reutilizarse posteriormente por un motor de lip-sync, por lo que `speechSynthesis` deja de ser suficiente como única salida de voz.

## Decisión

La aplicación cliente no se acoplará a Fish Audio ni conocerá sus credenciales o el identificador privado de la voz.

Se introduce un puerto/adaptador HTTP genérico de TTS con este contrato:

1. el cliente envía únicamente el texto a un endpoint HTTPS configurado;
2. el endpoint seguro custodia credenciales, identificador de voz y parámetros específicos del proveedor;
3. el endpoint devuelve audio;
4. el cliente reproduce ese audio y expone el `Blob`/Object URL a los callbacks de la aplicación;
5. si el endpoint no está configurado o falla antes de iniciar la reproducción, se utiliza `BrowserSpeechSynthesizer` como fallback.

La pronunciación del nombre visible `Xerach` se normaliza únicamente en la capa TTS a `Será`. El texto mostrado y almacenado por la aplicación no cambia.

## Seguridad y privacidad

- Ninguna API key se incluirá en GitHub Pages ni en el repositorio.
- El identificador privado de la voz tampoco se necesita en el cliente.
- No se versionan muestras de voz, audios generados ni otro material biométrico.
- El cliente no realiza llamadas directas autenticadas al proveedor de clonación.
- El único `fetch()` autorizado en la aplicación queda encapsulado en el adaptador HTTP de TTS y sujeto a la comprobación estructural.

## Impacto

La preview puede seguir funcionando sin infraestructura adicional gracias al fallback del navegador.

Para activar la voz clonada en una URL pública será necesario desplegar un proxy o función server-side mínima que implemente el contrato HTTP. La elección y despliegue de esa infraestructura es trabajo separado porque introduce una nueva pieza operativa y debe preservar el objetivo de coste recurrente 0 €.

## Consecuencias

### Positivas

- El proveedor de voz queda intercambiable.
- La API key no se expone al navegador.
- El audio generado puede alimentar un futuro renderer de lip-sync.
- La aplicación conserva funcionamiento degradado sin servicio remoto.
- La corrección de pronunciación no contamina el contenido visible.

### Negativas

- La voz clonada no puede activarse en GitHub Pages sin un endpoint externo seguro.
- Aparece una nueva dependencia operativa cuando dicho endpoint se despliegue.
