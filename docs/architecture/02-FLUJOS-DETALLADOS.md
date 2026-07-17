# Flujos Detallados del Sistema

## 1. Flujo General del Sistema

```mermaid
graph TB
    subgraph "FASE 1: GENERACIÓN"
        A[Cliente llena formulario] --> B[Sistema existente procesa]
        B --> C[Genera documento]
        C --> D[Firma digital con token]
        D --> E[Genera QR con firma]
        E --> F[Cliente recibe QR]
    end
    
    subgraph "FASE 2: VERIFICACIÓN"
        G[Técnico abre app] --> H[Escanea QR]
        H --> I[App verifica firma]
        I --> J{¿Firma válida?}
        J -->|Sí| K[Verifica documento local]
        J -->|No| L[Rechaza - QR falso]
        K --> M{¿Documento existe?}
        M -->|Sí| N[Verifica revocación]
        M -->|No| O[Rechaza - No existe]
        N --> P{¿Revocado?}
        P -->|No| Q[Muestra resultado VÁLIDO]
        P -->|Sí| R[Rechaza - Revocado]
    end
    
    subgraph "FASE 3: AUDITORÍA"
        Q --> S[Registra verificación]
        S --> T[Guarda en SQLite]
        T --> U{¿Hay internet?}
        U -->|Sí| V[Sincroniza con servidor]
        U -->|No| W[Marca pendiente sync]
    end
    
    F --> G
```

---

## 2. Flujo de Generación de QR

```mermaid
sequenceDiagram
    participant C as Cliente
    participant S as Sistema Existente
    participant FS as Firma Service
    participant QR as QR Generator
    participant DB as Base de Datos

    C->>S: Llena formulario
    S->>S: Valida datos
    S->>FS: Solicita firma digital
    FS->>FS: Serializa datos
    FS->>FS: Calcula SHA-256
    FS->>FS: Firma con clave privada ECDSA
    FS-->>S: Retorna firma
    S->>QR: Genera QR (datos + firma)
    QR->>QR: Agrega logo empresa
    QR-->>S: Retorna imagen QR
    S->>DB: Almacena documento
    S-->>C: Entrega QR (imagen/PDF)
```

---

## 3. Flujo de Verificación Offline

```mermaid
sequenceDiagram
    participant T as Técnico
    participant APP as App Móvil
    participant SC as Scanner
    participant CR as Crypto Service
    participant DB as SQLite Local

    T->>APP: Abre app
    APP->>T: Muestra pantalla escaneo
    T->>SC: Escanea QR
    SC->>SC: Decodifica contenido
    SC->>APP: Retorna datos JSON
    APP->>APP: Separa campos y firma
    APP->>CR: Verifica firma
    CR->>CR: Serializa campos
    CR->>CR: Calcula SHA-256
    CR->>CR: Verifica ECDSA con clave pública
    CR-->>APP: Resultado firma
    APP->>DB: Consulta documento
    DB-->>APP: ¿Existe?
    APP->>DB: Consulta revocados
    DB-->>APP: ¿Revocado?
    APP->>APP: Determina resultado
    APP->>T: Muestra resultado
```

---

## 4. Flujo de Sincronización

```mermaid
sequenceDiagram
    participant APP as App Móvil
    participant NET as Network Detector
    participant SYNC as Sync Service
    participant API as Backend API
    participant DB as PostgreSQL

    Note over APP,DB: App detecta conexión a internet
    NET->>SYNC: Conexión disponible
    SYNC->>APP: Consulta datos pendientes
    APP-->>SYNC: Retorna verificaciones no sync
    
    loop Para cada verificación pendiente
        SYNC->>API: POST /api/verifications
        API->>DB: Almacena verificación
        API-->>SYNC: OK
        SYNC->>APP: Marca como sincronizada
    end
    
    SYNC->>API: GET /api/revoked
    API->>DB: Consulta documentos revocados
    DB-->>API: Retorna lista
    API-->>SYNC: Lista de revocados
    SYNC->>APP: Actualiza lista local
```

---

## 5. Flujo de Revocación

```mermaid
sequenceDiagram
    participant ADM as Administrador
    participant API as Backend API
    participant DB as PostgreSQL
    participant REDIS as Redis Cache
    participant APP as App Técnico
    participant SQLITE as SQLite Local

    ADM->>API: POST /api/documents/{id}/revoke
    API->>DB: INSERT INTO revoked_documents
    API->>REDIS: Invalida cache del documento
    API-->>ADM: Documento revocado
    
    Note over APP,SQLITE: Próximo sync automático
    APP->>API: GET /api/revoked
    API->>DB: SELECT documentos revocados
    DB-->>API: Retorna lista
    API-->>APP: Lista de revocados
    APP->>SQLITE: Actualiza tabla local_revoked
    
    Note over APP,SQLITE: Próxima verificación
    APP->>SQLITE: Consulta si está revocado
    SQLITE-->>APP: Sí, está revocado
    APP-->>T: Muestra REVOCADO
```

---

## 6. Flujo de Autenticación

```mermaid
sequenceDiagram
    participant T as Técnico
    participant APP as App Móvil
    participant API as Backend API
    participant DB as PostgreSQL

    T->>APP: Ingresa credenciales
    APP->>API: POST /api/auth/login
    API->>DB: SELECT usuario
    DB-->>API: Retorna usuario
    API->>API: Valida contraseña
    API->>API: Genera JWT token
    API-->>APP: Token JWT
    APP->>APP: Almacena token localmente
    APP->>T: Login exitoso
    
    Note over APP,API: Requests subsecuentes
    APP->>API: Request con header Authorization
    API->>API: Valida JWT
    API-->>APP: Response
```

---

## 7. Flujo de Verificación con Internet

```mermaid
sequenceDiagram
    participant T as Técnico
    participant APP as App Móvil
    participant SC as Scanner
    participant CR as Crypto Service
    participant SQLITE as SQLite Local
    participant API as Backend API

    T->>APP: Escanea QR
    APP->>SC: Decodifica QR
    SC-->>APP: Datos + firma
    APP->>CR: Verifica firma (offline)
    CR-->>APP: Firma válida
    APP->>SQLITE: Consulta documento local
    SQLITE-->>APP: Documento existe
    
    alt Hay internet
        APP->>API: GET /api/documents/{id}/status
        API-->>APP: Estado actualizado + revocados
        APP->>SQLITE: Actualiza cache local
    end
    
    APP->>APP: Determina resultado final
    APP->>T: Muestra resultado
```

---

## 8. Diagrama de Estados - Documento

```mermaid
stateDiagram-v2
    [*] --> Creado: Sistema genera documento
    Creado --> Firmado: Firma digital aplicada
    Firmado --> QR_Generado: QR creado
    QR_Generado --> Entregado: Cliente recibe QR
    Entregado --> Verificado: Técnico verifica
    Entregado --> Revocado: Administrador revoca
    Verificado --> Verificado: Re-verificado
    Revocado --> [*]
```

---

## 9. Diagrama de Estados - Verificación

```mermaid
stateDiagram-v2
    [*] --> Escaneando: Técnico escanea QR
    Escaneando --> Verificando_Firma: QR decodificado
    Verificando_Firma --> Firma_Inválida: Firma no válida
    Verificando_Firma --> Verificando_Documento: Firma válida
    Firma_Inválida --> Rechazado: QR falsificado
    Verificando_Documento --> Documento_No_Encontrado: No existe local
    Verificando_Documento --> Verificando_Revocación: Documento existe
    Documento_No_Encontrado --> Rechazado: Documento no registrado
    Verificando_Revocación --> Revocado: Está en lista revocados
    Verificando_Revocación --> Aprobado: No revocado
    Revocado --> Rechazado: Documento revocado
    Aprobado --> Registrando: Guarda auditoría
    Registrando --> Sincronizando: ¿Internet disponible?
    Sincronizando --> Completado: Sync exitoso
    Sincronizando --> Pendiente_Sync: Sin internet
    Pendiente_Sync --> Sincronizando: Internet disponible
    Completado --> [*]
    Rechazado --> [*]
```

---

## 10. Diagrama de Secuencia - Caso de Uso Principal

```mermaid
graph LR
    subgraph "Actor"
        T[Técnico]
    end
    
    subgraph "Sistema"
        APP[App Móvil]
        SC[Scanner]
        CR[Crypto]
        DB[SQLite]
        API[Backend]
    end
    
    subgraph "Externo"
        QR[QR Code]
    end
    
    T -->|1. Escanea| QR
    QR -->|2. Datos| SC
    SC -->|3. JSON| APP
    APP -->|4. Verifica| CR
    CR -->|5. Resultado| APP
    APP -->|6. Consulta| DB
    DB -->|7. Resultado| APP
    APP -->|8. Muestra| T
    
    APP -.->|9. Sync| API
```

---

## 11. Flujos Alternativos

### 11.1 QR Dañado o No Legible

```mermaid
graph TD
    A[Escaneo fallido] --> B{¿Intentalo de nuevo?}
    B -->|Sí| A
    B -->|No| C[Mostrar error]
    C --> D[Opción: Ingreso manual ID]
    D --> E[Verificar por ID]
```

### 11.2 Dispositivo Sin GPS

```mermaid
graph TD
    A[Verificación exitosa] --> B{GPS disponible?}
    B -->|Sí| C[Capturar ubicación]
    B -->|No| D[Registrar sin ubicación]
    C --> E[Guardar verificación]
    D --> E
```

### 11.3 Base de Datos Local Corrupta

```mermaid
graph TD
    A[Error SQLite] --> B[Detectar corrupción]
    B --> C[Crear backup corrupto]
    C --> D[Recrear base de datos]
    D --> E[ Solicitar re-sync completo]
    E --> F[Descargar datos del servidor]
    F --> G[Base de datos restaurada]
```

---

## 12. Casos de Uso Detallados

### CU-001: Verificar Documento

| Campo | Descripción |
|-------|-------------|
| **ID** | CU-001 |
| **Nombre** | Verificar Documento |
| **Actor** | Técnico |
| **Precondiciones** | App instalada, técnico autenticado |
| **Postcondiciones** | Verificación registrada |

**Flujo Principal:**
1. Técnico selecciona "Escanear QR"
2. App activa cámara
3. Técnico apunta al QR del cliente
4. App decodifica QR
5. App verifica firma digital
6. App verifica documento en SQLite
7. App verifica lista de revocados
8. App muestra resultado (VÁLIDO/INVÁLIDO/REVOCADO)
9. App muestra campos clave del documento
10. Técnico presiona "Confirmar Verificación"
11. App registra verificación con timestamp y GPS

**Flujos Alternativos:**
- 5a. Firma inválida: App muestra "QR FALSO - Documento no válido"
- 6a. Documento no encontrado: App muestra "Documento no registrado"
- 7a. Documento revocado: App muestra "DOCUMENTO REVOCADO"

### CU-002: Ver Reporte Completo

| Campo | Descripción |
|-------|-------------|
| **ID** | CU-002 |
| **Nombre** | Ver Reporte Completo |
| **Actor** | Técnico |
| **Precondiciones** | Verificación exitosa, conexión a internet |
| **Postcondiciones** | PDF descargado y mostrado |

**Flujo Principal:**
1. Después de verificación exitosa
2. Técnico selecciona "Ver Reporte Completo"
3. App verifica conexión a internet
4. Si hay internet: descarga PDF desde servidor
5. App muestra PDF en visor embebido
6. Técnico puede hacer zoom, scroll
7. Técnico cierra visor

**Flujos Alternativos:**
- 3a. Sin internet: App muestra "Reporte disponible solo con conexión"

### CU-003: Sincronizar Datos

| Campo | Descripción |
|-------|-------------|
| **ID** | CU-003 |
| **Nombre** | Sincronizar Datos |
| **Actor** | Sistema (automático) |
| **Precondiciones** | Conexión a internet disponible |
| **Postcondiciones** | Datos sincronizados |

**Flujo Principal:**
1. App detecta conexión a internet
2. App consulta verificaciones pendientes de sync
3. App envía verificaciones al servidor
4. Servidor almacena verificaciones
5. App descarga lista de revocados actualizada
6. App actualiza SQLite local
7. App marca datos como sincronizados

---

## 13. Matriz de Traceabilidad

| Requisito | Caso de Uso | Componente | API Endpoint |
|-----------|-------------|------------|--------------|
| RF-001 | CU-001 | QR Generator | POST /api/documents |
| RF-010 | CU-001 | QR Scanner | - |
| RF-011 | CU-001 | Crypto Service | - |
| RF-014 | CU-001 | Result Screen | - |
| RF-020 | CU-001 | Audit Service | POST /api/verifications |
| RF-030 | CU-003 | Sync Service | GET /api/sync |
| RF-032 | CU-003 | Revoked Service | GET /api/revoked |

---

*Documento generado para el proyecto Akuma QR Validator*
*Versión 1.0 - Julio 2024*
