import { createClient } from 'microcms-js-sdk';

if (!import.meta.env.MICROCMS_SERVICE_DOMAIN) {
  throw new Error('MICROCMS_SERVICE_DOMAIN is required');
}

if (!import.meta.env.MICROCMS_API_KEY) {
  throw new Error('MICROCMS_API_KEY is required');
}

// microCMSクライアントを作成
export const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_KEY,
});

// 簡単なテスト記事の型定義
export interface TestPost {
  id: string;
  title: string;
  content?: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  revisedAt: string;
}

// microCMS APIのレスポンス型
export interface MicroCMSResponse<T> {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
}

// シンプルなテスト関数 - エンドポイント名を変更可能
export const testMicroCMSConnection = async (endpoint: string = 'posts'): Promise<any> => {
  try {
    console.log(`Testing microCMS connection to endpoint: ${endpoint}`);
    
    const response = await client.get({
      endpoint: endpoint,
      queries: {
        limit: 1,
      },
    });
    
    console.log('microCMS接続成功:', response);
    return response;
  } catch (error) {
    console.error(`microCMS接続エラー (endpoint: ${endpoint}):`, error);
    throw error;
  }
};

// 利用可能なエンドポイントを確認するためのテスト関数
export const testCommonEndpoints = async (): Promise<void> => {
  const commonEndpoints = [
    'blog',
    'fortune-articles',
    'notice-articles',
    'posts',
    'articles',
    'news',
    'contents'
  ];
  
  for (const endpoint of commonEndpoints) {
    try {
      console.log(`\n=== Testing endpoint: ${endpoint} ===`);
      await testMicroCMSConnection(endpoint);
      console.log(`✅ Endpoint "${endpoint}" exists and is accessible`);
    } catch (error) {
      console.log(`❌ Endpoint "${endpoint}" failed:`, (error as Error).message);
    }
  }
}; 