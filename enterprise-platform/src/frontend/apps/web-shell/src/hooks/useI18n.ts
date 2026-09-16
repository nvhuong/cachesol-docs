import { useCallback } from 'react';
import i18n from 'i18next';

export function useI18n() {
  const loadMiniAppI18n = useCallback(
    async (
      miniAppId: string,
      resources: Record<string, () => Promise<unknown>>
    ) => {
      for (const [lang, loader] of Object.entries(resources)) {
        try {
          const resource = await loader();
          // Merge resources với namespace = miniAppId
          i18n.addResourceBundle(
            lang,
            miniAppId,
            resource,
            true,
            true
          );
        } catch (error) {
          console.error(`Failed to load i18n for ${miniAppId}/${lang}:`, error);
        }
      }
    },
    []
  );

  return { loadMiniAppI18n };
}
