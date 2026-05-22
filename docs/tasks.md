# Hoja de ruta — de prototipo a proyecto mantenible

## Tarea 1 — Estabilización del proyecto

**Objetivo:** Eliminar los riesgos inmediatos que dificultan el desarrollo
sin romper nada.

**Pasos:**
1. Activar `strict: true` en `tsconfig.json` y resolver los errores
   de tipo que aparezcan (faltan null checks, tipos implícitos `any`,
   etc.).
2. Instalar ESLint con `eslint flat config` y las reglas estándar para
   React + TypeScript (`eslint-plugin-react-hooks`,
   `@typescript-eslint`). Correrlo y corregir los errores.
3. Añadir script `"typecheck": "tsc --noEmit"` a `package.json`
   (separado de `lint` para poder lanzarlos por separado).
4. Añadir `"preview"` script si no existe, o unificar el comando de
   build para que falle si hay errores de compilación.
5. Centralizar colores repetidos (`#00236f`, `#14B8A6`, `#c5c5d3`,
   `#444651`, `#eff4ff`, etc.) en variables CSS en `index.css` o en
   `theme.extend.colors` de Tailwind.
6. Verificar que `npm run build` produce un bundle limpio sin warnings.

**Criterio de terminado:**
- `tsc --noEmit` pasa sin errores.
- `npm run lint` pasa sin errores.
- `npm run build` genera `dist/` sin warnings.
- Los colores principales están definidos en un solo sitio.

**Riesgo principal:**
Activar `strict` puede revelar decenas de errores. Si son muchos,
valorar dejarlo como tarea separada o aplicar `strict` solo en
ficheros nuevos.
---

## Tarea 2 — Arquitectura y estructura de carpetas

**Objetivo:** Reorganizar el código en una estructura ligera que haga
visible la separación de responsabilidades sin añadir complejidad
empresarial.

```
src/
├── app/              # Entrada de la aplicación
│   ├── main.tsx      # Punto de entrada (ya existe)
│   ├── App.tsx       # Montaje de vistas (se simplificará)
│   └── index.css     # Estilos globales
│
├── features/         # Una carpeta por funcionalidad
│   ├── dashboard/    # Vista Dashboard + lógica asociada
│   ├── students/     # Vista StudentProfile + lógica asociada
│   └── evaluation/   # Panel de evaluación + lógica asociada
│
├── shared/           # Componentes y utilidades compartidas
│   ├── components/   # Sidebar, modales reutilizables, etc.
│   └── lib/          # util.ts, constantes, etc.
│
├── data/             # Acceso a datos (antes data.ts)
│   ├── students.ts   # mock data + persistencia localStorage
│   ├── hooks/        # useStudents, useAssignments, etc.
│   └── types.ts      # Interfaces generales
│
└── tests/            # Tests agrupados por feature o globales
    ├── setup.ts
    ├── data/
    ├── features/
    └── shared/
```

**Pasos:**
1. Crear la estructura de carpetas dentro de `src/`.
2. Mover ficheros existentes a su nueva ubicación:
   - `src/main.tsx`, `App.tsx` e `index.css` → `src/app/`
   - `src/types.ts` y `src/data.ts` → `src/data/`
   - `src/components/Sidebar.tsx` → `src/shared/components/`
   - Cada vista (DashboardView, StudentProfileView, EvaluationPanel)
     → su carpeta dentro de `features/`
3. Ajustar imports en todos los ficheros movidos.
4. Verificar que la app sigue funcionando (`npm run dev`).
5. Añadir barrel files (`index.ts`) opcionales si agrupan varias
   exportaciones.

**Criterio de terminado:**
- La app arranca y se comporta igual que antes.
- Cada fichero está en la carpeta que describe su responsabilidad.
- No hay imports circulares.

**Riesgo principal:**
Mover muchos ficheros de golpe puede generar conflictos si hay
trabajo en paralelo. Hacerlo en un solo commit limpio.
---

## Tarea 3 — Separación de componentes

**Objetivo:** Reducir el tamaño de `StudentProfileView.tsx` (649 lín.)
y `DashboardView.tsx` (501 lín.) extrayendo partes con
responsabilidad clara en componentes independientes.

**Pasos:**

*Sobre StudentProfileView:*
1. Extraer la tabla de asignaciones → `AssignmentTable.tsx`.
2. Extraer el perfil del alumno (cabecera con foto, datos, nota
   media) → `ProfileHeader.tsx`.
3. Extraer el gráfico de tendencia académica → `AcademicTrendChart.tsx`.
4. Extraer el modal de notas del profesor → `ProfessorNotesModal.tsx`.
5. Extraer el modal de contacto → `ContactStudentModal.tsx`.

*Sobre DashboardView:*
1. Extraer el encabezado con selector de alumno → `DashboardHeader.tsx`.
2. Extraer la tarjeta de KPI (nota media circular) → `GaugeCard.tsx`.
3. Extraer la zona de subida rápida → `QuickSubmissionCard.tsx`.
4. Extraer la lista de tareas pendientes → `PendingAssignmentsList.tsx`.
5. Extraer la sección de evaluaciones recientes → `RecentGradedList.tsx`.

*Sobre EvaluationPanel:*
1. Evaluar si el visor de documentos → `DocumentViewer.tsx` merece
   separarse (está en 105 líneas, viable para mantenerlo o
   extraerlo).
2. Extraer el formulario de rúbricas → `RubricChecklist.tsx`.

**Criterio de terminado:**
- Todos los nuevos componentes tienen una responsabilidad única.
- El fichero más grande del proyecto no supera las 300 líneas.
- La app funciona exactamente igual que antes.

**Riesgo principal:**
Dividir en exceso puede generar demasiados ficheros diminutos. Parar
cuando cada componente haga una cosa y sea legible sin scroll
excesivo.
---

## Tarea 4 — Separación de datos y lógica

**Objetivo:** Sacar la lógica de negocio de `App.tsx` y de los
componentes de vista para que sea reutilizable y testeable.

**Pasos:**
1. Crear un hook `useStudents.ts` en `src/data/hooks/` que encapsule:
   - Carga inicial de datos (`getStudents()`).
   - `handleUpdateAssignment(studentId, assignmentId, fields)`.
   - `handleAddSubmission(studentId, assignmentId, text, title)`.
   - `handleUpdateProfessorNotes(studentId, notes)`.
   - Estado `students` y `setStudents`.
   - Persistencia automática (`saveStudents`).
2. Refactorizar `App.tsx` para que use `useStudents()` en lugar de
   tener los handlers inline.
3. Crear un hook `useEvaluation.ts` que encapsule la lógica del panel
   de evaluación (score, rubrics, feedback, llamada a Gemini).
4. Mover la lógica de filtrado (searchQuery, semesterFilter) a
   `useMemo` dentro de los hooks o a funciones puras en
   `src/shared/lib/filters.ts`.
5. Extraer constantes (mensajes, textos de UI, config) a
   `src/shared/lib/constants.ts`.
6. Extraer funciones de formateo (cálculo de letra, badge, GPA)
   a `src/shared/lib/format.ts`.

**Criterio de terminado:**
- `App.tsx` no contiene handlers de más de 5 líneas.
- Los hooks son la única fuente de estado de los alumnos.
- Las funciones puras (`formatGrade`, `filterBySearch`, etc.) se
  pueden importar sin depender de React.

**Riesgo principal:**
Los hooks pueden crecer demasiado si no se separan bien. Dividir
`useStudents` en `useStudentList` y `useStudentMutations` si supera
las 100 líneas.
---

## Tarea 5 — Configuración de calidad: lint, typecheck, tests y build

**Objetivo:** Tener un sistema de verificación automática que
garantice que el código es correcto antes de integrar.

**Pasos:**
1. Instalar y configurar **Vitest** como test runner.
2. Instalar `@testing-library/react` y `@testing-library/jest-dom`.
3. Crear `vitest.config.ts` con cobertura y entorno jsdom.
4. Añadir scripts en `package.json`:
   ```json
   "test": "vitest run",
   "test:watch": "vitest",
   "test:coverage": "vitest run --coverage",
   "typecheck": "tsc --noEmit",
   "lint": "eslint src/",
   "check": "npm run typecheck && npm run lint && npm run test && npm run build"
   ```
5. Configurar ESLint con:
   - `typescript-eslint`
   - `eslint-plugin-react-hooks`
   - `eslint-plugin-react` (react 19 compatible)
   - Regla `no-console` como warning (excepto server.ts).
6. Verificar que `npm run check` pasa limpio.

**Criterio de terminado:**
- `npm run check` ejecuta typecheck + lint + tests + build y sale con
  código 0.
- Hay ficheros de configuración (`vitest.config.ts`, `eslint.config.*`)
  versionados.

**Riesgo principal:**
Si ESLint da muchas reglas rotas, empezar con `warn` y subir a
`error` progresivamente.
---

## Tarea 6 — Primer test real sobre una parte importante

**Objetivo:** Validar que la infraestructura de tests funciona y
cubrir la lógica de datos, que es crítica y no depende del DOM.

**Pasos:**
1. Escribir tests para `src/data/students.ts`:
   - Test A: `getStudents()` devuelve alumnos cuando localStorage
     está vacío (carga datos iniciales).
   - Test B: `saveStudents()` persiste correctamente y
     `getStudents()` lo recupera.
   - Test C: Un alumno tiene asignaciones con la estructura correcta
     (validación de tipos).
2. Mockear `localStorage` con `vitest-mock-extended` o un helper
   manual (`beforeEach` + `afterEach`).
3. Escribir tests para las funciones puras de `src/shared/lib/format.ts`:
   - `formatGrade(score)` devuelve la letra correcta.
   - `calculateAverage(scores, format)` devuelve el promedio en el
     formato adecuado.
4. Verificar cobertura mínima en estas dos unidades (>80 %).

**Criterio de terminado:**
- Todos los tests pasan con `npm run test`.
- La cobertura de `src/data/` y `src/shared/lib/format.ts` supera
  el 80 %.

**Riesgo principal:**
Mockear localStorage puede ser frágil. Usar
`vitest-plugin-localstorage` o un mock manual simple.
---

## Tarea 7 — Mejoras funcionales

**Objetivo:** Añadir valor real a la aplicación aprovechando que la
base ya es mantenible.

**Pasos propuestos (priorizar según necesidad):**
1. **Indicador de carga global** — Añadir un estado de carga
   mientras `getStudents()` se ejecuta (aunque sea síncrono, prepara
   el terreno para una futura API).
2. **Manejo de errores** — Envolver las vistas con un
   `ErrorBoundary` en `App.tsx` para que un fallo en una vista no
   tumbe toda la app.
3. **Confirmación antes de guardar** — El `alert()` del panel de
   evaluación puede reemplazarse por un toast no bloqueante (un
   componente simple o una librería mínima).
4. **Navegación con React Router** — Si se prevén más vistas,
   migrar el `useState` de `App.tsx` a `react-router-dom`.
5. **Accesibilidad** — Añadir `aria-label`, `role` y navegación por
   teclado a los elementos interactivos principales.
6. **Internacionalización** — Extraer textos a un fichero de locale
   (solo si el proyecto necesita multi-idioma).

**Criterio de terminado:**
- Las mejoras implementadas no rompen ningún test existente.
- No se añade deuda técnica nueva (cada mejora sigue la arquitectura
  definida).

**Riesgo principal:**
Es tentador añadir muchas mejoras. Elegir 2-3 que aporten más valor
y dejar el resto para otra iteración.
---

## Tarea 8 — Documentación final

**Objetivo:** Dejar el proyecto documentado para que cualquier
persona (o IA) pueda entenderlo y contribuir sin curva de
aprendizaje.

**Pasos:**
1. Actualizar `README.md` con:
   - Descripción del proyecto.
   - Requisitos (Node, npm).
   - Comandos disponibles (`dev`, `build`, `test`, `lint`,
     `typecheck`, `check`).
   - Variables de entorno necesarias (`GEMINI_API_KEY`).
2. Crear `docs/architecture.md`:
   - Explicación breve de la estructura de carpetas.
   - Árbol actualizado del proyecto.
   - Flujo de datos (componente → hook → data → localStorage).
3. Añadir comentarios JSDoc a las funciones públicas (hooks, data,
   format).
4. Revisar `AGENTS.md` y actualizarlo si hace falta.

**Criterio de terminado:**
- `README.md` contiene todo lo necesario para arrancar y contribuir.
- `docs/architecture.md` describe la estructura y el flujo de datos.
- Cualquier función exportada tiene JSDoc mínimo (qué hace, qué
  recibe, qué devuelve).

**Riesgo principal:**
La documentación se queda obsoleta rápido. Mantenerla solo para lo
que cambia poco (arquitectura, comandos) y evitar documentar
implementaciones volátiles.
