import { IBlogPost } from './blog-posts';

function getTitle(xml2JS: any) {}

function getLink(xml2JS: any) {}

function getImageUrl(xml2JS: any) {}

function getDesctiption(xml2JS: any) {}

function getDateUpdated(xml2JS: any) {}

function getDatePublished(xml2JS: any) {}

export function parseRSSPosts(xml2JS: any): IBlogPost[] {
  return xml2JS.rss.channel[0].item.map(item => ({
    title: getTitle(item),
    link: getLink(item),
    imageUrl: getImageUrl(item),
    description: getDesctiption(item),
    dateUpdated: getDateUpdated(item),
    datePublished: getDatePublished(item),
  }));
}
