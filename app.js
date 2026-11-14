(function(){
  var D = window.DISHES, cat = "All";
  var grid = document.getElementById("grid"), q = document.getElementById("q");
  var chipsEl = document.getElementById("chips"), countEl = document.getElementById("count");
  var url = function(id){ return "https://www.youtube.com/watch?v=" + id; };
  var thumb = function(id){ return "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg"; };
  var esc = function(s){ return String(s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); };

  document.getElementById("vegCount").textContent = "(" + D.length + ")";

  // Dish of the day: same dish all day, changes at midnight
  var d = new Date(), seed = d.getFullYear()*10000 + (d.getMonth()+1)*100 + d.getDate();
  var pick = D[seed % D.length];
  document.getElementById("today").innerHTML =
    '<img src="' + thumb(pick.id) + '" alt="' + esc(pick.n) + '">' +
    '<div><small>Today\'s pick</small><h3>' + esc(pick.n) + '</h3><p style="margin:0 0 8px;color:#7a6552">' + esc(pick.t) + '</p>' +
    '<a href="' + url(pick.id) + '" target="_blank" rel="noopener">Watch recipe →</a></div>';

  var cats = ["All"]; D.forEach(function(x){ if (cats.indexOf(x.c) < 0) cats.push(x.c); });
  chipsEl.innerHTML = cats.map(function(c){ return '<button class="chip' + (c==="All"?' active':'') + '" data-c="' + esc(c) + '">' + esc(c) + '</button>'; }).join("");
  chipsEl.addEventListener("click", function(e){
    var b = e.target.closest(".chip"); if (!b) return;
    cat = b.dataset.c;
    [].forEach.call(chipsEl.children, function(x){ x.classList.toggle("active", x === b); });
    render();
  });
  q.addEventListener("input", render);

  function render(){
    var s = q.value.trim().toLowerCase();
    var list = D.filter(function(x){
      return (cat === "All" || x.c === cat) && (!s || (x.n + " " + x.t + " " + x.c).toLowerCase().indexOf(s) >= 0);
    });
    countEl.textContent = list.length + " dish" + (list.length === 1 ? "" : "es");
    grid.innerHTML = list.length ? list.map(function(x){
      return '<a class="card" href="' + url(x.id) + '" target="_blank" rel="noopener">' +
        '<div class="img"><img loading="lazy" src="' + thumb(x.id) + '" alt="' + esc(x.n) + '"><span class="badge">VEG</span></div>' +
        '<div class="body"><h3>' + esc(x.n) + '</h3><p>' + esc(x.t) + '</p>' +
        '<div class="meta"><span>' + esc(x.c) + '</span><span>▶ ' + esc(x.v) + ' views</span></div></div></a>';
    }).join("") : '<div class="empty">No dishes match. Try another word.</div>';
  }
  render();

  document.querySelectorAll(".diet").forEach(function(b){
    b.addEventListener("click", function(){
      document.querySelectorAll(".diet").forEach(function(x){ x.classList.toggle("active", x === b); });
      var veg = b.dataset.diet === "veg";
      document.getElementById("vegPanel").hidden = !veg;
      document.getElementById("nonvegPanel").hidden = veg;
    });
  });
})();
