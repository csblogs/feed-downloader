import { parseFeed } from './feeds';
import { readFileSync } from 'fs';
import { IBlogPost } from './blog-posts';

describe('feeds', () => {
  describe('parseFeed()', () => {
    it('should throw if passed an empty string', async () => {
      try {
        await parseFeed('');
      } catch (e) {
        expect(e.message).toEqual('Valid XML Required');
      }
    });

    it('should throw if feedString is not a valid XML document', async () => {
      const invalidXML = '<?xml version = "1.0"?><data><<</data>';
      try {
        await parseFeed(invalidXML);
      } catch (e) {
        expect(e.message).toEqual('Valid XML Required');
      }
    });

    it("should throw if feedString is valid XML but isn't a valid ATOM/RSS feed", async () => {
      const validXMLNotAFeed = '<?xml version = "1.0"?><notAFeed></notAFeed>';
      try {
        await parseFeed(validXMLNotAFeed);
      } catch (e) {
        expect(e.message).toEqual('XML is not an RSS or ATOM feed');
      }
    });

    describe('real-life examples', () => {
      it('should correctly parse minimum.rss', async () => {
        const minimumRSS = readFileSync('./src/test-data/rss/minimum.rss').toString();
        const expectedItems: IBlogPost[] = [
          {
            title: "You won't believe what happened next!",
            link: 'http://example.com/what-happened-next',
            imageUrl: null,
            description: 'Something uninteresting, you got click baited!',
            dateUpdated: null,
            datePublished: null,
          },
          {
            title: 'Blog Authors hate him!',
            link: 'http://example.com/blog-authors-hate-him',
            imageUrl: null,
            description: null,
            dateUpdated: null,
            datePublished: null,
          },
        ];

        expect(await parseFeed(minimumRSS)).toEqual(expectedItems);
      });

      it.skip('should correctly parse blogger.atom', () => {});

      it.skip('should correctly parse alexs-custom-feed.atom', () => {});

      it.skip('should correctly parse wordpress.com.rss', () => {});
    });
  });
});
