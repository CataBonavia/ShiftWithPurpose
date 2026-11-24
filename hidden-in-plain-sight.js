/* Hidden in Plain Sight quiz engine. Content lives in hidden-in-plain-sight-data.js */
(function () {
  "use strict";

  var Q = window.QUIZ;
  var S = Q.settings;
  var app = document.getElementById("hips-app");
  var stage = document.getElementById("hips-stage");
  var params = new URLSearchParams(window.location.search);
  var LETTERS = "ABCDEFGH";

  var state = {
    step: -1,
    answers: new Array(Q.questions.length).fill(null),
    submitted: false
  };

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function isChoice(q) { return q.type === "choice"; }
  function setStage(mode) {          // "dark" for intro and questions, "light" for results
    stage.className = "section hips-stage " + (mode === "light" ? "hips-stage--light" : "section--navy");
  }
  function render(html, mode) {
    setStage(mode || "dark");
    app.innerHTML = html;
    var top = stage.getBoundingClientRect().top + window.scrollY - 90;
    if (window.scrollY > top) window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
    var focusEl = app.querySelector("[data-autofocus]");
    if (focusEl) focusEl.focus({ preventScroll: true });
  }

  function scores() {
    var totals = {};
    S.tieBreakOrder.forEach(function (k) { totals[k] = 0; });
    Q.questions.forEach(function (q, i) {
      var a = state.answers[i];
      if (a === null) return;
      if (isChoice(q)) {
        var sc = q.options[a].scores || {};
        Object.keys(sc).forEach(function (k) { totals[k] = (totals[k] || 0) + sc[k]; });
      } else {
        totals[q.suspect] = (totals[q.suspect] || 0) + a;
      }
    });
    return totals;
  }
  function topThree(totals) {
    return Object.keys(totals).sort(function (a, b) {
      if (totals[b] !== totals[a]) return totals[b] - totals[a];
      return S.tieBreakOrder.indexOf(a) - S.tieBreakOrder.indexOf(b);
    }).slice(0, 3);
  }

  /* ---------- screens ---------- */
  function showIntro() {
    state.step = -1;
    render(
      '<div class="hips-intro">' +
        '<span class="caption hips-caption">' + esc(Q.intro.eyebrow) + '</span>' +
        '<h1>' + esc(Q.intro.headline) + '</h1>' +
        '<p class="lead">' + esc(Q.intro.body) + '</p>' +
        '<button class="btn btn-sage" id="hips-start" data-autofocus>' + esc(Q.intro.button) + ' &rarr;</button>' +
        '<p class="hips-meta">' + Q.questions.length + ' questions. No right or wrong answers.</p>' +
      '</div>'
    );
    document.getElementById("hips-start").onclick = function () { showQuestion(0); };
  }

  function showQuestion(i) {
    state.step = i;
    var q = Q.questions[i];
    var total = Q.questions.length;
    var pct = Math.round((i / total) * 100);
    var opts, optsClass;

    if (isChoice(q)) {
      optsClass = "hips-options hips-options--list";
      opts = q.options.map(function (o, v) {
        var sel = state.answers[i] === v;
        return '<button class="hips-option' + (sel ? " is-selected" : "") + '" data-value="' + v + '" aria-pressed="' + sel + '">' +
          '<span class="hips-key">' + LETTERS[v] + '</span>' +
          '<span class="hips-label">' + (o.emoji ? '<span class="hips-emoji" aria-hidden="true">' + o.emoji + '</span>' : '') + esc(o.label) + '</span>' +
        '</button>';
      }).join("");
    } else {
      optsClass = "hips-options hips-options--scale";
      opts = S.scale.map(function (label, v) {
        var sel = state.answers[i] === v;
        return '<button class="hips-option' + (sel ? " is-selected" : "") + '" data-value="' + v + '" aria-pressed="' + sel + '">' +
          '<span class="hips-key">' + (v + 1) + '</span><span class="hips-label">' + esc(label) + '</span></button>';
      }).join("");
    }

    render(
      '<div class="hips-question-wrap">' +
        '<div class="hips-progress">' +
          '<div class="hips-progress__label"><span>Question ' + (i + 1) + ' of ' + total + '</span><span>' + pct + '%</span></div>' +
          '<div class="hips-progress__track"><div class="hips-progress__fill" style="width:' + pct + '%"></div></div>' +
        '</div>' +
        '<h2 class="hips-question" id="hips-qtext" tabindex="-1" data-autofocus>' + esc(q.text) + '</h2>' +
        (q.hint ? '<p class="hips-hint">' + esc(q.hint) + '</p>' : '') +
        '<div class="' + optsClass + '" role="group" aria-labelledby="hips-qtext">' + opts + '</div>' +
        '<div class="hips-nav">' +
          '<button class="hips-link" id="hips-back">&larr; Back</button>' +
          '<button class="btn btn-sage" id="hips-next"' + (state.answers[i] === null ? " disabled" : "") + '>' +
            (i === total - 1 ? "Close the case" : "Next") + ' &rarr;</button>' +
        '</div>' +
      '</div>'
    );

    app.querySelectorAll(".hips-option").forEach(function (btn) {
      btn.onclick = function () { choose(parseInt(btn.dataset.value, 10)); };
    });
    document.getElementById("hips-back").onclick = function () { i === 0 ? showIntro() : showQuestion(i - 1); };
    document.getElementById("hips-next").onclick = next;
  }

  var advanceTimer = null;
  function choose(v) {
    var i = state.step;
    state.answers[i] = v;
    app.querySelectorAll(".hips-option").forEach(function (b) {
      var on = parseInt(b.dataset.value, 10) === v;
      b.classList.toggle("is-selected", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    document.getElementById("hips-next").disabled = false;
    clearTimeout(advanceTimer);
    advanceTimer = setTimeout(next, 380);
  }

  function next() {
    clearTimeout(advanceTimer);
    var i = state.step;
    if (typeof i !== "number" || state.answers[i] === null) return;
    if (i < Q.questions.length - 1) return showQuestion(i + 1);
    if (S.emailBeforeResults) showDetails();
    else showResults(topThree(scores()), true);
  }

  function formHtml(buttonText, btnClass) {
    return (
      '<form id="hips-form" class="hips-form" novalidate>' +
        '<div class="hips-field"><label for="hips-fname">First name</label>' +
          '<input type="text" id="hips-fname" name="first_name" autocomplete="given-name" required></div>' +
        '<div class="hips-field"><label for="hips-email">Email</label>' +
          '<input type="email" id="hips-email" name="email" autocomplete="email" required></div>' +
        '<div class="hips-field"><label for="hips-org">Organisation</label>' +
          '<input type="text" id="hips-org" name="organisation" autocomplete="organization"></div>' +
        '<input class="hips-hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">' +
        '<label class="hips-check"><input type="checkbox" id="hips-consent" checked> <span>' + esc(Q.details.consent) + '</span></label>' +
        '<p class="hips-error" id="hips-err" role="alert" hidden></p>' +
        '<button class="btn ' + btnClass + '" type="submit">' + esc(buttonText) + ' &rarr;</button>' +
      '</form>'
    );
  }

  function showDetails() {
    state.step = "details";
    render(
      '<div class="hips-question-wrap">' +
        '<span class="caption hips-caption">' + esc(Q.details.eyebrow) + '</span>' +
        '<h2 data-autofocus tabindex="-1">' + esc(Q.details.headline) + '</h2>' +
        '<p class="lead">' + esc(Q.details.body) + '</p>' +
        formHtml(Q.details.button, "btn-sage") +
        '<p class="hips-backrow"><button class="hips-link" id="hips-back">&larr; Back to the questions</button></p>' +
      '</div>'
    );
    document.getElementById("hips-back").onclick = function () { showQuestion(Q.questions.length - 1); };
    bindForm(function () { showResults(topThree(scores()), false); });
  }

  function bindForm(onDone) {
    var form = document.getElementById("hips-form");
    form.onsubmit = function (e) {
      e.preventDefault();
      var err = document.getElementById("hips-err");
      var data = new FormData(form);
      var fname = (data.get("first_name") || "").trim();
      var email = (data.get("email") || "").trim();
      if (!fname || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        err.textContent = "Please add your first name and a valid email.";
        err.hidden = false;
        return;
      }
      if (data.get("website")) { onDone(); return; }   // honeypot: quietly skip bots
      var btn = form.querySelector("button[type=submit]");
      btn.disabled = true;
      btn.textContent = "Opening the case file...";
      submit({
        first_name: fname,
        email: email,
        organisation: (data.get("organisation") || "").trim(),
        consent: document.getElementById("hips-consent").checked ? "yes" : "no"
      }).then(onDone);
    };
  }

  function suspectCard(key, n) {
    var s = Q.suspects[key];
    return (
      '<article class="hips-suspect">' +
        '<span class="hips-suspect__num">Suspect #' + n + '</span>' +
        '<h3>' + esc(s.name) + '</h3>' +
        '<p class="hips-suspect__hook accent">' + esc(s.hook) + '</p>' +
        '<p>' + esc(s.body) + '</p>' +
        '<span class="caption hips-suspect__label">What this could look like</span>' +
        '<ul class="hips-suspect__list">' + s.examples.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + '</ul>' +
        '<div class="hips-suspect__investigate">' +
          '<span class="caption hips-suspect__label">Worth investigating</span>' +
          '<p>' + esc(s.investigate) + '</p>' +
        '</div>' +
      '</article>'
    );
  }

  function showResults(top, withForm) {
    state.step = "results";
    try { history.replaceState(null, "", "?r=" + top.join(",")); } catch (e) {}

    var R = Q.results;
    var formBlock = withForm && !state.submitted
      ? '<div class="hips-formcard" id="hips-formcard"><h3>Want the full case file in your inbox?</h3>' + formHtml("Email me my results", "btn-primary") + '</div>'
      : "";

    render(
      '<div class="hips-results">' +
        '<div class="hips-results__head">' +
          '<span class="caption">' + esc(R.eyebrow) + '</span>' +
          '<h1 data-autofocus tabindex="-1">' + esc(R.headline) + '</h1>' +
          '<p class="lead">' + esc(R.intro) + '</p>' +
        '</div>' +
        top.map(function (k, i) { return suspectCard(k, i + 1); }).join("") +
        formBlock +
        '<div class="hips-cta">' +
          '<span class="caption hips-caption">' + esc(R.cta.eyebrow) + '</span>' +
          '<h2>' + esc(R.cta.headline) + '</h2>' +
          '<p>' + esc(R.cta.body) + '</p>' +
          '<a class="btn btn-sage" href="' + esc(S.bookingUrl) + '">' + esc(R.cta.button) + ' &rarr;</a>' +
        '</div>' +
        '<p class="hips-ps"><strong>PS:</strong> ' + esc(R.ps) + '</p>' +
        '<p><button class="hips-link hips-link--dark" id="hips-restart">Retake the quiz</button></p>' +
      '</div>',
      "light"
    );

    document.getElementById("hips-restart").onclick = function () {
      state.answers.fill(null);
      state.submitted = false;
      try { history.replaceState(null, "", window.location.pathname); } catch (e) {}
      showIntro();
    };
    if (formBlock) bindForm(function () {
      document.getElementById("hips-formcard").innerHTML = "<h3>On its way</h3><p>Check your inbox for your full case file.</p>";
    });
  }

  /* ---------- sending results ---------- */
  function submit(person) {
    state.submitted = true;
    var totals = scores();
    var top = topThree(totals);
    var payload = {
      first_name: person.first_name,
      email: person.email,
      organisation: person.organisation,
      consent: person.consent,
      suspect_1: top[0], suspect_2: top[1], suspect_3: top[2],
      suspect_1_name: Q.suspects[top[0]].name,
      suspect_2_name: Q.suspects[top[1]].name,
      suspect_3_name: Q.suspects[top[2]].name,
      results_url: window.location.origin + window.location.pathname + "?r=" + top.join(","),
      submitted_at: new Date().toISOString(),
      page: window.location.href.split("?")[0],
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || ""
    };
    Object.keys(totals).forEach(function (k) { payload["score_" + k] = totals[k]; });
    Q.questions.forEach(function (q, i) {
      var a = state.answers[i];
      if (isChoice(q)) {
        var label = a === null ? "" : q.options[a].label;
        payload["q" + (i + 1)] = label;
        if (q.field) payload[q.field] = label;
      } else {
        payload["q" + (i + 1)] = a;
      }
    });

    var jobs = [];
    if (S.webhookUrl) {
      jobs.push(fetch(S.webhookUrl, { method: "POST", mode: "no-cors", body: new URLSearchParams(payload) }).catch(function () {}));
    }
    if (S.mailerlite && S.mailerlite.accountId && S.mailerlite.formId && person.consent === "yes") {
      var ml = new URLSearchParams();
      ml.append("fields[email]", person.email);
      ml.append("fields[name]", person.first_name);
      ml.append("fields[company]", person.organisation);
      ml.append("fields[suspect_1]", payload.suspect_1_name);
      ml.append("fields[suspect_2]", payload.suspect_2_name);
      ml.append("fields[suspect_3]", payload.suspect_3_name);
      if (payload.readiness) ml.append("fields[readiness]", payload.readiness);
      if (payload.situation) ml.append("fields[situation]", payload.situation);
      // every answer in one readable line, e.g. "Q1 Often; Q2 Absolutely; ..."
      ml.append("fields[answers]", Q.questions.map(function (q, i) {
        var a = state.answers[i];
        return "Q" + (i + 1) + " " + (a === null ? "-" : (isChoice(q) ? LETTERS[a] : S.scale[a]));
      }).join("; "));
      // all six suspect scores, e.g. "Program 4, Expertise 7, ..."
      ml.append("fields[scores]", S.tieBreakOrder.map(function (k) {
        return k.charAt(0).toUpperCase() + k.slice(1) + " " + (totals[k] || 0);
      }).join(", "));
      ml.append("ml-submit", "1");
      ml.append("anticsrf", "true");
      jobs.push(fetch("https://assets.mailerlite.com/jsonp/" + S.mailerlite.accountId + "/forms/" + S.mailerlite.formId + "/subscribe",
        { method: "POST", mode: "no-cors", body: ml }).catch(function () {}));
    }
    var timeout = new Promise(function (r) { setTimeout(r, 2500); });
    return Promise.race([Promise.all(jobs), timeout]);
  }

  /* ---------- keyboard: numbers or letters to answer ---------- */
  document.addEventListener("keydown", function (e) {
    if (typeof state.step !== "number" || state.step < 0) return;
    if (/INPUT|TEXTAREA/.test(e.target.tagName) || e.metaKey || e.ctrlKey || e.altKey) return;
    var q = Q.questions[state.step];
    var count = isChoice(q) ? q.options.length : S.scale.length;
    var v = -1;
    if (/^[1-9]$/.test(e.key)) v = parseInt(e.key, 10) - 1;
    else if (/^[a-h]$/i.test(e.key)) v = LETTERS.indexOf(e.key.toUpperCase());
    if (v >= 0 && v < count) { e.preventDefault(); choose(v); }
  });

  /* ---------- start ---------- */
  var shared = (params.get("r") || "").split(",").filter(function (k) { return Q.suspects[k]; });
  if (shared.length === 3) showResults(shared, false);
  else showIntro();
})();
