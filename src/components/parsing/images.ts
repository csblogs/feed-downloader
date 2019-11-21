import * as URI from 'urijs';
import * as cheerio from 'cheerio';

function removeImageSizeGetParamsFromURL(imageURI: uri.URI): uri.URI {
  // Wordpress tends to add image resizing get parameters. Remove them for full size image
  return imageURI.removeSearch(['w', 'h', 'resize']);
}

function isGravatar(imageURI): boolean {
  return imageURI.hostname().includes('gravatar.com');
}

function isWordPressAddCommentImage(imageURI): boolean {
  return imageURI.toString().includes('http://feeds.wordpress.com/1.0/comments');
}

function isValidImage(image): boolean {
  return !(isWordPressAddCommentImage(image) || isGravatar(image));
}

export function extractImageFromDescriptionHTML(description: string) {
  const $ = cheerio.load(description);
  const firstImage = $('img')
    .first()
    .attr('src');

  if (firstImage) {
    return new URI(firstImage);
  }
  return null;
}

export function extractRSSPostImage(post): uri.URI {
  // There are many more ways to get an image from RSS than ATOM
  // Let's try all of them to get one...
  let imageURI: uri.URI = null;

  if (post['media:content']) {
    const validMediaContentImageURLs = post['media:content']
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
    imageURI = extractImageFromDescriptionHTML(post['content:encoded'][0]);
  }

  if (!imageURI && post.description) {
    imageURI = extractImageFromDescriptionHTML(post.description[0]);
  }

  // Reject gravatar images and click to comment images
  if (imageURI && !isGravatar(imageURI) && !isWordPressAddCommentImage(imageURI)) {
    return removeImageSizeGetParamsFromURL(imageURI);
  }

  return null;
}
