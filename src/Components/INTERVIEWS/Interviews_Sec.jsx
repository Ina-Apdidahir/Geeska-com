
import React, { useState, useEffect } from 'react';
import client from '../../../sanity_client/sanityClient';

import styles from './Interviews_Sec.module.css'
import Floor from '../../assets/web images/floor.png'


function Interview_Section() {

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
                  "author": author->name
                }`;

            try {
                const data = await client.fetch(query);
                const interviewPost = data.filter(post => post.categories?.some(sub => sub.title == "Interviews"));
                setPosts(interviewPost);
                setIsLoading(false);
            } catch (err) {
                setError(err);
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);


    const Last4Posts = posts.slice(1, 5);
    const LastOne = posts[0];


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
                        <img src={Floor} alt="" />
                            <h1>INTERVIEWS</h1>
                        </div>
                        
                        <div className={styles.Btn}>
                            <button>more</button>
                            <div className={styles.more}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"></path></svg>
                            </div>
                        </div>
                    </div>

                    <div className={styles.Politic_stories}>
                        {LastOne && (
                            <div className={styles.story}>
                                {LastOne.mainImage && LastOne.mainImage.asset && (
                                    <div className={styles.image}>
                                        <img src={LastOne.mainImage.asset.url} alt={LastOne.mainImage.alt || 'Story Image'} />
                                    </div>
                                )}
                                <div className={styles.refrence}>
                                    <div className={styles.category}>
                                        <p>{LastOne.categories.map(category => category.title).join(', ')}</p>
                                    </div>
                                    <p className={styles.auther}>{LastOne.author}</p>
                                </div>
                                <h1 className={styles.title}>{LastOne?.title}</h1>
                                <p className={styles.subtitle}>{LastOne?.subtitle}</p>
                            </div>
                        )}

                        {Last4Posts && (
                            <div className={styles.sideStories}>
                                {Last4Posts.map((post, index) => (
                                    <div key={index} className={styles.sideStory}>
                                        {post.mainImage && post.mainImage.asset && (
                                            <div className={styles.side_image}>
                                                <img src={post.mainImage.asset.url} alt={post.mainImage.alt || 'Story Image'} />
                                            </div>
                                        )}
                                        <div className={styles.refrence}>
                                            <div className={styles.category}>
                                                <p>{post.categories.map(category => category.title).join(', ')}</p>
                                            </div>
                                            <p className={styles.auther}>{post.author}</p>
                                        </div>
                                        <h1 className={styles.side_title}>{post?.title}</h1>
                                        <p className={styles.side_subtitle}>{post?.subtitle}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>

                </div>
            )}
        </>

    )

}

export default Interview_Section