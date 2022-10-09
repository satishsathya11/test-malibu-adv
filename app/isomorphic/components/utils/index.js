import { getCollectionitems, getSearchPageItems, getStories, getAuthorStories } from "../../../api/utils";

export const isValidEmail = email => {
  const re = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
  if (!re.test(email)) return false;
  if (email.length > 150 || email.length < 6) return false;
  return true;
};

export const getLoadMoreStories = async ({
  offset,
  limit,
  isSearchPage = false,
  slug,
  query,
  shouldUseCollection,
  setStories,
  storiesToRender,
  setStoriesToRender,
  stories,
  isSectionPage,
  authorId
}) => {
  if (isSearchPage) {
    const loadMoreStories = await getSearchPageItems(slug, offset, limit);
    setStories(stories.slice(0, storiesToRender).concat(loadMoreStories));
    setStoriesToRender(storiesToRender + limit);
    return null;
  }

  if (shouldUseCollection && isSectionPage) {
    const loadMoreStories = await getCollectionitems(slug, offset, limit);
    setStories(stories.slice(0, storiesToRender).concat(loadMoreStories));
    setStoriesToRender(storiesToRender + limit);
    return null;
  }

  if (authorId) {
    const loadMoreStories = await getAuthorStories(authorId, offset, limit);
    setStories(stories.slice(0, storiesToRender).concat(loadMoreStories));
    setStoriesToRender(storiesToRender + limit);
    return null;
  }

  const loadMoreStories = await getStories(query, slug, offset, limit);
  setStories(stories.slice(0, storiesToRender).concat(loadMoreStories));
  setStoriesToRender(storiesToRender + limit);
  return null;
};
