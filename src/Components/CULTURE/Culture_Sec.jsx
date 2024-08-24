
import React, { useState, useEffect } from 'react';
import client from '../../../sanity_client/sanityClient';
import { urlFor } from '../../../sanity_client/sanityClient';

import styles from './Culture_Sec.module.css'

function Culture_Section() {


    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            const query = `*[ _type == "post"] | order(_createdAt desc) {
                  title,
                  slug,
                  subtitle,
                  mainImage {
                    asset -> {
                        _id,
                        url
                    },
                    alt
                    },
                  categories[]->{
                        title
                    },
                  "author": author->name,
                  "imageUrl": author->image
                }`;

            try {
                const data = await client.fetch(query);
                const CulturePosts = data.filter(post => post.categories?.some(sub => sub.title == "Culture"));
                setPosts(CulturePosts);
                setIsLoading(false);
            } catch (err) {
                setError(err);
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);


    // const Last4Posts = posts.slice(1, 5);
    // const LastOne = posts[0];


    if (error) {
        return <div>Error fetching posts: {error.message}</div>;
    }

    if (!posts.length < 0) {
        return <div>No posts found</div>;
    }


    return (
        <>
            {posts && posts.length > 0 && (
                <div className={styles.container}>
                    <div className={styles.section_head}>
                        <div className={styles.Title}>
                            <h1>CULTURE</h1>
                        </div>
                        <div className={styles.Btn}>
                            <button>More</button>
                            <svg className={styles.more} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                <path fill="currentColor" d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
                            </svg>
                        </div>
                    </div>

                    <div className={styles.Stories}>
                        {posts.map((post, index) => (
                            <div key={index} className={styles.Story}>
                                {post.mainImage && post.mainImage.asset && (
                                    <div className={styles.image}>
                                        <img src={post.mainImage.asset.url} alt={post.mainImage.alt || 'Story Image'} />
                                    </div>
                                )}

                                <div className={styles.refrence}>
                                    <div className={styles.category}>
                                        <p>{post.categories.map(category => category.title).join(', ')}</p>
                                    </div>
                                    <p className={styles.auther}>{post.author}</p>
                                </div>
                                <div className={styles.texts}>
                                    <h1 className={styles.title}>{post?.title}</h1>
                                    <p className={styles.subtitle}>{post?.subtitle}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}

export default Culture_Section