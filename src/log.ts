import * as bunyan from 'bunyan';

const logger = bunyan.createLogger({ name: 'FEED-DOWNLOADER' });

// Disable logging in tests to make output easier to read. Credit: http://www.sheshbabu.com/posts/disabling-bunyan-in-tests/
if (process.env.NODE_ENV === 'test') {
  logger.level(bunyan.FATAL + 1);
}

export default logger;
