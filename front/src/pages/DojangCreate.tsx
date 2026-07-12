import {useNavigate} from "react-router-dom";
import {dojangService} from "@/services/api/services/dojangService.ts";
import {extractErrorMessage} from "@/utils/error.ts";
import {useMutation} from "@tanstack/react-query";
import {toast} from "react-toastify";
import {useDojangStore} from "@/stores/dojangStore.ts";
import DojangForm from "@/components/features/Dojang/DojangForm.tsx";


const DojangCreate = () => {
    const navigate = useNavigate();
    const fetchDojangs = useDojangStore((state) => state.fetchDojangs);
    
    const mutation = useMutation({
        mutationFn: (formData: FormData) => dojangService.createDojang(formData),
        onSuccess: ({dojangId}) => {
            if (dojangId) {
                toast.success('도장이 성공적으로 등록되었습니다!');
                fetchDojangs(true);
                navigate(-1);
            }
        },
        onError: (error: any) => {
            console.error('도장 등록 실패 error: ', error);
            const errorMessage = extractErrorMessage(error) ?? "도장 등록에 실패했습니다. 관리자에게 문의해주세요.";
            toast.error(errorMessage);
        }
    });

    const handleSubmit = async (submitData: FormData) => {
        await mutation.mutateAsync(submitData);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Noto Sans KR' }}>
                            카포에라 도장 등록
                        </h1>
                        <p className="text-gray-600">새로운 카포에라 도장 정보를 등록해주세요.</p>
                    </div>

                    <DojangForm
                        mode="create"
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
};

export default DojangCreate;