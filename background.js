// chrome.sidePanel
//   .setPanelBehavior({ openPanelOnActionClick: true })
//   .catch((error) => console.error(error));

chrome.action.onClicked.addListener(function () {
  chrome.tabs.create({ url: chrome.runtime.getURL('index.html') })
})

// 监听来自 content script 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'translate') {
    // 模拟翻译（可替换为真实翻译 API）
    translateText(request.text)
      .then(translated => sendResponse({ translated }))
      .catch(() => sendResponse({ translated: '翻译服务异常' }));
    return true; // 表示异步响应
  }
});

// 模拟翻译函数（实际可调用 Google / 百度 / 有道等翻译 API）
async function translateText(text) {
  // 此处仅为演示，返回固定格式
  return `${text}`;

  /* 真实 API 调用示例（以某个翻译服务为例）
  const response = await fetch('https://api.example.com/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      q: text,
      source: 'auto',
      target: 'zh'
    })
  });
  const data = await response.json();
  return data.translatedText;
  */
}

// 规则配置：将 User-Agent 修改为 iPhone 12 的 UA
const RULE_ID = 1001; // 规则ID需要是唯一的数字
const customUserAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1";

// 定义规则
const rules = {
  addRules: [
    {
      id: RULE_ID,
      priority: 1,
      action: {
        type: "modifyHeaders",
        requestHeaders: [
          {
            header: "user-agent", // 注意：header 名称通常小写
            operation: "set",
            value: customUserAgent
          }
        ]
      },
      condition: {
        // 重要：urlFilter 不能使用 '<all_urls>'，应使用 '*' 或具体域名 [citation:5]
        urlFilter: "fanyi", 
        // 重要：必须指定资源类型，否则规则可能不生效 [citation:5]
        resourceTypes: [
          "main_frame",   // 主页面
          "sub_frame",    // iframe
          "stylesheet",
          "script",
          "image",
          "font",
          "object",
          "xmlhttprequest", // AJAX 请求
          "ping",
          "csp_report",
          "media",
          "websocket",
          "webtransport",
          "webbundle",
          "other"
        ]
      }
    }
  ],
  // 移除可能存在的旧规则，避免冲突
  removeRuleIds: [RULE_ID]
};

// 在扩展安装或启动时应用规则
chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeNetRequest.updateDynamicRules(rules, () => {
    if (chrome.runtime.lastError) {
      console.error("规则添加失败:", chrome.runtime.lastError.message);
    } else {
      console.log("User-Agent 修改规则已应用");
    }
  });
});