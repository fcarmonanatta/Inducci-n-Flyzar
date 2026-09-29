/*
 * PROGRAMA DE INDUCCIÓN FLYZAR
 * ----------------------------
 * Este archivo es el "manual" de la plataforma: acá se define qué tiene que
 * hacer cada persona nueva según su área. Para cambiar el programa no hace
 * falta tocar nada más.
 *
 * Cada tarea tiene:
 *   id          identificador único (no repetir, no cambiar una vez en uso)
 *   etapa       pre | dia1 | sem1 | d30 | d60 | d90
 *   titulo      qué hay que hacer
 *   detalle     cómo hacerlo / qué hay que saber
 *   responsable quién tiene que asegurarse de que se haga
 *   tipo        tarea | lectura | quiz | firma | practica
 *   material    (opcional) documentos: lista de { nombre, url, nota }
 *   preguntas   (solo para quiz) lista de { p, opciones, correcta }
 *
 * Fuentes usadas: MOE Flyzar Parte A (Rev. 01, 26-JUN-2023, aprobado ANAC)
 * y la presentación institucional FLYZAR - PRESENTACION (oct. 2025).
 * Lo marcado con [VALIDAR] todavía es una propuesta o depende de un documento
 * que hay que conseguir o actualizar.
 */

(function () {
  // Documentos de Google Drive (requieren estar logueado con la cuenta @flyzar.com)
  var DOC = {
    presentacion: { nombre: "FLYZAR – Presentación institucional (oct. 2025)",
      url: "https://drive.google.com/file/d/10GxV3F4uwk3I2IDvf8haA_yoWqwNW7fJ/view" },
    moe: { nombre: "Manual de Operaciones del Explotador (MOE) – Parte A, Rev. 01 (jun. 2023)",
      url: "https://drive.google.com/file/d/1IAyG6-i10U5ZQBnEmft5cwmWMNx8DiR7/view" },
    mgm: { nombre: "Manual General de Mantenimiento – Rev. 4 (ene. 2023)",
      url: "https://drive.google.com/file/d/1w0kRlhQmKgx4bMWikJ9RF45bOB-tp6eP/view" },
    smsAnac: { nombre: "ANAC – Fundamentos para la implementación del SMS",
      url: "https://drive.google.com/file/d/0B7a-aPYVfI66WTlGWDhwQ3lDXzA/view" },
    claveC: { nombre: "PROT N°184/24 – Procedimiento aeronaves Clave C (San Fernando)",
      url: "https://drive.google.com/file/d/1wi6szG4tHa7YLBgDo7EzNeSvLAwB6pNP/view" },
    frat: { nombre: "Formulario de evaluación de riesgo operacional (2025)",
      url: "https://docs.google.com/document/d/16JStu46f8vp4nrDy4zbqKtrB2x9yP9ANx0y6TyXqOXw/edit" },
    fl3xx: { nombre: "FL3XX Onboarding – Flyzar",
      url: "https://drive.google.com/file/d/14a_EcspE9TSAaTFpVIbklf6jsV5JOYL5/view" },
    fl3xxProyecto: { nombre: "Propuesta de proyecto: software de gestión integral FL3XX (2023)",
      url: "https://drive.google.com/file/d/1KBDeYUYVnU6p8G1rGanIxBA-K6ZzC1I_/view" },
    planillaFbo: { nombre: "Planilla de operaciones FBO Flyzar",
      url: "https://drive.google.com/file/d/1RUMrtwdZtJ_zc6wdsVt-Bpa1ku-Ay40n/view" },
    partidaInt: { nombre: "Procedimiento partida vuelo internacional Aeroparque",
      url: "https://drive.google.com/file/d/0B7a-aPYVfI66Z09NQ0JQZF9ETGc/view", nota: "2015, revisar vigencia" },
    cotizador: { nombre: "Planilla de cotización Flyzar",
      url: "https://drive.google.com/file/d/1Fp70lVPznR0fopQjv3X7gbDl44q0FV__/view" },
    propuestaCharter: { nombre: "Propuesta servicio charter (nov. 2025)",
      url: "https://drive.google.com/file/d/1NFmdCad3cTPnSeaCGNImor0k1T9c9Rdi/view" },
    propuestaEconomica: { nombre: "Presentación y propuesta económica (sep. 2025)",
      url: "https://drive.google.com/file/d/1VNm5O1K4aB9gUWUV9Ppyn6BBkWT7bsT3/view" },
    politicaTripulacion: { nombre: "Política de tripulación (viáticos, comidas y hoteles)",
      url: "https://drive.google.com/file/d/0B7a-aPYVfI66YkVLaG1zcDR6aWs/view", nota: "2014, revisar vigencia" },
    planillaViaticos: { nombre: "Planilla de viáticos",
      url: "https://drive.google.com/file/d/0B7a-aPYVfI66b2N2clkzdzhzZFU/view", nota: "2016, revisar vigencia" },
    registroHoras: { nombre: "Registro de horas totales y entrenamiento (formulario)",
      url: "https://drive.google.com/file/d/0B7a-aPYVfI66bWYybjNNOW5KRXc/view", nota: "2015, revisar vigencia" },
    brochures: [
      { nombre: "Brochure Challenger 605 (LV-HQR)", url: "https://drive.google.com/file/d/11VtAVsCS-ns_3oBlct0LePFtt_U4smoh/view" },
      { nombre: "Brochure Gulfstream V (LV-KLH)", url: "https://drive.google.com/file/d/1onTGHfKiwxSzeyBmzKikIMXsF9LX6Pin/view" },
      { nombre: "Brochure Gulfstream 450 (LV-KEB)", url: "https://drive.google.com/file/d/1iWAK_mZVZ6T0SOPRvNrVMr7ItmniidGT/view" },
      { nombre: "Brochure G400 (LV-SYG)", url: "https://drive.google.com/file/d/1iPyvTdJte1japNF1juhX3bPaB6jqetiY/view" },
      { nombre: "Brochure Learjet 45 (LV-GVX)", url: "https://drive.google.com/file/d/1M2zhYH1ZGBFmka-aQ1iZWTXVDzSJEFmc/view" },
      { nombre: "Brochure Learjet 40 (LV-CJY)", url: "https://drive.google.com/file/d/1RUG9qfV1KidRQot5-L6XNxrK0u4Zl-YK/view" },
      { nombre: "Brochure Bell 429 (LV-FKY)", url: "https://drive.google.com/file/d/1-jUgJ7gbIFtnihK-pb4aHJXO0WQmQdyJ/view" }
    ]
  };

  window.PROGRAMA = {
    empresa: "Flyzar",
    razonSocial: "Servicios y Emprendimientos Aeronáuticos S.A.",

    etapas: [
      { id: "pre",  codigo: "PRE",  nombre: "Antes del ingreso", dia: -1 },
      { id: "dia1", codigo: "D1",   nombre: "Primer día",        dia: 0 },
      { id: "sem1", codigo: "S1",   nombre: "Primera semana",    dia: 5 },
      { id: "d30",  codigo: "D+30", nombre: "Primer mes",        dia: 30 },
      { id: "d60",  codigo: "D+60", nombre: "Segundo mes",       dia: 60 },
      { id: "d90",  codigo: "D+90", nombre: "Cierre de inducción", dia: 90 }
    ],

    // -------------------------------------------------------------------
    // TRONCO COMÚN: lo recibe todo el que entra, sin importar el área.
    // -------------------------------------------------------------------
    comun: {
      nombre: "Tronco común",
      descripcion: "Lo que toda persona de Flyzar tiene que saber, sea del área que sea.",
      tareas: [
        { id: "c-alta", etapa: "pre", tipo: "tarea", responsable: "RR.HH.",
          titulo: "Alta administrativa y legajo",
          detalle: "Contrato firmado, documentación personal, alta en nómina y obra social, datos bancarios." },
        { id: "c-accesos", etapa: "pre", tipo: "tarea", responsable: "Sistemas",
          titulo: "Cuenta @flyzar.com y accesos",
          detalle: "Crear correo, Drive, Calendar y los accesos que pida el jefe directo (por ejemplo FL3XX para Operaciones). Preparar equipo si corresponde." },
        { id: "c-buddy", etapa: "pre", tipo: "tarea", responsable: "Jefe directo",
          titulo: "Asignar un buddy",
          detalle: "Un compañero con experiencia que acompaña los primeros 90 días y responde las dudas del día a día. No es el jefe." },
        { id: "c-agenda", etapa: "pre", tipo: "tarea", responsable: "RR.HH.",
          titulo: "Enviar agenda de la primera semana",
          detalle: "Mail de bienvenida con horario, dirección (Aeropuerto Internacional de San Fernando, Hangar 19), a quién preguntar al llegar y agenda de reuniones de los primeros días." },

        { id: "c-bienvenida", etapa: "dia1", tipo: "tarea", responsable: "RR.HH.",
          titulo: "Recepción y recorrido por las instalaciones",
          detalle: "Presentación con el equipo y recorrido por oficinas, salas VIP, FBO y hangar, siempre acompañado y respetando las zonas restringidas de plataforma." },
        { id: "c-cultura", etapa: "dia1", tipo: "lectura", responsable: "Empleado",
          titulo: "Quiénes somos: Flyzar",
          detalle: "Más de 30 años en vuelos privados nacionales e internacionales. Nuestro foco: seguridad, confort, flexibilidad y confidencialidad, con procedimientos de seguridad y mantenimiento bajo estándares ARGUS. Hangar propio en San Fernando y en Uruguay, equipo disponible 24/7. Servicios: alquiler de aviones, vuelos sanitarios y traslado de órganos, hangaraje, FBO, administración, comercialización y mantenimiento de aeronaves, salas de reuniones y salas VIP.",
          material: [DOC.presentacion] },
        { id: "c-flota", etapa: "dia1", tipo: "lectura", responsable: "Empleado",
          titulo: "Conocer la flota",
          detalle: "Qué aviones operamos, para cuántos pasajeros y con qué autonomía: de helicópteros y light jets a Challenger y Gulfstream de largo alcance. Todo el mundo en Flyzar tiene que poder nombrar la flota.",
          material: DOC.brochures },
        { id: "c-organigrama", etapa: "dia1", tipo: "lectura", responsable: "Empleado",
          titulo: "Organigrama y quién es quién",
          detalle: "Según el MOE: Presidente (Ejecutivo Responsable), de quien dependen el Gerente de Seguridad Operacional, el Gerente de Operaciones, el Gerente de Mantenimiento – Representante Técnico y el Gerente de Administración. Operaciones incluye Jefe de Pilotos, Inspectores Reconocidos, Control Operacional, Jefe de TCP e instructores, pilotos y Director Médico. [VALIDAR: sumar Comercial, FBO y nombres actuales]",
          material: [{ nombre: DOC.moe.nombre, url: DOC.moe.url, nota: "capítulo A2" }] },
        { id: "c-jefe-1a1", etapa: "dia1", tipo: "tarea", responsable: "Jefe directo",
          titulo: "Primera reunión con el jefe directo",
          detalle: "Explicar el rol, qué se espera a los 30, 60 y 90 días y cómo se va a medir." },

        { id: "c-politicas", etapa: "sem1", tipo: "firma", responsable: "Empleado",
          titulo: "Reglamento interno y políticas",
          detalle: "Horarios, licencias y vacaciones, gastos y viáticos, uso de equipos, código de conducta. Firmar la toma de conocimiento. [VALIDAR: no hay reglamento interno escrito; hay que redactarlo]" },
        { id: "c-confidencialidad", etapa: "sem1", tipo: "firma", responsable: "Empleado",
          titulo: "Confidencialidad",
          detalle: "La confidencialidad es uno de los cuatro pilares de nuestro servicio: no se comparte información de clientes, pasajeros, destinos ni horarios de vuelo fuera de la empresa, tampoco en redes sociales. Firmar acuerdo de confidencialidad. [VALIDAR: redactar el acuerdo]" },
        { id: "c-herramientas", etapa: "sem1", tipo: "practica", responsable: "Buddy",
          titulo: "Herramientas de trabajo",
          detalle: "Correo, calendario, Drive compartido, canales de comunicación internos y dónde está cada cosa." },
        { id: "c-sms", etapa: "sem1", tipo: "lectura", responsable: "Gerente de Seguridad Operacional",
          titulo: "Sistema de Gestión de la Seguridad Operacional (SMS)",
          detalle: "Flyzar tiene un SMS aprobado por ANAC en Fase IV, desarrollado en la Parte E del MOE. El Gerente de Seguridad Operacional depende directamente del Presidente y puede hacer recomendaciones a cualquier gerente. La seguridad es responsabilidad de todos: cualquier persona reporta peligros y eventos, sin miedo a sanción por errores honestos. [VALIDAR: conseguir la Parte E vigente y el formulario de notificación actual]",
          material: [{ nombre: DOC.moe.nombre, url: DOC.moe.url, nota: "capítulos A2.2.4 y A4" }, DOC.smsAnac] },
        { id: "c-quiz-sms", etapa: "sem1", tipo: "quiz", responsable: "Empleado",
          titulo: "Autoevaluación: Flyzar y seguridad operacional",
          detalle: "Cinco preguntas para confirmar que se entendió lo básico. Se aprueba con 80%.",
          preguntas: [
            { p: "Ves una situación que podría ser insegura, pero nadie resultó afectado. ¿Qué hacés?",
              opciones: ["Nada, porque no pasó nada", "La reporto por el sistema de notificación del SMS", "Se lo comento a un compañero"],
              correcta: 1 },
            { p: "¿De quién depende directamente el Gerente de Seguridad Operacional?",
              opciones: ["Del Gerente de Operaciones", "Del Presidente (Ejecutivo Responsable)", "Del Jefe de Pilotos"],
              correcta: 1 },
            { p: "¿Quién es responsable de la seguridad operacional en Flyzar?",
              opciones: ["Solo pilotos y mecánicos", "Solo el Gerente de Seguridad Operacional", "Todas las personas de la empresa"],
              correcta: 2 },
            { p: "Un conocido te pregunta a dónde viaja mañana un cliente de Flyzar. ¿Qué hacés?",
              opciones: ["Le cuento, es de confianza", "No comparto información de clientes ni de vuelos", "Le digo solo el destino"],
              correcta: 1 },
            { p: "¿Cuáles son los cuatro pilares del servicio Flyzar?",
              opciones: ["Precio, rapidez, lujo y tecnología", "Seguridad, confort, flexibilidad y confidencialidad", "Puntualidad, catering, flota y hangar"],
              correcta: 1 }
          ] },
        { id: "c-seg-higiene", etapa: "sem1", tipo: "lectura", responsable: "RR.HH.",
          titulo: "Seguridad e higiene y plan de emergencia",
          detalle: "Salidas de emergencia, matafuegos, punto de encuentro en el hangar, circulación en plataforma y elementos de protección personal según el puesto." },

        { id: "c-check30", etapa: "d30", tipo: "tarea", responsable: "Jefe directo",
          titulo: "Reunión de seguimiento a los 30 días",
          detalle: "Revisar avance del plan, dudas y ajustes. Registrar en 3 líneas cómo va." },
        { id: "c-encuesta30", etapa: "d30", tipo: "tarea", responsable: "Empleado",
          titulo: "Encuesta de experiencia de inducción",
          detalle: "Qué sirvió, qué faltó y qué sobró. Sirve para mejorar el programa." },
        { id: "c-check60", etapa: "d60", tipo: "tarea", responsable: "Jefe directo",
          titulo: "Reunión de seguimiento a los 60 días",
          detalle: "Confirmar que la persona ya trabaja con autonomía en las tareas básicas del puesto." },
        { id: "c-cierre", etapa: "d90", tipo: "firma", responsable: "RR.HH.",
          titulo: "Cierre formal de la inducción",
          detalle: "Evaluación de fin de período de prueba con el jefe directo. Se archiva el checklist completo en el legajo." }
      ]
    },

    // -------------------------------------------------------------------
    // TRACKS POR ÁREA: se suman al tronco común según el área del ingreso.
    // -------------------------------------------------------------------
    areas: [
      {
        id: "comercial",
        nombre: "Comercial / Ventas",
        corto: "Comercial",
        responsable: "Responsable Comercial",
        descripcion: "Servicios, condiciones comerciales y cómo se cotiza un vuelo en Flyzar.",
        tareas: [
          { id: "com-servicios", etapa: "dia1", tipo: "lectura", responsable: "Jefe directo",
            titulo: "Servicios y flota desde el punto de vista del cliente",
            detalle: "Qué vendemos (charter nacional e internacional, sanitarios, hangaraje, FBO, administración de aeronaves, salas VIP) y qué avión conviene para cada viaje según pasajeros y autonomía.",
            material: [DOC.presentacion].concat(DOC.brochures) },
          { id: "com-condiciones", etapa: "sem1", tipo: "lectura", responsable: "Jefe directo",
            titulo: "Condiciones generales de venta",
            detalle: "Base operativa en San Fernando; todos los vuelos se cotizan saliendo y regresando a la base; incluyen 4 horas de espera en destino (sin pernocte) y catering; disponibilidad garantizada pidiendo con al menos 72 horas; valores en USD sin IVA; modelo y matrícula a confirmar por Flyzar.",
            material: [DOC.presentacion] },
          { id: "com-cotizar", etapa: "sem1", tipo: "practica", responsable: "Buddy",
            titulo: "Cómo se arma una cotización",
            detalle: "Usar la planilla de cotización con un caso de prueba y revisar dos propuestas reales enviadas a clientes. [VALIDAR: aprobaciones necesarias y márgenes mínimos]",
            material: [DOC.cotizador, DOC.propuestaCharter, DOC.propuestaEconomica] },
          { id: "com-sombra", etapa: "sem1", tipo: "practica", responsable: "Buddy",
            titulo: "Acompañar a un vendedor en reuniones con clientes",
            detalle: "Al menos 3 reuniones o llamadas como oyente." },
          { id: "com-operaciones", etapa: "d30", tipo: "tarea", responsable: "Jefe directo",
            titulo: "Visita a Control Operacional",
            detalle: "Entender qué pasa después de que se cierra una venta: Control Operacional acepta el vuelo contratado y programa aeronave y tripulación." },
          { id: "com-primera", etapa: "d60", tipo: "practica", responsable: "Empleado",
            titulo: "Primera cotización propia supervisada",
            detalle: "Armar y presentar una cotización real con revisión del jefe directo." },
          { id: "com-cartera", etapa: "d90", tipo: "tarea", responsable: "Jefe directo",
            titulo: "Asignación de cartera y objetivos",
            detalle: "Definir clientes a cargo y objetivos comerciales del siguiente trimestre." }
        ]
      },
      {
        id: "operaciones",
        nombre: "Operaciones",
        corto: "Operaciones",
        responsable: "Gerente de Operaciones",
        descripcion: "Control Operacional, FBO y cómo se planifica y sigue cada vuelo.",
        tareas: [
          { id: "ops-flujo", etapa: "dia1", tipo: "lectura", responsable: "Jefe directo",
            titulo: "Qué hace Control Operacional",
            detalle: "Supervisa los vuelos y toma las decisiones necesarias para operarlos en forma segura y conforme a las normas: programa aeronaves y tripulaciones, acepta los vuelos contratados y publica las políticas y procedimientos que siguen las tripulaciones.",
            material: [{ nombre: DOC.moe.nombre, url: DOC.moe.url, nota: "capítulo A3" }] },
          { id: "ops-manual", etapa: "sem1", tipo: "lectura", responsable: "Empleado",
            titulo: "Capítulos del MOE que aplican al puesto",
            detalle: "A3 Control y supervisión de las operaciones, A8 Tiempos máximos de servicio, vuelo y descanso de las tripulaciones (Decreto 877/2021, RAAC 135 Subparte F) y A9 Procedimientos de operación y preparación de los vuelos.",
            material: [{ nombre: DOC.moe.nombre, url: DOC.moe.url, nota: "capítulos A3, A8 y A9" }] },
          { id: "ops-sistemas", etapa: "sem1", tipo: "practica", responsable: "Buddy",
            titulo: "FL3XX: programación y seguimiento de vuelos",
            detalle: "Cargar un vuelo de prueba, asignar aeronave y tripulación y seguirlo. [VALIDAR: confirmar que FL3XX es el sistema en uso]",
            material: [DOC.fl3xx, DOC.fl3xxProyecto] },
          { id: "ops-fbo", etapa: "sem1", tipo: "practica", responsable: "Buddy",
            titulo: "Operación del FBO",
            detalle: "Atención de aeronaves y pasajeros propios y de terceros, registro de servicios prestados.",
            material: [DOC.planillaFbo] },
          { id: "ops-sombra", etapa: "sem1", tipo: "practica", responsable: "Buddy",
            titulo: "Turnos acompañando a un operador con experiencia",
            detalle: "Mínimo 5 turnos como observador antes de operar solo." },
          { id: "ops-procedimientos", etapa: "d30", tipo: "lectura", responsable: "Jefe directo",
            titulo: "Procedimientos de aeropuerto e irregularidades",
            detalle: "Operaciones restringidas para aeronaves Clave C en San Fernando, partida internacional, demoras, meteorología, aeronave fuera de servicio y cambios de tripulación: qué hacer y a quién avisar.",
            material: [DOC.claveC, DOC.partidaInt] },
          { id: "ops-supervisado", etapa: "d60", tipo: "practica", responsable: "Jefe directo",
            titulo: "Operación supervisada",
            detalle: "Programar y seguir operaciones reales con un supervisor revisando cada paso." },
          { id: "ops-autonomo", etapa: "d90", tipo: "firma", responsable: "Gerente de Operaciones",
            titulo: "Habilitación para operar sin supervisión",
            detalle: "El Gerente de Operaciones firma que la persona está lista para trabajar de forma autónoma." }
        ]
      },
      {
        id: "administracion",
        nombre: "Administración y Finanzas",
        corto: "Adm. y Finanzas",
        responsable: "Gerente de Administración",
        descripcion: "Facturación, cobranza, presupuesto y circuitos de gastos.",
        tareas: [
          { id: "adm-circuitos", etapa: "dia1", tipo: "lectura", responsable: "Jefe directo",
            titulo: "Qué hace la Gerencia de Administración",
            detalle: "Según el MOE: programar y controlar los procesos de administración y finanzas, facturación y cobranza en plazo, seguimiento de cobranzas, base de datos de clientes y elaboración y control del presupuesto junto con las demás áreas.",
            material: [{ nombre: DOC.moe.nombre, url: DOC.moe.url, nota: "capítulo A2.2.6" }] },
          { id: "adm-sistema", etapa: "sem1", tipo: "practica", responsable: "Buddy",
            titulo: "Sistema contable / de gestión",
            detalle: "Carga de comprobantes, consultas y reportes básicos. [VALIDAR: qué sistema se usa]" },
          { id: "adm-aprobaciones", etapa: "sem1", tipo: "lectura", responsable: "Jefe directo",
            titulo: "Niveles de aprobación y control interno",
            detalle: "Quién aprueba cada tipo de gasto y hasta qué monto. [VALIDAR: no hay procedimiento escrito]" },
          { id: "adm-viaticos", etapa: "sem1", tipo: "lectura", responsable: "Jefe directo",
            titulo: "Viáticos de tripulación",
            detalle: "La empresa cubre comida, hospedaje y traslados de la tripulación fuera de base; cómo se calculan y liquidan.",
            material: [DOC.politicaTripulacion, DOC.planillaViaticos] },
          { id: "adm-costos", etapa: "d30", tipo: "lectura", responsable: "Jefe directo",
            titulo: "Estructura de costos de la operación aérea",
            detalle: "Combustible, mantenimiento, tasas aeroportuarias, seguros, tripulación, hangaraje: cómo se registran." },
          { id: "adm-cierre", etapa: "d60", tipo: "practica", responsable: "Empleado",
            titulo: "Participar de un cierre mensual",
            detalle: "Acompañar el cierre contable del mes con tareas asignadas." },
          { id: "adm-autonomo", etapa: "d90", tipo: "firma", responsable: "Gerente de Administración",
            titulo: "Validación de tareas a cargo",
            detalle: "Confirmar que la persona realiza sus circuitos sin supervisión." }
        ]
      },
      {
        id: "pilotos-mant",
        nombre: "Pilotos y Mantenimiento de aeronaves",
        corto: "Pilotos y Mant.",
        responsable: "Gerente de Operaciones / Gerente de Mantenimiento",
        descripcion: "Área regulada por ANAC (RAAC 135). La inducción complementa, no reemplaza, el programa de instrucción aprobado (MOE Parte D).",
        tareas: [
          { id: "pm-documentacion", etapa: "pre", tipo: "tarea", responsable: "Jefe de Pilotos / Gerente de Mantenimiento",
            titulo: "Verificar licencias, habilitaciones y certificado médico",
            detalle: "Pilotos: licencia según peso máximo de despegue (hasta 5.700 kg: Piloto Comercial; hasta 20.000 kg: Comercial de Primera Clase; más de 20.000 kg: Transporte de Línea Aérea), habilitaciones de tipo y certificado médico. Mantenimiento: licencia y habilitaciones. Registrar vencimientos y cursos recurrentes (Factores Humanos, Mercancías Peligrosas, RVSM, RNAV).",
            material: [{ nombre: DOC.moe.nombre, url: DOC.moe.url, nota: "capítulo A6" }, DOC.registroHoras] },
          { id: "pm-manuales", etapa: "sem1", tipo: "firma", responsable: "Empleado",
            titulo: "Lectura de manuales de la organización",
            detalle: "Pilotos: MOE (Parte A generalidades; Parte D capacitación; Parte E SMS). Mantenimiento: Manual General de Mantenimiento. Firmar toma de conocimiento. [VALIDAR: conseguir Partes B a E vigentes]",
            material: [DOC.moe, DOC.mgm] },
          { id: "pm-flota", etapa: "sem1", tipo: "practica", responsable: "Buddy",
            titulo: "Familiarización con la flota y el hangar",
            detalle: "Aeronaves, hangar, pañol de herramientas, documentación técnica a bordo y en taller.",
            material: DOC.brochures },
          { id: "pm-descanso", etapa: "sem1", tipo: "lectura", responsable: "Jefe de Pilotos",
            titulo: "Tiempos de vuelo, servicio y descanso",
            detalle: "Decreto 877/2021 y RAAC 135 Subparte F. Operaciones planifica las tripulaciones con estos límites; cada tripulante es responsable de avisar si no está en condiciones de volar.",
            material: [{ nombre: DOC.moe.nombre, url: DOC.moe.url, nota: "capítulo A8" }] },
          { id: "pm-fh", etapa: "sem1", tipo: "lectura", responsable: "Gerente de Seguridad Operacional",
            titulo: "SMS aplicado al puesto y evaluación de riesgo",
            detalle: "Factores humanos, fatiga, comunicación, reporte de eventos y uso del formulario de evaluación de riesgo operacional antes del vuelo.",
            material: [DOC.frat] },
          { id: "pm-entrenamiento", etapa: "d30", tipo: "practica", responsable: "Gerente de Operaciones",
            titulo: "Entrenamiento inicial reglamentario",
            detalle: "Pilotos: instrucción teórica y práctica según la Parte D del MOE; los cursos de tipo se hacen en centros de entrenamiento habilitados por ANAC, que incluyen ambos puestos de pilotaje. Mantenimiento: cursos requeridos por el MGM. [VALIDAR contra la Parte D vigente]",
            material: [{ nombre: DOC.moe.nombre, url: DOC.moe.url, nota: "capítulo A6.2 y Parte D" }] },
          { id: "pm-registros", etapa: "d30", tipo: "lectura", responsable: "Gerente de Mantenimiento",
            titulo: "Registros técnicos y documentación",
            detalle: "Registro Técnico de Vuelo: antes de cada vuelo el comandante verifica que las novedades anteriores tengan acción correctiva firmada por el responsable técnico. Órdenes de trabajo y liberación al servicio.",
            material: [DOC.mgm] },
          { id: "pm-supervisado", etapa: "d60", tipo: "practica", responsable: "Jefe de Pilotos",
            titulo: "Experiencia operativa bajo supervisión",
            detalle: "Pilotos: para ser designado Piloto al Mando hacen falta 25 horas de experiencia operativa en esa aeronave y posición, bajo supervisión de un instructor o Inspector Reconocido (se pueden reducir hasta 50% agregando un despegue y un aterrizaje por hora). Mantenimiento: tareas firmadas por un técnico habilitado.",
            material: [{ nombre: DOC.moe.nombre, url: DOC.moe.url, nota: "capítulo A6.1" }] },
          { id: "pm-habilitacion", etapa: "d90", tipo: "firma", responsable: "Gerente de Operaciones / Gerente de Mantenimiento",
            titulo: "Habilitación interna para el puesto",
            detalle: "Firma del gerente responsable. Se archiva en el legajo de instrucción junto con los certificados de cada curso." }
        ]
      }
    ]
  };
})();
