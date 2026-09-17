/* ============================================================
   Shish O Besh — Cart Engine
   Shared by every page. Include with:
   <script src="cart.js" defer></script>

   Storage: tries localStorage (persists across pages once this
   site is actually hosted on a real domain). Falls back silently
   to an in-memory object if localStorage is unavailable (e.g. a
   sandboxed preview) so the cart still works within a single page
   view even where persistence isn't possible.

   Payment: NOT wired up yet. Checkout currently captures the
   order + contact details and hands them off as an email via
   mailto: (same pattern as the existing chat widget's "talk to a
   human" flow). Search this file for "TODO: PAYMENT" to find the
   single spot to replace once a payment processor is connected.
   ============================================================ */

(function () {
  var CART_KEY = 'sob_cart_v1';
  var memoryFallback = [];
  var storageWorks = true;

  function loadCart() {
    try {
      var raw = window.localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      storageWorks = false;
      return memoryFallback;
    }
  }

  function saveCart(items) {
    memoryFallback = items;
    if (!storageWorks) return;
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch (e) {
      storageWorks = false;
    }
  }

  var cart = loadCart();

  function findItem(id) {
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === id) return cart[i];
    }
    return null;
  }

  function addItem(product, qty) {
    qty = qty || 1;
    var existing = findItem(product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        materials: product.materials || '',
        price: product.price, // number, or null for "priced on request"
        image: product.image || '',
        url: product.url || '',
        qty: qty
      });
    }
    saveCart(cart);
    renderCart();
    openDrawer();
  }

  function removeItem(id) {
    cart = cart.filter(function (i) { return i.id !== id; });
    saveCart(cart);
    renderCart();
  }

  function setQty(id, qty) {
    var item = findItem(id);
    if (!item) return;
    if (qty <= 0) { removeItem(id); return; }
    item.qty = qty;
    saveCart(cart);
    renderCart();
  }

  function cartCount() {
    return cart.reduce(function (sum, i) { return sum + i.qty; }, 0);
  }

  function cartSubtotal() {
    var known = 0, hasUnpriced = false;
    cart.forEach(function (i) {
      if (typeof i.price === 'number') { known += i.price * i.qty; }
      else { hasUnpriced = true; }
    });
    return { known: known, hasUnpriced: hasUnpriced };
  }

  function formatPrice(p) {
    return typeof p === 'number'
      ? ('\u20AC' + p.toLocaleString('en-US'))
      : 'Priced on request';
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  function renderCart() {
    var badge = document.getElementById('cartCount');
    var count = cartCount();
    if (badge) {
      badge.textContent = String(count);
      badge.style.display = count > 0 ? 'flex' : 'none';
    }

    var body = document.getElementById('cartBody');
    if (body) {
      body.innerHTML = '';
      if (cart.length === 0) {
        body.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
      } else {
        cart.forEach(function (item) {
          var row = document.createElement('div');
          row.className = 'cart-row';
          var imageHtml = item.image
            ? '<img src="' + escapeHtml(item.image) + '" alt="">'
            : '<span class="cart-row-fallback"><svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="2,20 12,4 22,20" fill="none" stroke="currentColor" stroke-width="1.4"/></svg></span>';
          row.innerHTML =
            imageHtml +
            '<div class="cart-row-body">' +
              '<h4>' + escapeHtml(item.name) + '</h4>' +
              '<p class="cart-row-materials">' + escapeHtml(item.materials) + '</p>' +
              '<div class="cart-row-controls">' +
                '<div class="qty-stepper">' +
                  '<button type="button" class="qty-btn" data-action="dec" data-id="' + escapeHtml(item.id) + '" aria-label="Decrease quantity">&minus;</button>' +
                  '<span>' + item.qty + '</span>' +
                  '<button type="button" class="qty-btn" data-action="inc" data-id="' + escapeHtml(item.id) + '" aria-label="Increase quantity">+</button>' +
                '</div>' +
                '<button type="button" class="cart-remove" data-action="remove" data-id="' + escapeHtml(item.id) + '">Remove</button>' +
              '</div>' +
            '</div>' +
            '<p class="cart-row-price">' + formatPrice(item.price) + '</p>';
          body.appendChild(row);
        });
      }
    }

    var subtotalEl = document.getElementById('cartSubtotal');
    if (subtotalEl) {
      var s = cartSubtotal();
      var text = s.known > 0 ? ('\u20AC' + s.known.toLocaleString('en-US')) : '\u2014';
      if (s.hasUnpriced) { text += (s.known > 0 ? ' + ' : '') + 'item(s) priced on request'; }
      subtotalEl.textContent = text;
    }

    var checkoutBtn = document.getElementById('cartCheckoutBtn');
    if (checkoutBtn) { checkoutBtn.disabled = cart.length === 0; }

    var storageNote = document.getElementById('cartStorageNote');
    if (storageNote) { storageNote.style.display = storageWorks ? 'none' : 'block'; }
  }

  function openDrawer() {
    var drawer = document.getElementById('cartDrawer');
    var overlay = document.getElementById('cartOverlay');
    if (drawer) drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    var drawer = document.getElementById('cartDrawer');
    var overlay = document.getElementById('cartOverlay');
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    if (!isCheckoutOpen()) document.body.style.overflow = '';
  }

  function isCheckoutOpen() {
    var el = document.getElementById('checkoutOverlay');
    return el && el.classList.contains('open');
  }

  function openCheckout() {
    closeDrawer();
    renderCheckoutSummary();
    var overlay = document.getElementById('checkoutOverlay');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCheckout() {
    var overlay = document.getElementById('checkoutOverlay');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function renderCheckoutSummary() {
    var el = document.getElementById('checkoutSummary');
    if (!el) return;
    el.innerHTML = '';
    cart.forEach(function (item) {
      var row = document.createElement('div');
      row.className = 'checkout-summary-row';
      row.innerHTML =
        '<span>' + item.qty + '&times; ' + escapeHtml(item.name) + '</span>' +
        '<span>' + formatPrice(item.price) + '</span>';
      el.appendChild(row);
    });
  }

  function buildOrderEmail(name, email, address, notes) {
    var lines = [];
    lines.push('New order request from ' + name + ' (' + email + ')');
    lines.push('');
    lines.push('Items:');
    cart.forEach(function (item) {
      lines.push('- ' + item.qty + '\u00D7 ' + item.name + ' \u2014 ' + formatPrice(item.price));
    });
    var s = cartSubtotal();
    lines.push('');
    lines.push('Subtotal: ' + (s.known > 0 ? ('\u20AC' + s.known.toLocaleString('en-US')) : '\u2014') + (s.hasUnpriced ? ' (plus item(s) priced on request)' : ''));
    if (address) { lines.push(''); lines.push('Shipping address: ' + address); }
    if (notes) { lines.push(''); lines.push('Notes: ' + notes); }
    return lines.join('\n');
  }

  // TODO: PAYMENT — this function is the single integration point.
  // Once a payment processor is connected, replace the mailto:
  // handoff below with a redirect to a hosted checkout / payment
  // link, passing the same cart contents.
  function submitOrder(formEl) {
    var name = formEl.querySelector('[name="name"]').value.trim();
    var email = formEl.querySelector('[name="email"]').value.trim();
    var address = formEl.querySelector('[name="address"]').value.trim();
    var notes = formEl.querySelector('[name="notes"]').value.trim();

    if (!name || !email) return false;

    var subject = encodeURIComponent('New order request from ' + name);
    var body = encodeURIComponent(buildOrderEmail(name, email, address, notes));
    window.location.href = 'mailto:hello@shishobesh.com?subject=' + subject + '&body=' + body;

    var formStep = document.getElementById('checkoutFormStep');
    var confirmStep = document.getElementById('checkoutConfirmStep');
    if (formStep) formStep.style.display = 'none';
    if (confirmStep) confirmStep.style.display = 'block';

    cart = [];
    saveCart(cart);
    renderCart();
    return true;
  }

  // event delegation for qty/remove buttons (works even for rows
  // rendered after this script runs)
  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('[data-action]') : null;
    if (!btn) return;
    var id = btn.getAttribute('data-id');
    var action = btn.getAttribute('data-action');
    if (action === 'inc') { var it = findItem(id); if (it) setQty(id, it.qty + 1); }
    else if (action === 'dec') { var it2 = findItem(id); if (it2) setQty(id, it2.qty - 1); }
    else if (action === 'remove') { removeItem(id); }
  });

  window.SOBCart = {
    add: addItem,
    open: openDrawer,
    close: closeDrawer,
    render: renderCart,
    getItems: function () { return cart.slice(); },
    subtotal: cartSubtotal,
    formatPrice: formatPrice
  };

  function init() {
    renderCart();

    var launcher = document.getElementById('cartLauncher');
    var closeBtn = document.getElementById('cartClose');
    var overlay = document.getElementById('cartOverlay');
    if (launcher) launcher.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (isCheckoutOpen()) closeCheckout();
      else closeDrawer();
    });

    document.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('[data-add-to-cart]') : null;
      if (!btn || btn.disabled) return;
      addItem({
        id: btn.getAttribute('data-id'),
        name: btn.getAttribute('data-name'),
        materials: btn.getAttribute('data-materials'),
        price: btn.getAttribute('data-price') ? parseFloat(btn.getAttribute('data-price')) : null,
        image: btn.getAttribute('data-image'),
        url: btn.getAttribute('data-url')
      }, 1);
    });

    var checkoutBtn = document.getElementById('cartCheckoutBtn');
    if (checkoutBtn) checkoutBtn.addEventListener('click', openCheckout);

    var checkoutClose = document.getElementById('checkoutClose');
    var checkoutOverlayBg = document.getElementById('checkoutOverlay');
    if (checkoutClose) checkoutClose.addEventListener('click', closeCheckout);
    if (checkoutOverlayBg) {
      checkoutOverlayBg.addEventListener('click', function (e) {
        if (e.target === checkoutOverlayBg) closeCheckout();
      });
    }

    var checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var ok = submitOrder(checkoutForm);
        if (!ok) {
          var warning = document.getElementById('checkoutFormWarning');
          if (warning) warning.style.display = 'block';
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
