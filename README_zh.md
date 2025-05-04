# Context7 MCP Agent for Cloudflare Workers

[![Deploy to Cloudflare Workers](https://img.shields.io/badge/Deploy%20to-Cloudflare%20Workers-orange?logo=cloudflare)](https://developers.cloudflare.com/workers/)

這個專案將 [@upstash/context7-mcp](https://github.com/upstash/context7) 部署為一個 Cloudflare Worker 上的 Model Context Protocol (MCP) 代理 (Agent)。

## 概觀

Context7 是一個讓開發者能夠為任何函式庫建立和查詢最新文件的平台。此 MCP 代理作為一個橋樑，讓 AI 模型可以透過標準化的 MCP 介面與 Context7 互動。

此代理實現了由 `@upstash/context7-mcp` 提供的 MCP 工具。有關可用工具的詳細資訊（如 `resolve-library-id` 和 `get-library-docs`），請參閱 [Upstash Context7 MCP 儲存庫](https://github.com/upstash/context7)。

此代理部署在 Cloudflare Workers 上，利用 Durable Objects 來處理狀態和 MCP 會話。


## 開始使用

### 安裝

1.  複製此儲存庫：
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```
2.  安裝依賴套件：
    ```bash
    npm install
    ```

### 本地開發

使用 Wrangler 在本地運行 Worker：

```bash
npm run dev
```

### 部署到 Cloudflare

1. 編輯 `wrangler.jsonc`，確認 `name`、`main`、`durable_objects` 等配置正確。
2. 執行部署指令：
    ```bash
    npm run deploy
    ```
3. 部署完成後，Cloudflare 會顯示你的 Worker URL。
4. 將此 URL 設定到你的 MCP 客戶端，以便與你的代理進行通信。
    ```json
    "context7-cloudflare-server": {
        "type": "sse",
        "url": "https://<your-worker-name>.<your-account-id>.workers.dev/sse"
    }
    ```


## 參考連結

- [Build a Remote MCP server](https://developers.cloudflare.com/agents/guides/remote-mcp-server/)
- [Upstash Context7 MCP](https://github.com/upstash/context7-mcp)
