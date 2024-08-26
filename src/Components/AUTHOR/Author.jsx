import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import client from '../../../sanity_client/sanityClient';
import { urlFor } from '../../../sanity_client/sanityClient';
import styles from './Author.module.css';
import { PortableText } from '@portabletext/react';

function Author() {
    const [author, setAuthor] = useState({});
    const [authorPosts, setAuthorPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { slug } = useParams(); // Get the slug from the URL parameters

    useEffect(() => {
        // Query to fetch author details and their posts
        const query = `*[ _type == "author" && slug.current == "${slug}"][0] {
          name,
          slug,
          image,
          bio,
          "posts": *[ _type == "post" && author._ref == ^._id] | order(_createdAt desc) {
            title,
            slug,
            mainImage {
              asset -> {
                _id,
                url
              },
              alt
            },
            publishedAt,
             categories[]->{
            title,
            slug
            },
            subcategories[]->{
            title,
            slug
            },
            }
        }`;

        client.fetch(query)
            .then((data) => {
                setAuthor(data);
                setAuthorPosts(data.posts);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setIsLoading(false);
            });
    }, [slug]);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.author}>
                <div className={styles.authorDetails}>
                    <div className={styles.authorImg}>
                        {author.image && (
                            <img src={urlFor(author.image)} alt={author.name} />
                        )}
                    </div>
                    <div className={styles.texts}>
                        <p>{author.name}</p>
                        {author.bio && (
                            <div className={styles.bio}>
                                <PortableText value={author.bio} />
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.authorPosts}>
                    <h2>Articles by {author.name}</h2>
                    {authorPosts.length > 0 ? (
                        authorPosts.map(post => (
                            <div key={post.slug.current} className={styles.post}>
                                <Link to={`/detail/${post.slug.current}`}>
                                    <div className={styles.postImg}>
                                        {post.mainImage && post.mainImage.asset && (
                                            <img src={post.mainImage.asset.url} alt={post.title} />
                                        )}
                                    </div>
                                    <div className={styles.postTitle}>
                                        <div className={styles.Refrence}>
                                            {post.subcategories ? (
                                                <span className={styles.category}>{post.subcategories.map(category => category.title).join(',')}</span>
                                            ) : (
                                                <span className={styles.category}>{post.categories.map(category => category.title).join(',')}</span>
                                            )}
                                            <small>{new Date(post.publishedAt).toLocaleDateString()}</small>
                                        </div>
                                        <p className={styles.title}>{post.title}</p>
                                    </div>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p>No articles found for this author.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Author;
