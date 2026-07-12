// import React from "react";

import Header from "./Header.tsx";
import {Outlet} from "react-router-dom";
import Footer from "./Footer.tsx";
import {useSmoothScroll} from "../../hooks/useSmoothScroll.ts";

const Layout = () => {
    useSmoothScroll(80);

    return (
        <div>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default Layout;