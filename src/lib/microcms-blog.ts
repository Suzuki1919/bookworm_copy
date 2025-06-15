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

// Blog記事の型定義（実際のmicroCMSスキーマに合わせて修正）
export interface BlogPost {
  id: string;
  bookworm_copy: string; // 実際のフィールド名
  content?: string;
  description?: string;
  image?: {
    url: string;
    height: number;
    width: number;
  };
  category?: string[];
  tags?: string[];
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

// Blog記事を取得する関数
export const getBlogPosts = async (limit: number = 10): Promise<MicroCMSResponse<BlogPost>> => {
  try {
    console.log('Fetching blog posts from microCMS...');
    
    const response = await client.get({
      endpoint: 'blog', // 小文字に修正
      queries: {
        limit,
        orders: '-publishedAt',
      },
    });
    
    console.log('Blog posts fetched successfully:', response);
    return response;
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    throw error;
  }
};

// 特定のBlog記事を取得する関数
export const getBlogPostById = async (id: string): Promise<BlogPost> => {
  try {
    console.log(`Fetching blog post with ID: ${id}`);
    
    const response = await client.get({
      endpoint: 'blog', // 小文字に修正
      contentId: id,
    });
    
    console.log('Blog post fetched successfully:', response);
    return response;
  } catch (error) {
    console.error('Failed to fetch blog post:', error);
    throw error;
  }
};

// Blog記事を既存のPost形式に変換する関数
export interface Post {
  id: string;
  slug: string;
  data: {
    title: string;
    description?: string;
    date: Date;
    image?: string;
    categories: string[];
    content?: string;
  };
}

export const convertBlogPostToPost = (blogPost: BlogPost): Post => {
  return {
    id: blogPost.id,
    slug: blogPost.id,
    data: {
      title: blogPost.bookworm_copy,
      description: blogPost.description,
      date: new Date(blogPost.publishedAt),
      image: blogPost.image?.url,
      categories: blogPost.category || ['未分類'],
      content: blogPost.content,
    },
  };
};

// 既存のシステムとの互換性のために、Blog記事をPost形式で取得
export const getSinglePageFromBlog = async (): Promise<Post[]> => {
  try {
    const response = await getBlogPosts(50);
    return response.contents.map(convertBlogPostToPost);
  } catch (error) {
    console.error('Failed to get posts from Blog endpoint:', error);
    return [];
  }
}; 