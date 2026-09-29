# Inducción Flyzar

Plataforma para estandarizar la inducción y el entrenamiento inicial de cada persona que entra a Flyzar, sea del área que sea.

## El problema que resuelve

Hoy la inducción depende de que alguien se acuerde de darla, y cada área la hace distinto. Con la plataforma:

1. **RR.HH. registra el ingreso** (nombre, puesto, área, fecha, jefe y buddy).
2. **La plataforma asigna el checklist automáticamente**: tronco común + track del área.
3. **Cada tarea tiene responsable y fecha límite**, calculada desde el día de ingreso.
4. **El panel muestra quién está al día y quién atrasado**, con las tareas vencidas.

## Cómo está armado el programa

| Parte | Quién la recibe | Dueño del contenido |
|---|---|---|
| Tronco común | Todos | RR.HH. |
| Comercial / Ventas | Área comercial | Gerente Comercial |
| Operaciones | Área de operaciones | Gerente de Operaciones |
| Administración y Finanzas | Área administrativa | Responsable de Administración |
| Pilotos y Mantenimiento | Pilotos y técnicos | Jefe de Pilotos / Director de Mantenimiento |

Cada track se divide en etapas: **Antes del ingreso → Primer día → Primera semana → 30 → 60 → 90 días**.

Roles:
- **RR.HH.**: dueño del proceso, controla el panel.
- **Jefe directo**: responsable del track de su área y de las reuniones de seguimiento.
- **Buddy**: compañero que acompaña el día a día durante 90 días.
- **Empleado**: hace las lecturas, firmas y autoevaluaciones.

## Cómo editar el contenido

Todo el programa está en [`plataforma/contenido.js`](plataforma/contenido.js). Cada tarea es un bloque con título, detalle, etapa, responsable y tipo. Lo marcado **[VALIDAR]** es una propuesta que tiene que revisar el responsable del área antes de usarlo con un ingreso real. Esto aplica especialmente al track de Pilotos y Mantenimiento: ese entrenamiento es reglamentario y tiene que coincidir con los programas aprobados por la autoridad aeronáutica.

## Identidad visual

La plataforma sigue el Brandbook de Flyzar: logo e isotipo (en `plataforma/marca/`, extraídos en vector del brandbook), Dress Blue (#2a3440) como color principal y los neutros cálidos de la paleta secundaria. Proxima Nova y Tribun no son fuentes web libres, así que se usan equivalentes de Google Fonts (Figtree y Newsreader italic); si Flyzar tiene licencia web de las originales, se reemplazan en `index.html`.

## Cómo probarla

Abrí `plataforma/index.html` en el navegador. Arranca con tres ingresos de ejemplo (ficticios) que se pueden quitar desde el panel.

## Estado y próximos pasos

- [x] **v1 – Prototipo**: programa estándar, checklist por ingreso, autoevaluaciones y panel de seguimiento. Los datos quedan guardados solo en el navegador de quien la usa.
- [x] **Material real vinculado**: presentación institucional, brochures de flota, MOE, Manual General de Mantenimiento, FL3XX, cotizador y procedimientos, con links a Drive. Organigrama, SMS, requisitos de pilotos y Control Operacional tomados del MOE (Rev. 01, jun. 2023).
- [ ] **Validar contenido** con cada responsable de área (ver marcas "A VALIDAR").
- [ ] **Redactar lo que falta**: reglamento interno, acuerdo de confidencialidad, organigrama completo (Comercial y FBO), procedimientos de Administración.
- [ ] **v2 – Uso real**: base de datos compartida y acceso con la cuenta @flyzar.com, con vistas distintas para RR.HH., jefes y nuevos ingresos.
- [ ] **Avisos automáticos** por mail cuando una tarea está por vencer o vencida.
- [ ] **Piloto** con el próximo ingreso y ajustes según la encuesta de los 30 días.
