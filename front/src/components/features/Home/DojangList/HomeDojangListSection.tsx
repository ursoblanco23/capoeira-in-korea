import DojangCardSection from "@/components/features/Home/FindDojang/components/DojangCardSection.tsx";
import {useDojangsQuery} from "@/hooks/queries/useDojangsQuery.ts";

const HomeDojangListSection = () => {
    const {data: dojangList = [], isPending, isError} = useDojangsQuery();

    return (
        <section className="bg-gray-50 pb-16">
            <div className="container mx-auto px-4">
                <h2 className="mb-6 text-2xl font-bold">이런 도장은 어떠신가요?</h2>

                {isPending && (
                    <div className="text-gray-600">도장 정보를 불러오는 중입니다.</div>
                )}

                {isError && dojangList.length === 0 && (
                    <div className="text-red-600">도장 정보를 불러오지 못했습니다.</div>
                )}

                {!isPending && !isError && dojangList.length === 0 && (
                    <div className="text-gray-600">등록된 도장이 없습니다.</div>
                )}

                {dojangList.length > 0 && (
                    <DojangCardSection dojangList={dojangList}/>
                )}
            </div>
        </section>
    );
};

export default HomeDojangListSection;
