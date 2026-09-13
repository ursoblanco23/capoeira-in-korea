package io.github.ursoblanco23.capoeira_in_korea_backend.common.dto;

import io.github.ursoblanco23.capoeira_in_korea_backend.common.entity.Address;

public record AddressResponse(
        String zipCode,
        String roadAddress,
        String detailAddress,
        String sidoName,
        String sigunguName,
        String eupmyeondongName
) {
    public static AddressResponse from(Address address) {
        return new AddressResponse(
                address.getZipCode(),
                address.getRoadAddress(),
                address.getDetailAddress(),
                address.getSidoName(),
                address.getSigunguName(),
                address.getEupmyeondongName()
        );
    }
}
