
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import styles from './Related.module.css'

import client from '../../../../sanity_client/sanityClient';
// import { urlFor } from '../../../sanity_client/sanityClient';

function Related({ singlePost }) {

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
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
        <>

            {FourrecommendedPosts && FourrecommendedPosts.length > 0 ? (
                <div className={styles.recomonded}>
                    <div className={styles.title}>
                        <h1>Most read Articls</h1>
                    </div>
                    {FourrecommendedPosts.map((post) => (
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
                </div >
            ) : (
                <div className={styles.recomonded}>
                    <div className={styles.title}>
                        <h1>Related Posts</h1>
                    </div>
                    {FourletestPosts.map((post) => (
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
                </div >
            )}
        </>
    )
}

export default Related