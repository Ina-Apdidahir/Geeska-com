
import HeadSection from "../Header Section/Header"
import Hero from '../Hero section/Hero'
import Politics_Section from "../POLITICS/Politics_Section"
import Opinion_Section from "../OPINION/Opinion_Sec"
import Culture_Section from "../CULTURE/Culture_Sec"
import Multimedia from "../MULTIMEDIA/Multimedia"
import Interview_Section from "../INTERVIEWS/Interviews_Sec"
import Footer from "../FOOTER/Footer"

function LandingPage() {

    return (
        <>
            <HeadSection />
            <Hero />
            <Politics_Section />
            <Opinion_Section />
            <Culture_Section />
            <Multimedia />
            <Interview_Section />
            <Footer />
        </>
    )
}

export default LandingPage