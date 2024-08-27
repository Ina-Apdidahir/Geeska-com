
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import styles from './TopStories.module.css';
import client from '../../../sanity_client/sanityClient';
import Next from '../../assets/web images/Wnext.png';
import previous from '../../assets/web images/Wprevious.png';

import right_chevron from '../../assets/web images/right-chevron.png';
import left_chevron from '../../assets/web images/left-chevron.png';

function TopStories() {
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

    const Last5Posts = posts.slice(0, 5);


    // Auto-slide function
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % Last5Posts.length);
        }, 10000); // Change slide every 5 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, [Last5Posts.length]);

    // Handle Next button
    const nextSlide = () => {
        setCurrentIndex((currentIndex + 1) % Last5Posts.length);
    };

    // Handle Previous button
    const previousSlide = () => {
        setCurrentIndex((currentIndex - 1 + Last5Posts.length) % Last5Posts.length);
    };

    // Handle Pagination
    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    
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

    // if (isLoading) {
    //     return <div className={styles.loading}>Loading...</div>;
    // }

    if (error) {
        return <div>Error fetching posts: {error.message}</div>;
    }

    if (!Last5Posts.length < 0) {
        return <div>No posts found</div>;
    }

  
    return (
        <>
            {posts && posts.length > 0 && (
                <div className={styles.TopStories}>
                    <div className={`${styles.movebtn} ${styles.previous}`} onClick={previousSlide}>
                        <img src={right_chevron} alt="Previous" />
                        {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.8284 12.0005L14.6569 14.8289L13.2426 16.2431L9 12.0005L13.2426 7.75781L14.6569 9.17203L11.8284 12.0005Z"></path></svg> */}
                    </div>
                    <div className={styles.storiesContainer}>
                        {Last5Posts.map((post, index) => (
                            <div key={index} className={`${styles.story} ${index === currentIndex ? styles.active : ''}`}>
                                {post.mainImage && post.mainImage.asset && (
                                    <div className={styles.image}>
                                        <Link to={`/detail/${post.slug.current}`}>
                                            <img src={post.mainImage.asset.url} alt={post.mainImage.alt || 'Story Image'} />
                                        </Link>
                                    </div>
                                )}
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
                                <Link to={`/detail/${post.slug.current}`}>
                                    <h1 className={styles.title}>{post?.title}</h1>
                                </Link>

                            </div>
                        ))}
                    </div>
                    <div className={`${styles.movebtn} ${styles.Next}`} onClick={nextSlide}>
                        <img src={left_chevron} alt="Next" />
                        {/* <svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.1717 12.0005L9.34326 9.17203L10.7575 7.75781L15.0001 12.0005L10.7575 16.2431L9.34326 14.8289L12.1717 12.0005Z"></path></svg> */}
                    </div>

                    {/* Pagination */}
                    <div className={styles.pagination}>
                        {Last5Posts.map((_, index) => (
                            <span
                                key={index}
                                className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
                                onClick={() => goToSlide(index)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

export default TopStories;
