
import Footer from '../FOOTER/Footer.jsx'
import HeadSection from "../Header Section/Header.jsx";
import YourComponent from "./Body Structure/Fonsizing.jsx";
import AuthorLatestPosts from './Author Posts/AuthorPosts.jsx'
import Related from "./Related/Related.jsx";

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
        subtitle,
        body,
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
          publishedAt,
        "author": author->name,
         "authorSlug": author->slug.current,
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

    const formattedDate = formatDate(singlePost?.publishedAt);

    if (isLoading) {
        <p className={styles.loading}>Loading...</p>
    }


    // Helper function to get category CSS class based on category title
    const getCategoryClass = (categoryTitle) => {
        switch (categoryTitle.toLowerCase()) {
            case 'culture':
                return styles.Culture;
            case 'politics':
                return styles.Politics;
            case 'interviews':
                return styles.Interviews;
            case 'multimedia':
                return styles.Multimedia;
            case 'opinion':
                return styles.Opinion;
            default:
                return styles.defaultCategory;
        }
    };



    const [video, setVideo] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            const query = `*[ _type == "multimeda"  && slug.current == "${slug}"] | order(_createdAt desc) {
                title,
                body,
                slug,
                youtubeUrl
              }`;

            try {
                const data = await client.fetch(query);
                setVideo(data[0]);
                setIsLoading(false);
            } catch (err) {
                setError(err);
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, [slug]);


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
        <div className={styles.container}>
            <HeadSection />
            <div className={styles.Details}>
                {singlePost ? (
                    <div className={styles.postdetsils}>

                        <div className={styles.categoriesContainer}>
                            {(singlePost.subcategories || singlePost.categories)?.map((category) => (
                                <Link
                                    key={category.slug.current}
                                    to={`/category/${category.slug.current}`}
                                    className={`${styles.category} ${getCategoryClass(category.title)}`}
                                >
                                    {category.title}
                                </Link>
                            ))}
                        </div>

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
                                    <Link to={`/author/${singlePost?.authorSlug}`}>
                                        <div className={styles.authorImg}>
                                            {singlePost.imageUrl && (
                                                <img src={urlFor(singlePost.imageUrl)} alt={singlePost.author} />
                                            )}
                                        </div>
                                        <p>{singlePost.author}</p>
                                    </Link>
                                </div>
                                <YourComponent singlePost={singlePost} />
                                <AuthorLatestPosts
                                    authorSlug={singlePost?.authorSlug}
                                    authorName={singlePost?.author}
                                />
                            </div>
                        ) : ''}

                    </div>
                ) : (
                    <div className={styles.postdetsils}>

                        <div className={styles.title}>
                            <h1>{video?.title}</h1>
                        </div>

                        <div className={styles.video}>
                            <iframe
                                // width="100%"
                                // height="100%"
                                src={getEmbedUrl(video?.youtubeUrl)}
                                title={video?.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>

                        <YourComponent singlePost={video} />
                    </div>
                )}

                <Related singlePost={singlePost} />
            </div>

        </div>

        <Footer />
        </>
    )
}

export default Details