import { getFortuneArticles, getNoticeArticles, type FortunePost, type NoticePost } from './microcms';

// 既存のPostインターフェースに合わせた型変換
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

// microCMSの占い記事を既存のPost形式に変換
const convertFortunePostToPost = (fortunePost: FortunePost): Post => {
  // カテゴリーを日本語に変換
  const categoryMap = {
    'weekly': '週刊占い',
    'semi-annual': '2024下半期'
  };

  return {
    id: fortunePost.id,
    slug: fortunePost.id,
    data: {
      title: fortunePost.title,
      description: fortunePost.description,
      date: new Date(fortunePost.publishedAt),
      image: fortunePost.image?.url,
      categories: [categoryMap[fortunePost.category]],
      content: fortunePost.content,
    },
  };
};

// microCMSのお知らせ記事を既存のPost形式に変換
const convertNoticePostToPost = (noticePost: NoticePost): Post => {
  return {
    id: noticePost.id,
    slug: noticePost.id,
    data: {
      title: noticePost.title,
      description: noticePost.description,
      date: new Date(noticePost.publishedAt),
      image: noticePost.image?.url,
      categories: ['お知らせ'],
      content: noticePost.content,
    },
  };
};

// microCMSから全ての記事を取得（占い記事とお知らせ記事を統合）
export const getSinglePageFromMicroCMS = async (collection: string): Promise<Post[]> => {
  try {
    if (collection !== 'posts') {
      return [];
    }

    // 並行して占い記事とお知らせ記事を取得
    const [fortuneResponse, noticeResponse] = await Promise.all([
      getFortuneArticles(),
      getNoticeArticles(),
    ]);

    // 占い記事を変換
    const fortunePosts = fortuneResponse.contents.map(convertFortunePostToPost);

    // お知らせ記事を変換
    const noticePosts = noticeResponse.contents.map(convertNoticePostToPost);

    // 全ての記事を統合して返す
    return [...fortunePosts, ...noticePosts];

  } catch (error) {
    console.error('microCMSからのコンテンツ取得に失敗しました:', error);
    // エラー時は空配列を返す（フォールバック）
    return [];
  }
};

// 特定の記事をIDで取得
export const getPostByIdFromMicroCMS = async (id: string): Promise<Post | null> => {
  try {
    // まず占い記事として検索
    try {
      const { getFortuneArticleById } = await import('./microcms');
      const fortunePost = await getFortuneArticleById(id);
      return convertFortunePostToPost(fortunePost);
    } catch (fortuneError) {
      // 占い記事で見つからない場合、お知らせ記事として検索
      try {
        const { getNoticeArticleById } = await import('./microcms');
        const noticePost = await getNoticeArticleById(id);
        return convertNoticePostToPost(noticePost);
      } catch (noticeError) {
        console.error('記事が見つかりませんでした:', id);
        return null;
      }
    }
  } catch (error) {
    console.error('記事の取得に失敗しました:', error);
    return null;
  }
};

// 星座名マッピング（microCMSで使用される英語名から日本語名への変換）
export const zodiacMapping: Record<string, string> = {
  'aries': '牡羊座',
  'taurus': '牡牛座', 
  'gemini': '双子座',
  'cancer': '蟹座',
  'leo': '獅子座',
  'virgo': '乙女座',
  'libra': '天秤座',
  'scorpio': '蠍座',
  'sagittarius': '射手座',
  'capricorn': '山羊座',
  'aquarius': '水瓶座',
  'pisces': '魚座',
}; 