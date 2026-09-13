import type { AddressDto } from "@/services/api/types/AddressDto.ts";
import type { Dojang } from "@/types/dojang.ts";

type AddressFormData = {
    [Key in keyof AddressDto]: NonNullable<AddressDto[Key]>;
};

export type DojangFormData = Pick<
    Dojang,
    | "id"
    | "name"
    | "phone"
    | "priceInfo"
    | "instructorName"
    | "latitude"
    | "longitude"
    | "description"
    | "thumbnailUrl"
> &
    AddressFormData
& {
    thumbnailImage: File | null;
    };
