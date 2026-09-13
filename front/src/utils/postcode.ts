import type { AddressDto } from "@/services/api/types/AddressDto.ts";

type PostcodeSearchResult = {
    [Key in keyof Pick<
        AddressDto,
        | "zipCode"
        | "roadAddress"
        | "sidoName"
        | "sigunguName"
        | "eupmyeondongName"
    >]: NonNullable<AddressDto[Key]>;
};

export function openPostcodeSearch(
    onComplete: (address: PostcodeSearchResult) => void,
) {
    new window.daum.Postcode({
        oncomplete(data) {
            onComplete({
                zipCode: data.zonecode,
                roadAddress: data.roadAddress,
                sidoName: data.sido,
                sigunguName: data.sigungu,
                eupmyeondongName: data.bname,
            });
        },
    }).open();
}
