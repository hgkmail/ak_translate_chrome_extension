<script setup lang="ts">
import { onMounted, computed, type Component, watch } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import type { Theme } from '@/stores/settings'
import SunIcon from '@/components/icons/SunIcon.vue'
import MoonIcon from '@/components/icons/MoonIcon.vue'
import SystemIcon from '@/components/icons/SystemIcon.vue'
import { useColorMode, usePreferredColorScheme, type ColorSchemeType } from '@vueuse/core'
import { storeToRefs } from 'pinia'

const settings = useSettingsStore()
const { theme } = storeToRefs(settings)

onMounted(() => {
  // 加载设置
  settings.load()
})

// 设置主题
const colorMode = useColorMode()
const setColorMode = (mode: Theme | ColorSchemeType) => {
  if (mode === 'dark' || mode === 'light') {
    colorMode.value = mode
  } else {
    colorMode.value = 'auto'
  }
}

// 监听系统主题
const sysColorScheme = usePreferredColorScheme()
watch([theme, sysColorScheme], ([newTheme, newSysColorScheme]) => {
  if (newTheme === 'system') {
    setColorMode(newSysColorScheme)
  } else {
    setColorMode(newTheme)
  }
}, { immediate: true })

const version = computed(() => {
  try {
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      return chrome.runtime.getManifest().version
    }
  } catch {
    // ignore
  }
  return '-'
})

const targetLanguageOptions = [
  { label: '简体中文', value: 'zh-CN' },
  { label: 'English', value: 'en' },
]

const engineOptions = [
  { label: '谷歌翻译', value: 'google' },
  { label: '必应翻译', value: 'bing' },
  { label: '百度翻译', value: 'baidu' },
]

const themeOptions: { label: string; value: Theme; icon: Component }[] = [
  { label: '浅色', value: 'light', icon: SunIcon },
  { label: '深色', value: 'dark', icon: MoonIcon },
  { label: '跟随系统', value: 'system', icon: SystemIcon },
]

const shortcuts = [
  { label: '打开/关闭侧边栏', key: 'Alt+S' },
  { label: '切换整页翻译', key: 'Alt+T' },
  { label: '切换显示模式', key: 'Alt+M' },
]
</script>

<template>
  <div class="settings-page">
    <!-- Header -->
    <header class="settings-header">
      <div class="header-inner">
        <div class="header-icon">
          <TranslateIcon />
        </div>
        <div class="header-text">
          <span class="header-title">AK Translate - Side Panel</span>
          <span class="header-subtitle">设置</span>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="settings-main">
      <el-row :gutter="20">
        <!-- Left column -->
        <el-col :span="16">
          <!-- 通用 -->
          <div class="settings-card">
            <div class="card-title">
              <OptionIcon />
              通用
            </div>
            <div class="setting-item">
              <div class="setting-info">
                <span class="setting-label">目标语言</span>
                <span class="setting-desc">默认翻译目标语言</span>
              </div>
              <el-select v-model="settings.targetLanguage" style="width: 180px">
                <el-option v-for="opt in targetLanguageOptions" :key="opt.value" :label="opt.label"
                  :value="opt.value" />
              </el-select>
            </div>
            <el-divider class="item-divider" />
            <div class="setting-item">
              <div class="setting-info">
                <span class="setting-label">翻译引擎</span>
                <span class="setting-desc">选择您偏好的翻译服务</span>
              </div>
              <el-select v-model="settings.translationEngine" style="width: 180px">
                <el-option v-for="opt in engineOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
              </el-select>
            </div>
            <el-divider class="item-divider" />
            <div class="setting-item">
              <div class="setting-info">
                <span class="setting-label">显示右键菜单</span>
                <span class="setting-desc">在右键菜单中显示"翻译..."选项</span>
              </div>
              <el-switch v-model="settings.showContextMenu" />
            </div>
          </div>

          <!-- 自动翻译网页 -->
          <div class="settings-card">
            <div class="card-title">
              <NetworkIcon />
              自动翻译网页
            </div>
            <div class="setting-item">
              <div class="setting-info">
                <span class="setting-label">自动翻译网页</span>
                <span class="setting-desc">打开外语网页时自动翻译</span>
              </div>
              <el-switch v-model="settings.autoTranslate" />
            </div>
          </div>

          <!-- 外观 -->
          <div class="settings-card">
            <div class="card-title">
              <SunIcon class="sun" />
              外观
            </div>
            <div class="setting-item setting-item--column">
              <span class="setting-label">主题</span>
              <div class="theme-buttons">
                <button v-for="opt in themeOptions" :key="opt.value" class="theme-btn"
                  :class="{ 'theme-btn--active': settings.theme === opt.value }" @click="settings.theme = opt.value">
                  <component :is="opt.icon" class="theme-btn-icon" />
                  {{ opt.label }}
                </button>
              </div>
            </div>
          </div>
        </el-col>

        <!-- Right column -->
        <el-col :span="8">
          <!-- 键盘快捷键 -->
          <div class="settings-card">
            <div class="card-title card-title--plain">
              <KeyboardIcon />
              键盘快捷键
            </div>
            <div v-for="sc in shortcuts" :key="sc.key" class="shortcut-row">
              <span class="shortcut-label">{{ sc.label }}</span>
              <kbd class="shortcut-key">{{ sc.key }}</kbd>
            </div>
          </div>

          <!-- 关于 -->
          <div class="settings-card">
            <div class="card-title card-title--plain">
              <AboutIcon />
              关于
            </div>
            <div class="about-version-row">
              <span class="about-version-label">版本</span>
              <span class="about-version-value">{{ version }}</span>
            </div>
            <p class="about-desc">快速优雅的浏览器翻译扩展。</p>
            <el-button class="about-more-btn" @click="() => { }">
              了解更多 &nbsp;
              <OpenIcon />
            </el-button>
            <div class="about-feedback">
              <FeedbackIcon />
              反馈：<a href="mailto:hgkmail@126.com" class="feedback-link">hgkmail@126.com</a>
            </div>
          </div>
        </el-col>
      </el-row>
    </main>
  </div>
</template>

<style scoped>
.settings-page {
  min-height: 100vh;
  background: var(--el-fill-color-light);
}

/* Header */
.settings-header {
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
  padding: 0 32px;
  height: 60px;
  display: flex;
  align-items: center;
}

.header-inner {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-icon {
  display: flex;
  align-items: center;
  background-color: var(--el-border-color-lighter);
  padding: 8px;
  border-radius: 8px;
}

.header-text {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.header-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.header-subtitle {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

/* Main layout */
.settings-main {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px 32px;
}

/* Card */
.settings-card {
  background: var(--el-bg-color);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 20px;
}

.card-title .sun {
  color: var(--el-color-primary);
}

.card-title--plain {
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.card-title-icon {
  font-size: 18px;
}

/* Setting item */
.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 48px;
  padding: 4px 0;
}

.setting-item--column {
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
}

.setting-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.setting-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.setting-desc {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.item-divider {
  margin: 10px 0 !important;
}

/* Theme buttons */
.theme-buttons {
  display: flex;
  gap: 10px;
  width: 100%;
}

.theme-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 0;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  background: var(--el-bg-color);
  cursor: pointer;
  font-size: 14px;
  color: var(--el-text-color-primary);
  transition: all 0.2s;
}

.theme-btn:hover {
  border-color: var(--ak-button-primary);
  color: var(--ak-button-primary);
}

.theme-btn--active {
  background: var(--ak-button-primary);
  border-color: var(--ak-button-primary);
  color: var(--el-bg-color);
}

.theme-btn--active:hover {
  color: var(--el-bg-color);
}

.theme-btn-icon {
  font-style: normal;
  font-size: 15px;
}

/* About card */
.about-version-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: var(--el-text-color-primary);
  margin-bottom: 10px;
}

.about-version-label {
  color: var(--el-text-color-regular);
}

.about-version-value {
  font-weight: 600;
}

.about-desc {
  font-size: 13px;
  color: var(--el-text-color-regular);
  margin: 0 0 14px;
  line-height: 1.6;
}

.about-more-btn {
  width: 100%;
  margin-bottom: 14px;
  color: var(--el-text-color-primary);
  border-color: var(--el-border-color);
}

.about-feedback {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--el-text-color-regular);
}

.feedback-link {
  color: var(--ak-button-primary);
  text-decoration: none;
}

.feedback-link:hover {
  text-decoration: underline;
}

/* Shortcuts */
.shortcut-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid var(--el-fill-color);
}

.shortcut-row:last-child {
  border-bottom: none;
}

.shortcut-label {
  font-size: 13px;
  color: var(--el-text-color-primary);
}

.shortcut-key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 3px 10px;
  background: var(--el-fill-color);
  border: 1px solid var(--el-border-color);
  border-radius: 5px;
  font-size: 12px;
  color: var(--el-text-color-primary);
  font-family: inherit;
  font-weight: 500;
  white-space: nowrap;
}
</style>
