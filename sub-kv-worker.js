// 使用 KV 存储替代内存存储
// 你需要绑定变量名为URL_STORE和SUB2_STORE的2个KV空间
// 基础配置参数
const CONFIG = {
  UUID: '123456',           // 节点上传密钥
  TOKEN: '666666',          // 订阅地址密钥
  PASSWORD: 'pswd123456',     // 后台页面登陆密码，路径/sub
  DEFAULT_DOMAIN: 'xx.dev', //  默认即可，无需设置
  EXPIRATION_TIME: 600,     // 链接有效期(秒)
  MAX_LOGIN_ATTEMPTS: 3     // 最大登录尝试次数
};

// 排除包含关键词的节点,分号隔开.
const excludeKeywords = 'GB-eugamehost.com;TW-freeserver.tw';

// 协议配置，默认即可
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
        .sub2-section {
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
            <h3>节点上传地址：</h3>
            <div class="url" id="uploadUrl"></div>
            <button class="copy-btn" onclick="copyToClipboard('uploadUrl')">复制</button>
            
            <h3>订阅地址：</h3>
            <div class="url" id="downloadUrl"></div>
            <button class="copy-btn" onclick="copyToClipboard('downloadUrl')">复制</button>
            
            <h3>使用说明：</h3>
            <ol>
                <li>节点原优选域名要设置为ip.sb，端口443或80，否则不能自动替换</li>
                <li>订阅链接参数：cf_ip和cf_port必填，可以自动替换优选域名和端口</li>
                <li>默认支持v2rayn软件，其他软件自行转换格式</li>
            </ol>

            <div class="sub2-section">
                <h3>自定义节点链接管理：</h3>
                <textarea id="sub2Content" placeholder="每行一个URL"></textarea>
                <button onclick="updateSub2()">更新自定义节点</button>
                <button onclick="loadSub2()" class="copy-btn">加载当前自定义节点</button>
                <div id="successMessage" class="success-message">更新自定义节点成功！</div>
            </div>
        </div>
    </div>

    <script>
        const CORRECT_PASSWORD = '${CONFIG.PASSWORD}';
        const UUID = '${CONFIG.UUID}';
        const TOKEN = '${CONFIG.TOKEN}';
        const MAX_ATTEMPTS = ${CONFIG.MAX_LOGIN_ATTEMPTS};
        let loginAttempts = 0;
        
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
                loadSub2();
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

        async function updateSub2() {
            const content = document.getElementById('sub2Content').value;
            const urls = content.split('\\n').filter(url => url.trim());
            
            const response = await fetch(\`\${getDomain()}/update-sub2-\${UUID}\`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ urls })
            });

            if (response.ok) {
                const successMsg = document.getElementById('successMessage');
                successMsg.style.display = 'block';
                setTimeout(() => {
                    successMsg.style.display = 'none';
                }, 3000);
            } else {
                alert('更新失败，请重试');
            }
        }

        async function loadSub2() {
            const response = await fetch(\`\${getDomain()}/get-sub2-\${UUID}\`);
            if (response.ok) {
                const data = await response.json();
                document.getElementById('sub2Content').value = data.urls.join('\\n');
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
  const excludeList = excludeKeywords.split(';').map(keyword => keyword.trim());
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
  if (path === '/sub') {
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
  } else {
    return new Response('Not Found', { status: 404 });
  }
}

async function handleUpdateSub2(request) {
  const { urls } = await request.json();
  if (!Array.isArray(urls)) {
    return new Response('Invalid URLs format', { status: 400 });
  }

  // 清除旧的SUB2数据
  const oldData = await SUB2_STORE.list();
  for (const key of oldData.keys) {
    await SUB2_STORE.delete(key.name);
  }

  // 预处理URL并应用过滤
  const processedUrls = urls
    .map(url => preProcessUrl(url))  // 使用预处理函数处理URL
    .filter(url => !shouldExcludeUrl(url));  // 过滤排除的URL

  // 保存处理后的SUB2数据
  for (let i = 0; i < processedUrls.length; i++) {
    await SUB2_STORE.put(`sub2_url_${i}`, processedUrls[i]);
  }

  return new Response('OK', { status: 200 });
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
  
  await URL_STORE.put(URL_NAME, JSON.stringify({
    urlName: URL_NAME,
    url: processedURL,
    lastUpdate: Date.now()
  }), { expirationTtl: CONFIG.EXPIRATION_TIME });
  
  return new Response('OK', { status: 200 });
}

async function handleToken(request) {
  const { searchParams } = new URL(request.url);
  const cf_ip = searchParams.get('cf_ip');
  const cf_port = searchParams.get('cf_port');
  if (!cf_ip || !cf_port) {
    return new Response('Missing cf_ip or cf_port in query parameters', { status: 400 });
  }
  
  // 获取常规URLs（应用关键词过滤）
  let urls = [];
  const kvUrls = await URL_STORE.list();
  for (const key of kvUrls.keys) {
    const value = await URL_STORE.get(key.name);
    if (value) {
      const data = JSON.parse(value);
      if (!shouldExcludeUrl(data.url)) {
        urls.push(data.url);
      }
    }
  }
  // 获取SUB2 URLs（已在getSub2Urls中应用过滤）
  const sub2Urls = await getSub2Urls();
  urls = urls.concat(sub2Urls);
  
  // 处理所有URLs
  urls = urls.map(url => {
    if (url.includes('YOUXUAN_IP') || url.includes('ip.sb')) {
      url = url.replace(/YOUXUAN_IP|ip\.sb/g, cf_ip)
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
    if (url.startsWith(`${PROTOCOL.pm}ess://`)) {
      let content = url.split('://')[1];
      let encodedContent = btoa(content);
      return `${PROTOCOL.pm}ess://` + encodedContent;
    }
    return url;
  });

  const content = urls.join('\n');
  const encodedContent = btoa(content);
  return new Response(encodedContent, {
    headers: { 'Content-Type': 'text/plain' }
  });
}
