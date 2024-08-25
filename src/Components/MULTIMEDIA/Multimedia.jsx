

import React, { useEffect, useState } from 'react';
import client from '../../../sanity_client/sanityClient';
import { PortableText } from '@portabletext/react';

import styles from './Multimedia.module.css'
import Floor from '../../assets/web images/floor.png'

const Multimedia = () => {

    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPlaying, setIsPlaying] = useState(true);


    useEffect(() => {
        const fetchPosts = async () => {
            const query = `*[ _type == "multimeda"] | order(_createdAt desc) {
                title,
                body,
                "thumbnailUrl": thumbnail.asset->url,
                "videoUrl": video.asset->url
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
                // Render the space component
                return (
                    <div style={{ height: value.height }} className={styles.space} />
                );
            },
            image: ({ value }) => {
                const imageUrl = urlFor(value.asset).url(); // Generate the URL
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

    const handleThumbnailClick = () => {
        setIsPlaying(true);
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
                        <div className={styles.Btn}>
                            <button>more  </button>
                            <div className={styles.more}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"></path></svg>
                            </div>
                        </div>
                    </div>

                    <div className={styles.Multimedia}>

                        {LastOne && (
                            <div className={styles.story_1}>
                                {LastOne.videoUrl && (
                                    <div className={styles.video}>
                                        <video controls autoPlay >
                                            <source src={LastOne.videoUrl} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                )}
                                <div className={styles.texts}>
                                    <h1 className={styles.title}>{LastOne.title}</h1>
                                    <div className={styles.subtitle}>
                                        <PortableText value={LastOne?.body} components={components} />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className={styles.Stories}>
                            {Last4Posts.map((video, index) => (
                                <div key={index} className={styles.Story}>

                                    <div className={styles.video}>
                                        <video controls autoPlay >
                                            <source src={video?.videoUrl} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                    
                                    <div className={styles.texts}>
                                        <h1 className={styles.title}>{video.title}</h1>
                                        {/* {video.body && <PortableText value={video.body} components={components} />} */}
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



{/* <video controls style={{ width: '100%', maxWidth: '600px', height: 'auto' }}>
<source src={video.videoUrl} type="video/mp4" />
Your browser does not support the video tag.
</video>  */}