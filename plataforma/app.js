/*
 * Lógica de la plataforma de inducción.
 * El contenido del programa está en contenido.js; este archivo solo lo muestra
 * y registra el avance de cada ingreso.
 *
 * Versión 1: los datos se guardan en el navegador (localStorage). Sirve para
 * probar el circuito; para uso real hay que conectar una base de datos
 * compartida (ver README).
 */
(function () {
  "use strict";

  var P = window.PROGRAMA;
  var CLAVE = "flyzar-induccion-v1";
  var DIA_MS = 86400000;
  var APROBACION = 0.8;

  var ORDEN_ETAPA = {};
  P.etapas.forEach(function (e, i) { ORDEN_ETAPA[e.id] = i; });

  var TIPOS = {
    tarea: "Tarea", lectura: "Lectura", quiz: "Autoevaluación",
    firma: "Firma", practica: "Práctica"
  };

  // ---------- utilidades ----------

  function hoy() {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }
  function sumarDias(fecha, n) { return new Date(fecha.getTime() + n * DIA_MS); }
  function aISO(d) {
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var dd = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + dd;
  }
  function deISO(s) {
    var p = s.split("-");
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function fmt(d) {
    return String(d.getDate()).padStart(2, "0") + "/" +
      String(d.getMonth() + 1).padStart(2, "0") + "/" + d.getFullYear();
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function nuevoId() { return "i" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

  // ---------- datos ----------

  var estado = cargar();

  function ejemplo() {
    var h = hoy();
    function hechas(ingreso, filtro) {
      tareasDe(ingreso).forEach(function (t) {
        if (filtro(t)) ingreso.hechas[t.id] = { fecha: aISO(h) };
      });
      return ingreso;
    }
    return {
      ingresos: [
        hechas({ id: "ej1", ejemplo: true, nombre: "Lucía Fernández", puesto: "Piloto",
          area: "pilotos-mant", inicio: aISO(sumarDias(h, -40)), jefe: "Jefe de Pilotos",
          buddy: "Comandante asignado", hechas: {} },
          function (t) { return ORDEN_ETAPA[t.etapa] <= 2 || t.id === "c-check30" || t.id === "pm-registros"; }),
        hechas({ id: "ej2", ejemplo: true, nombre: "Martín Sosa", puesto: "Ejecutivo comercial",
          area: "comercial", inicio: aISO(sumarDias(h, -8)), jefe: "Gerente Comercial",
          buddy: "Vendedor senior", hechas: {} },
          function (t) { return ORDEN_ETAPA[t.etapa] <= 2; }),
        hechas({ id: "ej3", ejemplo: true, nombre: "Carla Gómez", puesto: "Analista contable",
          area: "administracion", inicio: aISO(sumarDias(h, 4)), jefe: "Responsable de Administración",
          buddy: "Analista senior", hechas: {} },
          function (t) { return t.id === "c-alta" || t.id === "c-buddy"; })
      ]
    };
  }

  function cargar() {
    try {
      var raw = localStorage.getItem(CLAVE);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* sin almacenamiento: usamos el ejemplo */ }
    return null;
  }
  function guardar() {
    try { localStorage.setItem(CLAVE, JSON.stringify(estado)); } catch (e) { /* ignorar */ }
  }

  function area(id) {
    for (var i = 0; i < P.areas.length; i++) if (P.areas[i].id === id) return P.areas[i];
    return null;
  }
  function etapa(id) { return P.etapas[ORDEN_ETAPA[id]]; }

  function tareasDe(ingreso) {
    var a = area(ingreso.area);
    var lista = P.comun.tareas.map(function (t) { return Object.assign({ origen: "Común" }, t); });
    if (a) lista = lista.concat(a.tareas.map(function (t) { return Object.assign({ origen: a.corto }, t); }));
    return lista.sort(function (x, y) { return ORDEN_ETAPA[x.etapa] - ORDEN_ETAPA[y.etapa]; });
  }
  function vence(ingreso, t) { return sumarDias(deISO(ingreso.inicio), etapa(t.etapa).dia); }
  function vencida(ingreso, t) { return !ingreso.hechas[t.id] && vence(ingreso, t) < hoy(); }

  function resumen(ingreso) {
    var ts = tareasDe(ingreso);
    var hechas = ts.filter(function (t) { return ingreso.hechas[t.id]; }).length;
    var atrasadas = ts.filter(function (t) { return vencida(ingreso, t); });
    var pendientes = ts.filter(function (t) { return !ingreso.hechas[t.id]; });
    var dia = Math.round((hoy() - deISO(ingreso.inicio)) / DIA_MS);
    var est = hechas === ts.length ? "completo" : atrasadas.length ? "atrasado" : dia < 0 ? "proximo" : "aldia";
    return { total: ts.length, hechas: hechas, pct: Math.round(hechas / ts.length * 100),
      atrasadas: atrasadas, proxima: pendientes[0], dia: dia, estado: est };
  }

  var ETIQUETA_ESTADO = {
    completo: "Completo", atrasado: "Atrasado", aldia: "Al día", proximo: "Por ingresar"
  };

  // ---------- vistas ----------

  var raiz = document.getElementById("vista");
  var filtroArea = "";
  var filtroResp = "";
  var quizAbierto = null;
  var confirmarBorrado = false;

  function render() {
    var h = location.hash.replace("#", "");
    document.querySelectorAll(".nav a").forEach(function (a) {
      var destino = a.getAttribute("href").slice(1);
      var seccion = h.indexOf("programa") === 0 ? "programa" : "panel";
      a.setAttribute("aria-current", seccion === destino ? "page" : "false");
    });
    if (h.indexOf("ingreso-") === 0) return vistaIngreso(h.slice(8));
    if (h.indexOf("programa") === 0) return vistaPrograma(h.slice(9) || "comun");
    if (h === "nuevo") return vistaNuevo();
    vistaPanel();
  }

  function pill(est) {
    return '<span class="pill pill-' + est + '">' + ETIQUETA_ESTADO[est] + "</span>";
  }
  function barra(pct) {
    return '<span class="barra" role="img" aria-label="' + pct + '% completado"><span style="width:' + pct + '%"></span></span>';
  }

  function vistaPanel() {
    var lista = estado.ingresos.filter(function (i) { return !filtroArea || i.area === filtroArea; });
    var res = lista.map(function (i) { return { i: i, r: resumen(i) }; });
    var activos = res.filter(function (x) { return x.r.estado !== "completo"; });
    var atrasados = res.filter(function (x) { return x.r.estado === "atrasado"; });
    var prom = res.length ? Math.round(res.reduce(function (s, x) { return s + x.r.pct; }, 0) / res.length) : 0;
    var vencidas = res.reduce(function (s, x) { return s + x.r.atrasadas.length; }, 0);

    res.sort(function (a, b) {
      var peso = { atrasado: 0, aldia: 1, proximo: 2, completo: 3 };
      return peso[a.r.estado] - peso[b.r.estado] || b.r.atrasadas.length - a.r.atrasadas.length;
    });

    var opciones = '<option value="">Todas las áreas</option>' + P.areas.map(function (a) {
      return '<option value="' + a.id + '"' + (a.id === filtroArea ? " selected" : "") + ">" + esc(a.nombre) + "</option>";
    }).join("");

    var filas = res.map(function (x) {
      var i = x.i, r = x.r, a = area(i.area);
      var prox = r.atrasadas[0] || r.proxima;
      var diaTxt = r.dia < 0 ? "Ingresa en " + (-r.dia) + " d" : "Día " + r.dia;
      return '<a class="fila" href="#ingreso-' + i.id + '">' +
        '<span class="fila-quien"><strong>' + esc(i.nombre) + "</strong>" +
          (i.ejemplo ? ' <span class="tag-ej">ejemplo</span>' : "") +
          "<small>" + esc(i.puesto) + " · " + esc(a ? a.nombre : i.area) + "</small></span>" +
        '<span class="fila-dia mono">' + diaTxt + "<small>desde " + fmt(deISO(i.inicio)) + "</small></span>" +
        '<span class="fila-avance">' + barra(r.pct) + '<span class="mono">' + r.hechas + "/" + r.total + "</span></span>" +
        '<span class="fila-prox">' + (prox ? '<small class="' + (r.atrasadas.length ? "txt-mal" : "") + '">' +
          (r.atrasadas.length ? r.atrasadas.length + " vencida" + (r.atrasadas.length > 1 ? "s" : "") + " · " : "Sigue: ") +
          esc(prox.titulo) + "</small>" : "<small>Inducción cerrada</small>") + "</span>" +
        '<span class="fila-estado">' + pill(r.estado) + "</span>" +
      "</a>";
    }).join("");

    raiz.innerHTML =
      '<header class="cab"><div><p class="eyebrow">Panel de RR.HH.</p><h1>Ingresos en inducción</h1></div>' +
        '<a class="btn btn-pri" href="#nuevo">Registrar ingreso</a></header>' +
      '<section class="kpis" aria-label="Resumen">' +
        kpi(activos.length, "en inducción") +
        kpi(atrasados.length, "con tareas atrasadas", atrasados.length ? "mal" : "") +
        kpi(vencidas, "tareas vencidas", vencidas ? "mal" : "") +
        kpi(prom + "%", "avance promedio") +
      "</section>" +
      '<div class="barra-filtros"><label for="f-area">Área</label><select id="f-area">' + opciones + "</select></div>" +
      '<div class="tabla" role="list">' +
        (filas || '<p class="vacio">No hay ingresos en esta área. Registrá uno con el botón de arriba.</p>') +
      "</div>" +
      (estado.ingresos.some(function (i) { return i.ejemplo; }) ?
        '<p class="nota">Los ingresos marcados como <span class="tag-ej">ejemplo</span> son ficticios, para mostrar cómo funciona. ' +
        '<button class="link" id="borrar-ej">Quitar ejemplos</button></p>' : "");

    document.getElementById("f-area").onchange = function (e) { filtroArea = e.target.value; render(); };
    var be = document.getElementById("borrar-ej");
    if (be) be.onclick = function () {
      estado.ingresos = estado.ingresos.filter(function (i) { return !i.ejemplo; });
      guardar(); render();
    };
  }

  function kpi(valor, etiqueta, tono) {
    return '<div class="kpi' + (tono ? " kpi-" + tono : "") + '"><span class="kpi-v mono">' + valor + "</span><span>" + etiqueta + "</span></div>";
  }

  function vistaNuevo() {
    var opciones = P.areas.map(function (a) {
      return '<option value="' + a.id + '">' + esc(a.nombre) + "</option>";
    }).join("");
    raiz.innerHTML =
      '<a class="volver" href="#panel">← Volver al panel</a>' +
      '<header class="cab"><div><p class="eyebrow">Nuevo ingreso</p><h1>Registrar ingreso</h1></div></header>' +
      '<form id="form-nuevo" class="form">' +
        campo("n-nombre", "Nombre y apellido", '<input id="n-nombre" required autocomplete="off">') +
        campo("n-puesto", "Puesto", '<input id="n-puesto" required autocomplete="off">') +
        campo("n-area", "Área", '<select id="n-area" required>' + opciones + "</select>") +
        campo("n-inicio", "Fecha de ingreso", '<input id="n-inicio" type="date" required value="' + aISO(sumarDias(hoy(), 7)) + '">') +
        campo("n-jefe", "Jefe directo", '<input id="n-jefe" required autocomplete="off">') +
        campo("n-buddy", "Buddy (compañero de acompañamiento)", '<input id="n-buddy" autocomplete="off">') +
        '<p class="nota" id="n-resumen"></p>' +
        '<div class="acciones"><button class="btn btn-pri" type="submit">Crear checklist</button>' +
        '<a class="btn" href="#panel">Cancelar</a></div>' +
      "</form>";

    var sel = document.getElementById("n-area");
    function actualizar() {
      var a = area(sel.value);
      var n = P.comun.tareas.length + a.tareas.length;
      document.getElementById("n-resumen").textContent =
        "Se va a asignar el tronco común (" + P.comun.tareas.length + " tareas) más el track de " +
        a.nombre + " (" + a.tareas.length + " tareas): " + n + " tareas en 90 días.";
    }
    sel.onchange = actualizar;
    actualizar();

    document.getElementById("form-nuevo").onsubmit = function (e) {
      e.preventDefault();
      var v = function (id) { return document.getElementById(id).value.trim(); };
      var ing = { id: nuevoId(), nombre: v("n-nombre"), puesto: v("n-puesto"), area: v("n-area"),
        inicio: v("n-inicio"), jefe: v("n-jefe"), buddy: v("n-buddy"), hechas: {} };
      estado.ingresos.push(ing);
      guardar();
      location.hash = "ingreso-" + ing.id;
    };
  }

  function campo(id, etiqueta, control) {
    return '<div class="campo"><label for="' + id + '">' + etiqueta + "</label>" + control + "</div>";
  }

  function vistaIngreso(id) {
    var ing = estado.ingresos.filter(function (i) { return i.id === id; })[0];
    if (!ing) { location.hash = "panel"; return; }
    var r = resumen(ing), a = area(ing.area);
    var ts = tareasDe(ing);
    var responsables = [];
    ts.forEach(function (t) { if (responsables.indexOf(t.responsable) < 0) responsables.push(t.responsable); });
    if (filtroResp && responsables.indexOf(filtroResp) < 0) filtroResp = "";

    var chips = ['<button class="chip" aria-pressed="' + (!filtroResp) + '" data-resp="">Todos</button>']
      .concat(responsables.map(function (x) {
        return '<button class="chip" aria-pressed="' + (filtroResp === x) + '" data-resp="' + esc(x) + '">' + esc(x) + "</button>";
      })).join("");

    var bloques = P.etapas.map(function (e) {
      var deEtapa = ts.filter(function (t) { return t.etapa === e.id; });
      if (!deEtapa.length) return "";
      var hechas = deEtapa.filter(function (t) { return ing.hechas[t.id]; }).length;
      var visibles = deEtapa.filter(function (t) { return !filtroResp || t.responsable === filtroResp; });
      var venceEtapa = sumarDias(deISO(ing.inicio), e.dia);
      return '<section class="etapa">' +
        '<header class="etapa-cab"><span class="codigo mono">' + e.codigo + "</span>" +
          "<h2>" + e.nombre + "</h2>" +
          '<span class="etapa-meta mono">' + hechas + "/" + deEtapa.length + " · vence " + fmt(venceEtapa) + "</span></header>" +
        (visibles.length ? '<ul class="tareas">' + visibles.map(function (t) { return filaTarea(ing, t); }).join("") + "</ul>"
          : '<p class="vacio">Sin tareas para este responsable en esta etapa.</p>') +
      "</section>";
    }).join("");

    raiz.innerHTML =
      '<a class="volver" href="#panel">← Volver al panel</a>' +
      '<header class="cab ficha"><div><p class="eyebrow">' + esc(a ? a.nombre : "") +
        (ing.ejemplo ? ' · <span class="tag-ej">ejemplo</span>' : "") + "</p>" +
        "<h1>" + esc(ing.nombre) + "</h1>" +
        '<dl class="datos"><div><dt>Puesto</dt><dd>' + esc(ing.puesto) + "</dd></div>" +
        "<div><dt>Ingreso</dt><dd>" + fmt(deISO(ing.inicio)) + "</dd></div>" +
        "<div><dt>Jefe directo</dt><dd>" + esc(ing.jefe) + "</dd></div>" +
        "<div><dt>Buddy</dt><dd>" + esc(ing.buddy || "Sin asignar") + "</dd></div></dl></div>" +
        '<div class="ficha-estado">' + pill(r.estado) + '<span class="kpi-v mono">' + r.pct + "%</span>" + barra(r.pct) +
          '<small class="mono">' + r.hechas + " de " + r.total + " tareas</small></div>" +
      "</header>" +
      '<div class="barra-filtros"><span class="lbl">Ver tareas de</span><div class="chips">' + chips + "</div></div>" +
      bloques +
      '<footer class="pie-ficha">' +
        (confirmarBorrado
          ? '<span>¿Eliminar a ' + esc(ing.nombre) + ' y todo su avance?</span><button class="btn btn-mal" id="si-borrar">Eliminar</button><button class="btn" id="no-borrar">Cancelar</button>'
          : '<button class="link txt-mal" id="borrar">Eliminar este ingreso</button>') +
      "</footer>";

    raiz.querySelectorAll(".chip").forEach(function (b) {
      b.onclick = function () { filtroResp = b.getAttribute("data-resp"); render(); };
    });
    raiz.querySelectorAll("input[data-tarea]").forEach(function (c) {
      c.onchange = function () {
        var tid = c.getAttribute("data-tarea");
        if (c.checked) ing.hechas[tid] = { fecha: aISO(hoy()) };
        else delete ing.hechas[tid];
        guardar(); render();
      };
    });
    raiz.querySelectorAll("[data-quiz]").forEach(function (b) {
      b.onclick = function () {
        var tid = b.getAttribute("data-quiz");
        quizAbierto = quizAbierto === tid ? null : tid;
        render();
      };
    });
    var fq = document.getElementById("form-quiz");
    if (fq) fq.onsubmit = function (e) { e.preventDefault(); corregirQuiz(ing, fq); };
    var bb = document.getElementById("borrar");
    if (bb) bb.onclick = function () { confirmarBorrado = true; render(); };
    var nb = document.getElementById("no-borrar");
    if (nb) nb.onclick = function () { confirmarBorrado = false; render(); };
    var sb = document.getElementById("si-borrar");
    if (sb) sb.onclick = function () {
      estado.ingresos = estado.ingresos.filter(function (i) { return i.id !== ing.id; });
      confirmarBorrado = false; guardar(); location.hash = "panel";
    };
  }

  function filaTarea(ing, t) {
    var hecha = ing.hechas[t.id];
    var venc = vencida(ing, t);
    var control = t.tipo === "quiz"
      ? '<span class="check-q mono" aria-label="' + (hecha ? "Aprobada" : "Pendiente") + '">' + (hecha ? "✓" : "?") + "</span>"
      : '<input type="checkbox" id="t-' + t.id + '" data-tarea="' + t.id + '"' + (hecha ? " checked" : "") + ">";
    var cierre = hecha
      ? '<span class="estado-t ok mono">Hecho ' + fmt(deISO(hecha.fecha)) + (hecha.nota ? " · " + esc(hecha.nota) : "") + "</span>"
      : '<span class="estado-t mono' + (venc ? " txt-mal" : "") + '">' + (venc ? "Vencida " : "Vence ") + fmt(vence(ing, t)) + "</span>";
    var quiz = "";
    if (t.tipo === "quiz") {
      quiz = '<button class="btn btn-chico" data-quiz="' + t.id + '">' +
        (quizAbierto === t.id ? "Cerrar" : hecha ? "Repetir autoevaluación" : "Hacer autoevaluación") + "</button>";
      if (quizAbierto === t.id) quiz += formQuiz(t);
    }
    return '<li class="tarea' + (hecha ? " hecha" : "") + (venc ? " venc" : "") + '">' +
      control +
      '<div class="tarea-cuerpo">' +
        '<label for="t-' + t.id + '" class="tarea-tit">' + esc(t.titulo) + "</label>" +
        "<p>" + esc(t.detalle).replace(/\[VALIDAR([^\]]*)\]/g, '<mark class="validar">A VALIDAR$1</mark>') + "</p>" +
        '<div class="tarea-meta"><span class="resp">' + esc(t.responsable) + "</span>" +
          '<span class="tipo">' + TIPOS[t.tipo] + "</span>" +
          '<span class="origen">' + esc(t.origen) + "</span>" + cierre + "</div>" +
        quiz +
      "</div></li>";
  }

  function formQuiz(t) {
    return '<form id="form-quiz" class="quiz" data-tarea="' + t.id + '">' +
      t.preguntas.map(function (q, n) {
        return '<fieldset><legend>' + (n + 1) + ". " + esc(q.p) + "</legend>" +
          q.opciones.map(function (o, k) {
            var id = "q-" + t.id + "-" + n + "-" + k;
            return '<label for="' + id + '"><input type="radio" id="' + id + '" name="q' + n + '" value="' + k + '" required> ' + esc(o) + "</label>";
          }).join("") + "</fieldset>";
      }).join("") +
      '<div class="acciones"><button class="btn btn-pri" type="submit">Corregir</button><span id="quiz-res" class="mono" role="status"></span></div>' +
    "</form>";
  }

  function corregirQuiz(ing, form) {
    var tid = form.getAttribute("data-tarea");
    var t = tareasDe(ing).filter(function (x) { return x.id === tid; })[0];
    var bien = 0;
    t.preguntas.forEach(function (q, n) {
      var marcada = form.querySelector('input[name="q' + n + '"]:checked');
      var fs = form.querySelectorAll("fieldset")[n];
      var ok = marcada && +marcada.value === q.correcta;
      fs.classList.toggle("ok", !!ok);
      fs.classList.toggle("mal", !ok);
      if (ok) bien++;
    });
    var nota = bien / t.preguntas.length;
    var res = document.getElementById("quiz-res");
    if (nota >= APROBACION) {
      ing.hechas[tid] = { fecha: aISO(hoy()), nota: bien + "/" + t.preguntas.length };
      guardar();
      res.textContent = "Aprobada: " + bien + "/" + t.preguntas.length;
      res.className = "mono txt-ok";
      setTimeout(function () { quizAbierto = null; render(); }, 1200);
    } else {
      res.textContent = bien + "/" + t.preguntas.length + ". Hace falta " + Math.ceil(APROBACION * t.preguntas.length) +
        " para aprobar. Revisá las marcadas en rojo y probá de nuevo.";
      res.className = "mono txt-mal";
    }
  }

  function vistaPrograma(sel) {
    var pistas = [{ id: "comun", nombre: P.comun.nombre, descripcion: P.comun.descripcion,
      responsable: "RR.HH.", tareas: P.comun.tareas }].concat(P.areas);
    var actual = pistas.filter(function (p) { return p.id === sel; })[0] || pistas[0];

    var tabs = pistas.map(function (p) {
      return '<a class="chip" href="#programa-' + p.id + '" aria-pressed="' + (p.id === actual.id) + '">' +
        esc(p.corto || p.nombre) + ' <span class="mono">' + p.tareas.length + "</span></a>";
    }).join("");

    var cols = P.etapas.map(function (e) {
      var ts = actual.tareas.filter(function (t) { return t.etapa === e.id; });
      return '<section class="col"><header><span class="codigo mono">' + e.codigo + "</span> " + e.nombre + "</header>" +
        (ts.length ? "<ol>" + ts.map(function (t) {
          return "<li><strong>" + esc(t.titulo) + '</strong><small>' + esc(t.responsable) + " · " + TIPOS[t.tipo] + "</small></li>";
        }).join("") + "</ol>" : '<p class="vacio">—</p>') +
      "</section>";
    }).join("");

    raiz.innerHTML =
      '<header class="cab"><div><p class="eyebrow">Programa estándar</p><h1>Qué recibe cada ingreso</h1>' +
      '<p class="bajada">Todo ingreso recibe el tronco común más el track de su área. El contenido se edita en <code>contenido.js</code>.</p></div></header>' +
      '<div class="barra-filtros"><div class="chips">' + tabs + "</div></div>" +
      '<div class="pista-intro"><h2>' + esc(actual.nombre) + "</h2><p>" + esc(actual.descripcion) + "</p>" +
      '<p class="mono meta">Dueño del contenido: ' + esc(actual.responsable) + "</p></div>" +
      '<div class="grilla">' + cols + "</div>";
  }

  // ---------- arranque ----------

  if (!estado || !estado.ingresos) { estado = ejemplo(); guardar(); }
  window.addEventListener("hashchange", function () {
    quizAbierto = null; confirmarBorrado = false; render(); window.scrollTo(0, 0);
  });
  render();
})();
