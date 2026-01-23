import { mapMetaFromPlugin } from "./importAdapters";

export async function runSeoImport({ apiUrl, nonce }) {
  const res = await fetch(`${apiUrl}import`, {
    headers: {
      "X-WP-Nonce": nonce,
    },
  });

  const json = await res.json();
  if (!json.success) throw new Error("Import failed");

  const { plugins, globals, pages } = json;
  const importedPages = {};

  Object.entries(pages).forEach(([pageId, pageData]) => {
    const combined = {};

    plugins.forEach((plugin) => {
      Object.assign(combined, mapMetaFromPlugin(plugin, pageData.meta));
    });

    if (Object.keys(combined).length > 0) {
      importedPages[`page_${pageId}`] = combined;
    }
  });

  return {
    plugins,
    globals,
    pages: importedPages,
  };
}
