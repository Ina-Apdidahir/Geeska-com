import React, { useState } from 'react';
import { urlFor } from '../../../../sanity_client/sanityClient';
import { PortableText } from '@portabletext/react'; // Ensure you have PortableText imported
import styles from './bodystyle.module.css'; // Ensure your CSS module is properly imported


const YourComponent = ({ singlePost, video }) => {
    // State to control the current font size class
    const [fontSizeClass, setFontSizeClass] = useState(styles.fontNormal);

    // Function to increase the font size
    const increaseFontSize = () => {
        setFontSizeClass(styles.fontLarge);
    };

    // Function to decrease the font size
    const decreaseFontSize = () => {
        setFontSizeClass(styles.fontSmall);
    };


    // Function to share the post (placeholder function)
    const sharePost = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Check out this content!',
                text: 'Here is something I wanted to share with you.',
                url: window.location.href,
            })
                .then(() => console.log('Content shared successfully!'))
                .catch((error) => console.error('Error sharing content:', error));
        } else {
            console.error('Sharing not supported on this browser.');
        }
    };

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
            // Add other types as needed
        },
    };

    return (
        <>
            <div className={styles.userActions}>
                <div onClick={increaseFontSize} className={styles.action}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M5.55397 22H3.3999L10.9999 3H12.9999L20.5999 22H18.4458L16.0458 16H7.95397L5.55397 22ZM8.75397 14H15.2458L11.9999 5.88517L8.75397 14Z"></path>
                    </svg>
                </div>
                <div onClick={decreaseFontSize} className={styles.action}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M5.55397 22H3.3999L10.9999 3H12.9999L20.5999 22H18.4458L16.0458 16H7.95397L5.55397 22ZM8.75397 14H15.2458L11.9999 5.88517L8.75397 14Z"></path>
                    </svg>
                </div>

                <div onClick={sharePost} className={styles.action}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13.1202 17.0228L8.92129 14.7324C8.19135 15.5125 7.15261 16 6 16C3.79086 16 2 14.2091 2 12C2 9.79086 3.79086 8 6 8C7.15255 8 8.19125 8.48746 8.92118 9.26746L13.1202 6.97713C13.0417 6.66441 13 6.33707 13 6C13 3.79086 14.7909 2 17 2C19.2091 2 21 3.79086 21 6C21 8.20914 19.2091 10 17 10C15.8474 10 14.8087 9.51251 14.0787 8.73246L9.87977 11.0228C9.9583 11.3355 10 11.6629 10 12C10 12.3371 9.95831 12.6644 9.87981 12.9771L14.0788 15.2675C14.8087 14.4875 15.8474 14 17 14C19.2091 14 21 15.7909 21 18C21 20.2091 19.2091 22 17 22C14.7909 22 13 20.2091 13 18C13 17.6629 13.0417 17.3355 13.1202 17.0228ZM6 14C7.10457 14 8 13.1046 8 12C8 10.8954 7.10457 10 6 10C4.89543 10 4 10.8954 4 12C4 13.1046 4.89543 14 6 14ZM17 8C18.1046 8 19 7.10457 19 6C19 4.89543 18.1046 4 17 4C15.8954 4 15 4.89543 15 6C15 7.10457 15.8954 8 17 8ZM17 20C18.1046 20 19 19.1046 19 18C19 16.8954 18.1046 16 17 16C15.8954 16 15 16.8954 15 18C15 19.1046 15.8954 20 17 20Z"></path>
                    </svg>
                </div>
            </div>

            {singlePost.subtitle && (
                <h2 className={styles.subtitle}>{singlePost?.subtitle}</h2>
            )}
            <div className={styles.Blog_body}>
                {singlePost ? (
                    <div className={` ${styles.defaultFont} ${fontSizeClass}`}>
                        <PortableText value={singlePost?.body} components={components} />
                    </div>
                ) : (
                    <div className={` ${styles.defaultFont} ${fontSizeClass}`}>
                        <PortableText value={video?.body} components={components} />
                    </div>
                )}


            </div>
        </>
    );
};

export default YourComponent;
