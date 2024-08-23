
import React, { useState, useEffect } from 'react';
import client from '../../../sanity_client/sanityClient';
import { urlFor } from '../../../sanity_client/sanityClient';

import styles from './Opinion_Sec.module.css'
import quotes from '../../assets/web images/quotes.png'

function Opinion_Section() {

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
                const OpinionPosts = data.filter(post => post.categories?.some(sub => sub.title == "Opinion"));
                setPosts(OpinionPosts);
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
                            <h1>OPINION</h1>
                        </div>
                        <div className={styles.Btn}>
                            <button>More</button>
                            <svg className={styles.more} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                <path fill="currentColor" d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
                            </svg>
                        </div>
                    </div>

                    <div className={styles.Opinion_stories}>

                        {LastOne && (
                            <div className={styles.story_1}>
                                {LastOne.mainImage && LastOne.mainImage.asset && (
                                    <div className={styles.image}>
                                        <img src={LastOne.mainImage.asset.url} alt="" />
                                    </div>
                                )}
                                <div className={styles.storycontent}>
                                    <div className={styles.Author}>
                                        <div className={styles.authorImg}>
                                            {LastOne.imageUrl && (
                                                <img src={urlFor(LastOne.imageUrl)} alt={LastOne.author} />
                                            )}
                                        </div>
                                        <div className={styles.AuthorName}>
                                            <p>{LastOne.author}</p>
                                        </div>
                                    </div>

                                    <div className={styles.Title}>
                                        <div className={styles.Qoutes}>
                                            <img src={quotes} alt="" />
                                        </div>

                                        <div className={styles.Texts}>
                                            <h1>{LastOne?.title}</h1>
                                            <p>{LastOne?.subtitle}</p>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        )}

                        {Last4Posts && Last4Posts.length > 0 && (
                            <div className={styles.sideStories}>
                                {Last4Posts.map((story, index) => (
                                    <div key={index} className={styles.side_Story}>
                                        <div className={styles.story_container}>
                                            <div className={styles.Side_author}>
                                                {story.imageUrl && (
                                                    <div className={styles.image}>
                                                        <img src={urlFor(story.imageUrl)} alt={story.author} />
                                                    </div>
                                                )}
                                                <p>{story.author}</p>
                                            </div>
                                            <div className={styles.Side_Title}>
                                                <div className={styles.side_Qoutes}>
                                                    <img src={quotes} alt="" />
                                                </div>

                                                <div className={styles.side_Texts}>
                                                    <h1>{story?.title}</h1>
                                                    <p>{story?.subtitle}</p>
                                                </div>
                                            </div>
                                        </div>
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

export default Opinion_Section