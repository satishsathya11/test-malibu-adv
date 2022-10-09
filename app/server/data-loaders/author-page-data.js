import { Author } from "@quintype/framework/server/api-client";
import { storyFields } from "../../isomorphic/constants";

export async function loadAuthorPageData(client, authorSlug, config, next) {
  const params = { author: authorSlug, sort: "published-at", fields: storyFields, limit: 7 };
  const authorData = await Author.getAuthor(client, authorSlug);
  if (!authorData.author.id) return next();
  const authorCollection = await Author.getAuthorCollection(client, authorData.author.id, params);
  return {
    author: authorData.author,
    authorCollection
  };
}
