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
  return [{
    id: '1',
    url: 'https://dannycomputerscientist.wordpress.com/feed.xml', 
    lastModified: new Date()
  }];
}

export async function downloadFeedIfModified(feed: IFeed): Promise<IFeedDownload> {
  return {
    id: '1',
    url: 'https://dannycomputerscientist.wordpress.com/feed.xml',
    lastModified: new Date(),
    feedXML: '<>',
    newLastModified: null
  };
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
