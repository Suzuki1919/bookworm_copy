import {
  getCollection,
  type CollectionEntry,
} from "astro:content";

type PageData = {
  title: string;
  meta_title?: string;
  description?: string;
  image?: string;
  draft?: boolean;
};

export const getSinglePage = async (
  collectionName: string
): Promise<CollectionEntry<any>[]> => {
  const allPages = await getCollection(collectionName as any);

  const removeIndex = allPages.filter((data: any) => data.id.match(/^(?!-)/));

  const removeDrafts = removeIndex.filter((data: any) => {
    const pageData = data.data as PageData;
    return pageData.draft !== true;
  });

  return removeDrafts;
}; 