// 使用 KV 存储节点
// 你需要绑定变量名为URL_STORE和SUB2_STORE的2个KV空间
// 基础参数配置
const CONFIG = {
  UUID: 'ea4909ef-7ca6-4b46-bf2e-6c07896ef338',           // 节点上传密钥
  TOKEN: 'lgbts',          // 订阅地址密钥
  PASSWORD: '123123',     // 后台管理登陆密码，后台路径:域名/sub
  DEFAULT_DOMAIN: '', //  默认即可，无需设置
  EXPIRATION_TIME: 600,    // 链接过期时间
  MAX_LOGIN_ATTEMPTS: 3     // 最大登录尝试次数
};

// 排除包含关键词的节点,分号隔开.目的是移除个别失效节点
const excludeKeywords = 'GB-eu.com;TW-free.tw';

// 协议配置，默认即可.目的是防止cf关键词屏蔽
const PROTOCOL = {
  xieyi: 'vl',
  xieyi2: 'ess',
  pm: 'vm'
};

// HTML页面内容
const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>订阅管理</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .password-form {
            margin-bottom: 20px;
        }
        .info-box {
            display: none;
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            padding: 15px;
            border-radius: 4px;
            margin-top: 20px;
        }
        input[type="password"], input[type="text"], textarea {
            padding: 8px;
            margin-right: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            width: 100%;
            margin-bottom: 10px;
        }
        textarea {
            min-height: 100px;
            font-family: monospace;
        }
        button {
            padding: 8px 16px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
         button:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
        }
        button:hover:not(:disabled) {
            background-color: #0056b3;
        }
        .url {
            word-break: break-all;
            margin: 10px 0;
            padding: 10px;
            background-color: #e9ecef;
            border-radius: 4px;
        }
        .copy-btn {
            background-color: #28a745;
            margin-left: 10px;
        }
         .copy-btn:hover:not(:disabled) {
            background-color: #218838;
        }
        .current-list, .current-sub2-list, .current-keyword-list{
             margin-top: 10px;
            max-height: 300px;
            overflow-y: auto;
        }
        .list-item, .sub2-item, .keyword-item{
            display: flex;
            align-items: center;
            padding: 8px;
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            margin-bottom: 5px;
            border-radius: 4px;
        }
        .list-url, .sub2-url, .keyword-text {
            flex-grow: 1;
            word-break: break-all;
            margin-right: 10px;
        }
         .delete-btn {
            background-color: #dc3545;
            color: white;
            border: none;
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
        }
        .delete-btn:hover {
            background-color: #c82333;
        }
        .management-section {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
        }
         .success-message {
            color: #28a745;
            margin-top: 10px;
            display: none;
        }
        .error-message {
            color: #dc3545;
            margin-top: 10px;
            display: none;
        }
         .menu {
            display: flex;
            justify-content: space-around;
            margin-bottom: 20px;
        }

        .menu button {
            padding: 10px 15px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        .menu button:hover {
            background-color: #0056b3;
        }

        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>节点自动上传聚合订阅管理系统</h1>
        <div class="password-form">
            <input type="password" id="password" placeholder="请输入密码">
            <button onclick="checkPassword()" id="loginBtn">提交</button>
            <div id="errorMessage" class="error-message"></div>
        </div>
        <div id="infoBox" class="info-box">
            <div class="menu">
                <button onclick="showTab('home')">首页</button>
                <button onclick="showTab('upload')">自动上传节点管理</button>
                <button onclick="showTab('sub2')">自定义节点或订阅</button>
                 <button onclick="showTab('keywords')">关键词过滤</button>
            </div>
            <div id="home" class="tab-content active">
                <h3>节点上传地址：</h3>
                <div class="url" id="uploadUrl"></div>
                <button class="copy-btn" onclick="copyToClipboard('uploadUrl')">复制</button>
                
                <h3>订阅地址(优选域名ip.sb和端口443可自行更改)：</h3>
                <div class="url" id="downloadUrl"></div>
                <button class="copy-btn" onclick="copyToClipboard('downloadUrl')">复制</button>
                
                <h3>使用说明：</h3>
                <ol>
                    <li>节点原始优选域名要设置为ip.sb，端口443或8443，否则也不影响使用，只是不支持自动更换优选IP和端口</li>
                    <li>订阅链接参数：cf_ip和cf_port必填，可以自动替换优选域名和端口</li>
                    <li>默认支持v2r.ayng,hid.dify,neko等软件，其他软件自行转换格式</li>
                </ol>
            </div>
            <div id="upload" class="tab-content">
                <h3>当前节点列表：</h3>
                <div id="currentList" class="current-list"></div>
                  <button onclick="deleteAllUrls()" class="load-btn">删除全部</button>
                <button onclick="loadUrls()" class="load-btn">刷新列表</button>
            </div>
             <div id="sub2" class="tab-content">
                <h3>添加自定义节点或订阅链接(仅v2格式)：</h3>
                <textarea id="sub2Input" placeholder="每行一个URL"></textarea>
                <button onclick="updateSub2()">添加更新</button>
                <div id="sub2SuccessMessage" class="success-message">更新成功！</div>

                <h3>当前自定义节点列表：</h3>
                <div id="currentSub2List" class="current-sub2-list"></div>
                  <button onclick="deleteAllSub2Urls()" class="load-btn">删除全部</button>
                <button onclick="loadSub2()" class="load-btn">刷新列表</button>
            </div>
            <div id="keywords" class="tab-content">
                <h3>添加关键词过滤：</h3>
                <textarea id="keywordInput" placeholder="每行一个关键词"></textarea>
                <button onclick="updateKeywords()">添加更新</button>
                 <div id="keywordSuccessMessage" class="success-message">更新成功！</div>
                 <h3>当前关键词列表：</h3>
                <div id="currentKeywordList" class="current-keyword-list"></div>
                  <button onclick="deleteAllKeywords()" class="load-btn">删除全部</button>
                <button onclick="loadKeywords()" class="load-btn">刷新列表</button>
            </div>
        </div>
    </div>

    <script>
        const CORRECT_PASSWORD = '${CONFIG.PASSWORD}';
        const UUID = '${CONFIG.UUID}';
        const TOKEN = '${CONFIG.TOKEN}';
        const MAX_ATTEMPTS = ${CONFIG.MAX_LOGIN_ATTEMPTS};
        let loginAttempts = 0;
        
          function showTab(tabId) {
            const tabs = ['home', 'upload', 'sub2', 'keywords'];
            tabs.forEach(id => {
                document.getElementById(id).classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');
        }
        
        function getDomain() {
            return window.location.origin || 'https://${CONFIG.DEFAULT_DOMAIN}';
        }
        
        function checkPassword() {
            const password = document.getElementById('password').value;
            const errorMsg = document.getElementById('errorMessage');
            const loginBtn = document.getElementById('loginBtn');

            if (password === CORRECT_PASSWORD) {
                document.getElementById('infoBox').style.display = 'block';
                errorMsg.style.display = 'none';
                const domain = getDomain();
                document.getElementById('uploadUrl').textContent = 
                    \`\${domain}/upload-\${UUID}\`;
                document.getElementById('downloadUrl').textContent = 
                    \`\${domain}/token=\${TOKEN}?cf_ip=ip.sb&cf_port=443\`;
                loadUrls();
                loadSub2();
                loadKeywords();
            } else {
                loginAttempts++;
                const remainingAttempts = MAX_ATTEMPTS - loginAttempts;
                
                if (loginAttempts >= MAX_ATTEMPTS) {
                    errorMsg.textContent = '登录尝试次数已用完，请稍后再试';
                    loginBtn.disabled = true;
                     document.getElementById('password').disabled = true;
                } else {
                    errorMsg.textContent = \`密码错误，还剩 \${remainingAttempts} 次尝试机会\`;
                }
                errorMsg.style.display = 'block';
            }
        }

        function copyToClipboard(elementId) {
            const text = document.getElementById(elementId).textContent;
            navigator.clipboard.writeText(text).then(() => {
                alert('已复制到剪贴板');
            }).catch(err => {
                console.error('复制失败:', err);
            });
        }
        // 上传节点管理
         async function loadUrls() {
            const response = await fetch(\`\${getDomain()}/get-urls-\${UUID}\`);
            if (response.ok) {
                const data = await response.json();
                const listContainer = document.getElementById('currentList');
                listContainer.innerHTML = '';
                
                data.urls.forEach((item, index) => {
                    const listItem = document.createElement('div');
                    listItem.className = 'list-item';

                    const urlSpan = document.createElement('span');
                    urlSpan.className = 'list-url';
                    urlSpan.textContent = item.urlName;
                    
                      const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'delete-btn';
                    deleteBtn.textContent = '删除';
                     deleteBtn.onclick = () => deleteUrl(item.urlName);

                    listItem.appendChild(urlSpan);
                    listItem.appendChild(deleteBtn);
                    listContainer.appendChild(listItem);
                });
            }
        }
        async function deleteUrl(urlName) {
            const response = await fetch(\`\${getDomain()}/delete-url-\${UUID}\`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ urlName })
            });

            if (response.ok) {
                loadUrls(); // Refresh the list
            } else {
                alert('删除失败，请重试');
            }
        }
         async function deleteAllUrls() {
              if (confirm('确定删除全部节点吗？')) {
                  const response = await fetch(\`\${getDomain()}/delete-all-urls-\${UUID}\`, {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                      }
                  });

                  if (response.ok) {
                      loadUrls(); // 刷新列表
                  } else {
                      alert('删除失败，请重试');
                  }
             }
         }
          // 自定义节点管理
       async function updateSub2() {
            const content = document.getElementById('sub2Input').value;
            const urls = content.split('\\n').filter(url => url.trim());
            
            const response = await fetch(\`\${getDomain()}/update-sub2-\${UUID}\`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ urls })
            });

            if (response.ok) {
                const successMsg = document.getElementById('sub2SuccessMessage');
                successMsg.style.display = 'block';
                setTimeout(() => {
                    successMsg.style.display = 'none';
                }, 3000);
                 await loadSub2(); // 等待 loadSub2 完成
                document.getElementById('sub2Input').value = '';

            } else {
                alert('更新失败，请重试');
            }
        }

        async function loadSub2() {
            const response = await fetch(\`\${getDomain()}/get-sub2-\${UUID}\`);
            if (response.ok) {
                const data = await response.json();
                const listContainer = document.getElementById('currentSub2List');
                listContainer.innerHTML = '';
                
                data.urls.forEach((url, index) => {
                    const item = document.createElement('div');
                    item.className = 'sub2-item';
                    
                    const urlSpan = document.createElement('span');
                    urlSpan.className = 'sub2-url';
                    urlSpan.textContent = url;
                    
                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'delete-btn';
                    deleteBtn.textContent = '删除';
                    deleteBtn.onclick = () => deleteSub2Url(index);
                    
                    item.appendChild(urlSpan);
                    item.appendChild(deleteBtn);
                    listContainer.appendChild(item);
                });
            }
        }

        async function deleteSub2Url(index) {
            const response = await fetch(\`\${getDomain()}/delete-sub2-\${UUID}\`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ index })
            });

            if (response.ok) {
                loadSub2(); // Refresh the list
            } else {
                alert('删除失败，请重试');
            }
        }
          async function deleteAllSub2Urls() {
               if (confirm('确定删除全部自定义节点吗？')) {
                const response = await fetch(\`\${getDomain()}/delete-all-sub2-\${UUID}\`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (response.ok) {
                    loadSub2();
                } else {
                    alert('删除失败，请重试');
                }
            }
        }
          // 关键词过滤管理
        async function updateKeywords() {
            const content = document.getElementById('keywordInput').value;
            const keywords = content.split('\\n').filter(keyword => keyword.trim());
            
            const response = await fetch(\`\${getDomain()}/update-keywords-\${UUID}\`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ keywords })
            });

             if (response.ok) {
                const successMsg = document.getElementById('keywordSuccessMessage');
                successMsg.style.display = 'block';
                setTimeout(() => {
                    successMsg.style.display = 'none';
                }, 3000);
                document.getElementById('keywordInput').value = '';
                 loadKeywords();
            } else {
                alert('更新失败，请重试');
            }
        }
          async function loadKeywords() {
            const response = await fetch(\`\${getDomain()}/get-keywords-\${UUID}\`);
            if (response.ok) {
                const data = await response.json();
                const listContainer = document.getElementById('currentKeywordList');
                 listContainer.innerHTML = '';
                
                 data.keywords.forEach((keyword, index) => {
                    const item = document.createElement('div');
                    item.className = 'keyword-item';
                    
                    const keywordSpan = document.createElement('span');
                    keywordSpan.className = 'keyword-text';
                     keywordSpan.textContent = keyword;
                    
                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'delete-btn';
                    deleteBtn.textContent = '删除';
                     deleteBtn.onclick = () => deleteKeyword(index);
                    
                    item.appendChild(keywordSpan);
                     item.appendChild(deleteBtn);
                    listContainer.appendChild(item);
                });
            }
        }
          async function deleteKeyword(index) {
            const response = await fetch(\`\${getDomain()}/delete-keyword-\${UUID}\`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                 body: JSON.stringify({ index })
            });

            if (response.ok) {
                loadKeywords(); // Refresh the list
            } else {
                alert('删除失败，请重试');
            }
        }
         async function deleteAllKeywords() {
               if (confirm('确定删除全部关键词吗？')) {
                const response = await fetch(\`\${getDomain()}/delete-all-keywords-\${UUID}\`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (response.ok) {
                    loadKeywords();
                } else {
                    alert('删除失败，请重试');
                }
            }
        }

        document.getElementById('password').addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !this.disabled) {
                checkPassword();
            }
        });
    </script>
</body>
</html>`;

// URL预处理函数
function preProcessUrl(url) {
  let isSpecialFormat = false;
  if ((url.startsWith('{BASS}://') || url.startsWith(`${PROTOCOL.pm}ess://`)) && 
      url.split('://')[1].charAt(0) !== '{') {
    isSpecialFormat = true;
  }

  if (isSpecialFormat) {
    let encodedPart = url.split('://')[1];
    let decodedUrl = atob(encodedPart);
    let urlWithPrefix = `${PROTOCOL.pm}ess://` + decodedUrl;
    return urlWithPrefix.replace(/\{PASS\}\-/g, "")
                       .replace(/\{PA/g, PROTOCOL.xieyi)
                       .replace(/SS\}/g, PROTOCOL.xieyi2)
                       .replace(/\{BA/g, PROTOCOL.pm);
  } else {
    return url.replace(/\{PASS\}\-/g, "")
              .replace(/\{PA/g, PROTOCOL.xieyi)
              .replace(/SS\}/g, PROTOCOL.xieyi2)
              .replace(/\{BA/g, PROTOCOL.pm);
  }
}

// 检查URL是否包含排除关键词
function shouldExcludeUrl(url) {
    const excludeList = (excludeKeywords || '').split(';').map(keyword => keyword.trim());
    return excludeList.some(keyword => url.includes(keyword));
}

// 获取SUB2配置
async function getSub2Urls() {
  try {
    const data = await SUB2_STORE.list();
    const urls = [];
    for (const key of data.keys) {
      const value = await SUB2_STORE.get(key.name);
      if (value && !shouldExcludeUrl(value)) {  // 应用关键词过滤
        urls.push(value);
      }
    }
    return urls;
  } catch (error) {
    console.error('Error getting SUB2 URLs:', error);
    return [];
  }
}
// 获取排除关键词列表
async function getExcludeKeywords() {
    try {
        const data = await URL_STORE.get('excludeKeywords');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error getting exclude keywords:', error);
        return [];
    }
}
// 更新排除关键词列表
async function updateExcludeKeywords(keywords) {
    try {
      await URL_STORE.put('excludeKeywords', JSON.stringify(keywords));
    } catch (error) {
        console.error('Error updating exclude keywords:', error);
    }
}
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  // 默认路径返回 Hello World
  if (path === '/' || path === '') {
    return new Response('Hello World', {
      headers: { 'content-type': 'text/plain' },
    });
  }
  
  // 管理页面路径改为/sub
  if (path === `/sub-${CONFIG.UUID}`) {
    return new Response(html, {
      headers: {
        'content-type': 'text/html;charset=UTF-8',
      },
    });
  }
  
  // 处理其他路径
    if (path === `/upload-${CONFIG.UUID}` && request.method === 'POST') {
        return handleUpload(request);
    } else if (path === `/token=${CONFIG.TOKEN}`) {
        return handleToken(request);
    } else if (path === `/update-sub2-${CONFIG.UUID}` && request.method === 'POST') {
      return handleUpdateSub2(request);
    } else if (path === `/get-sub2-${CONFIG.UUID}`) {
      return handleGetSub2();
    }else if (path === `/delete-sub2-${CONFIG.UUID}` && request.method === 'POST') {
        return handleDeleteSub2(request);
    }else if (path === `/get-urls-${CONFIG.UUID}`) {
        return handleGetUrls();
    }else if (path === `/delete-url-${CONFIG.UUID}` && request.method === 'POST') {
        return handleDeleteUrl(request);
    }else if (path === `/delete-all-urls-${CONFIG.UUID}` && request.method === 'POST') {
      return handleDeleteAllUrls(request);
    }else if (path === `/update-keywords-${CONFIG.UUID}` && request.method === 'POST') {
        return handleUpdateKeywordsRequest(request);
    } else if (path === `/get-keywords-${CONFIG.UUID}`) {
        return handleGetKeywordsRequest();
    }else if (path === `/delete-keyword-${CONFIG.UUID}` && request.method === 'POST') {
        return handleDeleteKeyword(request);
    } else if (path === `/delete-all-keywords-${CONFIG.UUID}` && request.method === 'POST') {
        return handleDeleteAllKeywords(request);
    }else if (path === `/delete-all-sub2-${CONFIG.UUID}` && request.method === 'POST') {
         return handleDeleteAllSub2(request);
    }else {
    return new Response('Not Found', { status: 404 });
  }
}
async function handleDeleteAllKeywords() {
    await updateExcludeKeywords([]);
    return new Response('OK', { status: 200 });
}
async function handleDeleteAllSub2() {
  const data = await SUB2_STORE.list();
  for (const key of data.keys) {
    await SUB2_STORE.delete(key.name);
  }
  return new Response('OK', { status: 200 });
}
async function handleDeleteAllUrls(request) {
    const data = await URL_STORE.list();
     for (const key of data.keys) {
         await URL_STORE.delete(key.name)
     }
    return new Response('OK', { status: 200 });
}
// 处理删除关键词
async function handleDeleteKeyword(request) {
    const { index } = await request.json();
    
    let currentKeywords = await getExcludeKeywords();
    currentKeywords.splice(index, 1);
    await updateExcludeKeywords(currentKeywords);

    return new Response('OK', { status: 200 });
}
// 处理获取关键词
async function handleGetKeywordsRequest() {
    const keywords = await getExcludeKeywords();
    return new Response(JSON.stringify({ keywords }), {
        headers: { 'Content-Type': 'application/json' }
    });
}
// 处理更新关键词
async function handleUpdateKeywordsRequest(request) {
     const { keywords } = await request.json();
    if (!Array.isArray(keywords)) {
        return new Response('Invalid keywords format', { status: 400 });
    }
    await updateExcludeKeywords(keywords);
    return new Response('OK', { status: 200 });
}

async function handleDeleteUrl(request) {
    const { urlName } = await request.json();
   
    await URL_STORE.delete(urlName);
    return new Response('OK', { status: 200 });
}

async function handleGetUrls() {
    const data = await URL_STORE.list();
    const urls = [];
    for (const key of data.keys) {
        const decoder = new TextDecoder();
        const decodedKey = decoder.decode(Uint8Array.from(key.name, c => c.charCodeAt(0)))
      const value = await URL_STORE.get(key.name);
      if (value) {
        try {
          const data = JSON.parse(value);
          if (data && typeof data === 'object' && data.url) {
             data.urlName = decodedKey;
            urls.push(data);
          } else {
            console.warn('Skipping invalid data:', value);
          }
        } catch (e) {
          console.error('JSON parse error:', e, 'for value:', value);
        }
      }
    }
    return new Response(JSON.stringify({ urls }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

async function handleDeleteSub2(request) {
  const { index } = await request.json();
  
  // Get all current URLs
  const data = await SUB2_STORE.list();
  const urls = [];
  for (const key of data.keys) {
    const value = await SUB2_STORE.get(key.name);
    if (value) {
      urls.push(value);
    }
  }

  // Remove the URL at the specified index
  urls.splice(index, 1);

  // Clear all existing entries
  for (const key of data.keys) {
    await SUB2_STORE.delete(key.name);
  }

  // Re-add the remaining URLs
  for (let i = 0; i < urls.length; i++) {
    await SUB2_STORE.put(`sub2_url_${i}`, urls[i]);
  }

  return new Response('OK', { status: 200 });
}

async function handleUpdateSub2(request) {
  const { urls } = await request.json();
  if (!Array.isArray(urls)) {
    return new Response('Invalid URLs format', { status: 400 });
  }

  // 获取现有的 SUB2 数据
  const existingData = await SUB2_STORE.list();
  const existingUrls = new Set();
  for (const key of existingData.keys) {
    const value = await SUB2_STORE.get(key.name);
    if (value) {
      existingUrls.add(value);
    }
  }

  // 预处理新的 URL 并过滤掉已存在的和需要排除的
  const newUrls = urls
    .map(url => preProcessUrl(url))  // 预处理 URL
    .filter(url => !shouldExcludeUrl(url))  // 过滤排除的 URL
    .filter(url => !existingUrls.has(url));  // 过滤已存在的 URL

  // 只添加新的 URL，从最后一个现有索引开始
  const startIndex = existingData.keys.length;
  for (let i = 0; i < newUrls.length; i++) {
    await SUB2_STORE.put(`sub2_url_${startIndex + i}`, newUrls[i]);
  }

  return new Response('OK', { status: 200 });
}

async function handleGetSub2() {
  const urls = await getSub2Urls();
  return new Response(JSON.stringify({ urls }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
async function handleUpload(request) {
    const { URL_NAME, URL } = await request.json();
    if (!URL_NAME || !URL) {
      return new Response('Missing URL_NAME or URL', { status: 400 });
    }
    
    let processedURL = preProcessUrl(URL);

    // 检查关键词
    if (shouldExcludeUrl(processedURL)) {
      return new Response('OK', { status: 200 });
    }
      const encoder = new TextEncoder();
     const encodedKey = String.fromCharCode(...encoder.encode(URL_NAME));
    // 先检查是否已存在相同名称的条目
    const existingItem = await URL_STORE.get(encodedKey);
     if (existingItem) {
        const existingData = JSON.parse(existingItem);
          if(existingData.url === processedURL){
            return new Response('OK', { status: 200 });
        }
    }
    await URL_STORE.put(encodedKey, JSON.stringify({
        urlName: URL_NAME,
      url: processedURL,
    }));
  
  return new Response('OK', { status: 200 });
}
async function handleToken(request) {
  const { searchParams } = new URL(request.url);
  const cf_ip = searchParams.get('cf_ip');
  const cf_port = searchParams.get('cf_port');
  if (!cf_ip || !cf_port) {
    return new Response('Missing cf_ip or cf_port in query parameters', { status: 400 });
  }
  
  // 获取上传节点URLs（应用关键词过滤）
  let urls = [];
  const kvUrls = await URL_STORE.list();
  for (const key of kvUrls.keys) {
    const value = await URL_STORE.get(key.name);
    if (value) {
      try {
        const data = JSON.parse(value);
        if (data && typeof data === 'object' && data.url && !shouldExcludeUrl(data.url)) {
          urls.push(data.url);
        } else {
          console.warn('Skipping invalid data:', value);
        }
      } catch (e) {
        console.error('JSON parse error:', e, 'for value:', value);
      }
    }
  }
  // 获取自定义节点URLs（已在getSub2Urls中应用过滤）
  const sub2Urls = await getSub2Urls();
  urls = urls.concat(sub2Urls);
  
  // 获取关键词过滤列表
  const excludeList = await getExcludeKeywords();
  const filterUrls = urls.filter(url => !excludeList.some(keyword => url.includes(keyword)));

  // 处理所有URLs
  urls = filterUrls.map(url => {
    if (url.includes('YOUXUAN_IP') || url.includes('ip.sb')) {
      url = url.replace(/YOUXUAN_IP|ip.sb/g, cf_ip)
               .replace(/\b(443|8443)\b/g, cf_port)
               .replace(/CF_PORT/g, cf_port);
      
      if (cf_port === '80' || cf_port === '8080') {
        url = url.replace(/=tls/g, '=none')
                .replace(/tls\",/g, '\",');
      }
    } else {
      url = url.replace(/YOUXUAN_IP|ip\.sb/g, cf_ip)
               .replace(/CF_PORT/g, cf_port);
    }
    return url;
  });

  // 处理编码
  urls = urls.map(url => {
    if ((url.startsWith('{BASS}://') || url.startsWith(`${PROTOCOL.pm}ess://`)) && 
      url.split('://')[1].charAt(0) == '{') {
       let content = url.split('://')[1];
       let encodedContent = btoa(content);
      return `${PROTOCOL.pm}ess://` + encodedContent;
    }
    return url;
  });

  // 处理订阅链接
  let finalUrls = [];
  for (const url of urls) {
    if (url.toLowerCase().startsWith('http://') || url.toLowerCase().startsWith('https://')) {
      try {
        // 下载订阅内容
        const response = await fetch(url);
        let content = await response.text();

        // 尝试base64解码（如果内容是base64编码的）
        try {
          const decoder = new TextDecoder();
          content = decoder.decode(Uint8Array.from(atob(content), c => c.charCodeAt(0)));
        } catch (e) {
          // 如果解码失败，保持原始内容
          console.log('订阅内容不是base64编码，使用原始内容');
        }
        
        // 将内容分割成单独的链接并过滤空行
          const subUrls = content.split('\n')
            .filter(line => line.trim())
            .filter(line => !shouldExcludeUrl(line));
        finalUrls = finalUrls.concat(subUrls);
      } catch (error) {
        console.error('处理订阅链接失败:', error);
      }
    } else {
      finalUrls.push(url);
    }
  }

  const content = finalUrls.join('\n');
  const encoder = new TextEncoder();
  const encodedContent = btoa(String.fromCharCode(...encoder.encode(content)));
  return new Response(encodedContent, {
    headers: { 'Content-Type': 'text/plain' }
  });
}
