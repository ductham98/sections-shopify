import { Liquid, TagToken, TopLevelToken, Context, Template } from "liquidjs";
import { getSnippetTemplate } from "./snippets/snippet-registry";

export function registerShopifyTags(engine: Liquid): void {
  /**
   * Shopify {% form 'type', ... %} ... {% endform %} tag
   */
  engine.registerTag("form", {
    parse: function (tagToken: TagToken, remainTokens: TopLevelToken[]) {
      this.rawArgs = tagToken.args;
      this.templates = [];
      const stream = this.liquid.parser.parseStream(remainTokens);
      stream
        .on("tag:endform", () => stream.stop())
        .on("template", (tpl: Template) => this.templates.push(tpl))
        .on("end", () => {
          throw new Error(`tag ${tagToken.getText()} not closed with endform`);
        });
      stream.start();
    },
    render: function* (ctx: Context): Generator<unknown, string, string> {
      const raw = this.rawArgs || "";
      let formClass = "";
      let formId = "";

      const classMatch = raw.match(/class:\s*(?:['"]([^'"]+)['"]|([a-zA-Z0-9_\-]+))/);
      if (classMatch) {
        if (classMatch[1]) {
          formClass = classMatch[1];
        } else if (classMatch[2]) {
          const val = ctx.get([classMatch[2]]);
          formClass = val ? String(val) : classMatch[2];
        }
      }

      const idMatch = raw.match(/id:\s*(?:['"]([^'"]+)['"]|([a-zA-Z0-9_\-]+))/);
      if (idMatch) {
        if (idMatch[1]) {
          formId = idMatch[1];
        } else if (idMatch[2]) {
          const val = ctx.get([idMatch[2]]);
          formId = val ? String(val) : idMatch[2];
        }
      }

      const html = (yield this.liquid.renderer.renderTemplates(this.templates, ctx)) as string;

      const attrs: string[] = ['method="post"', 'action="#"', 'onsubmit="event.preventDefault();"'];
      if (formClass) attrs.push(`class="${formClass}"`);
      if (formId) attrs.push(`id="${formId}"`);

      return `<form ${attrs.join(" ")}>${html}</form>`;
    },
  });

  /**
   * Shopify {% style %} ... {% endstyle %}
   */
  engine.registerTag("style", {
    parse: function (tagToken: TagToken, remainTokens: TopLevelToken[]) {
      this.templates = [];
      const stream = this.liquid.parser.parseStream(remainTokens);
      stream
        .on("tag:endstyle", () => stream.stop())
        .on("template", (tpl: Template) => this.templates.push(tpl))
        .on("end", () => {
          throw new Error(`tag ${tagToken.getText()} not closed with endstyle`);
        });
      stream.start();
    },
    render: function* (ctx: Context): Generator<unknown, string, string> {
      const css = (yield this.liquid.renderer.renderTemplates(this.templates, ctx)) as string;
      return `<style data-shopify>${css}</style>`;
    },
  });

  /**
   * Shopify {% paginate collection.products by 12 %} ... {% endpaginate %}
   */
  engine.registerTag("paginate", {
    parse: function (tagToken: TagToken, remainTokens: TopLevelToken[]) {
      this.templates = [];
      const stream = this.liquid.parser.parseStream(remainTokens);
      stream
        .on("tag:endpaginate", () => stream.stop())
        .on("template", (tpl: Template) => this.templates.push(tpl))
        .on("end", () => {
          throw new Error(`tag ${tagToken.getText()} not closed with endpaginate`);
        });
      stream.start();
    },
    render: function* (ctx: Context): Generator<unknown, string, string> {
      const html = (yield this.liquid.renderer.renderTemplates(this.templates, ctx)) as string;
      return html;
    },
  });

  /**
   * Shopify {% render 'snippet', [arg: val] %} snippet resolution
   */
  const snippetRenderer = {
    parse(token: TagToken) {
      (this as Record<string, unknown>).rawArgs = token.args;
    },
    render: function* (ctx: Context) {
      const raw = ((this as Record<string, unknown>).rawArgs as string) || "";
      const match = raw.match(/^\s*['"]([a-zA-Z0-9_\-]+)['"](.*)$/);
      if (!match) return "";

      const snippetName = match[1];
      const restArgs = match[2] || "";

      // Look up snippet in registry
      const snippetTpl = getSnippetTemplate(snippetName);
      if (!snippetTpl) {
        return `<!-- snippet '${snippetName}' not found -->`;
      }

      // Parse optional parameters: e.g. foo: bar, product: collection.products[0]
      const snippetScope: Record<string, unknown> = {};
      const paramMatches = restArgs.matchAll(/([a-zA-Z0-9_\-]+)\s*:\s*([^,]+)/g);
      for (const pm of paramMatches) {
        const paramKey = pm[1].trim();
        const rawVal = pm[2].trim();
        if ((rawVal.startsWith("'") && rawVal.endsWith("'")) || (rawVal.startsWith('"') && rawVal.endsWith('"'))) {
          snippetScope[paramKey] = rawVal.slice(1, -1);
        } else if (!isNaN(Number(rawVal))) {
          snippetScope[paramKey] = Number(rawVal);
        } else if (rawVal === "true") {
          snippetScope[paramKey] = true;
        } else if (rawVal === "false") {
          snippetScope[paramKey] = false;
        } else {
          snippetScope[paramKey] = ctx.get([rawVal]);
        }
      }

      try {
        const ctxData = typeof (ctx as unknown as { getAll?: () => Record<string, unknown> }).getAll === "function"
          ? (ctx as unknown as { getAll: () => Record<string, unknown> }).getAll()
          : (ctx.environments || {});
        return (yield engine.parseAndRender(snippetTpl, { ...ctxData, ...snippetScope })) as string;
      } catch (e) {
        return `<!-- error rendering snippet '${snippetName}': ${String(e)} -->`;
      }
    },
  };

  const tagArg = snippetRenderer as unknown as Parameters<Liquid["registerTag"]>[1];
  engine.registerTag("render", tagArg);
  engine.registerTag("include", tagArg);
}
