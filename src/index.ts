import { insertNewBlogPosts } from './components/blog-posts';
import {
  downloadFeedIfModified,
  getAllFeeds,
  IFeedDownload,
  parseFeed,
  updateFeedLastModified,
} from './components/feeds';
import { getClient } from './database';

async function main() {
  // Download all feeds
  const feedUrls = await getAllFeeds();
  const downloadTasks = feedUrls.map(downloadFeedIfModified);
  const results = await Promise.all(downloadTasks);

  // Save new blog posts to DB
  const client = await getClient();
  try {
    await client.query('BEGIN');
    results.forEach(async (feedDownload: IFeedDownload) => {
      if (feedDownload.lastModified !== feedDownload.newLastModified) {
        const blogPosts = await parseFeed(feedDownload.feedXML);
        await insertNewBlogPosts(client, feedDownload.id, blogPosts);
        await updateFeedLastModified(client, feedDownload.id, feedDownload.newLastModified);
      }
    });
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
  } finally {
    await client.release();
  }
}
