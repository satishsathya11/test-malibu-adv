import { Story } from "@quintype/framework/server/api-client";

export function loadSearchPageData(client, query) {
  return Story.getSearch(client, { q: query, limit: "9" }).then(result => ({
    stories: result.stories.map(story => {
      return { type: "story", story: story.asJson() };
    }),
    total: result.total,
    query
  }));
}
