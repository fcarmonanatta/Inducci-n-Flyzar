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
 *   detalle     cómo hacerlo / qué material usar
 *   responsable "RR.HH." | "Jefe directo" | "Buddy" | "Empleado" | otro rol
 *   tipo        tarea | lectura | quiz | firma | practica
 *   preguntas   (solo para quiz) lista de { p, opciones, correcta }
 *
 * Lo marcado con [VALIDAR] es una propuesta que tiene que revisar el
 * responsable del área antes de usarlo con un ingreso real.
 */

window.PROGRAMA = {
  empresa: "Flyzar",

  etapas: [
    { id: "pre",  codigo: "PRE",  nombre: "Antes del ingreso", dia: -1 },
    { id: "dia1", codigo: "D1",   nombre: "Primer día",        dia: 0 },
    { id: "sem1", codigo: "S1",   nombre: "Primera semana",    dia: 5 },
    { id: "d30",  codigo: "D+30", nombre: "Primer mes",        dia: 30 },
    { id: "d60",  codigo: "D+60", nombre: "Segundo mes",       dia: 60 },
    { id: "d90",  codigo: "D+90", nombre: "Cierre de inducción", dia: 90 }
  ],

  // ---------------------------------------------------------------------
  // TRONCO COMÚN: lo recibe todo el que entra, sin importar el área.
  // ---------------------------------------------------------------------
  comun: {
    nombre: "Tronco común",
    descripcion: "Lo que toda persona de Flyzar tiene que saber, sea del área que sea.",
    tareas: [
      { id: "c-alta", etapa: "pre", tipo: "tarea", responsable: "RR.HH.",
        titulo: "Alta administrativa y legajo",
        detalle: "Contrato firmado, documentación personal, alta en nómina y obra social, datos bancarios." },
      { id: "c-accesos", etapa: "pre", tipo: "tarea", responsable: "Sistemas",
        titulo: "Cuenta @flyzar.com y accesos",
        detalle: "Crear correo, Drive, Calendar y los sistemas que el jefe directo haya pedido. Preparar equipo (notebook, celular) si corresponde." },
      { id: "c-buddy", etapa: "pre", tipo: "tarea", responsable: "Jefe directo",
        titulo: "Asignar un buddy",
        detalle: "Un compañero con experiencia que acompaña los primeros 90 días y responde las dudas del día a día. No es el jefe." },
      { id: "c-agenda", etapa: "pre", tipo: "tarea", responsable: "RR.HH.",
        titulo: "Enviar agenda de la primera semana",
        detalle: "Mail de bienvenida con horario, dirección, a quién preguntar al llegar y agenda de reuniones de los primeros días." },

      { id: "c-bienvenida", etapa: "dia1", tipo: "tarea", responsable: "RR.HH.",
        titulo: "Recepción y recorrido por las instalaciones",
        detalle: "Presentación con el equipo, recorrido por oficinas y hangar/plataforma (con acompañante y respetando zonas restringidas)." },
      { id: "c-cultura", etapa: "dia1", tipo: "lectura", responsable: "Empleado",
        titulo: "Historia, misión y valores de Flyzar",
        detalle: "Presentación institucional: quiénes somos, qué hacemos, cómo decidimos. [VALIDAR: cargar el link a la presentación oficial]" },
      { id: "c-organigrama", etapa: "dia1", tipo: "lectura", responsable: "Empleado",
        titulo: "Organigrama y quién es quién",
        detalle: "Áreas, responsables y a quién recurrir para cada tema (RR.HH., sistemas, compras, seguridad operacional)." },
      { id: "c-jefe-1a1", etapa: "dia1", tipo: "tarea", responsable: "Jefe directo",
        titulo: "Primera reunión con el jefe directo",
        detalle: "Explicar el rol, qué se espera a los 30, 60 y 90 días y cómo se va a medir." },

      { id: "c-politicas", etapa: "sem1", tipo: "firma", responsable: "Empleado",
        titulo: "Reglamento interno y políticas",
        detalle: "Horarios, licencias y vacaciones, gastos y viáticos, uso de equipos, código de conducta. Firmar la toma de conocimiento." },
      { id: "c-confidencialidad", etapa: "sem1", tipo: "firma", responsable: "Empleado",
        titulo: "Confidencialidad y protección de datos",
        detalle: "Manejo de información de clientes, pasajeros y de la empresa. Firmar acuerdo de confidencialidad." },
      { id: "c-herramientas", etapa: "sem1", tipo: "practica", responsable: "Buddy",
        titulo: "Herramientas de trabajo",
        detalle: "Correo, calendario, Drive compartido, canales de comunicación internos y dónde está cada cosa." },
      { id: "c-sms", etapa: "sem1", tipo: "lectura", responsable: "Seguridad operacional",
        titulo: "Política de seguridad operacional (SMS)",
        detalle: "En una empresa aeronáutica la seguridad es responsabilidad de todos. Política de seguridad, cultura justa y cómo reportar un peligro o evento. [VALIDAR con el responsable de SMS]" },
      { id: "c-quiz-sms", etapa: "sem1", tipo: "quiz", responsable: "Empleado",
        titulo: "Autoevaluación: seguridad y cultura de reporte",
        detalle: "Cinco preguntas para confirmar que se entendió lo básico. Se aprueba con 80%.",
        preguntas: [
          { p: "Ves una situación que podría ser insegura, pero nadie resultó afectado. ¿Qué hacés?",
            opciones: ["Nada, porque no pasó nada", "La reporto por el canal de reportes de seguridad", "Se lo comento a un compañero"],
            correcta: 1 },
          { p: "¿Qué significa \"cultura justa\"?",
            opciones: ["Que nunca hay consecuencias", "Que los errores honestos se reportan sin miedo a castigo, pero la negligencia grave no se tolera", "Que solo reporta el jefe"],
            correcta: 1 },
          { p: "¿Quién es responsable de la seguridad operacional en Flyzar?",
            opciones: ["Solo pilotos y mecánicos", "Solo el responsable de SMS", "Todas las personas de la empresa"],
            correcta: 2 },
          { p: "¿Podés entrar a la plataforma o al hangar sin acompañante durante tu primera semana?",
            opciones: ["Sí, si tengo apuro", "No, siempre acompañado y con la identificación visible", "Sí, si nadie me ve"],
            correcta: 1 },
          { p: "Recibís un mail pidiendo tu contraseña de @flyzar.com \"urgente\". ¿Qué hacés?",
            opciones: ["La envío", "No la envío y aviso a Sistemas", "La envío si el mail parece oficial"],
            correcta: 1 }
        ] },
      { id: "c-seg-higiene", etapa: "sem1", tipo: "lectura", responsable: "RR.HH.",
        titulo: "Seguridad e higiene y plan de emergencia",
        detalle: "Salidas de emergencia, matafuegos, punto de encuentro, elementos de protección personal según el puesto." },

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

  // ---------------------------------------------------------------------
  // TRACKS POR ÁREA: se suman al tronco común según el área del ingreso.
  // ---------------------------------------------------------------------
  areas: [
    {
      id: "comercial",
      nombre: "Comercial / Ventas",
      corto: "Comercial",
      responsable: "Gerente Comercial",
      descripcion: "Productos, clientes y proceso comercial de Flyzar.",
      tareas: [
        { id: "com-servicios", etapa: "dia1", tipo: "lectura", responsable: "Jefe directo",
          titulo: "Servicios y productos de Flyzar",
          detalle: "Qué vendemos, a quién y qué nos diferencia. [VALIDAR: catálogo de servicios]" },
        { id: "com-crm", etapa: "sem1", tipo: "practica", responsable: "Buddy",
          titulo: "Uso del CRM y registro de oportunidades",
          detalle: "Cargar un contacto, una oportunidad y una cotización de prueba." },
        { id: "com-cotizar", etapa: "sem1", tipo: "lectura", responsable: "Jefe directo",
          titulo: "Cómo se arma una cotización",
          detalle: "Lista de precios, costos de operación, aprobaciones necesarias y márgenes mínimos." },
        { id: "com-sombra", etapa: "sem1", tipo: "practica", responsable: "Buddy",
          titulo: "Acompañar a un vendedor en reuniones con clientes",
          detalle: "Al menos 3 reuniones o llamadas como oyente." },
        { id: "com-operaciones", etapa: "d30", tipo: "tarea", responsable: "Jefe directo",
          titulo: "Visita a Operaciones",
          detalle: "Entender qué pasa después de que se cierra una venta: programación, tripulación, mantenimiento." },
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
      descripcion: "Cómo se planifica, despacha y sigue cada operación.",
      tareas: [
        { id: "ops-flujo", etapa: "dia1", tipo: "lectura", responsable: "Jefe directo",
          titulo: "Flujo de una operación de punta a punta",
          detalle: "Desde el pedido del cliente hasta el cierre del vuelo: quién interviene en cada paso." },
        { id: "ops-manual", etapa: "sem1", tipo: "lectura", responsable: "Empleado",
          titulo: "Secciones del Manual de Operaciones que aplican al puesto",
          detalle: "[VALIDAR: el Gerente de Operaciones define qué capítulos corresponden]" },
        { id: "ops-sistemas", etapa: "sem1", tipo: "practica", responsable: "Buddy",
          titulo: "Sistemas de programación y seguimiento de vuelos",
          detalle: "Programación, asignación de tripulación y aeronave, seguimiento en tiempo real." },
        { id: "ops-sombra", etapa: "sem1", tipo: "practica", responsable: "Buddy",
          titulo: "Turnos acompañando a un operador con experiencia",
          detalle: "Mínimo 5 turnos como observador antes de operar solo." },
        { id: "ops-irregular", etapa: "d30", tipo: "lectura", responsable: "Jefe directo",
          titulo: "Gestión de irregularidades",
          detalle: "Demoras, meteorología, aeronave fuera de servicio, cambios de tripulación. Qué hacer y a quién avisar." },
        { id: "ops-supervisado", etapa: "d60", tipo: "practica", responsable: "Jefe directo",
          titulo: "Operación supervisada",
          detalle: "Programar y seguir operaciones reales con un supervisor revisando cada paso." },
        { id: "ops-autonomo", etapa: "d90", tipo: "firma", responsable: "Gerente de Operaciones",
          titulo: "Habilitación para operar sin supervisión",
          detalle: "El gerente firma que la persona está lista para trabajar de forma autónoma." }
      ]
    },
    {
      id: "administracion",
      nombre: "Administración y Finanzas",
      corto: "Adm. y Finanzas",
      responsable: "Responsable de Administración",
      descripcion: "Circuitos administrativos, contables y de control.",
      tareas: [
        { id: "adm-circuitos", etapa: "dia1", tipo: "lectura", responsable: "Jefe directo",
          titulo: "Mapa de circuitos administrativos",
          detalle: "Compras, pagos a proveedores, facturación, cobranzas, sueldos: quién hace qué." },
        { id: "adm-sistema", etapa: "sem1", tipo: "practica", responsable: "Buddy",
          titulo: "Sistema contable / de gestión",
          detalle: "Carga de comprobantes, consultas y reportes básicos en un entorno de prueba." },
        { id: "adm-aprobaciones", etapa: "sem1", tipo: "lectura", responsable: "Jefe directo",
          titulo: "Niveles de aprobación y control interno",
          detalle: "Quién aprueba cada tipo de gasto y hasta qué monto. Separación de funciones." },
        { id: "adm-costos", etapa: "d30", tipo: "lectura", responsable: "Jefe directo",
          titulo: "Estructura de costos de la operación aérea",
          detalle: "Combustible, mantenimiento, tasas aeroportuarias, seguros, tripulación: cómo se registran." },
        { id: "adm-cierre", etapa: "d60", tipo: "practica", responsable: "Empleado",
          titulo: "Participar de un cierre mensual",
          detalle: "Acompañar el cierre contable del mes con tareas asignadas." },
        { id: "adm-autonomo", etapa: "d90", tipo: "firma", responsable: "Responsable de Administración",
          titulo: "Validación de tareas a cargo",
          detalle: "Confirmar que la persona realiza sus circuitos sin supervisión." }
      ]
    },
    {
      id: "pilotos-mant",
      nombre: "Pilotos y Mantenimiento de aeronaves",
      corto: "Pilotos y Mant.",
      responsable: "Jefe de Pilotos / Director de Mantenimiento",
      descripcion: "Área regulada: además de la inducción, hay entrenamiento y registros obligatorios. Todo este track debe validarlo el responsable técnico ante la autoridad aeronáutica.",
      tareas: [
        { id: "pm-documentacion", etapa: "pre", tipo: "tarea", responsable: "Jefe de área",
          titulo: "Verificar licencias, habilitaciones y certificado médico",
          detalle: "Copia vigente de licencia, habilitaciones de tipo y certificado médico aeronáutico (pilotos) o licencia de mecánico y habilitaciones (mantenimiento). Registrar vencimientos." },
        { id: "pm-manuales", etapa: "sem1", tipo: "firma", responsable: "Empleado",
          titulo: "Lectura de manuales de la organización",
          detalle: "Pilotos: Manual de Operaciones. Mantenimiento: Manual de la Organización de Mantenimiento y procedimientos. Firmar toma de conocimiento. [VALIDAR]" },
        { id: "pm-flota", etapa: "sem1", tipo: "practica", responsable: "Buddy",
          titulo: "Familiarización con la flota y las instalaciones",
          detalle: "Aeronaves, hangar, pañol de herramientas, documentación técnica a bordo y en taller." },
        { id: "pm-fh", etapa: "sem1", tipo: "lectura", responsable: "Seguridad operacional",
          titulo: "Factores humanos y SMS aplicado al puesto",
          detalle: "Errores típicos, fatiga, comunicación, reporte de eventos. [VALIDAR: contenido del curso reglamentario]" },
        { id: "pm-entrenamiento", etapa: "d30", tipo: "practica", responsable: "Jefe de área",
          titulo: "Entrenamiento inicial reglamentario",
          detalle: "Pilotos: instrucción teórica, simulador/vuelo y chequeo según el programa aprobado. Mantenimiento: cursos requeridos (factores humanos, mercancías peligrosas si aplica, tipo de aeronave). [VALIDAR contra el programa aprobado]" },
        { id: "pm-registros", etapa: "d30", tipo: "lectura", responsable: "Jefe de área",
          titulo: "Registros técnicos y documentación",
          detalle: "Libro de a bordo / registros de mantenimiento, órdenes de trabajo, liberación al servicio. Cómo completarlos sin errores." },
        { id: "pm-supervisado", etapa: "d60", tipo: "practica", responsable: "Jefe de área",
          titulo: "Vuelos o tareas bajo supervisión",
          detalle: "Pilotos: vuelos con instructor o comandante designado. Mantenimiento: tareas firmadas por un técnico habilitado." },
        { id: "pm-habilitacion", etapa: "d90", tipo: "firma", responsable: "Jefe de Pilotos / Director de Mantenimiento",
          titulo: "Habilitación interna para el puesto",
          detalle: "Firma del responsable técnico. Se archiva en el legajo de instrucción junto con los certificados de cada curso." }
      ]
    }
  ]
};
