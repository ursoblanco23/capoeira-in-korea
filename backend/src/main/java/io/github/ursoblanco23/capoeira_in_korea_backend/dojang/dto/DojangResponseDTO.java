package io.github.ursoblanco23.capoeira_in_korea_backend.dojang.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.github.ursoblanco23.capoeira_in_korea_backend.dojang.entity.Dojang;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DojangResponseDTO {
    private Long id;
    private String name;
    private String zipCode;
    private String roadAddress;
    private String detailAddress;
    private String sidoName;
    private String sigunguName;
    private String eupmyeondongName;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String phone;
    private String priceRange;
    private String instructorName;
    private String description;
    private Long registrantId;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDateTime createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDateTime updatedAt;

    // Entity에서 DTO로 변환하는 정적 메서드
    public static DojangResponseDTO from(Dojang dojang) {
        return DojangResponseDTO.builder()
                .id(dojang.getId())
                .name(dojang.getName())
                .zipCode(dojang.getZipCode())
                .roadAddress(dojang.getRoadAddress())
                .detailAddress(dojang.getDetailAddress())
                .sidoName(dojang.getSidoName())
                .sigunguName(dojang.getSigunguName())
                .eupmyeondongName(dojang.getEupmyeondongName())
                .latitude(dojang.getLatitude())
                .longitude(dojang.getLongitude())
                .phone(dojang.getPhone())
                .priceRange(dojang.getPriceRange())
                .instructorName(dojang.getInstructorName())
                .description(dojang.getDescription())
                .registrantId(dojang.getRegistrantId())
                .createdAt(dojang.getCreatedAt())
                .updatedAt(dojang.getUpdatedAt())
                .build();
    }
}
