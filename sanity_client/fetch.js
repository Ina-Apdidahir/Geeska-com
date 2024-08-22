
import client from "./sanityClient";

export async function fetchPosts() {
  try {
    const data = await client.fetch(`
      *[_type == "post"] | order(_createdAt desc){
        _id,
        title,
        slug,
        mainImage {
          asset -> {
            _id,
            url
          },
          alt
        }
      }
    `);
    return data;
  }
   catch (error) {
      console.error('Error fetching posts from Sanity:', error);
      return [];
    }
  }