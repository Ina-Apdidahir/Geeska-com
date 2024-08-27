
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../../../../sanity_client/sanityClient';
import styles from './AuthorLatestPosts.module.css'; // Create a corresponding CSS module for styling

function AuthorLatestPosts({ authorSlug, authorName }) {
    const [latestPosts, setLatestPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLatestPosts = async () => {
            const query = `*[ _type == "post" && author->slug.current == "${authorSlug}"] | order(_createdAt desc)[0...3] {
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
                "author": author->name,
                publishedAt
            }`;

            try {
                const data = await client.fetch(query);
                setLatestPosts(data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching latest posts:', error);
                setIsLoading(false);
            }
        };

        fetchLatestPosts();
    }, [authorSlug]);

    if (isLoading) {
        return <p className={styles.loading}>Loading...</p>;
    }

    if (latestPosts.length < 0) {
        return <p className={styles.noPosts}>No recent posts by this author.</p>;
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



    return (
        <div className={styles.Related_to_Author}>
            <div className={styles.title}>
                <h1>More By the {authorName}</h1>
            </div>
            {latestPosts.map((post) => (
                <div className={styles.story} key={post.slug.current}>
                    <div className={styles.image}>
                        <Link className={styles.heading} to={`/detail/${post.slug?.current}`}>
                            <img src={post.mainImage.asset.url} alt="" />
                        </Link>
                    </div>
                    <div className={styles.Title}>
                        <div className={styles.detail}>

                            {(post.subcategories || post.categories)?.map((category) => (
                                <Link
                                    key={category.slug.current}
                                    to={`/category/${category.slug.current}`}
                                    className={`${styles.category} ${getCategoryClass(category.title)}`}
                                >
                                    {category.title}
                                </Link>
                            ))}

                            <small className={styles.author}>{post.author}</small>
                        </div>

                        <Link className={styles.heading} to={`/detail/${post.slug?.current}`}>
                            {post.title}
                        </Link>

                    </div>
                </div>
            ))
            }
        </div>
    );
}

export default AuthorLatestPosts;


{/* <h2>Latest Posts by This Author</h2>
<ul className={styles.postsList}>
    {latestPosts.map((post) => (
        <li key={post.slug} className={styles.postItem}>
            <Link to={`/post/${post.slug}`}>
                <div className={styles.postImage}>
                    {post.mainImage && (
                        <img src={post.mainImage.asset.url} alt={post.title} />
                    )}
                </div>
                <div className={styles.postDetails}>
                    <h3>{post.title}</h3>
                    <small>{new Date(post.publishedAt).toDateString()}</small>
                </div>
            </Link>
        </li>
    ))}
</ul> */}