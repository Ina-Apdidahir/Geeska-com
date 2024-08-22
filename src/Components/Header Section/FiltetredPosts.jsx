// src/components/SearchComponent.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import style from './Header.module.css';
import close from '../../assets/web images/close.png';
import search from '../../assets/web images/search.png';

const SearchComponent = ({ posts, showSearch, handleSearchClose }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery)
    );

    return (
        <div className={`${style.search_side} ${showSearch ? style.search_show : ''}`}>
            <div className={style.close}>
                <img className={style.search__close} src={close} onClick={handleSearchClose} alt="Close" />
            </div>
            <form className={style.search__form}>
                <img className={style.search_icon} src={search} alt="Search Icon" />
                <input
                    type="search"
                    placeholder="What are you looking for?"
                    className={style.search__input}
                    id="search_input"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                />
            </form>

            <div className={style.filteredPosts}>
                {filteredPosts.length > 0 && searchQuery.length > 0 ? (
                    filteredPosts.map(post => (
                        <div key={post._id} className={style.post}>
                            {post.mainImage?.asset?.url ? (
                                <img src={post.mainImage.asset.url} alt="post img" />
                            ) : (
                                <p>No image available</p>
                            )}
                            <p>
                                <Link to={`/detail/${post?.slug?.current}`} onClick={handleSearchClose}>
                                    {post.title}
                                </Link>
                            </p>
                        </div>
                    ))
                ) : (
                    <p>No posts found</p>
                )}
            </div>
        </div>
    );
};

export default SearchComponent;
