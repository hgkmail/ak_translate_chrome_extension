import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export type Theme = 'light' | 'dark' | 'system'

export interface SettingsState {
  targetLanguage: string
  translationEngine: string
  showContextMenu: boolean
  theme: Theme
  autoTranslate: boolean
}

const STORAGE_KEY = 'ak_translate_settings'

const defaults: SettingsState = {
  targetLanguage: 'zh-CN',
  translationEngine: 'bing',
  showContextMenu: true,
  theme: 'system',
  autoTranslate: false,
}

function readStorage(): Promise<Partial<SettingsState>> {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    return new Promise((resolve) => {
      chrome.storage.sync.get(STORAGE_KEY, (result: Record<string, unknown>) => {
        resolve((result[STORAGE_KEY] as Partial<SettingsState>) ?? {})
      })
    })
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return Promise.resolve(raw ? (JSON.parse(raw) as Partial<SettingsState>) : {})
  } catch {
    return Promise.resolve({})
  }
}

function writeStorage(data: SettingsState): void {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.sync.set({ [STORAGE_KEY]: data })
    return
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // ignore
  }
}

export const useSettingsStore = defineStore('settings', () => {
  const targetLanguage = ref<string>(defaults.targetLanguage)
  const translationEngine = ref<string>(defaults.translationEngine)
  const showContextMenu = ref<boolean>(defaults.showContextMenu)
  const theme = ref<Theme>(defaults.theme)
  const autoTranslate = ref<boolean>(defaults.autoTranslate)
  const loaded = ref(false)

  async function load() {
    const saved = await readStorage()
    if (saved.targetLanguage !== undefined) targetLanguage.value = saved.targetLanguage
    if (saved.translationEngine !== undefined) translationEngine.value = saved.translationEngine
    if (saved.showContextMenu !== undefined) showContextMenu.value = saved.showContextMenu
    if (saved.theme !== undefined) theme.value = saved.theme
    if (saved.autoTranslate !== undefined) autoTranslate.value = saved.autoTranslate
    loaded.value = true
  }

  function save() {
    writeStorage({
      targetLanguage: targetLanguage.value,
      translationEngine: translationEngine.value,
      showContextMenu: showContextMenu.value,
      theme: theme.value,
      autoTranslate: autoTranslate.value,
    })
  }

  watch([targetLanguage, translationEngine, showContextMenu, theme, autoTranslate], () => {
    if (loaded.value) save()
  })

  return {
    targetLanguage,
    translationEngine,
    showContextMenu,
    theme,
    autoTranslate,
    loaded,
    load,
  }
})
