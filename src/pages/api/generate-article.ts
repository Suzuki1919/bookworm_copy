import type { APIRoute } from 'astro';
import OpenAI from 'openai';

// OpenAIクライアントの初期化
const openai = new OpenAI({
  apiKey: import.meta.env.OPENAI_API_KEY,
});

export const POST: APIRoute = async ({ request }) => {
  try {
    // リクエストボディを取得
    const body = await request.json();
    const { prompt, zodiacSign, type } = body;

    // 必須パラメータのチェック
    if (!prompt || !zodiacSign || !type) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: prompt, zodiacSign, type' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // OpenAI APIを使用して記事を生成
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `あなたは占星術の専門家です。${type === 'weekly' ? '週刊' : '半期'}占いの記事を書いてください。星座は${zodiacSign}です。`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const generatedContent = completion.choices[0]?.message?.content || '';

    // 生成された記事を返す
    return new Response(
      JSON.stringify({
        success: true,
        content: generatedContent,
        zodiacSign,
        type,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error generating article:', error);
    
    // エラーレスポンス
    return new Response(
      JSON.stringify({
        error: 'Failed to generate article',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};

// GETリクエストは許可しない
export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({ error: 'Method not allowed. Use POST.' }),
    {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}; 