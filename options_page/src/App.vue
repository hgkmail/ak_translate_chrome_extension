<script setup lang="ts">
import { ref } from 'vue'
import {
  ElCard,
  ElSelect,
  ElOption,
  ElSwitch,
  ElRadioGroup,
  ElRadio,
  ElCheckbox,
  ElTag,
  ElLink,
  ElDivider,
} from 'element-plus'
import { Link, Message } from '@element-plus/icons-vue'

// 状态值
const targetLanguage = ref('zh')
const engine = ref('google')
const showContextMenu = ref(true)
const theme = ref('light')
const followSystem = ref(false)

// 了解更多链接（示例）
const learnMoreUrl = 'https://zenttranslate.com'

// 快捷键列表
const shortcuts = [
  { name: '打开/关闭侧边栏', key: 'Alt+S' },
  { name: '切换整页翻译', key: 'Alt+T' },
  { name: '切换显示模式', key: 'Alt+M' },
]
</script>

<template>
  <el-card class="settings-card" :shadow="'never'">
    <!-- 头部 -->
    <div class="header">
      <h2 class="main-title">Google Translate - Side Panel</h2>
      <div class="sub-title">设置</div>
    </div>

    <!-- 通用 -->
    <div class="section">
      <h3>通用</h3>
      <!-- 目标语言 -->
      <div class="setting-item">
        <div class="item-main">
          <span class="item-label">目标语言</span>
          <el-select
            v-model="targetLanguage"
            size="small"
            placeholder="选择语言"
            style="width: 140px"
          >
            <el-option label="中文" value="zh" />
            <el-option label="英文" value="en" />
            <el-option label="日文" value="ja" />
            <el-option label="韩文" value="ko" />
          </el-select>
        </div>
        <div class="item-desc">默认翻译目标语言</div>
      </div>

      <!-- 翻译引擎 -->
      <div class="setting-item">
        <div class="item-main">
          <span class="item-label">翻译引擎</span>
          <el-select
            v-model="engine"
            size="small"
            placeholder="选择服务"
            style="width: 140px"
          >
            <el-option label="Google 翻译" value="google" />
            <el-option label="Bing 翻译" value="bing" />
            <el-option label="DeepL" value="deepl" />
          </el-select>
        </div>
        <div class="item-desc">选择您偏好的翻译服务</div>
      </div>

      <!-- 显示右键菜单 -->
      <div class="setting-item">
        <div class="item-main">
          <span class="item-label">显示右键菜单</span>
          <el-switch v-model="showContextMenu" size="small" />
        </div>
        <div class="item-desc">在右键菜单中显示“翻译...”选项</div>
      </div>
    </div>

    <el-divider />

    <!-- 关于 -->
    <div class="section">
      <h3>关于</h3>
      <div class="about-item">
        <span class="about-label">版本</span>
        <strong>5.1.5</strong>
      </div>
      <div class="about-desc">快速优雅的浏览器翻译扩展。</div>
      <div class="about-links">
        <el-link
          :href="learnMoreUrl"
          target="_blank"
          :icon="Link"
          class="about-link"
        >
          了解更多
        </el-link>
        <span class="feedback">
          <el-icon><Message /></el-icon>
          <el-link href="mailto:support@zenttranslate.com">
            support@zenttranslate.com
          </el-link>
        </span>
      </div>
    </div>

    <el-divider />

    <!-- 外观 -->
    <div class="section">
      <h3>外观</h3>
      <!-- 主题选择 -->
      <div class="setting-item">
        <div class="item-main">
          <span class="item-label">主题</span>
          <el-radio-group v-model="theme" size="small">
            <el-radio label="light">浅色</el-radio>
            <el-radio label="dark">深色</el-radio>
          </el-radio-group>
        </div>
        <!-- 主题没有额外描述，留空 -->
      </div>
      <!-- 跟随系统 -->
      <div class="setting-item">
        <el-checkbox v-model="followSystem">跟随系统</el-checkbox>
      </div>
    </div>

    <el-divider />

    <!-- 键盘快捷键 -->
    <div class="section">
      <h3>键盘快捷键</h3>
      <div class="shortcut-list">
        <div
          v-for="shortcut in shortcuts"
          :key="shortcut.name"
          class="shortcut-item"
        >
          <span>{{ shortcut.name }}</span>
          <el-tag size="small" effect="plain" class="shortcut-tag">
            {{ shortcut.key }}
          </el-tag>
        </div>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.settings-card {
  max-width: 600px;
  margin: 24px auto;
  border-radius: 16px;
  background-color: #ffffff;
}

.header {
  margin-bottom: 20px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.main-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #1e293b;
}

.sub-title {
  font-size: 15px;
  color: #64748b;
}

.section {
  margin-bottom: 28px;
}

.section h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 18px 0;
  color: #0f172a;
  letter-spacing: 0.3px;
}

.setting-item {
  margin-bottom: 24px;
}

.item-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.item-label {
  font-size: 14px;
  font-weight: 500;
  color: #334155;
}

.item-desc {
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.5;
  margin-top: 2px;
}

/* 关于区域 */
.about-item {
  display: flex;
  align-items: baseline;
  margin-bottom: 10px;
}

.about-label {
  width: 60px;
  font-size: 14px;
  color: #475569;
}

.about-desc {
  font-size: 14px;
  color: #334155;
  margin-bottom: 16px;
  line-height: 1.5;
}

.about-links {
  display: flex;
  align-items: center;
  gap: 28px;
  flex-wrap: wrap;
}

.about-link {
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #2563eb;
}

.feedback {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #475569;
}

.feedback .el-link {
  color: #2563eb;
}

/* 快捷键列表 */
.shortcut-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.shortcut-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #1e293b;
  padding: 4px 0;
}

.shortcut-tag {
  font-family: 'SF Mono', 'Fira Code', monospace;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #0f172a;
  font-weight: 500;
  border-radius: 6px;
  padding: 0 8px;
  height: 26px;
  line-height: 24px;
}

/* 调整单选框组间距 */
.el-radio-group {
  display: flex;
  gap: 20px;
}

/* 复选框微调 */
.el-checkbox {
  height: auto;
  font-size: 14px;
  font-weight: 400;
  color: #334155;
}

/* divider 上下间距 */
.el-divider {
  margin: 24px 0;
}
</style>
