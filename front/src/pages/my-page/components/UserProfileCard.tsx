import type { UserMeDto } from "src/services/api/user/types/UserMeDto.ts";
import { useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import {userService} from "@/services/api/user/service/userService.ts";
import type {ProfileImageForm} from "@/services/api/user/types/ProfileImageForm.ts";
import {resolveMediaUrl} from "@/utils/media.ts";


type Props = {
    me: UserMeDto;
};

export const UserProfileCard = ({ me }: Props) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [profileImgForm, setProfileImgForm] = useState<ProfileImageForm>({
        file: null,
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const profileImageSrc = useMemo(() => {
        return previewUrl ?? me.profileImgUrl ?? null;
    }, [previewUrl, me.profileImgUrl]);

    const handleProfileEditClick = () => {
        fileInputRef.current?.click();
    };

    const handleProfileImageChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            toast.error("이미지 파일만 업로드할 수 있습니다.");
            return;
        }

        setProfileImgForm({
            file,
        });

        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
    };

    const handleProfileImageUpload = async () => {
        if (!profileImgForm.file) {
            toast.info("업로드할 프로필 이미지를 선택해주세요.");
            return;

        }

        // TODO: profileImgForm.file을 FormData로 만들어줘야함.
        const formData = new FormData();
        formData.append("file", profileImgForm.file);

        try {
            setIsUploading(true);

            await userService.updateProfileImage(formData);

            toast.success("프로필이 등록되었습니다.");
        } catch (err: any) {
            toast.error(err?.message ?? "프로필 이미지 등록에 실패했습니다.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <aside className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
                <button
                    type="button"
                    onClick={handleProfileEditClick}
                    className="relative h-24 w-24 overflow-hidden rounded-full bg-primary/10 text-3xl font-bold text-primary"
                    aria-label="프로필 이미지 선택"
                >
                    {profileImageSrc ? (
                        <img
                            src={profileImageSrc}
                            alt={`${me.nickname} 프로필 이미지`}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <span className="flex h-full w-full items-center justify-center">
                            {me.nickname.charAt(0)}
                        </span>
                    )}

                    <span className="absolute inset-x-0 bottom-0 bg-black/40 py-1 text-xs font-medium text-white">
                        수정
                    </span>
                </button>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfileImageChange}
                />

                <h2 className="mt-4 text-xl font-bold text-gray-900">
                    {me.nickname}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    {me.email}
                </p>

                <div className="mt-4 flex flex-wrap justify-center gap-2 text-center">
                    {me.roles.map((role) => (
                        <span
                            key={role.id}
                            className="rounded-full bg-secondary/10 px-4 py-1 text-sm font-medium text-secondary"
                        >
                            {role.displayName}
                        </span>
                    ))}
                </div>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-6">
                <button
                    type="button"
                    disabled={isUploading || !profileImgForm.file}
                    className="w-full rounded-button border border-primary px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={handleProfileImageUpload}
                >
                    {isUploading ? "업로드 중..." : "프로필 수정"}
                </button>
            </div>
        </aside>
    );
};