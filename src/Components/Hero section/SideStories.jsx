
import React, { useState, useEffect } from 'react';
import client from '../../../sanity_client/sanityClient';
import styles from './SideStories.module.css'

import { Link } from 'react-router-dom';

function SideStories() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchPosts = async () => {
            const query = `*[ _type == "post"] | order(_createdAt desc) {
                  title,
                  slug,
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
                  "author": author->name
                }`;

            try {
                const data = await client.fetch(query);
                setPosts(data);
                setIsLoading(false);
            } catch (err) {
                setError(err);
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);



    if (error) {
        return <div>Error fetching posts: {error.message}</div>;
    }

    if (!posts.length < 0) {
        return <div>No posts found</div>;
    }

    const Last5Posts = posts.slice(0, 5);

    return (
        <div className={styles.SideStories}>
            {Last5Posts && (
                Last5Posts.map((post, index) => (
                    <div className={styles.story} key={index}>
                        {post.mainImage && post.mainImage.asset && (
                            <div className={styles.image}>
                                <Link to={`/detail/${post.slug.current}`}>
                                    <img src={post.mainImage.asset.url} alt={post.mainImage.alt || 'Story Image'} />
                                </Link>
                            </div>
                        )}
                        <div className={styles.content}>
                            <div className={styles.refrence}>
                                <div className={styles.category}>
                                    <p>{post.categories.map(category => category.title).join(', ')}</p>
                                </div>
                                <p className={styles.auther}>{post.author}</p>
                            </div>
                            <div className={styles.title}>
                                <Link to={`/detail/${post.slug.current}`}><h1>{post?.title}</h1></Link>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

export default SideStories