(function(){
  var ALL = window.DISHES, diet = "veg", cat = "All";
  var grid = document.getElementById("grid"), q = document.getElementById("q");
  var chipsEl = document.getElementById("chips"), countEl = document.getElementById("count");
  var url = function(id){ return "https://www.youtube.com/watch?v=" + id; };
  var thumb = function(id){ return "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg"; };
  var esc = function(s){ return String(s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); };
  var inDiet = function(x){ return x.d === diet; };

  document.getElementById("vegCount").textContent = "(" + ALL.filter(function(x){ return x.d === "veg"; }).length + ")";
  document.getElementById("nonvegCount").textContent = "(" + ALL.filter(function(x){ return x.d === "nonveg"; }).length + ")";

  // Dish of the day: same dish all day for the chosen diet, changes at midnight
  function renderToday(){
    var list = ALL.filter(inDiet);
    var d = new Date(), seed = d.getFullYear()*10000 + (d.getMonth()+1)*100 + d.getDate();
    var pick = list[seed % list.length];
    document.getElementById("today").innerHTML =
      '<img src="' + thumb(pick.id) + '" alt="' + esc(pick.n) + '">' +
      '<div><small>Today\'s ' + (diet === "veg" ? "veg" : "non-veg") + ' pick</small><h3>' + esc(pick.n) + '</h3>' +
      '<p style="margin:0 0 8px;color:#7a6552">' + esc(pick.t) + '</p>' +
      '<a href="' + url(pick.id) + '" target="_blank" rel="noopener">Watch recipe →</a></div>';
  }

  function renderChips(){
    var cats = ["All"]; ALL.filter(inDiet).forEach(function(x){ if (cats.indexOf(x.c) < 0) cats.push(x.c); });
    chipsEl.innerHTML = cats.map(function(c){ return '<button class="chip' + (c === cat ? ' active' : '') + '" data-c="' + esc(c) + '">' + esc(c) + '</button>'; }).join("");
  }
  chipsEl.addEventListener("click", function(e){
    var b = e.target.closest(".chip"); if (!b) return;
    cat = b.dataset.c; renderChips(); render();
  });
  q.addEventListener("input", render);

  function render(){
    var s = q.value.trim().toLowerCase();
    var list = ALL.filter(function(x){
      return inDiet(x) && (cat === "All" || x.c === cat) && (!s || (x.n + " " + x.t + " " + x.c).toLowerCase().indexOf(s) >= 0);
    });
    countEl.textContent = list.length + " dish" + (list.length === 1 ? "" : "es");
    grid.innerHTML = list.length ? list.map(function(x){
      var v = x.d === "veg";
      return '<a class="card" href="' + url(x.id) + '" target="_blank" rel="noopener">' +
        '<div class="img"><img loading="lazy" src="' + thumb(x.id) + '" alt="' + esc(x.n) + '"><span class="badge' + (v ? '' : ' nv') + '">' + (v ? 'VEG' : 'NON-VEG') + '</span></div>' +
        '<div class="body"><h3>' + esc(x.n) + '</h3><p>' + esc(x.t) + '</p>' +
        '<div class="meta"><span>' + esc(x.c) + '</span><span>▶ ' + esc(x.v) + ' views</span></div></div></a>';
    }).join("") : '<div class="empty">No dishes match. Try another word.</div>';
  }

  document.querySelectorAll(".diet").forEach(function(b){
    b.addEventListener("click", function(){
      diet = b.dataset.diet; cat = "All"; q.value = "";
      document.querySelectorAll(".diet").forEach(function(x){ x.classList.toggle("active", x === b); x.classList.toggle("nv", x === b && diet === "nonveg"); });
      renderToday(); renderChips(); render();
    });
  });

  renderToday(); renderChips(); render();
})();
