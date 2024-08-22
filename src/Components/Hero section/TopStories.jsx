import React, { useState, useEffect } from 'react';
import styles from './TopStories.module.css';
import client from '../../../sanity_client/sanityClient';
import Next from '../../assets/web images/Wnext.png';
import previous from '../../assets/web images/Wprevious.png';

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

    if (isLoading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    if (error) {
        return <div>Error fetching posts: {error.message}</div>;
    }

    if (!Last5Posts.length) {
        return <div>No posts found</div>;
    }

  

    return (
        <div className={styles.TopStories}>
            <div className={`${styles.movebtn} ${styles.previous}`} onClick={previousSlide}>
                <img src={previous} alt="Previous" />
            </div>
            <div className={styles.storiesContainer}>
                {Last5Posts.map((post, index) => (
                    <div key={index} className={`${styles.story} ${index === currentIndex ? styles.active : ''}`}>
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
                        <h1 className={styles.title}>{post?.title}</h1>
                    </div>
                ))}
            </div>
            <div className={`${styles.movebtn} ${styles.Next}`} onClick={nextSlide}>
                <img src={Next} alt="Next" />
            </div>

            {/* Pagination */}
            <div className={styles.pagination}>
                {posts.map((_, index) => (
                    <span
                        key={index}
                        className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
                        onClick={() => goToSlide(index)}
                    />
                ))}
            </div>
        </div>
    );
}

export default TopStories;
