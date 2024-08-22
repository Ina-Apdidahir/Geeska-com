import { createClient} from '@sanity/client'; // Import named export
import imageUrlBuilder from '@sanity/image-url';

const client = createClient({
  projectId: '8zcs8u8e', // Replace with your project ID
  dataset: 'production', // Or your dataset name
  apiVersion : '2023-07-27',
  useCdn: false // `false` if you want to ensure fresh data
});

const builder = imageUrlBuilder(client);
export const urlFor = (source) => builder.image(source);

export default client


