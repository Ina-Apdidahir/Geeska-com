import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import client from '../../../sanity_client/sanityClient.js';
import { urlFor } from '../../../sanity_client/sanityClient.js';

import styles from './Politics.module.css';

import Footer from '../FOOTER/Footer.jsx';
import HeadSection from "../Header Section/Header.jsx";
import Pagination from '../AUTHOR/Pagination.jsx';
import Related from '../DETAILS/Related/Related.jsx'

function CategoryPage() {
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
                  publishedAt
                }`;

            try {
                // const politicsPost = data.filter(post => post.categories?.some(sub => sub.title === "Politics"));
                const data = await client.fetch(query);
                const filteredPosts = data.filter(post => 
                    post.categories?.some(category => category.slug.current === slug)
                );
                setPosts(filteredPosts);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, [slug]);

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
                        <h2>Politics Articles</h2>
                        {currentPosts.length > 0 ? (
                            currentPosts.map((post, index) => (
                                <div
                                    key={post.slug.current}
                                    className={index === 0 ? styles.firstPost : styles.post}
                                >
                                    <Link to={`/detail/${post.slug.current}`}>
                                        <div className={styles.postImg}>
                                            {post.mainImage && post.mainImage.asset && (
                                                <img src={post.mainImage.asset.url} alt={post.title} />
                                            )}
                                        </div>
                                        <div className={styles.postTitle}>
                                            <div className={styles.Refrence}>
                                                <div className={styles.Author}>
                                                    <span>{post.author}</span>
                                                </div>
                                                <small>{formatDate(post.publishedAt)}</small>
                                            </div>
                                            <p className={styles.title}>{post.title}</p>
                                            {index === 0 ? (
                                                <div className={styles.subtitle2}>
                                                    <small>{post.subtitle}</small>
                                                </div>
                                            ) : (
                                                <div className={styles.subtitle2}>
                                                    <small>{post.subtitle}</small>
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                    <div className={styles.subtitle1}>
                                        <small>{post.subtitle}</small>
                                    </div>

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
                <Related singlePost={posts}  />
                </div>
            </div>

            <Footer />
        </>
    );
}

export default CategoryPage;
