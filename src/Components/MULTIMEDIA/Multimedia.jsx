import React, { useEffect, useState } from 'react';
import client from '../../../sanity_client/sanityClient';
import { PortableText } from '@portabletext/react';
import { Link } from 'react-router-dom';

import styles from './Multimedia.module.css';
import Floor from '../../assets/web images/floor.png';

const Multimedia = () => {

    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            const query = `*[ _type == "multimeda"] | order(_createdAt desc) {
                title,
                body,
                slug,
                youtubeUrl
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

    const Last4Posts = posts.slice(1, 5);
    const LastOne = posts[0];

    const components = {
        types: {
            space: ({ value }) => {
                return (
                    <div style={{ height: value.height }} className={styles.space} />
                );
            },
            image: ({ value }) => {
                const imageUrl = urlFor(value.asset).url();
                return (
                    <img
                        src={imageUrl}
                        alt={value.alt || 'Image'}
                        className={styles.Image}
                    />
                );
            },
        },
    };

    const getEmbedUrl = (youtubeUrl) => {
        if (!youtubeUrl) {
            return '';
        }

        const videoIdMatch = youtubeUrl.match(/(?:youtube\.com\/(?:embed\/|v\/|v=)|youtu\.be\/)([^"&?\/\s]{11})/);

        if (videoIdMatch) {
            return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
        } else {
            console.error('Invalid YouTube URL:', youtubeUrl);
            return '';
        }
    };

    return (
        <>
            {posts && posts.length > 0 && (
                <div className={styles.container}>
                    <div className={styles.section_head}>
                        <div className={styles.Title}>
                            <img src={Floor} alt="" />
                            <h1>MULTIMEDIA</h1>
                        </div>
                        <Link to="/multimedia">
                            <div className={styles.Btn}>
                                <button>more</button>
                                <div className={styles.more}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"></path>
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className={styles.Multimedia}>
                        {LastOne && (
                            <div className={styles.story_1}>
                                {LastOne.youtubeUrl && (
                                    <div className={styles.video}>
                                        <Link to={`/detail/${LastOne.slug.current}`}>
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                src={getEmbedUrl(LastOne.youtubeUrl)}
                                                title={LastOne.title}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        </Link>
                                    </div>
                                )}
                                <div className={styles.texts}>
                                    <Link to={`/detail/${LastOne.slug.current}`}>
                                        <h1 className={styles.title}>{LastOne.title}</h1>
                                    </Link>
                                    <div className={styles.subtitle}>
                                        <PortableText value={LastOne?.body} components={components} />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className={styles.Stories}>
                            {Last4Posts.map((video, index) => (
                                <div key={index} className={styles.Story}>
                                    {video.youtubeUrl && (
                                        <div className={styles.video}>
                                            <Link to={`/detail/${LastOne.slug.current}`}>
                                                <iframe
                                                    // width="100%"
                                                    // height="100%"
                                                    src={getEmbedUrl(video.youtubeUrl)}
                                                    title={video.title}
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                ></iframe>
                                            </Link>
                                        </div>
                                    )}
                                    <div className={styles.texts}>
                                        <Link to={`/detail/${video.slug.current}`}>
                                            <h1 className={styles.title}>{video.title}</h1>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Multimedia;
