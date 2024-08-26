
import HeadSection from "../Header Section/Header.jsx";
import YourComponent from "./Fonsizing.jsx";

import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import client from '../../../sanity_client/sanityClient';
import { urlFor } from '../../../sanity_client/sanityClient';
import { PortableText } from '@portabletext/react';

import styles from './Details.module.css'


function Details() {

    const [singlePost, setSinglePost] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { slug } = useParams(); // Get the slug from the URL parameters


    useEffect(() => {
        const query = `*[ _type == "post" && slug.current == "${slug}"] {
        title,
        slug,
        body,
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
          publishedAt,
        "author": author->name,
        "imageUrl": author->image
      }`;

        client.fetch(query)
            .then((data) => {
                setSinglePost(data[0]);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setIsLoading(false);
            });
    }, [slug]);
    const [error, setError] = useState(null);
    const [recommendedPosts, setRecommendedPosts] = useState([]);
    const [latestPosts, setLatestPosts] = useState([]);


    useEffect(() => {
        const fetchRecommendedPosts = async () => {
            const query =
                `
        *[_type == "post" ] | order(_createdAt desc){
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
          title,
          slug
        },
        subcategories[]->{
          title,
          slug
        },
        "author": author->name
        } `
            try {
                const results = await client.fetch(query);
                setLatestPosts(results)
                const politicsPost = results.filter(post => post.categories?.some(sub => sub.title == singlePost.categories?.map(category => category.title)));
                setRecommendedPosts(politicsPost);
            } catch (err) {
                setError(err);
                setIsLoading(false);
            }
        };

        fetchRecommendedPosts();

    }, [singlePost])


    const FourrecommendedPosts = recommendedPosts.reverse().slice(0, 4);
    const FourletestPosts = latestPosts.reverse().slice(0, 4);



    function formatDate(timestamp) {
        const publishedDate = new Date(timestamp);
        const now = new Date();
        const diffInMilliseconds = now - publishedDate;

        const seconds = Math.floor(diffInMilliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours
            / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(days
            / 365);

        if (seconds < 60) {
            return `${seconds} seconds ago`;
        } else if (minutes < 60) {
            return `${minutes} minutes ago`;
        } else if (hours < 24) {
            return `${hours} hours ago`;
        } else if (days < 30) {
            return `${days} days ago`;
        } else if (months < 12) {
            return `${months} months ago`;
        } else {
            return `${years} years ago`;
        }
    }

    const formattedDate = formatDate(singlePost.publishedAt);




    return (

        <div className={styles.container}>
            <HeadSection />
            <div className={styles.Details}>
                {isLoading ? (<p className={styles.loading}>Loading...</p>) : singlePost ? (
                    <div className={styles.postdetsils}>

                        {singlePost.subcategories ? (
                            <Link to={`/category/${singlePost.subcategories?.map(category => category.slug?.current)}`}>
                                <p className={styles.category}>{singlePost.subcategories?.map(category => category.title).join(',')}</p>
                            </Link>
                        ) : (
                            <Link to={`/category/${singlePost.categories?.map(category => category.slug?.current)}`}>
                                <p className={styles.category}>{singlePost.categories?.map(category => category.title).join(',')}</p>
                            </Link>
                        )}

                        <div className={styles.title}>
                            <h1>{singlePost?.title}</h1>
                        </div>

                        {singlePost.publishedAt && (
                            <small>{formattedDate}</small>
                        )}

                        <div className={styles.postImg}>
                            {singlePost.mainImage && singlePost.mainImage.asset && (
                                <img src={singlePost.mainImage.asset.url} alt={singlePost.title} />
                            )}
                        </div>

                        {singlePost.author ? (
                            <div className={styles.Blog_author}>
                                <div className={styles.author}>
                                    <div className={styles.authorImg}>
                                        {singlePost.imageUrl && (
                                            <img src={urlFor(singlePost.imageUrl)} alt={singlePost.author} />
                                        )}
                                    </div>
                                    <p>Author: {singlePost.author}</p>
                                </div>
                                    <YourComponent singlePost={singlePost} />
                                </div>
                        ) : <p>no auther</p>}

                    </div>
                ) : (
                    <p>Post not found</p>
                )}

                {FourrecommendedPosts && FourrecommendedPosts.length > 1 ? (
                    <div className={styles.recomonded}>
                        <div className={styles.title}>
                            <h1>Recomonmded</h1>
                        </div>
                        {FourrecommendedPosts.map((post) => (
                            <div className={styles.story} key={post.slug.current}>
                                <div className={styles.image}>
                                    <img src={post.mainImage.asset.url} alt="" />
                                </div>
                                <div className={styles.Title}>
                                    <div className={styles.detail}>

                                        {post.subcategories ? (
                                            <Link to={`/category/${post.subcategories?.map(category => category.slug.current)}`}>
                                                <p className={styles.category}>{post.subcategories.map(category => category.title).join(',')}</p>
                                            </Link>
                                        ) : (
                                            <Link to={`/category/${post.categories?.map(category => category.slug.current)}`}>
                                                <p className={styles.category}>{post.categories.map(category => category.title).join(',')}</p>
                                            </Link>
                                        )}

                                        <small className={styles.author}>{post.author}</small>
                                    </div>
                                    <h2>
                                        <Link to={`/detail/${post.slug?.current}`}>{post.title}</Link>
                                    </h2>
                                </div>
                            </div>
                        ))
                        }
                    </div >
                ) : (
                    <div className={styles.recomonded}>
                        <div className={styles.title}>
                            <h1>Recomonmded</h1>
                        </div>
                        {FourletestPosts.map((post) => (
                            <div className={styles.story} key={post.slug.current}>
                                <div className={styles.image}>
                                    <img src={post.mainImage.asset.url} alt="" />
                                </div>
                                <div className={styles.Title}>
                                    <div className={styles.detail}>

                                        {post.subcategories ? (
                                            <Link to={`/category/${post.subcategories?.map(category => category.slug.current)}`}>
                                                <p className={styles.category}>{post.subcategories.map(category => category.title).join(',')}</p>
                                            </Link>
                                        ) : (
                                            <Link to={`/category/${post.categories?.map(category => category.slug.current)}`}>
                                                <p className={styles.category}>{post.categories.map(category => category.title).join(',')}</p>
                                            </Link>
                                        )}

                                        <small className={styles.author}>{post.author}</small>
                                    </div>
                                    <h2>
                                        <Link to={`/detail/${post.slug?.current}`}>{post.title}</Link>
                                    </h2>
                                </div>
                            </div>
                        ))
                        }
                    </div >
                )}
            </div>
        </div>

    )
}

export default Details