# Modelo de Dominio Conceptual

## Alcance del modelo

Cubre los conceptos centrales del sistema PSA para PCA: desde campañas de marketing que generan leads, el ciclo de ventas (oportunidades, cotizaciones, cierre), la gestión de clientes, tickets de soporte, hasta la ejecución de proyectos (desarrollo e implementación) con registro de horas para medir rentabilidad de productos.

## Inputs usados

- `docs/descubrimiento/minutas/2026-04-13-meet-ceo.md`
- `docs/descubrimiento/minutas/2026-04-23-meet-marketing.md`
- `docs/descubrimiento/minutas/2026-04-23-meet-ventas.md`
- `docs/descubrimiento/minutas/2026-04-23-meet-operaciones.md`
- `docs/descubrimiento/minutas/2026-04-30-meet-proyectos.md`
- `docs/descubrimiento/minutas/2026-05-07-meet-prospecto.md`
- `docs/vision/vision-modulo.md`
- `docs/requisitos/historias-dominio.md`
- `docs/requisitos/historias-usuario.md`
- `docs/requisitos/matriz-trazabilidad.md`
- `docs/requisitos/features/`

## Historias priorizadas tomadas como base

| Historia | Recorte que aporta al modelo | Escenarios o evidencia usada |
| --- | --- | --- |
| `HU-01` | Introduce los conceptos de `Campaña` y `Lead`, incluyendo la asociación entre campañas y prospectos generados. | `docs/requisitos/features/HU-01.feature` |
| `HU-02` | Define el ciclo comercial del dominio: `Lead` → `Oportunidad` → `Cliente`, incluyendo etapas de oportunidad y cierre de ventas. | `docs/requisitos/features/HU-02.feature`, historia de dominio "Conversión de lead a cliente" |
| `HU-03` | Introduce la creación de `Lead` por parte de Ventas, reforzando sus atributos obligatorios. | `docs/requisitos/features/HU-03.feature` |
| `HU-04` | Define el ciclo de vida y la gestión de un `Lead` (edición, cambio de estado) y la regla para convertirlo en `Oportunidad`. | `docs/requisitos/features/HU-04.feature` |
| `HU-05` | Confirma que `Lead` es una entidad central y consultable por el equipo de ventas. | `docs/requisitos/features/HU-05.feature` |
| `HU-06` | Confirma que `Oportunidad` es una entidad central y consultable para la gestión del pipeline. | `docs/requisitos/features/HU-06.feature` |
| `HU-07` | Confirma que `Cliente` es una entidad central y consultable para la gestión post-venta. | `docs/requisitos/features/HU-07.feature` |

## Clases conceptuales

| Clase | Evidencia visible | Justificación breve |
|---|---|---|
| Campaña | minuta marketing, minuta prospecto | objeto de trabajo principal de marketing; contiene nombre, costo, vigencia, tipo, canales |
| Lead | minuta marketing, minuta ventas, minuta prospecto | potencial cliente que se origina de una campaña o por aproximación directa |
| Oportunidad | minuta ventas, minuta prospecto | seguimiento de una posible venta con etapas, monto y observaciones |
| Cliente | minuta ventas, minuta prospecto | empresa que contrata productos/servicios; contiene razón social, CUIT, dirección |
| Producto | minuta CEO, minuta proyectos, minuta prospecto | bien o servicio que la empresa commercializa |
| Ticket | minuta ventas, minuta operaciones | consulta o reclamo de cliente con prioridad, severidad, estado y SLA |
| Proyecto | minuta operaciones, minuta proyectos | iniciativa de desarrollo o implementación vinculada a un producto |
| Tarea | minuta proyectos | unidad de trabajo dentro de un proyecto |
| RegistroHoras | minuta proyectos | carga horaria de un empleado por tarea y día |
| Empleado | minuta proyectos | persona que registra horas trabajadas en tareas |

## Asociaciones

| Clase A | Relación | Clase B | Multiplicidad A | Multiplicidad B | Evidencia |
|---|---|---|---|---|---|
| Campaña | genera | Lead | 0..1 | 0..* | minuta marketing: "asociar cada prospect/lead a la campaña que lo originó"; leads pueden originarse también por aproximación directa |
| Lead | se convierte en | Oportunidad | 1 | 0..1 | minuta prospecto: "Lead → Oportunidad"; un lead puede convertirse en una oportunidad |
| Oportunidad | negocia con | Cliente | * | 1 | minuta ventas: "una oportunidad es el seguimiento de una posible venta a un cliente" |
| Oportunidad | incluye | Producto | * | * | minuta prospecto: "registrar en una misma venta todos los productos que se consideraron" |
| Cliente | reporta | Ticket | 1 | 0..* | minuta operaciones: "cada consulta de soporte genere un ticket" asociado al cliente |
| Cliente | recibe | Proyecto | 1 | 0..* | minuta operaciones: "proyectos de implementación para clientes que contratan" |
| Proyecto | pertenece a | Producto | * | 1 | minuta proyectos: "cada proyecto está vinculado directamente a un producto" |
| Proyecto | contiene | Tarea | 1 | 0..* | minuta proyectos: "cada tarea está vinculada a un proyecto" |
| Tarea | tiene | RegistroHoras | 1 | 0..* | minuta proyectos: "cuántas horas cada persona trabajó en cada tarea" |
| Empleado | registra | RegistroHoras | 1 | 0..* | minuta proyectos: "cada empleado registre cuántas horas trabajó" |

## Atributos

| Clase | Atributo | Evidencia |
|---|---|---|
| Campaña | nombre | minuta marketing: "le ponemos un nombre a la campaña" |
| Campaña | presupuesto | minuta marketing: "cuál es el presupuesto asignado a estas campañas" |
| Campaña | fechaInicio, fechaFin | minuta marketing: "cuál es la vigencia, cuándo empieza, cuándo termina" |
| Campaña | descripcion | minuta marketing: "texto con una descripción de qué se trata" |
| Campaña | estadocampania | minuta marketing: “las campañas van pasando por diferentes etapas” |
| Campaña | tipo | minuta marketing: "campaña de lanzamiento, mantenimiento de marca, capacitación" |
| Lead | id | control técnico interno e identificador de prospecto |
| Lead | nombre | minuta marketing: inferido de la gestion de presupuestos |
| Lead | origen | minuta marketing: "a partir de qué campaña / cómo se enteró de nosotros" |
| Lead | estado | minuta prospecto: "nuevo, contactado, calificado" |
| Lead | fechaAlta | marca de tiempo de registro del lead |
| Lead | contacto | canal o información de contacto directo (email, teléfono) |
| Oportunidad | etapa | minuta prospecto: "negociación, ganada, perdida" |
| Oportunidad | montoFinal | minuta prospecto: "monto final" de la negociación |
| Oportunidad | observaciones | minuta prospecto: "observaciones" de cómo terminó |
| Oportunidad | estadoOportunidad | minuta prospecto: “cada uno de estos clientes o potenciales clientes prospects, van pasando por diferentes etapas” |
| Cliente | razonSocial | minuta ventas: "razón social" |
| Cliente | cuit | minuta ventas: "CUIT" |
| Cliente | direccion | minuta ventas: "dirección" |
| Cliente | activo | minuta ventas: "elegir si está activo o no" |
| Producto | nombre | minuta prospecto: "todos los productos que se consideraron" |
| Producto | tipo | minuta marketing: "productos y servicios (consultoría, customización)" |
| Ticket | descripcion | minuta ventas: "descripción de la solicitud" |
| Ticket | prioridad | minuta ventas: "niveles de prioridad" |
| Ticket | severidad | minuta operaciones: "severidades" con tiempos de respuesta |
| Ticket | estado | minuta ventas: "abierto, en progreso, cerrado" |
| Ticket | responsable | minuta ventas: "responsable" |
| Ticket | fechaCreacion, fechaActualizacion | minuta ventas: "fecha de creación y actualización" |
| Proyecto | tipo | minuta operaciones: "desarrollo o implementaciones" |
| Proyecto | fechaInicio, fechaFin | inferido de la gestión de proyectos |
| Tarea | descripcion | minuta proyectos: "en cada tarea" |
| RegistroHoras | fecha | minuta proyectos: "por día" |
| RegistroHoras | cantidadHoras | minuta proyectos: "cuántas horas trabajó cada persona" |
| Empleado | nombre | inferido de "cada empleado" |

## Trazabilidad

| Elemento del modelo | Minutas | Evidencia |
|---|---|---|
| Campaña | marketing, prospecto | RF registro campañas con nombre, costo, vigencia, tipo, canales |
| Lead | marketing, ventas, prospecto | RF asociar lead a campaña, etapas nuevo/contactado/calificado |
| Oportunidad | ventas, prospecto | RF crear oportunidades, etapas negociación/ganada/perdida |
| Cliente | ventas, prospecto | RF alta de clientes con razón social, CUIT, dirección, activo |
| Producto | CEO, proyectos, prospecto | RF registrar productos considerados y cerrados en venta |
| Ticket | ventas, operaciones | RF sistema de tickets con prioridad, estado, SLA |
| Proyecto | operaciones, proyectos | RF proyectos de desarrollo e implementación |
| Tarea | proyectos | RF tareas vinculadas a proyectos |
| RegistroHoras | proyectos | RF carga de horas por empleado, por tarea, por día |
| Empleado | proyectos | RF cada empleado carga sus horas |

## Diagrama

![Diagrama de Clases](/docs/analisis/modelo-dominio.png)

## Fuera de alcance y exclusiones

- no modelar endpoints, controllers, services, repositories, DTOs ni decisiones de arquitectura
- no modelar pantallas, widgets, botones ni navegación de UI
- no convertir esto en modelo ER, schema SQL ni diagrama de código
- no inventar clases o asociaciones sin evidencia visible en los inputs anteriores

## Dudas abiertas

- La relación entre Lead y Oportunidad no está completamente clara: ¿un lead puede generar múltiples oportunidades o es 1:1? La evidencia sugiere 1:1 pero debe confirmarse.
- ¿Ticket pertenece solo a Cliente o también podría ser interno (sin cliente asociado)? Las minutas mencionan tickets de clientes exclusivamente.
- ¿Existe un concepto de "Presupuesto" independiente de Oportunidad o es parte de ella? Se menciona presupuestación pero no se detalla como entidad separada.
- No se dispone de user stories ni features Gherkin en el repositorio; el modelo se construyó exclusivamente a partir de las minutas de entrevistas.



# API del módulo

## Alcance del API

API REST del módulo de Gestión de Oportunidades Comerciales del sistema PSA.

Permite convertir leads calificados en oportunidades, gestionar su avance dentro del pipeline comercial y registrar el resultado de las negociaciones.

Además, expone recursos de soporte relacionados con leads, clientes y campañas, necesarios para mantener la trazabilidad del proceso comercial completo.

El objetivo es brindar soporte al equipo de ventas durante todo el ciclo de conversión desde el lead hasta el cliente.

Los leads pueden originarse en campañas de marketing o por aproximación directa de ventas. Las campañas forman parte del contexto de negocio del sistema, pero no constituyen el foco principal de este módulo.

## Artefactos relacionados

- `docs/vision/vision-modulo.md`
- `docs/analisis/modelo-dominio.md`
- `docs/prototipos/prototipos.md`
- `docs/requisitos/features/HU-01.feature`
- `docs/requisitos/features/HU-02.feature`

## Endpoints

### Oportunidades

| Método | Path | Descripción | Estado | 
| ------ | --------------------------------- | ------------------------------------------- | ------------ | 
| POST | /api/oportunidades | Convertir un lead calificado en oportunidad | implementado | | GET | /api/oportunidades | Listar oportunidades del pipeline | implementado | | GET | /api/oportunidades/{id} | Obtener detalle de una oportunidad | implementado | | PUT | /api/oportunidades/{id}/ganada | Registrar una oportunidad como ganada | implementado | | PUT | /api/oportunidades/{id}/perdida | Registrar una oportunidad como perdida | implementado |

### Leads (soporte)

| Método | Path | Descripción | Estado | 
| ------ | ------------------------ | --------------------------------- | ------------ | 
| POST | /api/leads | Registrar un lead | implementado | 
| GET | /api/leads | Listar leads | implementado | 
| GET | /api/leads/{id} | Obtener detalle de un lead | implementado | 
| PUT | /api/leads/{id} | Actualizar información de un lead | implementado | 
| PUT | /api/leads/{id}/estado | Actualizar estado de un lead | implementado |

### Clientes (soporte)

| Método | Path | Descripción | Estado | 
| ------ | -------------------- | ----------------------------- | ------------ | 
| GET    | /api/clientes | Listar clientes | implementado | 
| GET    | /api/clientes/{id} | Obtener detalle de un cliente | implementado |
| POST   | /api/clientes | agregar un cliente | pendiente |

### Recursos relacionados (Campañas) 

| Método | Path | Descripción | Estado | 
| ------ | ------------------------ | ------------------------------------ | ------------ | 
| POST   | /api/campanias | Registrar campaña | implementado | 
| GET    | /api/campanias | Listar campañas | implementado | 
| GET    | /api/campanias/{id} | Obtener detalle de campaña | implementado | 
| GET    | /api/campanias/ranking | Consultar ranking de ROI de campañas | implementado | 
| GET    | /api/campanias/{id}/beneficios | obtener la suma total de los montos finales de todas las oportunidades ganadas asociadas a una campaña | implementado |


## Contratos principales 

| Recurso | Request | Response | Validaciones | 
| ---------------------- | ------------------------------------------ | ---------- | ---------------------------------------- | 
| Oportunidad (creación) | leadId, oportunidadId | id, etapa | el lead debe existir y estar calificado | 
| Oportunidad ganada | montoFinal, observaciones, clienteId | id, etapa | la oportunidad debe estar en negociación | 
| Oportunidad perdida | observaciones | id, etapa | observaciones obligatorias | 
| Lead | nombre, contacto, origen, campaniaId | id, estado | nombre y contacto obligatorios | 
| Cliente (creación) | razonSocial, cuit, direccion | id, activo | razonSocial y cuit son obligatorios |
| Campaña | nombre, costo, tipo, fechaInicio, fechaFin | id, estado | nombre obligatorio |


## Errores y validaciones

### Código 400 - Bad Request 

- Solo un lead calificado puede convertirse en oportunidad.
- Una oportunidad debe encontrarse en etapa "negociación" para registrarse como ganada. 
- Una oportunidad debe encontrarse en etapa "negociación" para registrarse como perdida. 
- El motivo de pérdida es obligatorio. 
- El cliente asociado debe existir para registrar una oportunidad como ganada. 
- El costo de una campaña no puede ser negativo. 
- La fecha de fin de una campaña no puede ser anterior a la fecha de inicio. 
- El lead debe contener nombre y contacto. 
- Los datos enviados deben respetar las validaciones de negocio. 

### Código 404 - Not Found 
- Lead inexistente. 
- Cliente inexistente. 
- Oportunidad inexistente. 
- Recursos consultados mediante identificadores no existentes.

## Decisiones abiertas

- Confirmar la estrategia de creación automática de clientes al cerrar una oportunidad como ganada, en línea con la regla de negocio RN-03.
- Evaluar filtros para consulta de oportunidades por etapa.
- Definir autenticación y autorización.
- Definir formato estándar de errores.
- Confirmar si los endpoints serán versionados (`/api/v1`).

## Trazabilidad

| Historia                       | Pantalla                                 | Endpoint principal                  |
| ------------------------------ | ---------------------------------------- | ----------------------------------- |
| HU-02 Crear oportunidad        | crear-oportunidad.html                   | POST /api/oportunidades             |
| HU-02 Registrar ganada         | crear-oportunidad.html                   | PUT /api/oportunidades/{id}/ganada  |
| HU-02 Registrar perdida        | crear-oportunidad.html                   | PUT /api/oportunidades/{id}/perdida |
| HU-02 Consultar pipeline       | listado-oportunidades.html               | GET /api/oportunidades              |
| HU-02 Crear cliente            | generar-cliente.html                     | POST /api/clientes                  |
| HU-02 Gestión de leads previos | listado-leads.html, formulario-lead.html | GET/POST/PUT /api/leads             |


# Pautas de Desarrollo y UI/UX del Proyecto

## 1. Consistencia Estricta con el Modelo de Dominio Conceptual
* Al diseñar, editar o refactorizar vistas del frontend (Formularios, Listas y Detalle) para entidades como `Lead`, `Oportunidad`, `Cliente`, etc., **solo** deben implementarse campos y columnas correspondientes a los **Atributos** explícitos de la clase definidos en el modelo conceptual.
* Las **Asociaciones** (por ejemplo, `Campaña -> Lead`) se consideran relaciones conceptuales/estratégicas y no deben ser mapeadas como atributos editables en el formulario de la entidad o columnas de su lista de administración, a menos que figuren explícitamente en la lista de atributos de dicha clase.

## 2. Patrón de Navegación en Tablas (UI/UX Invariante)
* La navegación hacia las vistas de detalle de cualquier entidad (`Lead`, `Oportunidad`, `Cliente`, `Campaña`) se debe realizar exclusivamente haciendo click en cualquier parte de la fila de la tabla (usando clases hover y `clickable`).
* No se deben añadir columnas adicionales de acción con botones del tipo `"Ver →"` a menos que sea solicitado de manera expresa.

## 3. Flujo de Trabajo en Ramas de Git (Frontend)
* Todo desarrollo en el repositorio del frontend (`2026-1c-tpg-squad-8-frontend`) debe ser empujado a la rama `frontend-nico` para su revisión previa, evitando realizar pushes directos sobre la rama `main`.