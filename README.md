# Sistema de Tickets de Ayuda

Sistema de gestión de tickets de soporte técnico desarrollado como prueba técnica frontend. Permite a los usuarios reportar problemas, gestionar tickets y realizar seguimiento de sus reportes.

## 🚀 Demo

[Ver Demo en Vivo](https://support-tickets-health.netlify.app)

## 📋 Requisitos Cumplidos

### ✅ Apartado: Reportar un Problema
- [x] Formulario con campo de Asunto
- [x] Selector de Prioridad (Baja, Media, Alta)
- [x] Campo de Detalle/Descripción
- [x] Funcionalidad para Adjuntar archivo
- [x] Validación de archivos (tipo y tamaño máximo 5MB)
- [x] Conversión de archivos a base64 para almacenamiento

### ✅ Apartado: Mis Reportes
- [x] Listado de tickets con:
  - Asunto
  - Prioridad (con badges de colores)
  - Fecha de creación
  - Estatus (Abierto, En Progreso, Resuelto)
  - Acciones (Ver, Eliminar)
- [x] Paginación (10 items por página)
- [x] Estado vacío cuando no hay tickets

### ✅ Funcionalidades de Tickets
- [x] Eliminar tickets con confirmación
- [x] Ver detalle completo del ticket
- [x] Editar prioridad y estatus
- [x] Descargar archivos adjuntos
- [x] Navegación entre vistas

### ✅ Requerimientos Técnicos
- [x] Almacenamiento en localStorage
- [x] Redux Toolkit con RTK Query para manejo de estado
- [x] React 19 como framework
- [x] TypeScript en modo estricto
- [x] Testing con Vitest y React Testing Library

## 🛠️ Tecnologías Utilizadas

- **Framework:** React 19 + Vite
- **Lenguaje:** TypeScript (strict mode)
- **Estado Global:** Redux Toolkit + RTK Query
- **Routing:** React Router v7
- **Estilos:** Tailwind CSS v3.4
- **Validación:** React Hook Form + Zod
- **Iconos:** React Icons
- **Testing:** Vitest + React Testing Library
- **Gestión de Paquetes:** pnpm

## 📦 Instalación

### Prerrequisitos

- Node.js 18+
- pnpm (recomendado) o npm

### Pasos de Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/danielislas3/support-tickets.git
cd support-tickets
```

2. Instalar dependencias:
```bash
pnpm install
# o con npm
npm install
```

3. Iniciar el servidor de desarrollo:
```bash
pnpm dev
# o con npm
npm run dev
```

4. Abrir el navegador en: `http://localhost:5173`

## 🎯 Uso

### Reportar un Problema

1. Navega a "Reportar Problema" en el menú
2. Completa el formulario:
   - **Asunto:** Título descriptivo del problema
   - **Prioridad:** Selecciona Baja, Media o Alta
   - **Descripción:** Detalla el problema
   - **Archivo (opcional):** Adjunta imágenes, PDF o archivos de texto (máx. 5MB)
3. Haz clic en "Reportar Problema"
4. Serás redirigido a "Mis Tickets"

### Ver Mis Tickets

1. Navega a "Mis Tickets" en el menú
2. Visualiza todos tus tickets reportados
3. Usa la paginación para navegar entre páginas
4. Acciones disponibles:
   - **Ver:** Ver detalles completos del ticket
   - **Eliminar:** Eliminar el ticket (con confirmación)

### Gestionar un Ticket

1. Haz clic en "Ver" en cualquier ticket
2. Visualiza toda la información:
   - Asunto, descripción, prioridad, estado
   - Fecha de creación
   - Archivo adjunto (si existe)
3. Haz clic en "Editar" para modificar:
   - Prioridad
   - Estado (Abierto → En Progreso → Resuelto)
4. Descarga archivos adjuntos con el botón "Descargar"

## 📁 Estructura del Proyecto

```
support-tickets/
├── src/
│   ├── app/                    # Configuración de la aplicación
│   │   ├── routes/            # Páginas principales
│   │   │   ├── ReportTicket.tsx
│   │   │   ├── MyTickets.tsx
│   │   │   └── TicketDetail.tsx
│   │   ├── Layout.tsx         # Layout principal con navegación
│   │   ├── App.tsx            # Configuración de rutas
│   │   ├── store.ts           # Configuración de Redux
│   │   └── main.tsx           # Entry point
│   │
│   ├── features/              # Features organizadas por dominio
│   │   └── tickets/
│   │       ├── api/           # RTK Query endpoints
│   │       │   └── ticketsApi.ts
│   │       ├── components/    # Componentes específicos de tickets
│   │       │   ├── TicketForm.tsx
│   │       │   ├── TicketsTable.tsx
│   │       │   ├── TicketTableRow.tsx
│   │       │   ├── TicketBadge.tsx
│   │       │   ├── AttachmentDisplay.tsx
│   │       │   ├── DeleteConfirmModal.tsx
│   │       │   └── EmptyState.tsx
│   │       ├── models/        # Tipos e interfaces
│   │       │   ├── ticket.ts
│   │       │   └── validationSchema.ts
│   │       └── utils/         # Utilidades
│   │           ├── fileUtils.ts
│   │           └── labels.ts
│   │
│   ├── shared/                # Código compartido
│   │   ├── components/        # Componentes reutilizables
│   │   │   └── Pagination.tsx
│   │   ├── lib/               # Utilidades generales
│   │   │   └── storage.ts
│   │   └── hooks/             # Custom hooks
│   │
│   └── __tests__/             # Tests
│       ├── features/
│       └── shared/
│
├── public/                    # Assets estáticos
├── CLAUDE.md                  # Guía para desarrollo con Claude Code
└── README.md                  # Este archivo
```

## 🧪 Testing

El proyecto incluye tests unitarios y de integración con cobertura completa de componentes críticos.

### Ejecutar tests:

```bash
# Ejecutar todos los tests
pnpm test

# Ejecutar tests en modo watch
pnpm test:watch

# Ver cobertura
pnpm test:coverage
```

### Tests implementados:

- ✅ TicketForm (8 tests)
- ✅ TicketsTable y TicketTableRow
- ✅ TicketBadge (8 tests)
- ✅ Pagination (11 tests)
- ✅ DeleteConfirmModal (8 tests)
- ✅ File utilities (12 tests)
- ✅ Validation schemas (12 tests)

**Total: 59 tests pasando**

## 📜 Scripts Disponibles

```bash
# Desarrollo
pnpm dev              # Inicia servidor de desarrollo

# Build
pnpm build            # Compila para producción
pnpm preview          # Preview del build de producción

# Testing
pnpm test             # Ejecuta tests
pnpm test:watch       # Tests en modo watch
pnpm test:coverage    # Genera reporte de cobertura

# Linting
pnpm lint             # Ejecuta ESLint

# Type checking
tsc -b                # Verifica tipos de TypeScript
```

## 🏗️ Arquitectura

### Manejo de Estado

- **Redux Toolkit:** Configuración centralizada del store
- **RTK Query:** Manejo de data fetching y cache
- **localStorage:** Persistencia de datos usando custom queryFn

### Validación

- **React Hook Form:** Manejo eficiente de formularios
- **Zod:** Validación de esquemas con TypeScript

### Routing

- **React Router v7:** Navegación entre vistas
- Rutas configuradas:
  - `/` - Reportar Problema
  - `/my-reports` - Mis Tickets
  - `/ticket/:id` - Detalle del Ticket

### Componentes

- **Arquitectura modular:** Componentes pequeños y reutilizables
- **Separación de responsabilidades:** UI separada de lógica de negocio
- **Props tipadas:** TypeScript estricto en todos los componentes

## 🎨 Características de UI/UX

- ✨ Diseño limpio y moderno con Tailwind CSS
- 🎯 Feedback visual claro (loading states, errores, éxitos)
- 📱 Diseño responsive
- ♿ Accesibilidad (aria-labels, roles semánticos)
- 🔔 Confirmaciones para acciones destructivas
- 🎨 Sistema de colores consistente para estados y prioridades

## 🔧 Decisiones Técnicas

### localStorage vs API Backend

Se implementó localStorage con RTK Query usando `fakeBaseQuery`, lo que permite:
- ✅ Desarrollo sin dependencias de backend
- ✅ Migración sencilla a API real (solo cambiar el baseQuery)
- ✅ Misma lógica de cache e invalidación que con API
- ✅ Testing simplificado

### Código en Inglés, UI en Español

- Variables, funciones y componentes en inglés (estándar de la industria)
- Textos de interfaz en español (target de usuarios)
- Facilita futuro i18n si es necesario

### Base64 para Archivos

- Simplifica almacenamiento en localStorage
- No requiere gestión de filesystem
- Adecuado para el scope de la prueba técnica

## 🚀 Deploy

El proyecto está desplegado en Netlify con continuous delivery configurado en la rama `main`.

- **URL de producción:** https://support-tickets-health.netlify.app
- **Configuración de build:**
  - **Build command:** `pnpm build`
  - **Publish directory:** `dist`
- **Deploy automático:** Cada push a `main` despliega automáticamente

### Build local para producción:

```bash
pnpm build
pnpm preview  # Preview local del build
```

## 📝 Notas de Desarrollo

- El proyecto usa **path aliases** configurados en `vite.config.ts` y `tsconfig.json`:
  - `@/app/*` → `src/app/*`
  - `@/features/*` → `src/features/*`
  - `@/shared/*` → `src/shared/*`

- **Convenciones de Git:**
  - Conventional Commits
  - Formato: `tipo: descripción`
  - Tipos: feat, fix, chore, docs, refactor, test, style

## 👨‍💻 Desarrollo

Este proyecto sigue las mejores prácticas de desarrollo frontend:
- Código en inglés, UI en español
- Conventional Commits para mensajes de git
- Arquitectura feature-based
- Testing como parte del workflow

## 🐛 Troubleshooting

### El servidor no inicia
```bash
# Limpia node_modules e instala de nuevo
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Los tests fallan
```bash
# Asegúrate de tener las dependencias actualizadas
pnpm install
pnpm test
```

### Build falla
```bash
# Verifica tipos de TypeScript
tsc -b
```

## 📄 Licencia

Este proyecto fue desarrollado como prueba técnica frontend.

---

**Desarrollado con React + TypeScript + Vite**
