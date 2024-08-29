
import React, { useState, useEffect } from 'react';
import client from '../../../sanity_client/sanityClient';
import { urlFor } from '../../../sanity_client/sanityClient';
import { Link } from 'react-router-dom';

import styles from './Opinion_Sec.module.css'
import quotes from '../../assets/web images/quotes.png'
import Floor from '../../assets/web images/floor.png'

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
                            <img src={Floor} alt="" />
                            <h1>OPINION</h1>
                        </div>
                        <Link to="/opinion">
                            <div className={styles.Btn}>
                                <button>more  </button>
                                <div className={styles.more}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"></path></svg>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className={styles.Opinion_stories}>

                        {LastOne && (
                            <div className={styles.story_1}>
                                {LastOne.mainImage && LastOne.mainImage.asset && (
                                    <div className={styles.image}>
                                        <Link to={`/detail/${LastOne.slug.current}`}>
                                            <img src={LastOne.mainImage.asset.url} alt="" />
                                        </Link>
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
                                            <Link to={`/detail/${LastOne.slug.current}`}>
                                                <h1>{LastOne?.title}</h1>
                                            </Link>
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
                                                    <Link to={`/detail/${story.slug.current}`}>
                                                        <h1>{story?.title}</h1>
                                                    </Link>
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