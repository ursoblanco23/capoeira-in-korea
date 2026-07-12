// import { useState } from "react";

import Hero from "@/components/features/Home/Hero/Hero.tsx";
import MainContents from "@/components/features/Home/MainContents/MainContents.tsx";
import Events from "../components/features/Home/Events/Events.tsx";
import CommunityHighlight from "../components/features/Home/CommunityHighlight/CommunityHighlight.tsx";
import Newsletter from "@/components/features/Home/NewsLetter/NewsLetter.tsx";
import FindDojang from "@/components/features/Home/FindDojang/FindDojang.tsx";

const Home = () => {

    return (
        <main>
            <Hero />
            <MainContents />
            <FindDojang />
            <Events />
            <CommunityHighlight />
            <Newsletter />
        </main>
    )
}

export default Home;