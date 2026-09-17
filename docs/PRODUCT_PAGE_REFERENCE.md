# Shish O Besh Product Page Reference

> AI-friendly implementation guide for adding a new product page that matches the current Shish O Besh storefront.
>
> Reference implementations: `products/urmia-60/urmia-60.html` and `products/achaemenid-70/achaemenid-70.html`.

## 1. Purpose

Use this document when creating a new product detail page. A new page should feel like an existing Shish O Besh product page, not like an independent layout.

The required result is:

- A shared dark/light theme and visual language.
- The same fixed header, navigation, cart, checkout, chat, footer, typography, spacing, and responsive behavior.
- A product-specific gallery, hero content, stories, specifications, included items, care guidance, FAQ, and enquiry CTA.
- Working cart metadata and working image thumbnails.
- No stretched images, wrapped button labels, overlapping content, or missing mobile layout rules.

## 2. Existing Page Family

| Page | Product ID | Primary image | Product-specific content |
| --- | --- | --- | --- |
| `products/urmia-60/urmia-60.html` | `urmia-60` | `products/urmia-60/assets/urmia-closed-full.webp` | Walnut, walnut root, Persepolis motifs |
| `products/achaemenid-70/achaemenid-70.html` | `achaemenid-70` | `products/achaemenid-70/assets/prod-closed-full.webp` | Sanjed burl, blue resin, Achaemenid reliefs |

A new page should use the same shared structure as these pages. Copy the closest existing product page first, then replace product-specific content and assets. Do not redesign the shell for each product.

## 3. File and Dependency Contract

A product page normally requires:

```text
products/new-product/new-product.html
scripts/cart.js
data/products.json
assets/shishobesh-logo.png
products/new-product/assets/product image assets
```

Every product page currently includes:

```html
<script src="../scripts/cart.js" defer></script>
```

`scripts/cart.js` is present and shared by every page. The old `catalog.js` reference was removed because that file is not present in the workspace. Restore it under `scripts/` only when catalog-specific behavior is implemented.

## 4. Required Document Skeleton

Use this high-level order:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  charset
  viewport
  product title
  product description
  shared product-page CSS
  cart.js
  catalog.js
</head>
<body>
  fixed site header
  <main>
    breadcrumb
    product hero
    divider
    product story section(s)
    optional pull quote
    optional divider
    feature cards
    included-items section
    care or audience section
    specification section
    FAQ section
    final enquiry CTA
  </main>
  shared footer
  shared cart drawer
  shared checkout modal
  shared chat widget
  page-local theme, gallery, reveal, and chat wiring
</body>
</html>
```

Use the existing HTML comments to keep the page easy to scan:

```html
<!-- ============ PRODUCT HERO ============ -->
```

## 5. Head Metadata

Replace all product-specific metadata. Keep the same language and brand tone.

```html
<title>The Product Name — Shish O Besh</title>
<meta name="description" content="One concise product summary including material, craft, key dimension, and made-to-order status.">
```

Metadata rules:

- Use the exact product name consistently.
- Mention the primary material and distinctive construction.
- Include the product scale when it matters.
- Keep the description factual and concise.
- Do not use placeholder text.

## 6. Shared Theme and Typography

Preserve the existing variables and font roles.

### Theme variables

Dark theme defaults:

```css
--bg: #15110D;
--bg-panel: #1C1610;
--bg-cta: #231017;
--ink: #EDE4D3;
--ink-muted: #A99A82;
--ink-faint: #786A56;
--brass: #B4864F;
--brass-bright: #D3A868;
--oxblood: #6E2A34;
--line: rgba(237,228,211,0.10);
```

Light theme overrides:

```css
--bg: #FAF6EE;
--bg-panel: #F1E9DB;
--bg-cta: #F4E7E3;
--ink: #241C14;
--ink-muted: #6E5D48;
--ink-faint: #9C8C74;
--brass: #8A5C2C;
--brass-bright: #A96F34;
--line: rgba(36,28,20,0.12);
```

Typography roles:

- `Fraunces`: headings, product names, quotes, prices, and display text.
- `Jost`: body copy, navigation, metadata, labels, buttons, and forms.
- Body weight is normally `300`.
- Heading weight is normally `500`.
- Product buttons use the body font, `font-weight: 300`, uppercase labels, and `white-space: nowrap`.

Do not introduce a second visual system, a new font family, or a new color palette for one product.

## 7. Shared Header

Copy the header structure exactly from an existing product page.

Required elements:

- Logo link back to `../../index.html#top`.
- Collection link to `../../index.html#collection`.
- Craft link to `../../index.html#craft`.
- Enquire link to the product page `#enquire`.
- Cart launcher with `id="cartLauncher"`.
- Theme toggle with `id="themeToggle"`.
- Accessible labels and `aria-pressed` state for the theme toggle.

Do not change the shared header IDs. The page scripts and cart behavior depend on them.

## 8. Product Hero Contract

The hero is the primary product information block.

Required structure:

```html
<section class="pd-hero">
  <div class="wrap pd-hero-grid">
    <div class="pd-gallery reveal">
      <div class="pd-gallery-main">
        <img id="pdMainImage" src="PRIMARY_IMAGE" alt="PRODUCT, primary view">
      </div>
      <div class="pd-thumbs">
        <!-- thumbnail buttons -->
      </div>
    </div>

    <div class="pd-info reveal">
      <p class="eyebrow">CATEGORY OR EDITION</p>
      <h1>PRODUCT NAME</h1>
      <p class="pd-short">Short factual product summary.</p>
      <ul class="pd-quickspecs">
        <li><span>Size</span>...</li>
        <li><span>Weight</span>...</li>
        <li><span>Exterior</span>...</li>
        <li><span>Interior</span>...</li>
        <li><span>Hardware</span>...</li>
      </ul>
      <div class="hero-actions">
        <button class="btn btn-primary" type="button" data-add-to-cart="">
          Add to Cart
        </button>
        <button class="btn btn-ghost" id="pdEnquireBtn" type="button">
          Enquire Instead
        </button>
      </div>
      <p class="cta-fallback">Made to order. Short supporting note.</p>
    </div>
  </div>
</section>
```

### Hero layout rules

Current shared CSS uses:

```css
.pd-hero-grid {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 60px;
  align-items: start;
}
```

At `max-width: 860px`, the grid becomes one column with a `36px` gap. Preserve this behavior. Never allow the gallery and text to overlap.

### Hero copy rules

- Keep the short summary to one compact paragraph.
- Put measurable or decision-relevant facts in `.pd-quickspecs`.
- Use the same labels across products where the fact exists.
- Do not invent facts to fill a row.
- Remove a row when the information is not known.
- Keep the product name identical in the title, heading, cart metadata, alt text, and JSON record.

## 9. Gallery Contract

The gallery requires one main image and one button per alternate image.

```html
<div class="pd-thumbs">
  <button class="pd-thumb is-active"
          data-full="product-closed-full.webp"
          data-alt="Product, closed case, full view"
          type="button">
    <img src="product-closed-full.webp" alt="">
  </button>
</div>
```

Rules:

- The first thumbnail must be active and match `#pdMainImage`.
- `data-full` must point to a real local asset.
- `data-alt` must describe the image and update the main image alt text.
- Thumbnail images use empty alt text because the button already represents the control.
- Use stable filenames without spaces when possible.
- Do not stretch or upscale an image beyond its useful source size.
- Use `object-fit: cover` only where cropping is intentional and acceptable.
- Use a contained image treatment where the complete product must remain visible.

The existing page-local gallery script expects:

```js
var mainImg = document.getElementById('pdMainImage');
var thumbs = document.querySelectorAll('.pd-thumb');
```

It changes `src`, changes `alt`, removes `.is-active` from all thumbnails, and adds it to the selected button. Preserve those IDs/classes.

## 10. Cart Integration Contract

The primary cart button must include all required data attributes:

```html
<button class="btn btn-primary"
        type="button"
        data-add-to-cart
        data-id="product-id"
        data-name="Product Name"
        data-materials="Primary material &amp; secondary material"
        data-price="1450"
        data-image="product-closed-full.webp"
        data-url="product.html">
  Add to Cart
</button>
```

For products priced on request, omit `data-price` or leave it absent. Do not use an invented numeric price.

Required attributes:

| Attribute | Requirement |
| --- | --- |
| `data-add-to-cart` | Present; activates shared cart binding |
| `data-id` | Unique stable ID; must match `products.json` |
| `data-name` | Exact display name |
| `data-materials` | Short material summary |
| `data-price` | Numeric price only when known |
| `data-image` | Existing primary image filename |
| `data-url` | Product page filename |

`cart.js` stores `id`, `name`, `materials`, `price`, `image`, `url`, and quantity. It persists under the `sob_cart_v1` local-storage key when storage is available and falls back to in-memory state otherwise.

## 11. Product Data Record

Add or update the matching record in `products.json`.

```json
{
  "id": "product-id",
  "name": "The Product Name",
  "materials": "Walnut & maple inlay",
  "description": "Short collection-card description.",
  "price": 1450,
  "currency": "EUR",
  "stock": 4,
  "lowStockThreshold": 2,
  "category": "Standard",
  "image": "product-closed-full.webp",
  "url": "product.html",
  "sku": "SOB-XXX-001",
  "active": true
}
```

Data rules:

- IDs must be unique and stable.
- Use the same ID in HTML and JSON.
- Use `null` for a price that is not public.
- Use a real SKU, not a placeholder.
- Use `active: true` only when the page and assets are ready.
- Keep stock values intentional; do not use `0` unless the item is actually unavailable.
- Remove accidental test records. The current file contains an `asd` record that should not be copied into future data.

## 12. Recommended Content Sections

Use the following sequence unless the product genuinely does not support a section.

### 12.1 Exterior story

```html
<section class="section pd-story">
  <div class="wrap">
    <div class="reveal">
      <p class="eyebrow">The Exterior</p>
      <h2>Short editorial heading.</h2>
    </div>
    <div class="pd-story-grid reveal">
      <p>Material, craft, motif, and construction detail.</p>
      <p>Additional detail that adds useful understanding.</p>
    </div>
  </div>
</section>
```

Use two paragraphs. Keep them specific to the product.

### 12.2 Pull quote

Use `.pd-pullquote-band` for one meaningful product idea, not generic marketing copy.

### 12.3 Feature cards

Use `.pd-feature-grid` and `.pd-feature`. Use the three-column modifier only when there are three genuinely distinct features:

```html
<div class="pd-feature-grid pd-feature-grid-3 reveal">
```

Each feature needs:

- A small shared-style icon.
- A concise heading.
- One useful explanation.

### 12.4 Included items

Use `.pd-included-list` for concrete items supplied with the product. Do not include vague benefits.

### 12.5 Care or audience

Use `.pd-for` for care guidance or intended audience. Keep this section short and factual.

### 12.6 Specification table

Use a definition list:

```html
<dl class="pd-spec-list reveal">
  <div><dt>Dimensions</dt><dd>...</dd></div>
  <div><dt>Weight</dt><dd>...</dd></div>
  <div><dt>Interior surface</dt><dd>...</dd></div>
  <div><dt>Exterior</dt><dd>...</dd></div>
  <div><dt>Design</dt><dd>...</dd></div>
  <div><dt>Hardware</dt><dd>...</dd></div>
  <div><dt>Finish</dt><dd>...</dd></div>
  <div><dt>Construction</dt><dd>...</dd></div>
</dl>
```

Only include verified specifications. The specification table should agree with the hero quick specs.

### 12.7 FAQ

Use `.pd-faq-list` and `.pd-faq-item` for product-specific questions. Good FAQ topics include:

- Authenticity of hand work.
- Material durability.
- Personalization.
- Included accessories.
- Care.
- Lead time.
- Shipping.

Do not copy an answer that contradicts the product's actual materials or included items.

### 12.8 Final CTA

Every product page ends with a CTA using `id="enquire"` and a button with `id="ctaChatBtn"`:

```html
<section class="cta-band" id="enquire">
  <div class="wrap reveal">
    <p class="eyebrow">Made to Order</p>
    <h2>Product-specific closing line.</h2>
    <p>Short invitation to ask about this product or speak with the team.</p>
    <button class="btn btn-primary" id="ctaChatBtn" type="button">Open Chat</button>
    <p class="cta-fallback">
      Prefer email? <a href="mailto:hello@shishobesh.com">hello@shishobesh.com</a>
    </p>
  </div>
</section>
```

The page-local chat script binds both `ctaChatBtn` and `pdEnquireBtn` to the chat panel.

## 13. Shared UI Components That Must Remain Compatible

### Buttons

Use `.btn btn-primary` for the main action and `.btn btn-ghost` for the secondary enquiry action.

The current button contract includes:

```css
.btn {
  font-family: var(--body);
  font-weight: 300;
  white-space: nowrap;
}

.btn-primary {
  background: var(--brass);
  color: var(--bg);
}

.btn-ghost {
  background: none;
  border-color: var(--ink-faint);
  color: var(--ink);
}
```

The explicit `background: none` is required for native `<button>` elements; otherwise browsers may display a white default button background in the dark theme.

### Dividers

Use the existing SVG divider pattern between major content groups. Give repeated SVG patterns unique IDs per document to avoid ID collisions.

### Reveal animation

Add `.reveal` to content blocks that should appear on scroll. The shared script adds `.is-visible` through `IntersectionObserver`. Keep the reduced-motion fallback intact.

### Theme toggle

The page-local theme script switches `html[data-theme="light"]`. Keep the toggle's `aria-pressed` and `aria-label` synchronized with the state.

### Cart and checkout

Copy the existing cart drawer and checkout modal without changing IDs. They are wired by `cart.js`.

### Chat

Copy the existing chat launcher and panel. Keep:

- `chatLauncher`
- `chatPanel`
- `chatClose`
- `chatBody`
- `chatInput`
- `chatSend`
- `ctaChatBtn`
- `pdEnquireBtn`

## 14. Responsive Requirements

Breakpoints currently used by the storefront:

| Breakpoint | Behavior |
| --- | --- |
| `860px` | Reduce page/header horizontal padding; stack product hero and story grids; reduce button padding |
| `700px` | Used by the homepage featured section for image/text flow |
| `520px` | Reduce section padding, button size, and navigation CTA size |
| `480px` | Reduce buttons again and constrain chat panel to viewport |

Product-page requirements:

- At `860px` and below, `.pd-hero-grid` becomes one column.
- At `860px` and below, `.pd-story-grid` becomes one column.
- At `860px` and below, feature cards become one column.
- At `860px` and below, included items become one column.
- At `860px` and below, specification rows become one column.
- At `520px` and below, reduce section padding to `72px 0`.
- Buttons must never wrap their labels. Reduce padding and font size instead.
- Images must remain within their containers and must not overlap text.
- Large editorial images should have a deliberate maximum size. The current artisan image cap is `480px`.
- Test at narrow widths where two button labels could otherwise collide.

## 15. Accessibility Requirements

Every new product page must include:

- One meaningful `<h1>`.
- Descriptive alt text for the main product image.
- Empty alt text for decorative thumbnail images when the button has the accessible meaning.
- Visible keyboard focus using the shared `:focus-visible` style.
- Real `<button>` elements for actions.
- `type="button"` on non-submit buttons.
- `aria-label` on icon-only controls.
- `aria-expanded` on the chat launcher.
- `aria-live="polite"` on the chat message body.
- `aria-pressed` on the theme toggle.
- Dialog labels on cart, checkout, and chat surfaces.
- No information communicated by color alone.

## 16. Content Consistency Rules

Before publishing, compare the following values across the page:

| Value | Must agree across |
| --- | --- |
| Product name | title, h1, cart button, JSON, alt text, footer links if used |
| Product ID | cart button and JSON |
| Primary image | main gallery, cart button, JSON |
| Materials | hero, cart button, JSON |
| Dimensions | quick specs and specification table |
| Weight | quick specs and specification table |
| Hardware | quick specs, features, and specification table |
| Included items | included section, specs, FAQ, checkout expectations |
| Lead time | CTA, FAQ, and any catalog/admin data |

Avoid contradictions such as calling an item included in one section and an add-on in another.

## 17. New Product Addition Workflow

1. Choose `products/urmia-60/urmia-60.html` or `products/achaemenid-70/achaemenid-70.html` as the base according to the closest content shape.
2. Create a new `products/product-id/` folder with `index.html` and `assets/`.
3. Add all product image assets to that product's `assets/` folder.
4. Verify every image filename with the workspace file list.
5. Replace title, description, hero label, product name, summary, and specs.
6. Replace every gallery `src`, `data-full`, `data-alt`, and main image alt text.
7. Replace cart data attributes, including the stable product ID and URL.
8. Add the matching `products.json` record.
9. Replace every story, feature, included-item, care, specification, FAQ, and CTA value that is product-specific.
10. Preserve shared IDs, classes, scripts, header, footer, cart, checkout, chat, and theme behavior.
11. Search the new file for old product names, old IDs, old image names, old materials, and old dimensions.
12. Validate all referenced assets exist.
13. Open the page at desktop, tablet, and mobile widths.
14. Test theme switching, gallery thumbnails, Add to Cart, cart persistence, checkout request, chat, and keyboard focus.

## 18. AI Implementation Checklist

An AI coding assistant should follow this checklist before editing:

```text
[ ] Read the closest existing product page.
[ ] Read products.json and cart.js.
[ ] Confirm all product assets exist.
[ ] Preserve the shared CSS variables and font imports.
[ ] Preserve header/footer/cart/checkout/chat IDs.
[ ] Keep one h1 and product-specific metadata.
[ ] Keep the hero gallery and pdMainImage contract intact.
[ ] Keep pd-thumb data-full and data-alt values valid.
[ ] Keep data-add-to-cart attributes complete.
[ ] Keep product ID and JSON record identical.
[ ] Keep buttons non-wrapping and responsive.
[ ] Add maximum sizes to large editorial images.
[ ] Keep desktop and mobile layouts free of overlap.
[ ] Remove copied product names, images, specs, and claims.
[ ] Search for stale references after editing.
[ ] Run HTML diagnostics.
[ ] Test core interactions in a browser.
```

## 19. Validation Commands and Checks

Use the editor diagnostics for each changed HTML file. At minimum, verify:

```text
No HTML/CSS/JavaScript diagnostics in the changed page.
Every local image referenced by the page exists.
Every gallery thumbnail changes the main image and alt text.
Add to Cart opens the drawer and shows the correct product.
The cart shows the correct name, materials, image, price state, and URL.
The checkout request contains the correct product.
Theme switching changes both background and text colors.
Buttons do not wrap at narrow widths.
No image overlaps text at desktop, tablet, or mobile widths.
```

A quick stale-reference search should include:

```text
old product name
old product id
old image prefix
old material names
old dimensions
old SKU
```

## 20. Current Repository Notes

- `index.html` is the storefront entry point.
- `products/urmia-60/urmia-60.html` and `products/achaemenid-70/achaemenid-70.html` are the authoritative product-page examples.
- `scripts/cart.js` is the shared cart and checkout integration point.
- `data/products.json` is the catalog data source, but its records must be kept synchronized with HTML.
- `catalog.js` is currently absent and is no longer referenced by the reorganized pages.
- `products.json` currently contains an apparent test record with ID `asd`; do not use it as a template.
- Product pages currently duplicate substantial CSS and JavaScript. Keep changes synchronized across pages when changing shared behavior, or extract shared assets in a future refactor.
- Payment is not connected. Checkout currently creates a `mailto:` request through `cart.js`.
- The current product-page visual system uses dark brown, ivory, muted tan, brass, and oxblood; future pages should remain within that system.

## 21. Minimal New Product Example

The following is an intentionally abbreviated product-specific core. It is not a complete page; wrap it in the shared shell from an existing product page.

```html
<section class="pd-hero">
  <div class="wrap pd-hero-grid">
    <div class="pd-gallery reveal">
      <div class="pd-gallery-main">
        <img id="pdMainImage"
             src="rosewood-traveler-closed.webp"
             alt="The Rosewood Traveler, closed case, full view">
      </div>
      <div class="pd-thumbs">
        <button class="pd-thumb is-active"
                data-full="rosewood-traveler-closed.webp"
                data-alt="The Rosewood Traveler, closed case, full view"
                type="button">
          <img src="rosewood-traveler-closed.webp" alt="">
        </button>
        <button class="pd-thumb"
                data-full="rosewood-traveler-open.webp"
                data-alt="The Rosewood Traveler, open, rosewood and boxwood interior"
                type="button">
          <img src="rosewood-traveler-open.webp" alt="">
        </button>
      </div>
    </div>

    <div class="pd-info reveal">
      <p class="eyebrow">Traveler</p>
      <h1>The Rosewood Traveler</h1>
      <p class="pd-short">A compact hand-carved folding board in rosewood and boxwood, made for the desk, study, or cabin.</p>
      <ul class="pd-quickspecs">
        <li><span>Size</span>Verified dimensions</li>
        <li><span>Weight</span>Verified weight</li>
        <li><span>Exterior</span>Rosewood, hand-carved</li>
        <li><span>Interior</span>Boxwood playing surface</li>
      </ul>
      <div class="hero-actions">
        <button class="btn btn-primary"
                type="button"
                data-add-to-cart
                data-id="rosewood-traveler"
                data-name="The Rosewood Traveler"
                data-materials="Rosewood &amp; boxwood"
                data-price="1890"
                data-image="rosewood-traveler-closed.webp"
                data-url="rosewood-traveler.html">
          Add to Cart
        </button>
        <button class="btn btn-ghost" id="pdEnquireBtn" type="button">
          Enquire Instead
        </button>
      </div>
    </div>
  </div>
</section>
```

This example deliberately omits invented product facts. Replace every placeholder with verified content before publishing.
