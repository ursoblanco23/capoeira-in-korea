import type {AddressDto} from "@/services/api/types/AddressDto.ts";

export function isAddressEmpty(address: AddressDto): boolean {
    return Object.values(address).every((value) => !value.trim());
}

export function isAddressComplete(address: AddressDto): boolean {
    return Object.values(address).every((value) => value.trim().length > 0);
}

export function toNullableAddress(address: AddressDto): AddressDto | null {
    if (isAddressEmpty(address) || !isAddressComplete(address)) {
        return null;
    }

    return {
        zipCode: address.zipCode.trim(),
        roadAddress: address.roadAddress.trim(),
        detailAddress: address.detailAddress.trim(),
        sidoName: address.sidoName.trim(),
        sigunguName: address.sigunguName.trim(),
        eupmyeondongName: address.eupmyeondongName.trim(),
    };
}
