
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
                        title,
                        slug
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


    // Helper function to get category CSS class based on category title
    const getCategoryClass = (categoryTitle) => {
        switch (categoryTitle.toLowerCase()) {
            case 'culture':
                return styles.Culture;
            case 'politics':
                return styles.Politics;
            case 'interviews':
                return styles.Interviews;
            case 'multimedia':
                return styles.Multimedia;
            case 'opinion':
                return styles.Opinion;
            default:
                return styles.defaultCategory;
        }
    };



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
                                {(post.subcategories || post.categories)?.map((category) => (
                                    <Link
                                        key={category.slug.current}
                                        to={`/category/${category.slug.current}`}
                                        className={`${styles.category} ${getCategoryClass(category.title)}`}
                                    >
                                        {category.title}
                                    </Link>
                                ))}
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