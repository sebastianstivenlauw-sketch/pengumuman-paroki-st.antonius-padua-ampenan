/* Pengumuman Paroki St. Antonius Padua — interaksi halaman */
(function () {
  "use strict";

  var WITA_OFFSET = 8 * 60 * 60 * 1000;
  /* Jam selesai hanya dipakai untuk status "sedang berlangsung",
     tidak ditampilkan sebagai jadwal. */
  var MASSES = [
    { start: 7 * 60 + 30, end: 8 * 60 + 45, time: "07.30", name: "Misa pagi" },
    { start: 18 * 60, end: 19 * 60 + 15, time: "18.00", name: "Misa sore" }
  ];

  var clockEl = document.getElementById("wita-clock");
  var nextMassEl = document.getElementById("next-mass");
  var nextLabel = document.getElementById("next-label");
  var nextWhen = document.getElementById("next-when");
  var nextCount = document.getElementById("next-count");
  var yearEl = document.getElementById("year");

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function shiftedDate(timestamp) {
    return new Date(timestamp + WITA_OFFSET);
  }

  function witaParts(timestamp) {
    var d = shiftedDate(timestamp);
    return {
      year: d.getUTCFullYear(),
      month: d.getUTCMonth(),
      date: d.getUTCDate(),
      dow: d.getUTCDay(),
      minutes: d.getUTCHours() * 60 + d.getUTCMinutes(),
      seconds: d.getUTCSeconds()
    };
  }

  function massTimestamp(year, month, date, minutes) {
    return Date.UTC(year, month, date, Math.floor(minutes / 60), minutes % 60, 0) - WITA_OFFSET;
  }

  function findMass(now) {
    var parts = witaParts(now);
    var currentMinutes = parts.minutes + parts.seconds / 60;

    if (parts.dow === 0) {
      for (var i = 0; i < MASSES.length; i++) {
        if (currentMinutes >= MASSES[i].start && currentMinutes < MASSES[i].end) {
          return {
            live: true,
            mass: MASSES[i],
            start: massTimestamp(parts.year, parts.month, parts.date, MASSES[i].start),
            end: massTimestamp(parts.year, parts.month, parts.date, MASSES[i].end)
          };
        }
      }
    }

    for (var offset = 0; offset < 8; offset++) {
      var day = new Date(Date.UTC(parts.year, parts.month, parts.date + offset));
      if (day.getUTCDay() !== 0) continue;

      for (var j = 0; j < MASSES.length; j++) {
        var mass = MASSES[j];
        var start = massTimestamp(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), mass.start);
        if (start > now) {
          return {
            live: false,
            mass: mass,
            start: start,
            end: massTimestamp(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), mass.end)
          };
        }
      }
    }

    return null;
  }

  function formatRemaining(ms, includeSeconds) {
    var total = Math.max(0, Math.floor(ms / 1000));
    var days = Math.floor(total / 86400);
    var hours = Math.floor((total % 86400) / 3600);
    var minutes = Math.floor((total % 3600) / 60);
    var seconds = total % 60;
    var parts = [];

    if (days) parts.push(days + " hari");
    if (days || hours) parts.push(hours + " jam");
    if (!days) parts.push(minutes + " menit");
    if (!days && includeSeconds) parts.push(pad(seconds) + " detik");

    return parts.join(" ");
  }

  var dayFormatter = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Asia/Makassar"
  });

  function renderNextMass() {
    var now = Date.now();
    var result = findMass(now);
    if (!result) return;

    if (result.live) {
      nextMassEl.classList.add("is-live");
      if (nextLabel.textContent !== "Misa sedang berlangsung") {
        nextLabel.textContent = "Misa sedang berlangsung";
      }
      var liveText = result.mass.name + " · sedang berlangsung";
      if (nextWhen.textContent !== liveText) nextWhen.textContent = liveText;
      nextCount.textContent = "sisa " + formatRemaining(result.end - now, true);
      return;
    }

    nextMassEl.classList.remove("is-live");
    if (nextLabel.textContent !== "Misa berikutnya") {
      nextLabel.textContent = "Misa berikutnya";
    }

    var startParts = witaParts(result.start);
    var todayParts = witaParts(now);
    var sameDay =
      startParts.date === todayParts.date &&
      startParts.month === todayParts.month &&
      startParts.year === todayParts.year;

    var dateText = sameDay ? "Hari ini" : dayFormatter.format(new Date(result.start));
    var whenText = dateText + " · " + result.mass.time + " WITA";
    if (nextWhen.textContent !== whenText) nextWhen.textContent = whenText;

    nextCount.textContent = "mulai dalam " + formatRemaining(result.start - now, true);
  }

  function updateClock() {
    var d = shiftedDate(Date.now());
    if (clockEl) {
      clockEl.textContent = pad(d.getUTCHours()) + "." + pad(d.getUTCMinutes()) + " WITA";
      clockEl.setAttribute("datetime", d.toISOString());
    }
  }

  updateClock();
  renderNextMass();
  setInterval(updateClock, 15000);
  setInterval(renderNextMass, 1000);

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ------------------------------------------------------------------
     Pengumuman diambil dari data/pengumuman.js.
     Markup statis di index.html dipakai jika berkas data tidak ada.
     ------------------------------------------------------------------ */
  function node(tag, className, text) {
    var item = document.createElement(tag);
    if (className) item.className = className;
    if (text !== undefined && text !== null) item.textContent = String(text);
    return item;
  }

  function featureMark() {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("class", "feature-mark");
    svg.setAttribute("viewBox", "0 0 24 34");
    svg.setAttribute("aria-hidden", "true");
    var path = document.createElementNS(ns, "path");
    path.setAttribute("d", "M10.4 0h3.2v9.2H23v3.2h-9.4V34h-3.2V12.4H1V9.2h9.4z");
    svg.appendChild(path);
    return svg;
  }

  function buildFeature(feature) {
    var article = node("article", "feature");
    var head = node("div", "feature-head");
    head.appendChild(node("span", "tag", feature.tag || "Pengumuman"));
    if (feature.dateTime) {
      var time = node("time", "", feature.dateText || feature.dateTime);
      time.setAttribute("datetime", feature.dateTime);
      head.appendChild(time);
    } else if (feature.dateText) {
      head.appendChild(node("span", "", feature.dateText));
    }
    article.appendChild(head);

    article.appendChild(node("h3", "", feature.title || ""));
    if (feature.body) article.appendChild(node("p", "", feature.body));

    if (feature.points && feature.points.length) {
      var list = node("ul", "feature-list");
      feature.points.forEach(function (point) {
        var li = node("li");
        li.appendChild(node("strong", "", point.label || ""));
        li.appendChild(node("span", "", point.text || ""));
        list.appendChild(li);
      });
      article.appendChild(list);
    }

    if (feature.linkText) {
      var link = node("a", "feature-link", feature.linkText);
      link.href = feature.linkHref || "#kontak";
      article.appendChild(link);
    }

    article.appendChild(featureMark());
    return article;
  }

  function buildNotice(item, index) {
    var id = "n" + (index + 1);
    var article = node("article", "notice");

    var button = node("button", "notice-head");
    button.type = "button";
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", id);

    var date = node("span", "notice-date");
    date.appendChild(node("strong", "", item.date || item.day || ""));
    date.appendChild(node("span", "", item.month || ""));
    button.appendChild(date);

    var main = node("span", "notice-main");
    main.appendChild(node("span", "notice-cat", item.category || ""));
    main.appendChild(node("span", "notice-title", item.title || ""));
    main.appendChild(node("span", "notice-excerpt", item.excerpt || ""));
    button.appendChild(main);

    var plus = node("span", "notice-plus");
    plus.setAttribute("aria-hidden", "true");
    button.appendChild(plus);

    var body = node("div", "notice-body");
    body.id = id;
    body.setAttribute("aria-hidden", "true");
    var inner = node("div", "notice-body-inner");
    inner.appendChild(node("p", "", item.body || ""));
    if (item.meta) inner.appendChild(node("p", "notice-meta", item.meta));
    body.appendChild(inner);

    article.appendChild(button);
    article.appendChild(body);
    return article;
  }

  function renderNotices() {
    var data = window.DATA_PENGUMUMAN;
    var host = document.querySelector(".notice-layout");
    if (!data || !host) return;

    var fragment = document.createDocumentFragment();
    if (data.feature) fragment.appendChild(buildFeature(data.feature));

    var list = node("div", "notice-list");
    list.appendChild(node("h3", "list-title", data.listTitle || "Pengumuman lainnya"));
    (data.items || []).forEach(function (item, index) {
      list.appendChild(buildNotice(item, index));
    });
    fragment.appendChild(list);

    host.textContent = "";
    host.appendChild(fragment);

    var update = document.getElementById("pengumuman-update");
    if (update && data.update) update.textContent = data.update;
  }

  renderNotices();

  /* Pengumuman yang bisa dibuka */
  function bindNotices() {
    var noticeButtons = document.querySelectorAll(".notice-head");
    Array.prototype.forEach.call(noticeButtons, function (button) {
      button.addEventListener("click", function () {
        var item = button.closest(".notice");
        var isOpen = item.classList.toggle("open");
        button.setAttribute("aria-expanded", isOpen ? "true" : "false");
        var body = document.getElementById(button.getAttribute("aria-controls"));
        if (body) body.setAttribute("aria-hidden", isOpen ? "false" : "true");
      });
    });
  }

  bindNotices();

  /* Menu untuk layar kecil */
  var header = document.querySelector("[data-header]");
  var menuToggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");
  var menuLabel = menuToggle ? menuToggle.querySelector(".sr-only") : null;

  function closeMenu() {
    if (!nav || !menuToggle) return;
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    if (menuLabel) menuLabel.textContent = "Buka menu";
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      if (menuLabel) menuLabel.textContent = isOpen ? "Tutup menu" : "Buka menu";
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("click", function (event) {
      if (nav.classList.contains("open") && !event.target.closest(".site-header")) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });
  }

  /* Bayangan header saat halaman digulir */
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Penanda bagian yang sedang dibaca */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".site-nav a"));
  var sections = navLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var setCurrent = function (id) {
      navLinks.forEach(function (link) {
        if (link.getAttribute("href") === "#" + id) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    };

    var spy = new IntersectionObserver(
      function (entries) {
        var visible = entries
          .filter(function (entry) {
            return entry.isIntersecting;
          })
          .sort(function (a, b) {
            return b.intersectionRatio - a.intersectionRatio;
          });

        if (visible.length) setCurrent(visible[0].target.id);
      },
      { rootMargin: "-18% 0px -62% 0px", threshold: [0, 0.1, 0.5] }
    );

    sections.forEach(function (section) {
      spy.observe(section);
    });
  }

  /* Galeri diperbesar */
  var dialog = document.getElementById("lightbox");
  var dialogImage = document.getElementById("lightbox-img");
  var dialogCaption = document.getElementById("lightbox-caption");
  var dialogClose = dialog ? dialog.querySelector(".lightbox-close") : null;

  if (dialog && dialogImage && typeof dialog.showModal === "function") {
    var shots = document.querySelectorAll(".shot");

    Array.prototype.forEach.call(shots, function (shot) {
      shot.addEventListener("click", function () {
        var image = shot.querySelector("img");
        if (!image) return;
        dialogImage.src = image.currentSrc || image.src;
        dialogImage.alt = image.alt;
        dialogCaption.textContent = shot.getAttribute("data-caption") || "";
        dialog.showModal();
      });
    });

    if (dialogClose) {
      dialogClose.addEventListener("click", function () {
        dialog.close();
      });
    }

    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) dialog.close();
    });
  }
})();
