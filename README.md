## Getting Started

Para levantar el json-server: `npm run db:start`
Para levantar la aplicación de Angular: `npm run start`
tests unitarios: `npm run test`
tests e2e: `npm run cy:open`

## Introducción

Este documento presenta las decisiones técnicas y de arquitectura adoptadas en la implementación de una aplicación Angular híbrida (SSR/CSR) para gestionar canciones (visualización, creación y edición). A continuación, explico el razonamiento detrás de cada elección y las dificultades encontradas.

## Requisitos Obligatorios

He hecho una aplicación que demuestra una lista de canciones, el detalle de cada canción, una vista para crear canciones nuevas y otra para editar canciones. 

Para el tipo de aplicación Angular, he optado por crear una aplicación SSR híbrida. Para las vistas que se encargan principalmente de demostrar contenido (lista de canciones y detalle), la aplicación cargará en modo SSR. Para las vistas interactivas, (crear y editar canciones), la aplicación cargará en modo CSR.

He implementado además una estructura de carpetas para los componentes y archivos de la aplicación basado en principios de DDD y Strategic Design (dominios, scopes, features, ui, data-access, util).

En cuanto a diseño, he optado por seguir una metodología de mobile-first, y después asegurarme de que las vistas se adapten a pantallas más anchas. 

He decidido también usar `@angular/material` para agilizar la creación de componentes. Esta es la librería que solemos usar donde trabajo, pero estamos viendo si cambiamos a usar `PrimeNG`, ya que debe de ser más fácil de customizar el estilado. Sin embargo este caso, he optado por usar lo que ya conozco bien. 

Para los estados de carga he usado los componentes de Angular Material, salvo para los skeletons que los he creado a mano. Para estos skeletons he usado `::ng-deep` en los componentes `src/app/song/feature-song/containers/songs-list`y `src/app/song/feature-song/containers/song-detail`, ya que aunque `::ng-deep` está deprecated, a día de hoy el equipo de Angular no ha proporcionado una alternativa mejor para customizar el estilado de un componente "base" según el componente padre. Esto es algo que se maneja fácilmente en otros frameworks de front como *Vue*, que aprovecha el uso del pseudo-selector ``:slotted()`.

hay un interceptor que simula latencia en las peticiones para comprobar el funcionamiento de loas loaders, skeletons, spinners, etc. en  `src/app/shared/data-access/interceptors/delay-interceptor.interceptor.ts`

Había probado usar ViewEncapsulation.None y pasar el estilado via input al componente del skeleton, pero el enfoque más limpio y eficaz en mi opinión sigue siendo `::ng-deep`.

En cuanto a técnicas de desarrollo y rendimiento, he optado por usar `signals` en angular, disponible desde v16, que permiten un control más granular sobre la detección de cambios. También  me he asegurado de que todos los componentes usen la estrategia `OnPush`de detección de cambios, minimizando  la cantidad de veces que Angular intente detectar cambios nuevos, mejorando la velocidad de renderizado.

Había empezado por integrar el sistema de [i18n](https://angular.dev/guide/i18n) que da por defecto Angular, pero me di cuenta de que se pide específicamente `ngx-translate` o `@ngeat/transloco`, así que he optado finalmente por `ngx-translate`. Personalmente, prefiero el sistema de `i18n` or defecto de Angular, ya que al hacer el build de las aplicaciones, se crea un "build" por cada idioma, teniendo el idioma directamente incrustado en el html. Esto es más óptimo que  `ngx-translate` o `@ngeat/transloco`, que modifican el DOM en **runtime**, lo cual es peor para la carga inicial de la aplicación. También he visto que usando `@ngx-translate/http-loader`, si hay latencia, el contenido de texto de la página puede aparecer en blanco.

## Requisitos Adicionales (opcionales / valorables)

### Gestión de Estado
Para la gestión de estado he usado los signal-store de `@ngrx/signals`. Donde trabajo hemos tenido varios debates de si usar este o `@ngrx/store`. Al final se ha optado por usar signal-store ya que requiere menos boilerplate y es más flexible, pudiendo servir más fácilmente como un global-store o un component-store, mientras que `@ngrx/store`es "demasiado complejo" para la mayoría de casos de uso. A mí personalmente me gustaba el patrón de Redux que ofrecía `@ngrx/store`, pero lo cierto es que `@ngrx/signals` es más fácil y flexible de implementar.

### Tests
He implementado tests unitarios para el componente `src/app/song/feature-song/containers/songs-list`, y he implementado un test e2e usando `Cypress`para testear el flujo de crear una canción y que aparezca después en la lista de canciones. En el contexto de vuestra prueba técnica,  me he limitado a crear estos tests para demostrar que soy capaz de ello, sin llegar a cubrir toda la aplicación con tests.
### Metodología BEM 

He usado la metodología BEM para cuando me encontraba limitado por Angular Material y he tenido que estilar cosas a mano.

## Problemas

### Campo "country" en canciones

En los formularios de editar y crear canciones, he quitado el campo "country", ya que esto es un campo relacionado de `companies`, y no se debería cambiar desde la canción. En todo caso, debería haber otro formulario de `company`donde se pueda modificar los datos de este. 
### json-server

La dependencia `json-server` me ha dado bastantes problemas, especialmente al manejar relaciones y ordenar datos. He tenido que usar soluciones temporales como la creación de un signal-store (`populate.signal-store.ts`) para simular relaciones de datos, y lógica adicional en servicios (`company.service.ts`) para mantener coherencia relacional manualmente.  En una aplicación real, esta responsabilidad debería caer en el backend.

**Nada de esto sería problemático si trabajase con un API más robusto que `json-server`. Regularmente trabajo con servicios de Backend y APIs usando [Strapi](https://docs.strapi.io/dev-docs/intro), y aprender más sobre Backend/Node es algo que me llama mucho la atención si trabajase con vosotros.**

## Pasos a futuro

- En el formulario de canciones, refactorizar los campos de autocompletado y de chips para que sean componentes reutilizables.
- Usar una aplicación backend más robusto que json-server
	- Quitar funcionalidad que se debería estar encargando el servidor
		- `src/app/shared/data-access/store/populate.signal-store.ts`
		- `src/app/company/data-access-company/services/company.service.ts`
- Aumentar el test coverage de la aplicación
- Abstraer funcionalidad como el validador `src/app/song/util-song/validators/is-artist-id-validator.ts`
- Evaluar dependencias alternativas (PrimeNG) para facilitar la customización via css.
