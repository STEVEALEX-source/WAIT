(function () {
  function $(id) {
    return document.getElementById(id);
  }

  var prompts = [
    "how many outlets are in this room",
    "what was the last song stuck in your head",
    "name the dumbest movie you've seen",
    "press your toes into the floor hard",
    "what's the coldest thing you can touch right now",
    "spell the street you live on backwards",
    "pick a color and find 4 things that are that color",
    "what did you eat yesterday",
    "describe your shoes like you're selling them",
    "count the corners you can see from here"
  
  ];  

  var timerId = null;
  var remaining = 0;
  var session = null;

  function loadLogs() {
    try {
      return JSON.parse(localStorage.getItem("urge_logs") || "[]");
    } catch (e) {
      return [];
    }                
  }                           
  function saveLogs(arr) {
    localStorage.setItem("urge_logs", JSON.stringify(arr));
  }
  function loadDumps() {
    try {
      return JSON.parse(localStorage.getItem("urge_dumps") || "[]");
    } catch (e) {
      return [];
    }
  }     
  function saveDumps(arr) {
    localStorage.setItem("urge_dumps", JSON.stringify(arr));
  }         

  function fmt(sec) {
    if (sec < 0) sec = 0;
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  function renderHistory() {
    var logs = loadLogs();
    var recent = $("recentList");
    var full = $("historyList");
    var stats = $("stats");
    if (!recent || !full || !stats) return;

    if (!logs.length) {
      recent.innerHTML = '<p style="opacity:0.6">empty</p>';
      full.innerHTML = "";
      stats.textContent = "";
      return;
    }

    var resisted = 0;
    var dropSum = 0;
    var dropCount = 0;
    for (var i = 0; i < logs.length; i++) {
      if (logs[i].result === "resisted") resisted++;
      if (logs[i].anxEnd != null) {
        dropSum += logs[i].anxStart - logs[i].anxEnd;
        dropCount++;
      }
    }
    var avg = dropCount ? (dropSum / dropCount).toFixed(1) : "—";
    stats.innerHTML =
      "<strong>" + resisted + "</strong> resisted / " + logs.length +
      " total · avg anxiety change <strong>" + avg + "</strong>";

    function itemHtml(l) {
      var stamp = l.result === "resisted" ? '<span class="stamp">WAITED</span>' : "";
      var fear = l.fear ? "fear: " + l.fear + " · " : "";
      return (
        '<div class="log-item"><strong>' + l.tag + "</strong> " + stamp +
        "<br/>anxiety " + l.anxStart + " → " + (l.anxEnd != null ? l.anxEnd : "—") +
        " · waited " + l.mins + "m<br/><span style=\"opacity:0.7\">" +
        fear + new Date(l.at).toLocaleString() + "</span></div>"
      );
    }

    var recentHtml = "";
    var n = Math.min(5, logs.length);
    for (var r = 0; r < n; r++) {
      var l = logs[r];
      var st = l.result === "resisted" ? '<span class="stamp">WAITED</span>' : "";
      recentHtml +=
        '<div class="log-item"><strong>' + l.tag + "</strong> " + st +
        "<br/>" + l.anxStart + "→" + (l.anxEnd != null ? l.anxEnd : "?") +
        " · " + l.mins + "m · " + new Date(l.at).toLocaleString() + "</div>";
    }
    recent.innerHTML = recentHtml;

    var fullHtml = "";
    for (var j = 0; j < logs.length; j++) fullHtml += itemHtml(logs[j]);
    full.innerHTML = fullHtml;
  }

  function renderDumps() {
    var dumps = loadDumps();
    var box = $("dumpList");
    if (!box) return;
    var html = "";
    var n = Math.min(8, dumps.length);
    for (var i = 0; i < n; i++) {
      var d = dumps[i];
      var t = d.text.length > 80 ? d.text.slice(0, 80) + "…" : d.text;
      html +=
        '<div class="log-item">' + t +
        '<br/><span style="opacity:0.6">' +
        new Date(d.at).toLocaleString() + "</span></div>";
    }
    box.innerHTML = html;
  }

  function finish(result) {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    if (!session) return;

    session.result = result;
    session.anxEnd = parseInt($("anxietyNow").value, 10);
    session.waited = session.mins * 60 - remaining;
    if (session.waited < 0) session.waited = 0;

    var logs = loadLogs();
    logs.unshift(session);
    saveLogs(logs.slice(0, 200));
    renderHistory();

    var drop = session.anxStart - session.anxEnd;
    var msg =
      result === "resisted"
        ? "ok. you didn't do it."
        : "did the thing. whatever. still writing it down.";
    var detail = "anxiety " + session.anxStart + " → " + session.anxEnd;
    if (drop > 0) detail += " (down " + drop + ")";
    if (drop < 0) detail += " (up " + -drop + ")";
    detail += " · " + Math.round(session.waited / 60) + " min waited";

    $("doneMsg").textContent = msg;
    $("doneDetail").textContent = detail;
    $("timerView").classList.add("hidden");
    $("timerPoster").classList.add("hidden");
    $("doneView").classList.remove("hidden");
    session = null;
  }

  function checkPin() {
    var saved = localStorage.getItem("urge_pin");
    if (!saved) return;

    var gate = document.createElement("div");
    gate.id = "gate";
    gate.style.cssText =
      "position:fixed;inset:0;background:#c4b8a0;z-index:99;display:flex;align-items:center;justify-content:center";
    gate.innerHTML =
      '<div class="poster" style="position:relative;width:260px;transform:rotate(-2deg)">' +
      "<h2>pin</h2>" +
      '<input type="password" id="gatePin" />' +
      '<button type="button" id="gateGo" style="margin-top:8px;width:100%">open</button></div>';
    document.body.appendChild(gate);
    document.getElementById("gateGo").onclick = function () {
      if (document.getElementById("gatePin").value === saved) {
        gate.parentNode.removeChild(gate);
      } else {
        alert("nope");
      }    
    };
  }  



  // --- make posters draggable ---

  function enableDrag() {
    var wall = document.getElementById("wall");
    if (!wall) return;
    var posters = wall.querySelectorAll(".poster");
    for (var i = 0; i < posters.length; i++) {
      setupDrag(posters[i], wall);
    }
  }

  function setupDrag(el, wall) {
    var startX = 0, startY = 0, origLeft = 0, origTop = 0, dragging = false, pointerId = null;

    function interactive(target) {
      while (target && target !== el) {
        var tag = (target.tagName || "").toLowerCase();
        if (tag === "input" || tag === "select" || tag === "textarea" || tag === "button" || tag === "label" || tag === "option") return true;
        target = target.parentNode;
      }
      return false;
    }

    function toAbsolute() {
      var wallRect = wall.getBoundingClientRect();
      var rect = el.getBoundingClientRect();
      var left = rect.left - wallRect.left + wall.scrollLeft;
      var top = rect.top - wallRect.top + wall.scrollTop;
      el.style.position = "absolute";
      el.style.margin = "0";
      el.style.left = left + "px";
      el.style.top = top + "px";
      el.style.right = "auto";
      el.style.bottom = "auto";
      // keep a slight rotation if none set via inline
      if (!el.style.transform) {
        el.style.transform = "rotate(" + (Math.random() * 4 - 2).toFixed(1) + "deg)";
      }
      return { left: left, top: top };
    }

    function onDown(e) {
      if (interactive(e.target)) return;
      // only primary button / touch
      if (e.type === "mousedown" && e.button !== 0) return;

      var pos = toAbsolute();
      var clientX = e.clientX != null ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      var clientY = e.clientY != null ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

      if (e.pointerId != null) {
        pointerId = e.pointerId;
        try { el.setPointerCapture(e.pointerId); } catch (err) {}
      }

      startX = clientX;
      startY = clientY;
      origLeft = pos.left;
      origTop = pos.top;
      dragging = true;
      el.classList.add("dragging");
      e.preventDefault();
    }

    function onMove(e) {
      if (!dragging) return;
      if (pointerId != null && e.pointerId != null && e.pointerId !== pointerId) return;

      var clientX = e.clientX != null ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : startX);
      var clientY = e.clientY != null ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : startY);

      var dx = clientX - startX;
      var dy = clientY - startY;
      el.style.left = (origLeft + dx) + "px";
      el.style.top = (origTop + dy) + "px";
      e.preventDefault();
    }

    function onUp(e) {
      if (!dragging) return;
      if (pointerId != null && e.pointerId != null && e.pointerId !== pointerId) return;
      dragging = false;
      pointerId = null;
      el.classList.remove("dragging");
      savePositions();
    }

    // Prefer pointer events; also bind mouse/touch as fallback
    if (window.PointerEvent) {
      el.addEventListener("pointerdown", onDown);
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerup", onUp);
      el.addEventListener("pointercancel", onUp);
    } else {
      el.addEventListener("mousedown", onDown);
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
      el.addEventListener("touchstart", onDown, { passive: false });
      window.addEventListener("touchmove", onMove, { passive: false });
      window.addEventListener("touchend", onUp);
    }
  }

  function savePositions() {
    var data = {};
    var posters = document.querySelectorAll(".poster");
    for (var i = 0; i < posters.length; i++) {
      var el = posters[i];
      if (!el.id) el.id = "poster_" + i;
      if (el.style.left) {
        data[el.id] = {
          left: el.style.left,
          top: el.style.top,
          transform: el.style.transform || ""
        };
      }
    }
    try { localStorage.setItem("urge_positions", JSON.stringify(data)); } catch (e) {}
  }

  function loadPositions() {
    try {
      var raw = localStorage.getItem("urge_positions");
      if (!raw) return;
      var data = JSON.parse(raw);
      var posters = document.querySelectorAll(".poster");
      for (var i = 0; i < posters.length; i++) {
        var el = posters[i];
        if (!el.id) el.id = "poster_" + i;
        if (data[el.id]) {
          el.style.position = "absolute";
          el.style.margin = "0";
          el.style.left = data[el.id].left;
          el.style.top = data[el.id].top;
          el.style.right = "auto";
          el.style.bottom = "auto";
          if (data[el.id].transform) el.style.transform = data[el.id].transform;
        }
      }
    } catch (e) {}
  }

  function init() {
    if (!$("startBtn")) {
      console.error("Urge Pause: missing DOM");
      return;
    }

    $("anxiety").oninput = function () {
      $("anxVal").textContent = $("anxiety").value;
    };
    $("anxietyNow").oninput = function () {
      $("anxNowVal").textContent = $("anxietyNow").value;
    };

    $("startBtn").onclick = function () {
      var mins = parseInt($("mins").value, 10) || 10;
      remaining = mins * 60;
      session = {
        tag: $("tag").value,
        anxStart: parseInt($("anxiety").value, 10) || 5,
        fear: ($("fearNote").value || "").trim(),
        mins: mins,
        at: Date.now()
      };
      $("anxietyNow").value = session.anxStart;
      $("anxNowVal").textContent = session.anxStart;
      $("setupView").classList.add("hidden");
      $("timerView").classList.remove("hidden");
      $("doneView").classList.add("hidden");
      $("timerPoster").classList.remove("hidden");
      $("clock").textContent = fmt(remaining);
      $("clock2").textContent = fmt(remaining);

      if (timerId) clearInterval(timerId);
      timerId = setInterval(function () {
        remaining--;
        if (remaining <= 0) {
          remaining = 0;
          clearInterval(timerId);
          timerId = null;
          $("clock").textContent = "0:00";
          $("clock2").textContent = "0:00";
        } else {
          $("clock").textContent = fmt(remaining);
          $("clock2").textContent = fmt(remaining);
        }
      }, 1000);
    };                           

    $("resistBtn").onclick = function () {
      finish("resisted");
    };
    $("gaveBtn").onclick = function () {
      finish("gave_in");
    };
    $("cancelBtn").onclick = function () {
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
      session = null;
      $("timerView").classList.add("hidden");
      $("timerPoster").classList.add("hidden");
      $("setupView").classList.remove("hidden");
    };
    $("againBtn").onclick = function () {
      $("doneView").classList.add("hidden");
      $("setupView").classList.remove("hidden");
    };

    $("distractBtn").onclick = function () {
      var i = Math.floor(Math.random() * prompts.length);
      $("distractText").textContent = prompts[i];
    };

    var breathOn = false;
    $("breathBtn").onclick = function () {
      breathOn = !breathOn;
      $("breathCircle").classList.toggle("on", breathOn);
      $("breathBtn").textContent = breathOn ? "stop" : "start";
    };

    $("dumpSave").onclick = function () {
      var t = ($("dump").value || "").trim();
      if (!t) return;
      var dumps = loadDumps();
      dumps.unshift({ text: t, at: Date.now() });
      saveDumps(dumps.slice(0, 50));
      $("dump").value = "";
      renderDumps();
    };
    $("dumpClear").onclick = function () {
      $("dump").value = "";
    };

    $("exportBtn").onclick = function () {
      var data = { logs: loadLogs(), dumps: loadDumps() };
      var blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json"
      });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "urge-pause-log.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
    $("clearAllBtn").onclick = function () {
      if (confirm("really wipe all of this?")) {
        localStorage.removeItem("urge_logs");
        localStorage.removeItem("urge_dumps");
        renderHistory();
        renderDumps();
      }
    };

    var remKey = "urge_reminder";
    var defaultRem = "it always feels permanent until it isn't";
    $("reminderText").textContent = localStorage.getItem(remKey) || defaultRem;
    $("editReminder").onclick = function () {
      var editing = !$("reminderEdit").classList.contains("hidden");
      if (editing) {
        var v = ($("reminderEdit").value || "").trim() || defaultRem;
        localStorage.setItem(remKey, v);
        $("reminderText").textContent = v;
        $("reminderText").classList.remove("hidden");
        $("reminderEdit").classList.add("hidden");
        $("editReminder").textContent = "edit";
      } else {
        $("reminderEdit").value = $("reminderText").textContent;
        $("reminderText").classList.add("hidden");
        $("reminderEdit").classList.remove("hidden");
        $("editReminder").textContent = "save";
      }
    };

    $("pinBtn").onclick = function () {
      var v = ($("pinInput").value || "").trim();
      if (!v) {
        localStorage.removeItem("urge_pin");            
        alert("pin gone");
        return;
      }
      localStorage.setItem("urge_pin", v);
      alert("ok locked next time");
      $("pinInput").value = "";
    };

    renderHistory();
    renderDumps();                
    checkPin();                                           
    loadPositions();         
    enableDrag();         
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }   
})();                          
                       