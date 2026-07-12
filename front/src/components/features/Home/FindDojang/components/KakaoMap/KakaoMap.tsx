import '@/components/features/Home/FindDojang/components/KakaoMap/KakaoMap.scss';
import {useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {setKakaoMap} from "@/components/features/Home/FindDojang/components/KakaoMap/utils.ts";
import type {Dojang} from "@/types/dojang.ts";


const KakaoMap = ({ dojangs }: { dojangs: Dojang[] }) => {
    const navigate = useNavigate();
    const openOverlayRef = useRef<kakao.maps.CustomOverlay | null>(null);

    /* init */
    useEffect(() => {
        setKakaoMap();

        //unmount 시 cleanup 실행
        return () => {
            openOverlayRef.current = null;
        };
    }, []);

    /*dojangs 검색 및 카카오맵 세팅*/
    useEffect(() => {

        if (dojangs.length > 0) {
            setKakaoMap({dojangs, navigate, openOverlayRef});
        } else {
            setKakaoMap();
        }

        return () => {
            openOverlayRef.current = null;
        }
    }, [dojangs]);
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
            <div
                id="map"
                className="w-full h-96 bg-[url('https://public.readdy.ai/gen_page/map_placeholder_1280x720.png')] bg-center bg-cover"
            ></div>
        </div>
    );
};

export default KakaoMap;