import { Liquid, TagToken, TopLevelToken, Context, Template } from "liquidjs";

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
}
