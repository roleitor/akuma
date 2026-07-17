# Akuma QR Validator

Sistema de validación de documentos mediante códigos QR con soporte offline.

## Estructura del Proyecto

```
akuma/
├── backend/                    # API Server (FastAPI + Python)
│   ├── app/
│   │   ├── api/routes/        # Endpoints REST
│   │   ├── core/              # Configuración y seguridad
│   │   ├── models/            # Modelos SQLAlchemy
│   │   ├── schemas/           # Schemas Pydantic
│   │   ├── services/          # Lógica de negocio
│   │   └── repositories/      # Acceso a datos
│   ├── migrations/            # Alembic migrations
│   ├── tests/                 # Tests
│   └── requirements.txt       # Dependencias Python
│
├── frontend/                   # App Móvil (React + Capacitor)
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   ├── screens/           # Pantallas
│   │   ├── services/          # Servicios (crypto, sync, DB)
│   │   ├── stores/            # Estado global (Zustand)
│   │   ├── types/             # Tipos TypeScript
│   │   └── utils/             # Utilidades
│   ├── android/               # Capacitor Android
│   ├── ios/                   # Capacitor iOS
│   └── package.json           # Dependencias Node
│
└── docs/                       # Documentación
    └── architecture/          # Arquitectura del sistema
```

## Inicio Rápido

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Build APK (Android)

```bash
cd frontend
npm run build
npx cap add android
npx cap sync
npx cap open android
```

## API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/documents | Crear documento |
| GET | /api/documents/{id} | Obtener documento |
| GET | /api/documents/{id}/status | Estado del documento |
| POST | /api/verifications | Registrar verificación |
| POST | /api/verifications/batch | Batch de verificaciones |
| GET | /api/sync/revoked | Lista de revocados |
| POST | /api/sync/pull | Descargar documentos |
| GET | /api/health | Health check |

## Stack Tecnológico

- **Backend:** Python 3.10+, FastAPI, PostgreSQL, Redis
- **Frontend:** React 18, TypeScript, Capacitor 5, SQLite
- **Seguridad:** ECDSA (secp256r1), SHA-256, JWT
- **Offline:** SQLite embebido, sync automático

## Documentación

Ver `docs/architecture/` para documentación completa de arquitectura.
