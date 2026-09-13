package io.github.ursoblanco23.capoeira_in_korea_backend.common.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddressRequest {

    @Nullable
    @Size(max = 10)
    private String zipCode;

    @Nullable
    @Size(max = 200)
    private String roadAddress;

    @Nullable
    @Size(max = 200)
    private String detailAddress;

    @Nullable
    @Size(max = 30)
    private String sidoName;

    @Nullable
    @Size(max = 30)
    private String sigunguName;

    @Nullable
    @Size(max = 50)
    private String eupmyeondongName;

    public boolean hasMissingValue() {
        return isBlank(zipCode)
                || isBlank(roadAddress)
                || isBlank(detailAddress)
                || isBlank(sidoName)
                || isBlank(sigunguName)
                || isBlank(eupmyeondongName);
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
