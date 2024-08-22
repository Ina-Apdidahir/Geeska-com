
import TopStories from './TopStories'
import SideStories from './SideStories'
import styles from './TopStories.module.css'

function Hero() {
    return (
        <div className={styles.container}>
            <div className={styles.stories}>
                <TopStories />
                <SideStories />
            </div>
        </div>
    )
}

export default Hero