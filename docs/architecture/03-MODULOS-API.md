# Especificación de Módulos y Contratos API

## 1. Módulos del Sistema

### 1.1 Módulo Frontend - App Móvil

| Módulo | Responsabilidad | Tecnología |
|--------|-----------------|------------|
| **QR Scanner** | Escanear códigos QR con cámara | html5-qrcode |
| **Crypto Service** | Verificar firmas ECDSA y hashes | elliptic, crypto-js |
| **Database Service** | Gestión SQLite local | @capacitor-community/sqlite |
| **Sync Service** | Sincronización offline→online | Capacitor Network |
| **Auth Service** | Autenticación JWT local | localStorage |
| **UI Components** | Componentes de interfaz | React + Tailwind |

### 1.2 Módulo Backend - API Server

| Módulo | Responsabilidad | Tecnología |
|--------|-----------------|------------|
| **Document API** | CRUD documentos | FastAPI Router |
| **Verification API** | Gestión verificaciones | FastAPI Router |
| **Sync API** | Sincronización de datos | FastAPI Router |
| **Auth API** | Autenticación usuarios | FastAPI Router |
| **Signer Service** | Generación de firmas ECDSA | cryptography |
| **Repository** | Acceso a datos | SQLAlchemy |

---

## 2. Contratos API

### 2.1 Endpoints de Documentos

#### POST /api/documents
**Descripción:** Registrar nuevo documento

**Request:**
```json
{
  "id": "TXN-2024-001234",
  "client_name": "Juan Pérez García",
  "transaction_date": "2024-07-17",
  "campaign": "Campaña Vacunación Q3",
  "location": "Centro de Salud #12",
  "form_data": {
    "campo1": "valor1",
    "campo2": "valor2"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "TXN-2024-001234",
    "hash": "a1b2c3d4e5f6...",
    "signature": "MEUCIQDx8k2m...",
    "qr_payload": {
      "v": "1.0",
      "txn": "TXN-2024-001234",
      "cli": "Juan Pérez García",
      "fec": "2024-07-17",
      "cam": "Campaña Vacunación Q3",
      "loc": "Centro de Salud #12",
      "ts": 1721234567,
      "sig": "MEUCIQDx8k2m..."
    },
    "created_at": "2024-07-17T10:30:00Z"
  }
}
```

#### GET /api/documents/{id}
**Descripción:** Obtener documento por ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "TXN-2024-001234",
    "client_name": "Juan Pérez García",
    "transaction_date": "2024-07-17",
    "campaign": "Campaña Vacunación Q3",
    "location": "Centro de Salud #12",
    "form_data": {},
    "hash_document": "a1b2c3d4e5f6...",
    "signature": "MEUCIQDx8k2m...",
    "status": "active",
    "created_at": "2024-07-17T10:30:00Z"
  }
}
```

#### GET /api/documents/{id}/status
**Descripción:** Verificar estado de documento (para sync)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "TXN-2024-001234",
    "status": "active",
    "revoked": false,
    "last_verification": "2024-07-17T10:35:00Z"
  }
}
```

---

### 2.2 Endpoints de Verificaciones

#### POST /api/verifications
**Descripción:** Registrar verificación (para sync)

**Request:**
```json
{
  "document_id": "TXN-2024-001234",
  "technician_id": "TECH-001",
  "technician_name": "María López",
  "device_id": "DEVICE-ABC123",
  "verification_date": "2024-07-17T10:32:00Z",
  "latitude": -12.0464,
  "longitude": -77.0428,
  "result": "VALID"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1234,
    "document_id": "TXN-2024-001234",
    "synced_at": "2024-07-17T10:33:00Z"
  }
}
```

#### POST /api/verifications/batch
**Descripción:** Registrar múltiples verificaciones (batch sync)

**Request:**
```json
{
  "verifications": [
    {
      "document_id": "TXN-2024-001234",
      "technician_id": "TECH-001",
      "technician_name": "María López",
      "device_id": "DEVICE-ABC123",
      "verification_date": "2024-07-17T10:32:00Z",
      "latitude": -12.0464,
      "longitude": -77.0428,
      "result": "VALID"
    },
    {
      "document_id": "TXN-2024-001235",
      "technician_id": "TECH-001",
      "technician_name": "María López",
      "device_id": "DEVICE-ABC123",
      "verification_date": "2024-07-17T10:35:00Z",
      "latitude": -12.0465,
      "longitude": -77.0429,
      "result": "REVOKED"
    }
  ]
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "synced": 2,
    "failed": 0,
    "results": [
      {"id": "TXN-2024-001234", "status": "synced"},
      {"id": "TXN-2024-001235", "status": "synced"}
    ]
  }
}
```

#### GET /api/verifications
**Descripción:** Listar verificaciones (admin)

**Query Parameters:**
- `technician_id`: Filtrar por técnico
- `document_id`: Filtrar por documento
- `start_date`: Fecha inicio
- `end_date`: Fecha fin
- `page`: Página
- `limit`: Límite por página

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "items": [
      {
        "id": 1234,
        "document_id": "TXN-2024-001234",
        "technician_id": "TECH-001",
        "technician_name": "María López",
        "verification_date": "2024-07-17T10:32:00Z",
        "result": "VALID"
      }
    ]
  }
}
```

---

### 2.3 Endpoints de Sincronización

#### GET /api/sync/revoked
**Descripción:** Obtener lista de documentos revocados

**Response (200):**
```json
{
  "success": true,
  "data": {
    "revoked": [
      {
        "document_id": "TXN-2024-000100",
        "revoked_at": "2024-07-15T08:00:00Z",
        "reason": "Cliente solicita cancelación"
      },
      {
        "document_id": "TXN-2024-000050",
        "revoked_at": "2024-07-10T14:30:00Z",
        "reason": "Documento duplicado"
      }
    ],
    "last_updated": "2024-07-17T10:00:00Z"
  }
}
```

#### POST /api/sync/pull
**Descripción:** Descargar documentos nuevos/actualizados

**Request:**
```json
{
  "last_sync": "2024-07-16T00:00:00Z",
  "document_ids": ["TXN-2024-001234", "TXN-2024-001235"]
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "documents": [
      {
        "id": "TXN-2024-001234",
        "client_name": "Juan Pérez García",
        "transaction_date": "2024-07-17",
        "campaign": "Campaña Vacunación Q3",
        "location": "Centro de Salud #12",
        "hash_document": "a1b2c3d4e5f6...",
        "signature": "MEUCIQDx8k2m..."
      }
    ],
    "revoked": ["TXN-2024-000100"]
  }
}
```

---

### 2.4 Endpoints de Autenticación

#### POST /api/auth/login
**Descripción:** Iniciar sesión

**Request:**
```json
{
  "email": "maria.lopez@empresa.com",
  "password": "********"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "token_type": "bearer",
    "expires_in": 86400,
    "user": {
      "id": "TECH-001",
      "name": "María López",
      "email": "maria.lopez@empresa.com",
      "role": "technician"
    }
  }
}
```

#### POST /api/auth/refresh
**Descripción:** Refrescar token

**Request:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "expires_in": 86400
  }
}
```

#### POST /api/auth/register-device
**Descripción:** Registrar dispositivo

**Request:**
```json
{
  "device_id": "DEVICE-ABC123",
  "name": "Samsung Galaxy S21",
  "platform": "android",
  "user_id": "TECH-001"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "device_id": "DEVICE-ABC123",
    "registered_at": "2024-07-17T10:00:00Z"
  }
}
```

---

### 2.5 Endpoints de Documentos Revocados

#### POST /api/documents/{id}/revoke
**Descripción:** Revocar documento (admin)

**Request:**
```json
{
  "reason": "Cliente solicita cancelación",
  "revoked_by": "ADMIN-001"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "document_id": "TXN-2024-000100",
    "revoked_at": "2024-07-15T08:00:00Z",
    "reason": "Cliente solicita cancelación"
  }
}
```

#### POST /api/documents/{id}/unrevoke
**Descripción:** Restaurar documento (admin)

**Request:**
```json
{
  "reason": "Error en revocación",
  "unrevoked_by": "ADMIN-001"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "document_id": "TXN-2024-000100",
    "status": "active"
  }
}
```

---

## 3. Modelos de Datos

### 3.1 Document

```typescript
interface Document {
  id: string;                    // TXN-2024-001234
  client_name: string;           // Juan Pérez García
  transaction_date: string;      // 2024-07-17
  campaign: string;              // Campaña Vacunación Q3
  location: string;              // Centro de Salud #12
  form_data: Record<string, any>; // Datos del formulario
  hash_document: string;         // SHA-256 hash
  signature: string;             // Firma ECDSA
  status: 'active' | 'revoked';
  created_at: string;            // ISO 8601
  updated_at: string;            // ISO 8601
}
```

### 3.2 Verification

```typescript
interface Verification {
  id: number;
  document_id: string;
  technician_id: string;
  technician_name: string;
  device_id: string;
  verification_date: string;     // ISO 8601
  latitude?: number;
  longitude?: number;
  result: 'VALID' | 'INVALID' | 'REVOKED';
  synced: boolean;
}
```

### 3.3 RevokedDocument

```typescript
interface RevokedDocument {
  document_id: string;
  revoked_at: string;            // ISO 8601
  reason: string;
  revoked_by: string;
}
```

### 3.4 User

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'technician';
  active: boolean;
  created_at: string;
}
```

### 3.5 Device

```typescript
interface Device {
  id: string;
  user_id: string;
  name: string;
  platform: 'android' | 'ios' | 'web';
  last_sync?: string;
  active: boolean;
}
```

### 3.6 QR Payload

```typescript
interface QRPayload {
  v: string;      // Versión
  txn: string;    // ID Transacción
  cli: string;    // Cliente
  fec: string;    // Fecha
  cam: string;    // Campaña
  loc: string;    // Ubicación
  ts: number;     // Timestamp Unix
  sig: string;    // Firma ECDSA
}
```

---

## 4. Códigos de Respuesta

### 4.1 Códigos de Éxito

| Código | Descripción |
|--------|-------------|
| 200 | OK - Operación exitosa |
| 201 | Created - Recurso creado |
| 204 | No Content - Operación sin contenido |

### 4.2 Códigos de Error

| Código | Descripción | Acción App |
|--------|-------------|------------|
| 400 | Bad Request | Mostrar error de formato |
| 401 | Unauthorized | Re-login |
| 403 | Forbidden | Mostrar "Sin permisos" |
| 404 | Not Found | Mostrar "Documento no encontrado" |
| 409 | Conflict | Reintentar |
| 422 | Unprocessable Entity | Mostrar error de validación |
| 429 | Too Many Requests | Esperar y reintentar |
| 500 | Internal Server Error | Reintentar más tarde |
| 503 | Service Unavailable | Modo offline |

### 4.3 Estructura de Error

```json
{
  "success": false,
  "error": {
    "code": "DOCUMENT_NOT_FOUND",
    "message": "El documento con ID TXN-2024-001234 no existe",
    "details": {}
  }
}
```

---

## 5. Autenticación y Seguridad

### 5.1 JWT Token

**Header:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Payload:**
```json
{
  "sub": "TECH-001",
  "name": "María López",
  "role": "technician",
  "device_id": "DEVICE-ABC123",
  "iat": 1721234567,
  "exp": 1721320967
}
```

### 5.2 Rate Limiting

| Endpoint | Límite | Ventana |
|----------|--------|---------|
| POST /api/auth/login | 5 req | 1 min |
| POST /api/verifications | 100 req | 1 min |
| GET /api/documents/* | 60 req | 1 min |
| GET /api/sync/* | 30 req | 1 min |

### 5.3 Headers de Seguridad

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
```

---

## 6. Endpoints de Health Check

#### GET /api/health
**Descripción:** Verificar estado del sistema

**Response (200):**
```json
{
  "status": "healthy",
  "timestamp": "2024-07-17T10:30:00Z",
  "services": {
    "database": "connected",
    "redis": "connected",
    "signer": "available"
  },
  "version": "1.0.0"
}
```

---

## 7. WebSocket (Opcional)

### 7.1 Conexión

```
ws://api.example.com/ws?token=eyJhbGciOiJIUzI1NiIs...
```

### 7.2 Eventos

#### Revocación en Tiempo Real
```json
{
  "event": "document_revoked",
  "data": {
    "document_id": "TXN-2024-000100",
    "revoked_at": "2024-07-15T08:00:00Z",
    "reason": "Cliente solicita cancelación"
  }
}
```

#### Actualización de App
```json
{
  "event": "app_update_available",
  "data": {
    "version": "1.1.0",
    "url": "https://releases.example.com/v1.1.0"
  }
}
```

---

*Documento generado para el proyecto Akuma QR Validator*
*Versión 1.0 - Julio 2024*
