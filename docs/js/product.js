import { loadProducts, money, addToCart, renderAuthUI, updateCartCount, qs } from "/js/app.js";

renderAuthUI(); updateCartCount();
document.getElementById("y").textContent = new Date().getFullYear();

const id = qs("id");
const products = await loadProducts();
const p = products.find(x => x.id === id);
const wrap = document.getElementById("wrap");

if(!p){
  wrap.innerHTML = `<div class="notice">Product not found.</div>`;
} else {
  wrap.innerHTML = `
    <div class="split">
      <div class="card">
        <div class="cardImg" style="background-image:url('${p.image}'); aspect-ratio: 4/5;"></div>
      </div>

      <div class="totalBox">
        <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start">
          <div>
            <div class="muted small">${p.category}</div>
            <div style="font-weight:900;font-size:22px;margin-top:6px">${p.name}</div>
          </div>
          ${p.badge ? `<span class="badge">${p.badge}</span>` : ``}
        </div>

        <div style="margin-top:10px" class="price">${money(p.price)}</div>
        <p class="muted" style="line-height:1.7">${p.description}</p>

        <div class="grid" style="margin-top:12px">
          <div>
            <div class="muted small">Color</div>
            <select id="color">${p.colors.map(c=>`<option>${c}</option>`).join("")}</select>
          </div>

          <div>
            <div class="muted small">Size</div>
            <select id="size">${p.sizes.map(s=>`<option>${s}</option>`).join("")}</select>
          </div>

          <div>
            <div class="muted small">Quantity</div>
            <input class="input" id="qty" type="number" value="1" min="1"/>
          </div>

          <button class="btn primary" id="add">Add to Cart</button>
          <div class="notice" id="msg" style="display:none"></div>
        </div>
      </div>
    </div>
  `;

  document.getElementById("add").addEventListener("click", ()=>{
    const color = document.getElementById("color").value;
    const size = document.getElementById("size").value;
    const qty = Math.max(1, Number(document.getElementById("qty").value || 1));

    addToCart({ id: p.id, name: p.name, price: p.price, image: p.image, color, size, qty });

    const msg = document.getElementById("msg");
    msg.style.display = "block";
    msg.innerHTML = `Added to cart. <a class="btn ghost" href="/cart.html" style="margin-left:8px">Go to Cart</a>`;
  });
}
