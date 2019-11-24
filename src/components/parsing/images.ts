import * as URI from 'urijs';
import * as cheerio from 'cheerio';

function removeImageSizeGetParamsFromURL(imageURI: uri.URI): uri.URI {
  // Wordpress tends to add image resizing get parameters. Remove them for full size image
  return imageURI.removeSearch(['w', 'h', 'resize']);
}

function isGravatar(imageURI): boolean {
  return imageURI.hostname().includes('gravatar.com');
}

function isWordPressCommentImageOrTracker(imageURI): boolean {
  const imageURIString = imageURI.toString();
  return (
    imageURIString.includes('http://feeds.wordpress.com/1.0/comments') ||
    imageURIString.includes('https://pixel.wp.com')
  );
}

function isValidImage(image): boolean {
  return !(isWordPressCommentImageOrTracker(image) || isGravatar(image));
}

export function extractImageURLFromDescriptionHTML(description: string): uri.URI {
  const $ = cheerio.load(description);
  const firstImage = $('img')
    .first()
    .attr('src');

  return firstImage ? new URI(firstImage) : null;
}

export function extractRSSPostImage(post): uri.URI {
  // There are many more ways to get an image from RSS than ATOM
  // Let's try all of them to get one...
  let imageURI: uri.URI = null;

  if (post.content) {
    const validMediaContentImageURLs = post.content
      .map(media => media.$)
      .reduce(
        (images, media) => (media.medium === 'image' ? images.concat(new URI(media.url)) : images),
        []
      )
      .reduce(
        (validImageURLs, image) =>
          isValidImage(image) ? validImageURLs.concat(image) : validImageURLs,
        []
      );

    if (validMediaContentImageURLs.length > 0) {
      imageURI = validMediaContentImageURLs[0];
    }
  }

  if (!imageURI && post['content:encoded']) {
    imageURI = extractImageURLFromDescriptionHTML(post['content:encoded'][0]);
  }

  if (!imageURI && post.description) {
    imageURI = extractImageURLFromDescriptionHTML(post.description[0]);
  }

  // Reject gravatar images and click to comment images
  if (imageURI && isValidImage(imageURI)) {
    return removeImageSizeGetParamsFromURL(imageURI);
  }

  return null;
}

export function makeRelativeImageURLAbsolute(imageUrl: string, postLink: string): string {
  const imageURI = new URI(imageUrl);

  if (imageURI.is('relative')) {
    return imageURI.absoluteTo(postLink).toString();
  }

  return imageUrl;
}
