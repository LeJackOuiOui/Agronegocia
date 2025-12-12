## 🛒 Proyecto Final - Agrocomercia

# 📋 Descripción del Proyecto
  Este es un proyecto de e-commerce desarrollado con React y Vite, que incluye funcionalidades completas de autenticación, gestión de productos, carrito de compras y panel de vendedores. La aplicación utiliza Supabase como backend para base de datos, autenticación y almacenamiento.

## 🚀 Características Principales

- 🔐 Autenticación de usuarios (clientes y vendedores)
- 🛍️ Catálogo de productos con imágenes
- 🛒 Carrito de compras interactivo
- 👤 Panel de vendedores para gestionar productos
- 📱 Diseño responsive y moderno
- 🔄 Estado global con Context API
- 🖼️ Subida y gestión de imágenes a Supabase Storage
- 🎨 Componentes modales para mejor experiencia de usuario

# 🏗️ Estructura del Proyecto

PROYECTO-FINAL/ <br>
├── public/ # Assets públicos<br>
├── src/<br>
│ ├── assets/ # Imágenes estáticas y logos<br>
│ │ └── images/ # Imágenes del catálogo<br>
│ ├── components/ # Componentes reutilizables<br>
│ │ ├── context/ # Context API (AppContext)<br>
│ │ ├── forms/ # Formularios (Login, Producto, Vendedor)<br>
│ │ └── UI/ # Componentes de interfaz<br>
│ ├── data/ # Datos estáticos y constantes<br>
│ ├── hooks/ # Custom Hooks personalizados<br>
│ ├── pages/ # Páginas principales de la aplicación<br>
│ ├── services/ # Servicios externos<br>
│ │ ├── API/ # Servicios de API<br>
│ │ └── supabase/ # Configuración y servicios de Supabase<br>
│ └── styles/ # Estilos CSS por componente<br>
├── .env # Variables de entorno<br>
├── index.html # Punto de entrada HTML<br>
├── package.json # Dependencias y scripts<br>
└── vite.config.js # Configuración de Vite
`

# 🛠️ Tecnologías Utilizadas

## Frontend

- React - Biblioteca principal
- Vite - Build tool y servidor de desarrollo
- Context API - Gestión de estado global
- CSS Modules - Estilos componentes

## Backend (Supabase)

- Autenticación - Sistema de login/registro
- PostgreSQL - Base de datos relacional
- Storage - Almacenamiento de imágenes
- APIs REST/Realtime - Comunicación en tiempo real
- Herramientas de Desarrollo
  ESLint - Linter para calidad de código
- Git - Control de versiones

# 📦 Instalación y Configuración

## Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn
- Cuenta en Supabase

# Pasos de Instalación

## 1. Clonar el repositorio

```bash
git clone <repositorio>
cd PROYECTO-FINAL
```

## 2. Instalar dependencias

```bash
npm install
# o
yarn install
```

## 3. Configurar variables de entorno

- Crear archivo .env basado en .env.example
- Obtener las credenciales de Supabase desde tu proyecto

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
Configurar Supabase
```

## 4. Crear las tablas necesarias en la base de datos

- Configurar políticas de acceso
- Crear bucket de almacenamiento para imágenes
- Iniciar la aplicación

```bash
npm run dev
# o
yarn dev
```

# 🔧 Scripts Disponibles

```json
{
  "dev": "vite",            # Inicia servidor de desarrollo
  "build": "vite build",    # Construye para producción
  "preview": "vite preview" # Vista previa de producción
}
```

# 🗂️ Componentes Principales

## Contexto y Estado

- AppContext.jsx - Maneja el estado global de la aplicación (usuario, carrito, productos)

## Formularios

- LoginForm.jsx - Formulario de autenticación
- ProductForm.jsx - Creación/edición de productos
- SellerForm.jsx - Registro de vendedores

## Componentes UI

- Header.jsx - Navegación principal
- Footer.jsx - Pie de página
- Card.jsx - Tarjeta de producto
- Carousel.jsx - Carrusel de imágenes
- CartModal.jsx - Modal del carrito
- ProductModal.jsx - Modal de detalles de producto
- Alert.jsx - Componente de notificaciones
- ListaProducts.jsx - Listado de productos

# 🎨 Estilos

La aplicación utiliza un enfoque modular de CSS:

- Estilos globales en App.css y index.css
- Estilos específicos por componente en la carpeta styles/

# 📡 Servicios Supabase

## Configuración

- client.js - Inicialización del cliente Supabase
- auth.js - Servicios de autenticación
- database.js - Operaciones con la base de datos
- storage.js - Manejo de almacenamiento de archivos
- Servicios Específicos
  imageService.js - Gestión de subida y recuperación de imágenes

# 🔒 Variables de Entorno

| Variable               | Descripción               | Requerido |
| :--------------------- | :------------------------ | :-------- |
| VITE_SUPABASE_URL      | URL del proyecto Supabase | Sí        |
| VITE_SUPABASE_ANON_KEY | Clave anónima de Supabase | Sí        |

# 📱 Funcionalidades por Rol

## 👤 Cliente

- Registro y login
- Explorar catálogo de productos
- Agregar productos al carrito
- Ver detalles de productos
- Proceso de compra

## 👨‍💼 Vendedor

- Registro como vendedor
- Subir y gestionar productos
- Ver estadísticas de ventas
- Editar información de productos

## 📄 Licencia

- Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

## 👥 Autores

- Nicolas Steven Prieto Gomez
- Juan David Casanova Melo
- Diego Fernando Castillo Cruz
- Juan Esteban Robledo Forero
