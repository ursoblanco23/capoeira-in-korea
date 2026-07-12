package io.github.ursoblanco23.capoeira_in_korea_backend.dojang.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class DojangFormDTO {
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
    private String altText;
}
