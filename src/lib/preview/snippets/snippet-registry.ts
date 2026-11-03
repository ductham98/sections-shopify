/**
 * Snippet Registry for resolving {% render 'snippet' %} and {% include 'snippet' %}
 * in Shopify Liquid sections without requiring live theme files.
 */

export interface SnippetDefinition {
  name: string;
  template: string;
}

const BUILTIN_SNIPPETS: Record<string, string> = {
  // Price snippet (Dawn / OS 2.0 style)
  price: `
    <div class="price price--large {% if product.compare_at_price > product.price %}price--on-sale{% endif %}" style="display:inline-flex;align-items:baseline;gap:8px;font-family:inherit;">
      {% if product.compare_at_price > product.price %}
        <span class="price-item price-item--sale" style="font-weight:700;color:#111827;font-size:1.05em;">{{ product.price | money }}</span>
        <s class="price-item price-item--regular" style="font-size:0.9em;color:#9ca3af;text-decoration:line-through;">{{ product.compare_at_price | money }}</s>
      {% else %}
        <span class="price-item price-item--regular" style="font-weight:700;color:#111827;font-size:1.05em;">{{ product.price | money }}</span>
      {% endif %}
    </div>
  `,

  // Comprehensive Icon snippet
  icon: `
    <span class="icon-wrapper icon-{{ name | default: 'check' }}" style="display:inline-flex;align-items:center;justify-content:center;line-height:1;width:1.25em;height:1.25em;">
      {% case name %}
        {% when 'check' %}
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        {% when 'arrow-right' %}
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        {% when 'arrow-left' %}
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        {% when 'chevron-right' %}
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        {% when 'chevron-left' %}
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        {% when 'chevron-down' %}
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        {% when 'chevron-up' %}
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
        {% when 'star' %}
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        {% when 'close' %}
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        {% when 'cart' %}
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        {% when 'search' %}
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        {% when 'heart' %}
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        {% when 'eye' %}
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
        {% when 'truck' %}
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
        {% when 'shield' %}
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
        {% when 'refresh' %}
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
        {% else %}
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>
      {% endcase %}
    </span>
  `,

  // Badge snippet
  badge: `
    {% if text %}
      <span class="badge {{ class }}" style="display:inline-block;padding:4px 8px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;border-radius:4px;background:#111827;color:#ffffff;line-height:1;">
        {{ text }}
      </span>
    {% endif %}
  `,

  // Standard Product Card snippet
  "product-card": `
    <div class="product-card card-wrapper" style="display:flex;flex-direction:column;gap:12px;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;transition:transform 0.2s,box-shadow 0.2s;">
      <div class="product-card__image-wrapper" style="position:relative;aspect-ratio:1/1;overflow:hidden;background:#f3f4f6;">
        {% if product.compare_at_price > product.price %}
          <span class="badge badge--onsale" style="position:absolute;top:10px;left:10px;z-index:2;padding:3px 8px;background:#ef4444;color:#fff;font-size:10px;font-weight:700;border-radius:4px;text-transform:uppercase;">Sale</span>
        {% endif %}
        <img
          src="{{ product.featured_image.src | default: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600' }}"
          alt="{{ product.title }}"
          style="width:100%;height:100%;object-fit:cover;display:block;transition:transform 0.3s;"
          loading="lazy"
        />
      </div>
      <div class="product-card__info" style="padding:0 14px 14px;">
        <span class="product-card__vendor" style="font-size:11px;text-transform:uppercase;color:#6b7280;letter-spacing:0.05em;">{{ product.vendor | default: 'Studio' }}</span>
        <h4 style="margin:4px 0 6px;font-size:14px;font-weight:600;color:#111827;line-height:1.4;">{{ product.title }}</h4>
        <div class="product-card__price">
          {% render 'price', product: product %}
        </div>
      </div>
    </div>
  `,

  // Social Icons snippet
  "social-icons": `
    <ul class="list-social" style="display:inline-flex;align-items:center;gap:12px;list-style:none;padding:0;margin:0;">
      <li><a href="#" aria-label="Instagram" style="color:inherit;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a></li>
      <li><a href="#" aria-label="Facebook" style="color:inherit;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a></li>
      <li><a href="#" aria-label="Twitter" style="color:inherit;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg></a></li>
    </ul>
  `,

  // Pagination snippet
  pagination: `
    {% if paginate.pages > 1 %}
      <nav class="pagination" role="navigation" aria-label="Pagination" style="display:flex;justify-content:center;align-items:center;gap:8px;margin-top:24px;">
        <span class="pagination__item pagination__item--current" style="padding:6px 12px;background:#111827;color:#fff;border-radius:4px;font-weight:600;font-size:13px;">1</span>
        <a href="#" class="pagination__item" style="padding:6px 12px;border:1px solid #e5e7eb;border-radius:4px;font-size:13px;color:#374151;">2</a>
        <a href="#" class="pagination__item" style="padding:6px 12px;border:1px solid #e5e7eb;border-radius:4px;font-size:13px;color:#374151;">3</a>
      </nav>
    {% endif %}
  `,
};

const customSnippets = new Map<string, string>();

export function registerSnippet(name: string, template: string): void {
  customSnippets.set(name.toLowerCase(), template);
}

export function getSnippetTemplate(name: string): string | null {
  const normalized = name.toLowerCase().replace(/\.liquid$/, "");
  return customSnippets.get(normalized) || BUILTIN_SNIPPETS[normalized] || null;
}

export function hasSnippet(name: string): boolean {
  const normalized = name.toLowerCase().replace(/\.liquid$/, "");
  return customSnippets.has(normalized) || normalized in BUILTIN_SNIPPETS;
}
