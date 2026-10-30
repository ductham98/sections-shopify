import { Liquid } from "liquidjs";
import { registerShopifyFilters } from "./liquid-filters";
import { registerShopifyTags } from "./liquid-tags";

let engineInstance: Liquid | null = null;

export function getLiquidEngine(): Liquid {
  if (engineInstance) return engineInstance;

  const engine = new Liquid({
    strictFilters: false,
    strictVariables: false,
    lenientIf: true,
    jsTruthy: true,
  });

  registerShopifyFilters(engine);
  registerShopifyTags(engine);

  engineInstance = engine;
  return engineInstance;
}

