# SongApp

## Introducción

Este proyecto es una prueba de implementación creada con el objetivo de explorar, evaluar y validar ciertos aspectos clave en la construcción de aplicaciones web con Angular y git, su integración con herramientas externas como Cypress para pruebas e2e, y la implementación de pruebas unitarias usando Karma/Jasmine.

## Herramientas empleadas

 - Angular
 - NgRx
 - ngx-skeleton-loader
 - ngx-toastr
 - Karma +  Jasmine
 - Cypress

## Metodología empleada

Antes de iniciar el proyecto he creado una lista de tareas con sus descipciones siguiendo el estilo de Jira, siendo SNG la etiqueta del proyecto.

Las ramas tienen el nombre completo de la tarea en cuestión y cada commit tiene el identificador de la tarea únicamente. Esto ayuda a ver los commits en la plataforma de Atlassian.

Los pull requests se han cerrado con merge y las ramas se han dejado abiertas para que sea posible identificarlas analizando el repositorio.

## Instalacion del proyecto

Se ha utilizado yarn  como gestor de paquetes por lo que se recomienda lanzar todos los comandos con yarn.

Para instalar yarn y instalar las dependencias:

```
npm install -g yarn
yarn
```

## Configuraciones del proyecto

En el fichero `environments.ts` se encuentran dos configuraciones para testear los skeleton loaders y errores en el guardado.

```
apiErrors
apiDelay
```

## Iniciar un servidor de desarrollo

```
yarn dev
```

## Lanzar tests unitarios

Solamente se han definido tests en el componente de `icon-button`, pero hay tests generados automaticamente por angular que pueden no funcionar.

```
yarn test
```

## Lanzar tests e2e

```
yarn test:e2e
```

## Posibles mejoras y correcciones

Mejoras

 - Refactorizar el store, dividirlo en un store por entidad, mejorar legibilidad de codigo
 - Mejorar la interfaz de lista de canciones
 - Añadir tests para el resto de la aplicación
 - Cambiar json-server por un backend de verdad y delegar la gesttion de entidades (actualmente esta gestion se hace en el store)

Correcciones

 - Terminar de traducir todos los componentes de la aplicación
