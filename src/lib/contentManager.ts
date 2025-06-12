import cmsConfig from "@/config/cms.json";
import { getSinglePage } from "@/lib/contentParser.astro";
import { getSinglePageFromMicroCMS, type Post } from "@/lib/contentParser.microcms";

/**
 * 設定に基づいてコンテンツを取得する統合関数
 */
export const getContent = async (collection: string): Promise<Post[]> => {
  try {
    if (cmsConfig.useMicroCMS) {
      // microCMSからデータを取得
      console.log('microCMSからコンテンツを取得中...');
      return await getSinglePageFromMicroCMS(collection);
    } else {
      // ローカルファイルからデータを取得
      console.log('ローカルファイルからコンテンツを取得中...');
      const localPosts = await getSinglePage(collection);
      
      // ローカルファイルの形式をPost形式に変換
      return localPosts.map((post: any) => ({
        id: post.id || post.slug,
        slug: post.slug,
        data: {
          title: post.data.title,
          description: post.data.description,
          date: post.data.date,
          image: post.data.image,
          categories: post.data.categories || [],
          content: post.body, // ローカルファイルの場合はbodyフィールド
        },
      }));
    }
  } catch (error) {
    console.error('コンテンツ取得エラー:', error);
    
    // microCMS接続失敗時のフォールバック
    if (cmsConfig.useMicroCMS) {
      console.log('microCMS接続失敗、ローカルファイルにフォールバック中...');
      try {
        const localPosts = await getSinglePage(collection);
        return localPosts.map((post: any) => ({
          id: post.id || post.slug,
          slug: post.slug,
          data: {
            title: post.data.title,
            description: post.data.description,
            date: post.data.date,
            image: post.data.image,
            categories: post.data.categories || [],
            content: post.body,
          },
        }));
      } catch (fallbackError) {
        console.error('ローカルファイルフォールバックも失敗:', fallbackError);
        return [];
      }
    }
    
    return [];
  }
};

/**
 * CMSモードを切り替える
 */
export const toggleCMSMode = (useMicroCMS: boolean) => {
  console.log(`CMSモードを${useMicroCMS ? 'microCMS' : 'ローカルファイル'}に切り替えました`);
  // 実際の切り替えは設定ファイルの変更が必要
};

/**
 * 現在のCMSモードを取得
 */
export const getCurrentCMSMode = (): string => {
  return cmsConfig.useMicroCMS ? 'microCMS' : 'ローカルファイル';
}; 