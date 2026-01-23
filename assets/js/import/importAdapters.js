import { COMPETITOR_KEY_MAP } from "./competitorKeyMap";

export function mapMetaFromPlugin(plugin, rawMeta) {
  const pluginMap = COMPETITOR_KEY_MAP[plugin];
  if (!pluginMap) return {};

  const result = {};

  Object.entries(pluginMap.meta).forEach(([targetKey, sourceKeys]) => {
    for (const key of sourceKeys) {
      if (rawMeta[key] !== undefined && rawMeta[key] !== "") {
        result[targetKey] = rawMeta[key];
        break;
      }
    }
  });

  return result;
}
