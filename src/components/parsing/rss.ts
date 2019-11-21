import { IBlogPost } from '../blog-posts';
import { formatDescription } from '../feeds';
import { extractRSSPostImage } from './images';

function getTitle(post: any) {
  return post.title[0].trim();
}

function getLink(post: any) {
  return post.link[0].trim();
}

function getImageUrl(post: any) {
  return extractRSSPostImage(post);
}

function getDescription(post: any) {
  return post.description ? formatDescription(post.description[0]) : null;
}

function getDateUpdated(post: any) {
  return null;
}

function getDatePublished(post: any) {
  return post.pubDate ? new Date(post.pubDate) : null;
}

export function parseRSSPosts(xml2JS: any): IBlogPost[] {
  return xml2JS.rss.channel[0].item.map(item => ({
    title: getTitle(item),
    link: getLink(item),
    imageUrl: getImageUrl(item),
    description: getDescription(item),
    dateUpdated: getDateUpdated(item),
    datePublished: getDatePublished(item),
  }));
}
