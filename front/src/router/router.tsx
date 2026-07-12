import {createBrowserRouter, Navigate, Outlet} from 'react-router-dom';
import Layout from "../components/layout/Layout";
import Home from "../pages/Home";
import Test from "../Test";
import NotFound from "../pages/NotFound.tsx";
import {PAGE} from "@/constants/routes.ts";
import DojangManage from "@/pages/DojangManage.tsx";
import DojangCreate from "@/pages/DojangCreate.tsx";
import DojangUpdate from "@/pages/DojangUpdate.tsx";
import RequireRole from "@/components/auth/RequireRole.tsx";
import Unauthorized from "@/pages/Unauthorized.tsx";
import DojangDetail from "@/pages/DojangDetail.tsx";
import Login from "@/pages/Login.tsx";
import SignupPage from "@/pages/SignupPage.tsx";
import {MyPage} from "../pages/my-page/MyPage.tsx"; // type으로만 쓰이고 있으면 import type 으로 변경하라는데 아래에서 쓰이고 있음.

const router = createBrowserRouter([
    {
        element: <Layout />, // 공통 레이아웃을 여기에 정의
        children: [
            {
                path: PAGE.HOME,
                element: <Home />,
            },
            {
                path: PAGE.LOGIN,
                element: <Login />,
            },
            {
                path: PAGE.MY_PAGE,
                element: <MyPage />
            },
            {
                path: PAGE.DOJANG(':id'),
                element: <DojangDetail />
            },
            {
                path: PAGE.ADMIN_DOJANG,
                element: (
                    <RequireRole allowedRoles={['dojang_admin', 'site_admin']}>
                        <Outlet />
                    </RequireRole>
                ),
                children: [
                    {
                        path: '',
                        element: <DojangManage />,
                    },
                    {
                        path: PAGE.ADMIN_DOJANG_REGIST,
                        element: <DojangCreate />,
                    },
                    {
                        path: PAGE.ADMIN_DOJANG_EDIT(':id'),
                        element: <DojangUpdate />,
                    },
                ]
            },
            {
                path: PAGE.SIGN_UP,
                element: <SignupPage />,
            },
        ],
    },
    // 레이아웃이 적용되지 않는 라우트들
    {
        path: '/test',
        element: <Test />,
    },
    // unauthorized 페이지
    { path: '/unauthorized', element: <Unauthorized /> },
    // 404 페이지
    { path: '/not-found', element: <NotFound /> },
    {
        path: '*',
        element: <Navigate to="/not-found" replace />
    },
]);

export default router;