/**
 * Snippet Registry for resolving {% render 'snippet' %} and {% include 'snippet' %}
 * in Shopify Liquid sections without requiring live theme files.
 */

export interface SnippetDefinition {
  name: string;
  template: string;
}

const BUILTIN_SNIPPETS: Record<string, string> = {
  // Price snippet
  price: `
    <div class="price-container" style="display:inline-flex;align-items:baseline;gap:8px;">
      {% if product.compare_at_price > product.price %}
        <span class="price-item price-item--sale" style="font-weight:700;color:#111827;">{{ product.price | money }}</span>
        <s class="price-item price-item--regular" style="font-size:0.9em;color:#9ca3af;">{{ product.compare_at_price | money }}</s>
      {% else %}
        <span class="price-item price-item--regular" style="font-weight:700;color:#111827;">{{ product.price | money }}</span>
      {% endif %}
    </div>
  `,

  // Icon snippet
  icon: `
    <span class="icon-wrapper icon-{{ name | default: 'check' }}" style="display:inline-flex;align-items:center;justify-content:center;line-height:1;">
      {% case name %}
        {% when 'check' %}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        {% when 'arrow-right' %}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        {% when 'star' %}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        {% when 'close' %}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        {% else %}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>
      {% endcase %}
    </span>
  `,

  // Badge snippet
  badge: `
    {% if text %}
      <span class="badge {{ class }}" style="display:inline-block;padding:3px 8px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;border-radius:4px;background:#111827;color:#ffffff;">
        {{ text }}
      </span>
    {% endif %}
  `,

  // Product card snippet
  "product-card": `
    <div class="product-card" style="display:flex;flex-direction:column;gap:10px;">
      <div class="product-card__image" style="aspect-ratio:1/1;overflow:hidden;border-radius:6px;background:#f3f4f6;">
        <img src="{{ product.featured_image.src | default: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600' }}" alt="{{ product.title }}" style="width:100%;height:100%;object-fit:cover;display:block;" />
      </div>
      <div class="product-card__info">
        <h4 style="margin:0 0 4px;font-size:14px;font-weight:600;">{{ product.title }}</h4>
        <div style="font-size:13px;color:#4b5563;">{{ product.price | money }}</div>
      </div>
    </div>
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

