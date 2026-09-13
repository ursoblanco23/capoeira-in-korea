package io.github.ursoblanco23.capoeira_in_korea_backend.dojang.dto;

import io.github.ursoblanco23.capoeira_in_korea_backend.common.dto.AddressResponse;
import io.github.ursoblanco23.capoeira_in_korea_backend.dojang.constants.DojangStatus;
import io.github.ursoblanco23.capoeira_in_korea_backend.dojang.entity.Dojang;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Builder
public class DojangResponseDTO {

    private Long id;
    private String name;
    private AddressResponse address;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String phone;
    private String priceInfo;
    private String instructorName;
    private String description;
    private Long registrantId;
    private DojangStatus dojangStatus;
    private Instant createdAt;
    private Instant updatedAt;

    private String thumbnailUrl;

    // Entity에서 DTO로 변환하는 정적 메서드
    public static DojangResponseDTO from(
            Dojang dojang
            ,String thumbnailUrl
    ) {
        return DojangResponseDTO.builder()
                .id(dojang.getId())
                .name(dojang.getName())
                .address(AddressResponse.from(dojang.getAddress()))
                .latitude(dojang.getLatitude())
                .longitude(dojang.getLongitude())
                .phone(dojang.getPhone())
                .priceInfo(dojang.getPriceInfo())
                .instructorName(dojang.getInstructorName())
                .description(dojang.getDescription())
                .registrantId(dojang.getRegistrantId())
                .dojangStatus(dojang.getDojangStatus())
                .createdAt(dojang.getCreatedAt())
                .updatedAt(dojang.getUpdatedAt())
                .thumbnailUrl(thumbnailUrl)
                .build();
    }
}
