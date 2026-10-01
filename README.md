# ⭐ Star Wars Explorer

Aplicación web para explorar personajes del universo Star Wars, construida como parte de la **Prueba Técnica – Analista de Desarrollo**.

La aplicación consume datos reales desde la API pública GraphQL de SWAPI y permite explorar personajes, buscar por nombre, navegar mediante paginación y consultar el detalle de cada personaje en un Drawer sincronizado con la URL.

## 🚀 Demo

**Producción:** https://star-wars-explorer-ten.vercel.app/

**Repositorio:** https://github.com/ISCSantIa/star-wars-explorer

## 🛠️ Tecnologías

* Next.js 16 – App Router
* React 19
* TypeScript
* GraphQL
* Apollo Client
* GraphQL Code Generator
* Ant Design
* Git / GitHub
* Vercel

## 🌌 API

La aplicación consume directamente la API pública:

`https://swapi-graphql.netlify.app/graphql`

No se utilizan mocks ni datos simulados.

## ✨ Funcionalidades

### Listado de personajes

* Consulta personajes directamente desde SWAPI.
* Paginación basada en cursores GraphQL.
* Navegación hacia adelante y atrás.
* Skeleton durante la carga.
* Estado vacío.
* Manejo de errores con opción de reintentar.
* CTA para consultar el detalle de cada personaje.

### 🔎 Búsqueda

* Búsqueda global por nombre.
* Case-insensitive.
* Filtrado en memoria.
* Debounce de 300 ms.
* No realiza una petición al API por cada tecla.
* La búsqueda se realiza sobre todos los personajes disponibles.

### 🎬 Detalle

El detalle se muestra mediante un Drawer de Ant Design e incluye:

* Nombre del personaje.
* Películas en las que participa.
* Director de cada película.
* Planetas asociados a cada película mediante tags/chips.

### 🔗 URL sincronizada

El personaje seleccionado se representa mediante un query parameter:

`/?character=cGVvcGxlOjE=`

Esto permite:

* Abrir el detalle desde el listado.
* Compartir directamente la URL de un personaje.
* Acceder directamente a una URL y cargar el Drawer abierto.
* Cerrar el Drawer y regresar al listado.

## 🏗️ Arquitectura

La aplicación utiliza Next.js App Router y separa las responsabilidades entre Server Components, Client Components y Server Actions.

```text
src/
├── app/
│   ├── actions/
│   │   └── characters.ts
│   ├── page.tsx
│   └── layout.tsx
│
├── components/
│   └── characters/
│       ├── CharacterCard.tsx
│       ├── CharacterDetailView.tsx
│       ├── CharacterDrawer.tsx
│       ├── CharacterFilmList.tsx
│       ├── CharacterGrid.tsx
│       ├── CharacterListContainer.tsx
│       └── CharacterPagination.tsx
│
├── graphql/
│   ├── generated/
│   └── queries/
│       ├── characters.graphql
│       └── character-detail.graphql
│
└── lib/
    └── apollo/
        └── client.ts
```

### Listado y paginación

La carga inicial se realiza desde el servidor utilizando Apollo Client.

Para las operaciones de paginación, el Client Component utiliza una Server Action como puente para ejecutar nuevamente las consultas GraphQL desde el servidor.

La navegación utiliza cursores `first/after` para avanzar y `last/before` para retroceder.

Debido al comportamiento particular del endpoint público de SWAPI, se mantiene un historial de cursores para permitir navegar nuevamente hacia adelante después de retroceder.

### Detalle y relaciones GraphQL

Durante la validación de la API se comprobó que la conexión de películas expuesta desde `person(id)` no se comportaba de forma consistente en el endpoint público utilizado.

Por esta razón, la implementación obtiene las películas mediante `allFilms` y determina la relación personaje → película utilizando `characterConnection`.

A partir de cada película también se obtiene:

* `director`
* `planetConnection`

Esto permite mostrar las películas, sus directores y los planetas asociados utilizando datos reales de la API.

## 🔐 Variables de entorno

Crear un archivo `.env.local`:

```env
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://swapi-graphql.netlify.app/graphql
```

El archivo `.env.local` no se incluye en el repositorio.

## 💻 Instalación

Requisitos:

* Node.js 22+
* npm

Clonar el repositorio:

```bash
git clone https://github.com/ISCSantIa/star-wars-explorer.git
cd star-wars-explorer
```

Instalar dependencias:

```bash
npm install
```

Configurar `.env.local` con el endpoint GraphQL.

## ▶️ Ejecución en desarrollo

```bash
npm run dev
```

Abrir:

`http://localhost:3000`

## 🧬 GraphQL Code Generator

Los tipos de TypeScript se generan automáticamente a partir del schema y las operaciones GraphQL.

Ejecutar:

```bash
npm run codegen
```

Los archivos generados se encuentran en:

`src/graphql/generated/`

## 🏭 Build de producción

Para validar la aplicación:

```bash
npm run build
```

## ☁️ Deployment

La aplicación está desplegada en Vercel.

Cada cambio integrado en `main` puede generar un nuevo deployment automático.

## 📌 Decisiones técnicas

### Next.js App Router

Se utiliza para aprovechar Server Components, Server Actions y el renderizado del lado del servidor.

### Apollo Client

Se utiliza como cliente GraphQL y para centralizar la comunicación con la API.

### GraphQL Code Generator

Permite generar tipos TypeScript a partir del schema y las operaciones GraphQL, evitando utilizar `any` para los datos provenientes de la API.

### Ant Design

Se utiliza para componentes de interfaz como Drawer, Input, Skeleton, Alert, Empty, Pagination y Tags.

### Query parameter para el detalle

Se utiliza `?character=ID` como fuente de verdad del personaje seleccionado. Esto simplifica la sincronización entre estado de UI y URL y permite acceder directamente a un personaje.

### Búsqueda con debounce

La búsqueda utiliza un debounce de 300 ms y filtrado en memoria. La API actualmente proporciona 82 personajes, por lo que esta estrategia evita peticiones innecesarias y proporciona una respuesta inmediata al usuario.

## 🔮 Mejoras con más tiempo

Con más tiempo se podrían incorporar:

* Pruebas automatizadas con React Testing Library.
* Metadata dinámica específica para cada personaje.
* Mejoras adicionales de accesibilidad y navegación mediante teclado.
* Tests de integración para paginación y navegación del Drawer.
* Optimización adicional si el volumen de personajes de la API aumentara significativamente.

## 👨‍💻 Autor

**David Santiago Rivera Orjuela**

Prueba Técnica – Analista
