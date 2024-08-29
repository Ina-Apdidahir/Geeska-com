

import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import client from '../../../sanity_client/sanityClient.js';
import { urlFor } from '../../../sanity_client/sanityClient.js';
import { PortableText } from '@portabletext/react';

import styles from './multmedia.module.css'

import Footer from '../FOOTER/Footer.jsx';
import HeadSection from "../Header Section/Header.jsx";
import Pagination from '../AUTHOR/Pagination.jsx';
import Related from '../DETAILS/Related/Related.jsx'

function MULTIMEDIA() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 6;

    useEffect(() => {
        const fetchPosts = async () => {
            const query = `*[ _type == "multimeda"] | order(_createdAt desc) {
                    title,
                    body,
                    slug,
                    publishedAt,
                    youtubeUrl
                }`;

            try {
                const data = await client.fetch(query);
                setPosts(data);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // Scroll to top when currentPage changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

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


    // Format the publishedAt date
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    };

    // Get current posts for pagination
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    // Pagination functions
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => {
        if (currentPage < Math.ceil(posts.length / postsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    const firstPage = () => {
        setCurrentPage(1);
    };
    const lastPage = () => {
        setCurrentPage(Math.ceil(posts.length / postsPerPage));
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }


    return (
        <>
            <HeadSection />

            <div className={styles.container}>
                <div className={styles.Category_Container}>
                    <div className={styles.Category}>
                        <div className={styles.CategoryPosts}>
                            <h2> Multimedia Articles</h2>
                            {currentPosts.length > 0 ? (
                                currentPosts.map((post, index) => (
                                    <div
                                        key={post.slug.current}
                                        className={index === 0 && currentPage === 1 ? styles.firstPost : styles.post}
                                    >
                                        <Link to={`/detail/${post.slug.current}`}>
                                            {post.youtubeUrl && (
                                                <div className={styles.video}>
                                                    <iframe
                                                        width="100%"
                                                        height="100%"
                                                        src={getEmbedUrl(post.youtubeUrl)}
                                                        title={post.title}
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    ></iframe>

                                                </div>
                                            )}

                                            <div className={styles.postTitle}>
                                                <small>{formatDate(post.publishedAt)}</small>
                                                <p className={styles.title}>{post.title}</p>

                                                <div className={styles.subtitle1}>
                                                    <PortableText value={post?.body} components={components} />
                                                </div>
                                            </div>
                                        </Link>
                                        {index !== 0 && (
                                            <div className={styles.subtitle2}>
                                            <PortableText value={post?.body} components={components} />
                                        </div>
                                        )}
                                    </div>

                                ))
                            ) : (
                                <p>No articles found in Politics.</p>
                            )}
                        </div>
                        <Pagination
                            postsPerPage={postsPerPage}
                            totalPosts={posts.length}
                            paginate={paginate}
                            currentPage={currentPage}
                            nextPage={nextPage}
                            prevPage={prevPage}
                            firstPage={firstPage}
                            lastPage={lastPage}
                        />
                    </div>
                    <Related singlePost={posts} />
                </div>
            </div>

            <Footer />
        </>
    );
}

export default MULTIMEDIA;
