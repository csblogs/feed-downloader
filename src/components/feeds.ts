import { query } from '../database';
import { PoolClient } from 'pg';
import { IBlogPost } from './blog-posts';

export interface IFeed {
  id: string;
  url: string;
  lastModified: Date;
}

export interface IFeedDownload extends IFeed {
  feedXML: string;
  newLastModified: Date;
}

export async function getAllFeeds(): Promise<IFeed[]> {
  const { rows } = await query('SELECT id, url, lastModified FROM users', null);
  
  const feeds: IFeed[] = rows.map(row => {
    return {
      id: row.id,
      url: row.blog_feed_uri,
      lastModified: new Date(row.feed_last_modified)
    }
  });

  return feeds;
}

function getLastModifiedFromHeaders(headers: Headers) {
  const lastModifiedHeader = headers.get('last-modified');
  const dateHeader = headers.get('date');

  if (lastModifiedHeader) {
    return new Date(lastModifiedHeader);
  }

  if (dateHeader) {
    return new Date(dateHeader);
  }

  return null;
}

export async function downloadFeedIfModified(feed: IFeed): Promise<IFeedDownload> {
  const response = await fetch(feed.url, {
    headers: {
      'If-Modified-Since': feed.lastModified.toUTCString(),
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'
    }
  });

  const feedXML = await response.text();
  const newLastModified = getLastModifiedFromHeaders(response.headers);
  
  return {
    ...feed,
    feedXML,
    newLastModified
  }
}

export async function updateFeedLastModified(client: PoolClient, feedId: string, newLastModified: Date) {
  client.query('UPDATE users SET feed_last_modified=$1::timestamp WHERE id=$2::integer', [newLastModified, feedId]);
}

export async function parseFeed(feedXML: string): Promise<IBlogPost[]> {
  return {
    title: '',
    link: '',
    image_url: '',
    description: '',
    date_updated: new Date(),
    date_publidhed: new Date()
  }
}
