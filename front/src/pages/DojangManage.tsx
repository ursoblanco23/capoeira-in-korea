import DojangCardSection from "@/components/features/Home/FindDojang/components/DojangCardSection.tsx";
import {useDojangList} from "@/stores/dojangStore.ts";
import {useEffect, useState} from "react";
import type {Dojang} from "@/types/dojang.ts";
import {Link, useNavigate} from "react-router-dom";
import {PAGE} from "@/constants/routes.ts";
import {useUser} from "@/services/api/user/store/userStore.ts";
import {toast} from "react-toastify";

const DojangManage = () => {
    const dojangList = useDojangList();
    const [myDojangs, setMyDojangs] = useState<Dojang[]>([]);
    const user = useUser();
    const navigate = useNavigate();

    // 사용자 인증 및 권한 체크
    useEffect(() => {
        console.log('DojangManage useEffect - user:', user);

        if (!user) {
            toast.error('로그인이 필요합니다.');
            navigate('/login');
            return;
        }
        
        const hasAdminRole = user.roles.some(role =>
            role === 'dojang_admin' || role === 'site_admin'
        );
        
        if (!hasAdminRole) {
            toast.error('접근 권한이 없습니다. 관리자에게 문의해주세요.');
            navigate('/unauthorized');
            return;
        }
    }, [user, navigate]);

    useEffect(() => {
        // 사이트 관리자의 경우 모든 도장 리스트 보여줌.
        if (user?.roles.includes('site_admin')) {
            setMyDojangs(dojangList);
        } else {
            const res = dojangList.filter((dojang) => dojang.registrantId === user!.id)
            setMyDojangs(res);
        }
    }, [dojangList, user]);

  return (
    <main className="py-16">
        <div className="container mx-auto px-4">
            <div className='flex justify-between align-center mb-6'>
                <h3 className="text-2xl font-bold">내가 등록한 도장 목록</h3>
                <Link to={PAGE.ADMIN_DOJANG_REGIST} className="font-bold px-4 py-2 bg-primary text-white hover:bg-primary/90 transition-colors rounded-lg whitespace-nowrap">
                    도장 등록하기
                </Link>
            </div>
            { (myDojangs.length > 0)
                ? <DojangCardSection dojangList={myDojangs} isAdmin={true}/>
                : <div>등록된 도장이 없습니다.</div>
            }
        </div>
    </main>
  )
}

export default DojangManage;