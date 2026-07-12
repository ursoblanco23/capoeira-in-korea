import { RouterProvider } from 'react-router-dom'
import './assets/styles/App.css'
import router from "./router/router.tsx";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {Bounce, ToastContainer} from "react-toastify";
import {AuthInitializer} from "@/components/auth/AuthInitializer.tsx";

const queryClient = new QueryClient({
   defaultOptions: {
       queries: {
           retry: false,
       },
       mutations: {
           retry: false,
       },
   },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthInitializer/>

            {/*TODO: ToastContainer 이후에 입맛에 맞게 커스텀 하기.*/}
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />

            <RouterProvider router={router} />
        </QueryClientProvider>
        );

}

export default App
