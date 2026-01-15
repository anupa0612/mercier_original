import { loadProducts, money, renderAuthUI, updateCartCount, addToCart } from "/js/app.js";

renderAuthUI(); updateCartCount();

const products = await loadProducts();
const grid = document.getElementById("grid");
const countText = document.getElementById("countText");

const q = document.getElementById("q");
const cat = document.getElementById("cat");
const sort = document.getElementById("sort");

// open category from URL ?cat=
const params = new URLSearchParams(location.search);
const catFromUrl = params.get("cat") || "";

const drawer = document.getElementById("drawer");
const backdrop = document.getElementById("backdrop");
document.getElementById("openFilters").addEventListener("click", () => {
  drawer.classList.add("open");
  backdrop.classList.add("open");
});
document.getElementById("closeFilters").addEventListener("click", () => {
  drawer.classList.remove("open");
  backdrop.classList.remove("open");
});
backdrop.addEventListener("click", () => {
  drawer.classList.remove("open");
  backdrop.classList.remove("open");
});

const categories = [...new Set(products.map(p => p.category))].sort();
cat.innerHTML = `<option value="">All</option>` + categories.map(c => `<option value="${c}">${c}</option>`).join("");
if(catFromUrl) cat.value = catFromUrl;

function apply(){
  const query = q.value.trim().toLowerCase();
  const c = cat.value;
  const s = sort.value;

  let rows = products.filter(p => {
    const okQ = !query || p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
    const okC = !c || p.category === c;
    return okQ && okC;
  });

  if(s === "low") rows.sort((a,b)=>a.price-b.price);
  if(s === "high") rows.sort((a,b)=>b.price-a.price);
  if(s === "az") rows.sort((a,b)=>a.name.localeCompare(b.name));

  countText.textContent = `${rows.length} item(s)`;

  grid.innerHTML = rows.map(p => `
    <div class="card">
      ${p.badge ? `<span class="badge">${p.badge}</span>` : ``}
      <a href="/product.html?id=${encodeURIComponent(p.id)}">
        <div class="cardImg" style="background-image:url('${p.image}')"></div>
      </a>
      <div class="cardBody">
        <div class="cardName">${p.name}</div>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div class="muted small">${p.category}</div>
          <div class="price">${money(p.price)}</div>
        </div>
      </div>

      <!-- Quick Add (FOA-like) -->
      <div class="quickAdd">
        <button class="btn primary" data-qa="${p.id}" type="button">Quick Add</button>
      </div>
    </div>
  `).join("") || `<div class="notice">No products match your filters.</div>`;

  // Quick Add default: first color + first size
  document.querySelectorAll("[data-qa]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.getAttribute("data-qa");
      const item = products.find(x => x.id === id);
      if(!item) return;

      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        color: item.colors?.[0] || "Default",
        size: item.sizes?.[0] || "One Size",
        qty: 1
      });

      btn.textContent = "Added ✓";
      setTimeout(()=> btn.textContent="Quick Add", 900);
    });
  });
}

[q,cat,sort].forEach(el => el.addEventListener("input", apply));
document.getElementById("reset").addEventListener("click", ()=>{
  q.value=""; cat.value=""; sort.value="featured"; apply();
});

apply();
