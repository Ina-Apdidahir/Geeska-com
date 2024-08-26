
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import styles from './Author.module.css'

function Author(){

    const [singlePost, setSinglePost] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { slug } = useParams(); // Get the slug from the URL parameters


    useEffect(() => {
        const query = `*[ _type == "post" && slug.current == "${slug}"] {
        name,
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


    return(
        <></>
    )
}

export default Author