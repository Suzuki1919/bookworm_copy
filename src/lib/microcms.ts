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

// 占い記事の型定義
export interface FortunePost {
  id: string;
  title: string;
  content: string;
  description?: string;
  image?: {
    url: string;
    height: number;
    width: number;
  };
  zodiacSign: string; // 星座名
  category: 'weekly' | 'semi-annual'; // 週刊 or 半期
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  revisedAt: string;
}

// お知らせ記事の型定義
export interface NoticePost {
  id: string;
  title: string;
  content: string;
  description?: string;
  image?: {
    url: string;
    height: number;
    width: number;
  };
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

// 占い記事を取得する関数
export const getFortuneArticles = async (
  category?: 'weekly' | 'semi-annual',
  zodiacSign?: string,
  limit: number = 50
): Promise<MicroCMSResponse<FortunePost>> => {
  try {
    const filters: string[] = [];
    
    if (category) {
      filters.push(`category[equals]${category}`);
    }
    
    if (zodiacSign) {
      filters.push(`zodiacSign[equals]${zodiacSign}`);
    }
    
    const filterString = filters.length > 0 ? filters.join('[and]') : undefined;
    
    const response = await client.get({
      endpoint: 'fortune-articles',
      queries: {
        limit,
        orders: '-publishedAt',
        filters: filterString,
      },
    });
    
    return response;
  } catch (error) {
    console.error('占い記事の取得に失敗しました:', error);
    throw error;
  }
};

// お知らせ記事を取得する関数
export const getNoticeArticles = async (
  limit: number = 10
): Promise<MicroCMSResponse<NoticePost>> => {
  try {
    const response = await client.get({
      endpoint: 'notice-articles',
      queries: {
        limit,
        orders: '-publishedAt',
      },
    });
    
    return response;
  } catch (error) {
    console.error('お知らせ記事の取得に失敗しました:', error);
    throw error;
  }
};

// 特定の記事を取得する関数
export const getFortuneArticleById = async (id: string): Promise<FortunePost> => {
  try {
    const response = await client.get({
      endpoint: 'fortune-articles',
      contentId: id,
    });
    
    return response;
  } catch (error) {
    console.error('記事の取得に失敗しました:', error);
    throw error;
  }
};

// 特定のお知らせ記事を取得する関数
export const getNoticeArticleById = async (id: string): Promise<NoticePost> => {
  try {
    const response = await client.get({
      endpoint: 'notice-articles',
      contentId: id,
    });
    
    return response;
  } catch (error) {
    console.error('お知らせ記事の取得に失敗しました:', error);
    throw error;
  }
}; 