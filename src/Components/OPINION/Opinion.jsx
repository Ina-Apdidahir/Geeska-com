
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import client from '../../../sanity_client/sanityClient.js';
import { urlFor } from '../../../sanity_client/sanityClient.js';

import quotes from '../../assets/web images/quotes.png'
import styles from './Opinion.module.css'

import Footer from '../FOOTER/Footer.jsx';
import HeadSection from "../Header Section/Header.jsx";
import Pagination from '../AUTHOR/Pagination.jsx';
import Related from '../DETAILS/Related/Related.jsx'

function Opinion() {



    // State to track window size
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 1023);

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth > 1023);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);




    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { slug } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 3;

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
                        title,
                        slug
                    },
                  "author": author->name,
                  "authorSlug": author->slug.current,
                  "imageUrl": author->image,
                  publishedAt
                }`;

            try {
                const data = await client.fetch(query);
                const OpinionPost = data.filter(post => post.categories?.some(sub => sub.title === "Opinion"));
                // const data = await client.fetch(query);
                // const filteredPosts = data.filter(post =>
                //     post.categories?.some(category => category.slug.current === slug)
                // );
                setPosts(OpinionPost);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, [slug]);

    useEffect(() => {
        // Scroll to top when currentPage changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

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
                            <h2> Opinion Articles</h2>
                            {currentPosts.length > 0 ? (
                                currentPosts.map((post, index) => (
                                    <div
                                        key={post.slug.current}
                                        className={index === 0 && currentPage === 1 ? styles.firstPost : styles.post}
                                    >

                                        {index === 0 && currentPage === 1 ? (
                                            <Link to={`/detail/${post.slug.current}`}>
                                                <div className={styles.postImg}>
                                                    {post.mainImage && post.mainImage.asset && (
                                                        <img src={post.mainImage.asset.url} alt={post.title} />
                                                    )}
                                                </div>
                                                <div className={styles.postTitle}>

                                                    <div className={styles.Refrence}>
                                                        <div className={styles.Author}>
                                                            <div className={styles.authorImg}>
                                                                {post.imageUrl && (
                                                                    <img src={urlFor(post.imageUrl)} alt={post.author} />
                                                                )}
                                                            </div>
                                                            <span>{post.author}</span>
                                                        </div>
                                                        <small>{formatDate(post.publishedAt)}</small>
                                                    </div>
                                                    <div className={styles.Info}>
                                                        <img src={quotes} alt='' />
                                                        <div className={styles.texts}>
                                                            <p className={styles.title}>{post.title}</p>

                                                            <div className={styles.subtitle}>
                                                                <small>{post.subtitle}</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ) : (
                                            <Link to={`/detail/${post.slug.current}`}>
                                                {isLargeScreen ? (post.mainImage && post.mainImage.asset && (
                                                    <div className={styles.postImg}>
                                                        <img src={post.mainImage.asset.url} alt={post.title} />
                                                    </div>
                                                )) : (
                                                    <div className={styles.quotes} >
                                                        <img src={quotes} alt='' />
                                                    </div>
                                                )}
                                                <div className={styles.postTitle}>

                                                    <div className={styles.Refrence}>
                                                        <div className={styles.Author}>
                                                            <div className={styles.authorImg}>
                                                                {post.imageUrl && (
                                                                    <img src={urlFor(post.imageUrl)} alt={post.author} />
                                                                )}
                                                            </div>
                                                            <span>{post.author}</span>
                                                        </div>
                                                        <small>{formatDate(post.publishedAt)}</small>
                                                    </div>
                                                    <div className={styles.Info}>
                                                        {isLargeScreen && (<img src={quotes} alt='' />)}
                                                        <div className={styles.texts}>
                                                            <p className={styles.title}>{post.title}</p>

                                                            <div className={styles.subtitle}>
                                                                <small>{post.subtitle}</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
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
                    <Related singlePost={currentPosts} />
                </div>
            </div>

            <Footer />
        </>
    );
}


export default Opinion
