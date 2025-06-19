# Generate Article API

## エンドポイント
`POST /api/generate-article`

## 使用方法

### リクエスト例

```javascript
const response = await fetch('/api/generate-article', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: '今週の運勢を教えてください',
    zodiacSign: '牡羊座',
    type: 'weekly' // 'weekly' または 'semi-annual'
  })
});

const data = await response.json();
```

### レスポンス例

成功時:
```json
{
  "success": true,
  "content": "生成された占い記事の内容...",
  "zodiacSign": "牡羊座",
  "type": "weekly"
}
```

エラー時:
```json
{
  "error": "Failed to generate article",
  "message": "詳細なエラーメッセージ"
}
```

## 環境変数

以下の環境変数が必要です：

- `OPENAI_API_KEY`: OpenAI APIキー

## Cloudflare Pagesでの設定

1. Cloudflare Pagesのダッシュボードで環境変数を設定
2. `OPENAI_API_KEY`を追加

## 注意事項

- このAPIはPOSTメソッドのみ対応しています
- レート制限に注意してください
- 本番環境では適切な認証機構を実装することを推奨します 