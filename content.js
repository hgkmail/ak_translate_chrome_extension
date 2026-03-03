// 创建翻译按钮和结果框
const button = document.createElement('div');
button.id = 'translate-button';
button.textContent = '译';
document.body.appendChild(button);

const resultDiv = document.createElement('div');
resultDiv.id = 'translate-result';
document.body.appendChild(resultDiv);

let selectedText = '';          // 保存当前选中的文本
let currentRange = null;        // 保存选中区域的范围（用于定位）

// 显示按钮
function showButton(x, y) {
  button.style.left = x + 'px';
  button.style.top = y + 'px';
  button.classList.add('show');
}

// 隐藏按钮
function hideButton() {
  button.classList.remove('show');
}

// 显示翻译结果
function showResult(text, x, y) {
  resultDiv.innerHTML = `
<div class="header"><span class="title">翻译结果</span><span class="close">&times;</span></div>
<div class="content">
<iframe id="myIframe" style="width: 350px; height: 400px; border: none;" allow="clipboard-read; clipboard-write;"
    src="https://fanyi.baidu.com/m/trans?from=en&to=zh&query=${text}" 
    title="Translation View"></iframe>
</div>
<div class="footer"><span>baidu</span></div>
`;
  resultDiv.style.left = x + 'px';
  resultDiv.style.top = y + 'px';
  resultDiv.classList.add('show');

  // 关闭结果框
resultDiv.querySelector('.close').addEventListener('click', (e) => {
  e.stopPropagation();
  hideResult();
});
}

// 隐藏翻译结果
function hideResult() {
  resultDiv.classList.remove('show');
}

// 获取选中文本及其位置
function handleSelection(event) {
  // 如果点击在按钮或结果框上，不做处理（避免立即隐藏）
  if (button.contains(event.target) || resultDiv.contains(event.target)) {
    return;
  }

  const selection = window.getSelection();
  const text = selection.toString().trim();

  if (text) {
    selectedText = text;
    if (selection.rangeCount > 0) {
      currentRange = selection.getRangeAt(0);
      const rect = currentRange.getBoundingClientRect();
      // 将按钮显示在选区右上角
      const buttonX = rect.right + window.scrollX;
      const buttonY = rect.top + window.scrollY - 40; // 向上偏移40px
      showButton(buttonX, buttonY);
    }
  } else {
    hideButton();
    hideResult();
  }
}

// 监听鼠标松开事件，检测选中文本
document.addEventListener('mouseup', handleSelection);

// 点击翻译按钮
button.addEventListener('click', () => {
  if (!selectedText) return;

  // 发送翻译请求到 background
  chrome.runtime.sendMessage(
    { action: 'translate', text: selectedText },
    (response) => {
      if (response && response.translated) {
        // 将结果显示在按钮位置下方
        const buttonRect = button.getBoundingClientRect();
        console.log('Button rect:', buttonRect);
        const resultX = buttonRect.left + window.scrollX;
        const resultY = buttonRect.bottom + window.scrollY;
        showResult(response.translated, resultX, resultY);
      } else {
        // 翻译失败提示
        showResult('翻译失败', event.clientX + window.scrollX, event.clientY + window.scrollY);
      }

      // 隐藏按钮（避免干扰）
      hideButton();
    }
  );

});

// 点击页面其他区域时隐藏按钮和结果框
document.addEventListener('mousedown', (event) => {
  if (!button.contains(event.target) && !resultDiv.contains(event.target)) {
    hideButton();
    hideResult();
  }
});

// 滚动时隐藏按钮和结果框（简化处理，也可重新计算位置）
window.addEventListener('scroll', () => {
  hideButton();
  // hideResult();
});

// 当页面大小改变时，可考虑重新计算位置（本示例略）
