package io.github.ursoblanco23.capoeira_in_korea_backend.dojang.dto;

import io.github.ursoblanco23.capoeira_in_korea_backend.common.dto.AddressRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

/**
 * Dojnag create, updtae 요청의 body DTO
 */
@Data
public class DojangFormDTO {

    @NotBlank
    @Size(max = 100)
    private String name;

    @NotNull
    @Digits(integer = 2, fraction = 8)
    @DecimalMin("-90.00000000")
    @DecimalMax("90.00000000")
    private BigDecimal latitude;

    @NotNull
    @Digits(integer = 3, fraction = 8)
    @DecimalMin("-180.00000000")
    @DecimalMax("180.00000000")
    private BigDecimal longitude;

    @Size(max = 20)
    private String phone;

    private String priceInfo;

    @Size(max = 50)
    private String instructorName;

    private String description;

    private String altText;

    @Valid
    @NotNull
    private AddressRequest address;
}
