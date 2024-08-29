
import React, { useState, useEffect } from 'react';
import client from '../../../sanity_client/sanityClient';
import { Link } from 'react-router-dom';

import styles from './Culture_Sec.module.css'
import Floor from '../../assets/web images/floor.png'

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


    // const LastOne = posts[0];
    const Last8Posts = posts.slice(0, 8);


    if (error) {
        return <div>Error fetching posts: {error.message}</div>;
    }

    if (!posts.length < 0) {
        return <div>No posts found</div>;
    }


    return (
        <>
            {Last8Posts && Last8Posts.length > 0 && (
                <div className={styles.container}>
                    <div className={styles.section_head}>
                        <div className={styles.Title}>
                            <img src={Floor} alt="" />
                            <h1>CULTURE</h1>
                        </div>
                        <Link to="/category/culture">
                            <div className={styles.Btn}>
                                <button>more  </button>
                                <div className={styles.more}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"></path></svg>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className={styles.Stories}>
                        {Last8Posts.map((post, index) => (
                            <div key={index} className={styles.Story}>
                                {post.mainImage && post.mainImage.asset && (
                                    <div className={styles.image}>
                                        <Link to={`/detail/${post.slug.current}`}>
                                            <img src={post.mainImage.asset.url} alt={post.mainImage.alt || 'Story Image'} />
                                        </Link>
                                    </div>
                                )}

                                <div className={styles.refrence}>
                                    <div className={styles.category}>
                                        <p>{post.categories.map(category => category.title).join(', ')}</p>
                                    </div>
                                    <p className={styles.auther}>{post.author}</p>
                                </div>
                                <div className={styles.texts}>
                                    <Link to={`/detail/${post.slug.current}`}>
                                        <h1 className={styles.title}>{post?.title}</h1>
                                    </Link>
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