import { IBlogPost } from './blog-posts';

function getTitle(xml2JS: any) {}

function getLink(xml2JS: any) {}

function getImageUrl(xml2JS: any) {}

function getDesctiption(xml2JS: any) {}

function getDateUpdated(xml2JS: any) {}

function getDatePublished(xml2JS: any) {}

export function parseAtomPosts(xml2JS: any): IBlogPost[] {
  return xml2JS.feed.entry.map(item => ({
    title: getTitle(item),
    link: getLink(item),
    imageUrl: getImageUrl(item),
    description: getDesctiption(item),
    dateUpdated: getDateUpdated(item),
    datePublished: getDatePublished(item),
  }));
}
