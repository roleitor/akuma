# Changelog

Todos los cambios notables en el proyecto Akuma QR Validator.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/),
y este proyecto adherirse al [Semantic Versioning](https://semver.org/lang/es/).

## [1.1.0] - 2026-07-23

### Added

#### Escaneo QR desde Galería
- **Modo Cámara / Galería**: Toggle para alternar entre escaneo directo con cámara y selección de imagen desde la galería del dispositivo
- **`Html5Qrcode.scanFile()`**: Escaneo de QR desde archivos de imagen
- **Preview de imagen**: Muestra la imagen seleccionada con overlay de "Escaneando..."
- **Selección múltiple**: Botones para elegir otra imagen o reintentar
- **UX mejorada**: Iconos descriptivos, feedback visual claro para cada modo

#### Configuración PWA
- **`vite-plugin-pwa`** configurado con Workbox para service worker automático
- **Manifest PWA completo** con soporte para instalación en Android, iOS y escritorio
- **Service Worker** con estrategias de cache:
  - `NetworkFirst` para llamadas a la API (datos frescos con fallback a cache)
  - `CacheFirst` para imágenes (30 días de cache)
  - `CacheFirst` para fuentes (1 año de cache)
  - Precaching de assets estáticos (JS, CSS, HTML)
- **Auto-update** del service worker cuando hay nueva versión disponible
- **Background sync** para subir verificaciones pendientes cuando vuelve la conexión
- **Cleanup de caches** obsoletos automáticamente

#### Metatags PWA en `index.html`
- Meta tags para `apple-mobile-web-app-capable` (iOS)
- Meta tags para `msapplication-TileColor` (Windows)
- Apple Touch Icons para todos los tamaños necesarios
- Open Graph tags para sharing
- Favicon con SVG de fallback

#### Iconos PWA
- Iconos SVG placeholder para todos los tamaños requeridos:
  - 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512
- Soporte para `maskable` icons en 192x192 y 512x512
- Favicon SVG generado

#### Servicios de Almacenamiento Offline
- **`offlineDB.ts`**: Servicio completo de IndexedDB usando `idb`
  - Store `documents`: Documentos cacheados offline
  - Store `verifications`: Verificaciones realizadas offline
  - Store `sync_queue`: Cola de sincronización para requests pendientes
  - Store `meta`: Metadata (última sincronización, lista de revocados)
  - Operaciones CRUD completas para cada store
  - Operaciones bulk (clearAll, getStats)
  
- **`documentService.ts`**: Servicio de documentos con soporte offline
  - `getDocument()`: Primero intenta local, luego red
  - `checkDocumentStatus()`: Verifica estado contra cache y lista de revocados
  - `searchDocuments()`: Búsqueda local en documentos cacheados

- **`syncManager.ts`**: Reescrito completamente con soporte PWA
  - Detección automática de estado online/offline via eventos del navegador
  - Sincronización periódica cada 30 segundos cuando está online
  - Sincronización inmediata al recuperar conexión
  - Callbacks de estado para UI (online, syncing, lastSync, pendingCount)
  - `saveVerificationLocally()`: Guarda offline e intenta sync inmediato
  - `isDocumentRevoked()`: Verifica contra lista local de revocados

#### Scripts NPM
- `dev:pwa`: Desarrollo con modo PWA
- `build:pwa`: Build de producción optimizado
- `preview:pwa`: Preview del build PWA
- `cap:build:android`: Build + sync para Android
- `cap:build:ios`: Build + sync para iOS

#### Animaciones CSS
- Animación `slideUp`/`slideDown` para notificaciones PWA
- Estilos para `.pwa-install-banner` (banner de instalación)
- Indicador de estado offline (`.offline-indicator`)
- Indicador de sincronización (`.sync-status`)

#### TypeScript
- Tipado de `BeforeInstallPromptEvent` para install prompt
- Referencia a `vite-plugin-pwa/client` types

### Changed

- **`vite.config.ts`**: Configuración reescrita con plugin PWA, Workbox strategies, y manual chunks
- **`package.json`**: Scripts actualizados, nuevas dependencias PWA
- **`index.html`**: Metatags PWA agregados, favicon actualizado
- **`main.tsx`**: Inicialización de service worker y sync manager
- **`index.css`**: Animaciones PWA agregadas

### Dependencies Added

- `vite-plugin-pwa` ^1.3.0 - Plugin de Vite para PWA
- `idb` ^8.0.3 - Wrapper moderno para IndexedDB
- `workbox-window` ^7.4.1 - Window para Workbox
- `workbox-core` ^7.4.1 - Core de Workbox
- `workbox-routing` ^7.4.1 - Enrutamiento de requests
- `workbox-strategies` ^7.4.1 - Estrategias de cache
- `workbox-recipes` ^7.4.1 - Recetas comunes de cache
- `workbox-expiration` ^7.4.1 - Manejo de expiración de cache

---

## [1.0.0] - 2026-07-22

### Added

#### Backend (NestJS)
- Arquitectura Hexagonal / Clean Architecture
- Módulo de Documentos con CRUD completo
- Módulo de Verificaciones con batch support
- Módulo de Sincronización (pull documents, revoked list)
- Módulo de Autenticación JWT
- Health Check endpoint
- Swagger para documentación de API
- Prisma ORM con PostgreSQL
- Cache con Redis
- Guards JWT y filtros de excepciones

#### Frontend (React + Capacitor)
- Estructura base con React 18 + TypeScript + Vite
- 5 pantallas: Home, Scan, Detail, History, Settings
- React Router v6 con rutas configuradas
- Tailwind CSS para estilos
- Zustand para state management
- Capacitor 5 para wrapping nativo (Android/iOS)
- html5-qrcode para escaneo
- Servicios stub: crypto, database, network, sync

#### Infraestructura
- Docker Compose con PostgreSQL 16 y Redis 7
- Configuración de health checks
- .gitignore completo

#### Documentación
- Resumen Ejecutivo
- Arquitectura de Software completa
- Flujos Detallados con diagramas Mermaid
- Especificación de Módulos API
