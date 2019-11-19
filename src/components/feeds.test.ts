import { parseFeed } from './feeds';

describe('feeds', () => {
  describe('parseFeed()', () => {
    it('should throw if passed an null or empty string', async () => {
      await parseFeed('');
    });
  });
});
