<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import type { Theme } from '@/stores/settings'

const settings = useSettingsStore()

onMounted(() => settings.load())

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

const themeOptions: { label: string; value: Theme; icon: string }[] = [
  { label: '浅色', value: 'light', icon: '☀' },
  { label: '深色', value: 'dark', icon: '🌙' },
  { label: '跟随系统', value: 'system', icon: '🖥' },
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
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="6" fill="#4285F4" />
            <text x="12" y="17" text-anchor="middle" font-size="13" font-weight="bold" fill="white"
              font-family="Arial">A</text>
            <text x="17" y="13" text-anchor="middle" font-size="9" fill="white" font-family="Arial">文</text>
          </svg>
        </div>
        <div class="header-text">
          <span class="header-title">Google Translate - Side Panel</span>
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
              <el-icon class="card-title-icon" color="#4285F4">
                <Lightning />
              </el-icon>
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

          <!-- 外观 -->
          <div class="settings-card">
            <div class="card-title">
              <el-icon class="card-title-icon" color="#F5A623">
                <Sunny />
              </el-icon>
              外观
            </div>
            <div class="setting-item setting-item--column">
              <span class="setting-label">主题</span>
              <div class="theme-buttons">
                <button v-for="opt in themeOptions" :key="opt.value" class="theme-btn"
                  :class="{ 'theme-btn--active': settings.theme === opt.value }" @click="settings.theme = opt.value">
                  <span class="theme-btn-icon">{{ opt.icon }}</span>
                  {{ opt.label }}
                </button>
              </div>
            </div>
          </div>

          <!-- 自动翻译网页 -->
          <div class="settings-card">
            <div class="card-title">
              <el-icon class="card-title-icon" color="#4285F4">
                <ChromeFilled />
              </el-icon>
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
        </el-col>

        <!-- Right column -->
        <el-col :span="8">
          <!-- 关于 -->
          <div class="settings-card">
            <div class="card-title card-title--plain">关于</div>
            <div class="about-version-row">
              <span class="about-version-label">版本</span>
              <span class="about-version-value">{{ version }}</span>
            </div>
            <p class="about-desc">快速优雅的浏览器翻译扩展。</p>
            <el-button class="about-more-btn" @click="() => { }">
              了解更多
              <el-icon class="el-icon--right">
                <TopRight />
              </el-icon>
            </el-button>
            <div class="about-feedback">
              <el-icon>
                <Message />
              </el-icon>
              反馈：<a href="mailto:support@zenttranslate.com" class="feedback-link">support@zenttranslate.com</a>
            </div>
          </div>

          <!-- 键盘快捷键 -->
          <div class="settings-card">
            <div class="card-title card-title--plain">
              <el-icon class="card-title-icon" color="#4285F4">
                <Grid />
              </el-icon>
              键盘快捷键
            </div>
            <div v-for="sc in shortcuts" :key="sc.key" class="shortcut-row">
              <span class="shortcut-label">{{ sc.label }}</span>
              <kbd class="shortcut-key">{{ sc.key }}</kbd>
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
  background: #f5f7fa;
}

/* Header */
.settings-header {
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
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
}

.header-text {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.header-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a2e;
}

.header-subtitle {
  font-size: 12px;
  color: #909399;
}

/* Main layout */
.settings-main {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px 32px;
}

/* Card */
.settings-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 20px;
}

.card-title--plain {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a2e;
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
  color: #303133;
}

.setting-desc {
  font-size: 12px;
  color: #909399;
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
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  color: #303133;
  transition: all 0.2s;
}

.theme-btn:hover {
  border-color: #4285F4;
  color: #4285F4;
}

.theme-btn--active {
  background: #4285F4;
  border-color: #4285F4;
  color: #fff;
}

.theme-btn--active:hover {
  color: #fff;
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
  color: #303133;
  margin-bottom: 10px;
}

.about-version-label {
  color: #606266;
}

.about-version-value {
  font-weight: 600;
}

.about-desc {
  font-size: 13px;
  color: #606266;
  margin: 0 0 14px;
  line-height: 1.6;
}

.about-more-btn {
  width: 100%;
  margin-bottom: 14px;
  color: #303133;
  border-color: #dcdfe6;
}

.about-feedback {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #606266;
}

.feedback-link {
  color: #4285F4;
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
  border-bottom: 1px solid #f0f0f0;
}

.shortcut-row:last-child {
  border-bottom: none;
}

.shortcut-label {
  font-size: 13px;
  color: #303133;
}

.shortcut-key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 3px 10px;
  background: #f5f7fa;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  font-size: 12px;
  color: #303133;
  font-family: inherit;
  font-weight: 500;
  white-space: nowrap;
}
</style>
