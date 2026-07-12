import DojangForm from "@/components/features/Dojang/DojangForm.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useDojangStore, useFindDojangById} from "@/stores/dojangStore.ts";
import {useEffect, useState} from "react";
import type {Dojang} from "@/types/dojang.ts";
import {useMutation} from "@tanstack/react-query";
import {toast} from "react-toastify";
import {extractErrorMessage} from "@/utils/error.ts";
import dojangService from "@/services/api/services/dojangService.ts";

const DojangUpdate = () => {
    const { dojangId } = useParams<{ dojangId: string }>();
    const findDojangById = useFindDojangById();
    const [dojang, setDojang] = useState<Dojang>();
    const navigate = useNavigate();
    const fetchDojangs = useDojangStore((state) => state.fetchDojangs);

    const mutation = useMutation({
        mutationFn: ({dojangId, submitData}: {dojangId: number, submitData: FormData}) => dojangService.updateDojang(dojangId, submitData),
        onSuccess: ({updatedDojangId}) => {
            if (updatedDojangId) {
                toast.success('도장이 성공적으로 수정되었습니다!');
                fetchDojangs(true); // 도장 목록을 새로고침
                navigate(-1);
            }
        },
        onError: (error: any) => {
            console.error('도장 수정 실패 error: ', error);
            const errorMessage = extractErrorMessage(error) ?? "도장 수정에 실패했습니다. 관리자에게 문의해주세요.";
            toast.error(errorMessage);
        }
    });

    useEffect(() => {
        if (dojangId) {
            const dojangData = findDojangById(Number(dojangId));
            if (dojangData) {
                // console.log('DojangDetail with id', id, 'found:', dojangData);
                setDojang(dojangData);
            } else {
                console.error(`Dojang with id ${dojangId} not found.`);
            }
        }
    }, [dojangId]);

    const handleSubmit = async (dojangId:number, submitData: FormData) => {
        await mutation.mutateAsync({dojangId, submitData});
    };

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
                        dojangId={Number(dojangId)}
                        initialData={dojang}
                        mode="update"
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
}

export default DojangUpdate;