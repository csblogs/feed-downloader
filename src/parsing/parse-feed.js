const util = require('util');
const xml2js = require('xml2js');
const Boom = require('boom');

const parseXMLString = util.promisify(xml2js.parseString);

async function parseXML(xml) {
  try {
    const xmlAsJSON = await parseXMLString(xml, { trim: true, explicitArray: false });
    return xmlAsJSON;
  } catch (error) {
    throw new Boom.badData('Invalid XML', error);
  }
}

function determineFeedType(xmlAsJson) {
  if (xmlAsJson.rss) {
    return 'RSS';
  }

  throw new Boom.badData('Not an RSS or ATOM feed');
}

function parseRSSBlogPosts(xmlAsJSON) {
  const { channel } = xmlAsJSON.rss;
  const channelItems = Array.isArray(channel.item) ? channel.item : [channel.item];
  return channelItems.map(item => ({
    title: item.title,
    link: item.link,
    description: item.description || '',
  }));
}

function parseBlogPosts(feedType, xmlAsJSON) {
  switch (feedType) {
    case 'RSS':
      return parseRSSBlogPosts(xmlAsJSON);
    default:
      return null;
  }
}

module.exports = async function parseFeed(rss) {
  const xmlAsJson = await parseXML(rss);
  const feedType = determineFeedType(xmlAsJson);
  const blogPosts = parseBlogPosts(feedType, xmlAsJson);

  return blogPosts;
};
