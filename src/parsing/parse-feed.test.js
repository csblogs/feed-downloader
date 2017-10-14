const fs = require('fs');
const path = require('path');
const Boom = require('boom');
const parseFeed = require('./parse-feed');

function loadTestFeed(name) {
  const fileLocation = path.join(__dirname, '..', '..', 'test', 'rss-atom-feeds', name);
  return fs.readFileSync(fileLocation);
}

describe('PARSE RSS', () => {
  it('should throw a `Bad Data` error if passed invalid XML', async () => {
    const invalidXml = '<xml> /xml>';
    await expect(parseFeed(invalidXml)).rejects.toEqual(Boom.badData('Invalid XML'));
  });

  it('should throw a `Bad Data` error if provided XML doesn\'t match RSS/ATOM schemas', async () => {
    const beerXML = '<RECIPES></RECIPES>';
    await expect(parseFeed(beerXML)).rejects.toEqual(Boom.badData('Not an RSS or ATOM feed'));
  });

  it('should successfully parse a minimum RSS example', async () => {
    const minimumRSS = loadTestFeed('minimum.rss');
    const blogPosts = await parseFeed(minimumRSS);

    expect(blogPosts).toHaveLength(1);
    expect(blogPosts[0]).toEqual({
      title: 'You won\'t believe what happened next!',
      link: 'http://example.com/what-happened-next',
      description: '',
    });
  });

  it.skip('should parse an example Ghost RSS file', async () => {
    const ghostRSS = loadTestFeed('ghost.rss');
    const blogPosts = await parseFeed(ghostRSS);

    expect(blogPosts).toHaveLength();
  });
});
