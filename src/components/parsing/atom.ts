import { IBlogPost } from '../blog-posts';
import { formatDescription } from '../feeds';
import { extractImageFromDescriptionHTML } from './images';

function getTitle(post: any) {
  let title = '';
  if (post.title[0]._) {
    // Some titles include format information, and so their info resides in _
    title = post.title[0]._;
  } else {
    // Some contain just plain text titles, return directly
    return post.title[0];
  }
  return title;
}

function getLink(postLinks: any) {
  let preferredLink = '';
  if (postLinks.length === 1) {
    preferredLink = postLinks[0].$.href;
  } else {
    // Prefer alternative URIs to self URIs
    const alternateLinks = postLinks
      .filter(link => link.$.rel === 'alternate')
      .map(link => link.$.href);
    const selfLinks = postLinks.filter(link => link.$.rel === 'self').map(link => link.$.href);

    preferredLink = alternateLinks.length > 0 ? alternateLinks[0] : selfLinks[0];
  }
  return preferredLink;
}

function getImageUrl(post: any) {
  const description = getDescription(post);
  const imageFromDescription = extractImageFromDescriptionHTML(description);
  return imageFromDescription || null;
}

function getDescription(post: any) {
  let description = '';
  if (post.content) {
    description = post.content[0]._;
  } else {
    description = post.summary[0]._;
  }
  return formatDescription(description);
}

function getDateUpdated(post: any) {
  return post.updated ? new Date(post.updated[0]) : null;
}

function getDatePublished(post: any) {
  return post.published ? new Date(post.published[0]) : null;
}

export function parseAtomPosts(xml2JS: any): IBlogPost[] {
  return xml2JS.feed.entry.map(item => ({
    title: getTitle(item),
    link: getLink(item.link),
    imageUrl: getImageUrl(item),
    description: getDescription(item),
    dateUpdated: getDateUpdated(item),
    datePublished: getDatePublished(item),
  }));
}
