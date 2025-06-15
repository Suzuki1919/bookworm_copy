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
  title?: string;
  content?: string;
  blog?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  category?: string;
  zodiacSign?: string;
}

// お知らせ記事の型定義
export interface NoticePost {
  id: string;
  title?: string;
  content?: string;
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

// 占い記事を取得する関数（カテゴリフィルタ対応）
export const getFortuneArticles = async (
  category?: string,
  zodiacSign?: string,
  limit: number = 50
): Promise<MicroCMSResponse<FortunePost>> => {
  try {
    console.log('Fetching fortune articles...');
    
    let filters = '';
    const filterConditions = [];
    
    if (category) {
      filterConditions.push(`category[contains]${category}`);
    }
    
    if (zodiacSign) {
      filterConditions.push(`zodiacSign[equals]${zodiacSign}`);
    }
    
    if (filterConditions.length > 0) {
      filters = filterConditions.join('[and]');
    }
    
    const queries: any = {
      limit,
      orders: '-publishedAt',
    };
    
    if (filters) {
      queries.filters = filters;
      console.log('Using filters:', filters);
    }
    
    const response = await client.get({
      endpoint: 'fortune-articles',
      queries,
    });
    
    console.log('Fortune articles fetched successfully:', response);
    return response;
  } catch (error) {
    console.error('占い記事の取得に失敗しました:', error);
    throw error;
  }
};

// デバッグ用：全ての記事を取得する関数
export const getAllFortuneArticles = async (
  limit: number = 50
): Promise<MicroCMSResponse<FortunePost>> => {
  try {
    console.log('Fetching ALL fortune articles for debugging...');
    
    const response = await client.get({
      endpoint: 'fortune-articles',
      queries: {
        limit,
        orders: '-publishedAt',
      },
    });
    
    console.log('ALL Fortune articles fetched successfully:', response);
    return response;
  } catch (error) {
    console.error('全占い記事の取得に失敗しました:', error);
    throw error;
  }
};

// 週刊占い記事を取得する関数
export const getWeeklyFortuneArticles = async (
  limit: number = 50
): Promise<MicroCMSResponse<FortunePost>> => {
  return getFortuneArticles('weekly', undefined, limit);
};

// 半期占い記事を取得する関数
export const getSemiAnnualFortuneArticles = async (
  limit: number = 50
): Promise<MicroCMSResponse<FortunePost>> => {
  try {
    console.log('Fetching semi-annual fortune articles...');
    
    const response = await client.get({
      endpoint: 'semi-annual-articles',
      queries: {
        limit,
        orders: '-publishedAt',
      },
    });
    
    console.log('Semi-annual fortune articles fetched successfully:', response);
    return response;
  } catch (error) {
    console.error('半期占い記事の取得に失敗しました:', error);
    throw error;
  }
};

// お知らせ記事を取得する関数
export const getNoticeArticles = async (
  limit: number = 10
): Promise<MicroCMSResponse<NoticePost>> => {
  try {
    console.log('Fetching notice articles...');
    
    const response = await client.get({
      endpoint: 'notices',
      queries: {
        limit,
        orders: '-publishedAt',
      },
    });
    
    console.log('Notice articles fetched successfully:', response);
    return response;
  } catch (error) {
    console.error('お知らせ記事の取得に失敗しました:', error);
    throw error;
  }
};

// 特定の占い記事を取得する関数
export const getFortuneArticleById = async (id: string): Promise<FortunePost> => {
  try {
    console.log(`Fetching fortune article with ID: ${id}`);
    
    const response = await client.get({
      endpoint: 'fortune-articles',
      contentId: id,
    });
    
    console.log('Fortune article fetched successfully:', response);
    return response;
  } catch (error) {
    console.error('占い記事の取得に失敗しました:', error);
    throw error;
  }
};

// 特定の半期占い記事を取得する関数
export const getSemiAnnualFortuneArticleById = async (id: string): Promise<FortunePost> => {
  try {
    console.log(`Fetching semi-annual fortune article with ID: ${id}`);
    
    const response = await client.get({
      endpoint: 'semi-annual-articles',
      contentId: id,
    });
    
    console.log('Semi-annual fortune article fetched successfully:', response);
    return response;
  } catch (error) {
    console.error('半期占い記事の取得に失敗しました:', error);
    throw error;
  }
};

// 特定のお知らせ記事を取得する関数
export const getNoticeArticleById = async (id: string): Promise<NoticePost> => {
  try {
    console.log(`Fetching notice article with ID: ${id}`);
    
    const response = await client.get({
      endpoint: 'notices',
      contentId: id,
    });
    
    console.log('Notice article fetched successfully:', response);
    return response;
  } catch (error) {
    console.error('お知らせ記事の取得に失敗しました:', error);
    throw error;
  }
}; 