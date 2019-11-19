import { query } from '../database';
import { PoolClient } from 'pg';
import { IBlogPost } from './blog-posts';
import { parseStringPromise as parseXMLString } from 'xml2js';
import { parseAtomPosts } from './atom';
import { parseRSSPosts } from './rss';

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
      lastModified: new Date(row.feed_last_modified),
    };
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
      'User-Agent':
        'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
    },
  });

  const feedXML = await response.text();
  const newLastModified = getLastModifiedFromHeaders(response.headers);

  return {
    ...feed,
    feedXML,
    newLastModified,
  };
}

export async function updateFeedLastModified(
  client: PoolClient,
  feedId: string,
  newLastModified: Date
) {
  client.query('UPDATE users SET feed_last_modified=$1::timestamp WHERE id=$2::integer', [
    newLastModified,
    feedId,
  ]);
}

function isRSS(xml2JS: any) {
  return Boolean(xml2JS.rss);
}

function isAtom(xml2JS: any) {
  return Boolean(xml2JS.feed);
}

export async function parseFeed(unparsedFeedXML: string): Promise<IBlogPost[]> {
  const xml2JSResult = await parseXMLString(unparsedFeedXML);

  if (isRSS(xml2JSResult)) {
    return parseRSSPosts(xml2JSResult);
  }

  if (isAtom(xml2JSResult)) {
    return parseAtomPosts(xml2JSResult);
  }

  throw new Error('Valid RSS/ATOM Required');
}
