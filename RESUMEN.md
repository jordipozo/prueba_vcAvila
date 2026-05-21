# EduManage Academic Portal — Resumen del Proyecto

Portal académico funcional de una sola página (SPA) para que profesores/educadores gestionen perfiles de estudiantes, vean un panel de control, evalúen trabajos (con asistencia opcional de IA vía Google Gemini) y hagan seguimiento del progreso académico.

---

## Tecnologías utilizadas

### Frontend
| Tecnología | Versión | Propósito |
|---|---|---|
| **React** | 19 | Librería UI basada en componentes |
| **TypeScript** | ~5.8 | Tipado estático en todo el proyecto |
| **Vite** | 6 | Build tool y dev server con HMR |
| **Tailwind CSS** | 4 | Framework CSS utilitario |
| **Lucide React** | 0.546 | Iconos SVG |
| **Motion** | 12.23 | Animaciones (sucesor de Framer Motion) |

### Backend
| Tecnología | Versión | Propósito |
|---|---|---|
| **Express** | 4.21 | Servidor HTTP Node.js |
| **@google/genai** | 1.29 | SDK de Google Gemini para IA |
| **dotenv** | 17.2 | Carga de variables de entorno |
| **tsx** | 4.21 | Ejecución de TypeScript en desarrollo |
| **esbuild** | 0.25 | Bundler para producción |

### DevOps
- **Node.js** como runtime
- **Vite** para desarrollo y build
- Variables de entorno (`.env`): `GEMINI_API_KEY`, `APP_URL`
- Desplegado como **applet de Google AI Studio** (Google Cloud Run)

---

## Estructura del proyecto

```
academic-portal-main/
├── src/
│   ├── main.tsx                  # Punto de entrada React
│   ├── App.tsx                   # Componente raíz (estado, ruteo)
│   ├── types.ts                  # Interfaces TypeScript (Student, Assignment)
│   ├── data.ts                   # Datos mock (3 estudiantes) + helpers localStorage
│   ├── index.css                 # Import de Tailwind CSS
│   └── components/
│       ├── DashboardView.tsx     # Panel de control (GPA, trabajos pendientes, progreso)
│       ├── StudentProfileView.tsx# Perfil de estudiante (asistencia, notas, gráficos)
│       ├── EvaluationPanel.tsx   # Panel de evaluación con IA Gemini
│       └── Sidebar.tsx           # Barra de navegación lateral
├── server.ts                     # Servidor Express (API, sirve SPA)
├── vite.config.ts                # Configuración de Vite
├── index.html                    # Entrada HTML
├── package.json                  # Dependencias y scripts
├── tsconfig.json                 # Configuración TypeScript
└── metadata.json                 # Metadatos para AI Studio
```

---

## Funcionalidades principales

1. **Tres vistas** con navegación por pestañas (sidebar):
   - **Dashboard**: vista general con GPA, trabajos pendientes y calificados, subida de archivos.
   - **Students**: listado de alumnos, perfil detallado (foto, carrera, año), gráfico de tendencia académica, asistencia, notas del profesor, tabla de trabajos.
   - **Evaluation Panel**: vista dividida (documento a la izquierda, formulario de calificación a la derecha).

2. **Calificación asistida por IA** con Google Gemini: analiza el documento, genera puntuación (0–100), insignia de nota, feedback cualitativo y evaluación de 5 rúbricas (Originalidad, Rigor Metodológico, Calidad de Citación, Claridad, Ética). Soporta caída a datos offline si falta la API key.

3. **Datos mock** con 3 estudiantes pre-cargados que persisten en `localStorage`.

4. **UI moderna** con Tailwind 4, animaciones con Motion, iconos Lucide, y esquema de color azul marino / teal.

5. **Pipeline de build**: `npm run build` genera frontend con Vite y backend con esbuild en `dist/`.

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia servidor en modo desarrollo (Vite HMR) |
| `npm run build` | Build de producción (frontend + servidor) |
| `npm start` | Sirve la app en producción |
| `npm run clean` | Limpia directorios `build/` y `dist/` |
| `npm run lint` | Ejecuta linter |
