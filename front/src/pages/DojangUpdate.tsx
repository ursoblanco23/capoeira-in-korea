import DojangForm from "@/components/features/Dojang/DojangForm.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "react-toastify";
import {extractErrorMessage} from "@/utils/error.ts";
import dojangService from "@/services/api/services/dojangService.ts";
import {dojangQueryKeys, useDojangQuery} from "@/hooks/queries/useDojangsQuery.ts";

const DojangUpdate = () => {
    const { dojangId } = useParams<{ dojangId: string }>();
    const parsedDojangId = Number(dojangId);
    const validDojangId =
        Number.isSafeInteger(parsedDojangId) && parsedDojangId > 0
            ? parsedDojangId
            : undefined;
    const {data: dojang, isPending, isError} =
        useDojangQuery(validDojangId);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({dojangId, submitData}: {dojangId: number, submitData: FormData}) => dojangService.updateDojang(submitData, dojangId),
        onSuccess: async ({updatedDojangId}) => {
            if (updatedDojangId) {
                toast.success('도장이 성공적으로 수정되었습니다!');

                await Promise.all([
                    queryClient.invalidateQueries({
                        queryKey: dojangQueryKeys.lists(),
                    }),
                    queryClient.invalidateQueries({
                        queryKey: dojangQueryKeys.detail(updatedDojangId),
                    }),
                ]);

                navigate(-1);
            }
        },
        onError: (error: any) => {
            console.error('도장 수정 실패 error: ', error);
            const errorMessage = extractErrorMessage(error) ?? "도장 수정에 실패했습니다. 관리자에게 문의해주세요.";
            toast.error(errorMessage);
        }
    });


    const handleSubmit = async (submitData: FormData) => {
        if (validDojangId === undefined) {
            toast.error("수정할 도장 정보가 올바르지 않습니다.");
            return;
        }

        await mutation.mutateAsync({
            submitData,
            dojangId: validDojangId,
        });
    };

    if (validDojangId === undefined) {
        return <div>잘못된 도장 ID입니다.</div>;
    }

    if (isPending) {
        return <div>도장 정보를 불러오는 중입니다.</div>;
    }

    if (isError || !dojang) {
        return <div>도장 정보를 불러오지 못했습니다.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Noto Sans KR' }}>
                            카포에라 도장 수정
                        </h1>
                    </div>

                    <DojangForm
                        key={dojang.id}
                        initialData={dojang ? {
                            ...dojang,
                            ...dojang.address,
                        } : undefined}
                        mode="update"
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
}

export default DojangUpdate;