import { getCart, cartTotals, money, placeOrder, setCart, renderAuthUI, updateCartCount, getUser } from "/js/app.js";

renderAuthUI(); updateCartCount();
document.getElementById("y").textContent = new Date().getFullYear();

const cart = getCart();
const t = cartTotals();
const summary = document.getElementById("summary");

summary.innerHTML = `
  <div style="font-weight:900;letter-spacing:.12em;text-transform:uppercase;font-size:13px">Order Summary</div>
  <div class="hr"></div>
  <div class="grid" style="gap:10px">
    ${cart.map(it => `
      <div style="display:flex;justify-content:space-between;gap:10px">
        <div class="muted small">${it.name} (${it.color}/${it.size}) × ${it.qty}</div>
        <div>${money(it.price * it.qty)}</div>
      </div>
    `).join("") || `<div class="notice">Cart is empty.</div>`}
  </div>
  <div class="hr"></div>
  <div style="display:flex;justify-content:space-between"><span class="muted">Subtotal</span><span>${money(t.subtotal)}</span></div>
  <div style="display:flex;justify-content:space-between"><span class="muted">Shipping</span><span>${money(t.shipping)}</span></div>
  <div style="display:flex;justify-content:space-between"><span class="muted">Tax</span><span>${money(t.tax)}</span></div>
  <div class="hr"></div>
  <div style="display:flex;justify-content:space-between"><span style="font-weight:900">Total</span><span style="font-weight:900">${money(t.total)}</span></div>
`;

const user = getUser();
if(user){
  document.getElementById("name").value = user.name || "";
  document.getElementById("email").value = user.email || "";
}

document.getElementById("place").addEventListener("click", async ()=>{
  const msg = document.getElementById("msg");
  msg.style.display = "none";
  msg.textContent = "";

  if(cart.length === 0){
    msg.style.display = "block";
    msg.textContent = "Your cart is empty.";
    return;
  }

  const fullName = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const city = document.getElementById("city").value.trim();
  const address = document.getElementById("address").value.trim();
  const notes = document.getElementById("notes").value.trim();

  if(!fullName || !email || !address){
    msg.style.display = "block";
    msg.textContent = "Please fill Full name, Email and Address.";
    return;
  }

  try{
    const payload = {
      customer: { fullName, email, phone, city, address, notes },
      items: cart,
      totals: t
    };

    const res = await placeOrder(payload);
    localStorage.setItem("mercier_last_order", res.orderId);
    setCart([]);
    updateCartCount();

    msg.style.display = "block";
    msg.innerHTML = `Order placed. Your order ID is <b>${res.orderId}</b>. <a class="btn ghost" href="/orders.html" style="margin-left:8px">View</a>`;
  }catch(e){
    msg.style.display = "block";
    msg.textContent = e.message || "Order failed.";
  }
});
