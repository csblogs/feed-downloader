import { PoolClient } from "pg";

export interface IBlogPost {
  title: string,
  link: string,
  imageUrl: string,
  description: string,
  dateUpdated: Date,
  datePublished: Date,
}

export async function insertNewBlogPosts(client: PoolClient, feedId: string, blogPosts: IBlogPost[]) {
  const insertPromises = blogPosts.map(async(blogPost) => {
    const { title, link, imageUrl, description, dateUpdated, datePublished } = blogPost;

    await client.query(
      'INSERT INTO blog_posts (title, link, image_url, description, date_updated, date_published, author_id) ' +
      'VALUES ($1::text, $2::text, $3::text, $4::text, $5:timestamp $6::timestamp, $7::integer)',
      [ title, link, imageUrl, description, dateUpdated, datePublished, feedId ]
    );
  });

  await Promise.all(insertPromises);
}
