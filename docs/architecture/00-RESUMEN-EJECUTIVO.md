# Resumen Ejecutivo - Arquitectura del Sistema

## Visión General

El **Akuma QR Validator** es un sistema diseñado para validar documentos mediante códigos QR en áreas con conectividad limitada. Reemplaza el proceso manual de verificación con papel por una solución digital que funciona offline.

---

## Documentación Generada

| Documento | Contenido |
|-----------|-----------|
| `01-ARQUITECTURA-SOFTWARE.md` | Requisitos funcionales/no funcionales, stack tecnológico, diagramas C4, modelo de datos, seguridad |
| `02-FLUJOS-DETALLADOS.md` | Diagramas de flujo, secuencia, estados, casos de uso |
| `03-MODULOS-API.md` | Especificación de módulos, contratos API, modelos de datos |

---

## Arquitectura Resumida

```
┌─────────────────────────────────────────────────────────────────┐
│                    ARQUITECTURA GENERAL                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────┐      ┌──────────────────────┐       │
│  │    APP MÓVIL         │      │    BACKEND API       │       │
│  │    (PWA + Capacitor) │      │    (FastAPI)         │       │
│  │                      │      │                      │       │
│  │  ├── React 18        │      │  ├── Python 3.10+    │       │
│  │  ├── TypeScript      │      │  ├── PostgreSQL 14   │       │
│  │  ├── SQLite Local    │◀────▶│  ├── Redis 7         │       │
│  │  ├── ECDSA Verify    │ HTTPS│  ├── ECDSA Sign      │       │
│  │  └── Offline First   │      │  └── JWT Auth        │       │
│  └──────────────────────┘      └──────────────────────┘       │
│                                                                 │
│  Plataformas: Android 8+, iOS 15+, Web                         │
│  Usuarios: 200-500 técnicos                                    │
│  Conectividad: Offline first, sync cuando haya internet        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Requisitos Clave

### Funcionales
| ID | Requisito | Estado |
|----|-----------|--------|
| RF-001 | Generar QR único por transacción | Pendiente |
| RF-010 | Escanear QR con cámara | Pendiente |
| RF-011 | Verificar firma digital ECDSA | Pendiente |
| RF-014 | Mostrar resultado VÁLIDO/INVÁLIDO/REVOCADO | Pendiente |
| RF-017 | Funcionar 100% offline | Pendiente |
| RF-020 | Registrar auditoría (quién, cuándo, dónde) | Pendiente |
| RF-030 | Sincronizar datos cuando haya internet | Pendiente |

### No Funcionales
| ID | Requisito | Métrica |
|----|-----------|---------|
| RNF-001 | Tiempo verificación offline | < 3 segundos |
| RNF-010 | Disponibilidad offline | 100% |
| RNF-020 | Firma digital ECDSA | Clave privada en servidor |
| RNF-030 | Compatibilidad Android | 8.0+ |
| RNF-031 | Compatibilidad iOS | 15+ |

---

## Stack Tecnológico

### Frontend
- **Framework:** React 18 + TypeScript
- **Bundler:** Vite 5
- **UI:** Tailwind CSS + Headless UI
- **State:** Zustand + Zustand Persist
- **Wrapper:** Capacitor 5
- **SQLite:** @capacitor-community/sqlite
- **QR:** html5-qrcode
- **Crypto:** elliptic (ECDSA) + crypto-js (SHA-256)

### Backend
- **Lenguaje:** Python 3.10+
- **Framework:** FastAPI 0.104+
- **ORM:** SQLAlchemy 2.0
- **DB:** PostgreSQL 14
- **Cache:** Redis 7
- **Auth:** JWT (python-jose)
- **Crypto:** cryptography (ECDSA)

### Infraestructura
- **Servidor:** AWS EC2 / Azure VM / On-premise
- **CI/CD:** GitHub Actions
- **Monitoreo:** Prometheus + Grafana
- **Errores:** Sentry

---

## Seguridad

```
┌─────────────────────────────────────────────────────────────────┐
│                    CAPAS DE SEGURIDAD                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. FIRMA DIGITAL (ECDSA secp256r1)                            │
│     ├── Clave privada: Solo en servidor (HSM/Key Vault)        │
│     ├── Clave pública: Embebida en app                         │
│     └── Garantiza: Autenticidad + Integridad                   │
│                                                                 │
│  2. HASH (SHA-256)                                             │
│     └── Garantiza: Integridad de datos del QR                  │
│                                                                 │
│  3. JWT TOKEN                                                  │
│     ├── Expiración: 24 horas                                   │
│     └── Refresh token para sesiones largas                     │
│                                                                 │
│  4. HTTPS                                                      │
│     └── TLS 1.2+ obligatorio                                   │
│                                                                 │
│  5. AUDITORÍA                                                  │
│     ├── Cada verificación: técnico, fecha, GPS, resultado      │
│     └── Logs estructurados en servidor                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Estructura del QR

```json
{
  "v": "1.0",
  "txn": "TXN-2024-001234",
  "cli": "Juan Pérez García",
  "fec": "2024-07-17",
  "cam": "Campaña Vacunación Q3",
  "loc": "Centro de Salud #12",
  "ts": 1721234567,
  "sig": "MEUCIQDx8k2m..."
}
```

**Tamaño:** ~200-300 bytes  
**Nivel corrección:** H (30%) - permite logo de empresa

---

## Flujo Principal

```
GENERACIÓN:
1. Cliente llena formulario
2. Sistema genera documento
3. Firma digital con token externo
4. Genera QR con firma ECDSA
5. Cliente recibe QR

VERIFICACIÓN (Offline):
1. Técnico escanea QR
2. App verifica firma con clave pública
3. App verifica documento en SQLite local
4. App verifica lista de revocados
5. Muestra resultado (2-3 segundos)

SINCRONIZACIÓN:
1. App detecta internet
2. Envía verificaciones pendientes
3. Descarga lista de revocados actualizada
4. Actualiza caché local
```

---

## Cronograma

| Fase | Duración | Entregable |
|------|----------|------------|
| Configuración | 1 semana | Repo, claves, estructura |
| Backend | 2 semanas | API completa |
| Frontend | 3 semanas | App completa |
| Integración | 1 semana | Conexión frontend-backend |
| QA y Seguridad | 1 semana | Tests y auditoría |
| Despliegue | 1 semana | Producción |
| **Total** | **9 semanas** | **Sistema completo** |

---

## Costos Estimados

| Concepto | Costo |
|----------|-------|
| Desarrollo (9 semanas) | $4,500 - $9,000 |
| Servidor (mensual) | $50 - $150 |
| Apple Developer (anual) | $99 |
| Google Play (único) | $25 |
| **Total inicial** | **$4,624 - $9,124** |

---

## Próximos Pasos

1. **Aprobación de arquitectura** - Revisar y aprobar documentación
2. **Configuración inicial** - Crear repositorio, generar claves
3. **Desarrollo backend** - API FastAPI + PostgreSQL
4. **Desarrollo frontend** - App React + Capacitor
5. **Integración** - Conectar frontend con backend
6. **Testing** - Pruebas unitarias, integración, seguridad
7. **Despliegue** - Producción + distribución app

---

## Contacto y Soporte

| Rol | Responsabilidad |
|-----|-----------------|
| Arquitecto de Software | Diseño y documentación |
| Líder Técnico | Implementación |
| Product Owner | Requisitos y aprobaciones |
| Security Analyst | Auditoría de seguridad |

---

*Documento generado para el proyecto Akuma QR Validator*  
*Versión 1.0 - Julio 2024*
