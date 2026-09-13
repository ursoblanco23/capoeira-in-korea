import DojangCardSection from "@/components/features/Home/FindDojang/components/DojangCardSection.tsx";
import {useMemo} from "react";
import {Link} from "react-router-dom";
import {PAGE} from "@/constants/routes.ts";
import {useAuthStore} from "@/stores/authStore.ts";
import {ROLE} from "@/constants/role.ts";
import {useDojangsQuery} from "@/hooks/queries/useDojangsQuery.ts";

const DojangManage = () => {
    const {data: dojangList = [], isPending, isError} = useDojangsQuery();
    const me = useAuthStore((state) => state.me);

    const myDojangs = useMemo(() => {
        if (!me) {
            return [];
        }

        const isSiteAdmin = me.roles.some(
            (role) => role.roleName === ROLE.SITE_ADMIN
        );

        if (isSiteAdmin) {
            return dojangList;
        }

        return dojangList.filter(
            (dojang) => dojang.registrantId === me.id
        );
    }, [dojangList, me]);

  return (
    <main className="py-16">
        <div className="container mx-auto px-4">
            <div className='flex justify-between align-center mb-6'>
                <h3 className="text-2xl font-bold">내가 등록한 도장 목록</h3>
                <Link to={PAGE.ADMIN_DOJANG_REGISTER} className="font-bold px-4 py-2 bg-primary text-white hover:bg-primary/90 transition-colors rounded-lg whitespace-nowrap">
                    도장 등록하기
                </Link>
            </div>
            {isPending
                ? <div>도장 정보를 불러오는 중입니다.</div>
                : isError && dojangList.length === 0
                    ? <div>도장 정보를 불러오지 못했습니다.</div>
                    : myDojangs.length > 0
                        ? <DojangCardSection dojangList={myDojangs} isAdmin={true}/>
                : <div>등록된 도장이 없습니다.</div>
            }
        </div>
    </main>
  )
}

export default DojangManage;