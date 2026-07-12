package io.github.ursoblanco23.capoeira_in_korea_backend.common.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Embeddable
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Address {

    @Column(name = "zip_code", length = 10)
    private String zipCode;

    @Column(name = "road_address", length = 100)
    private String roadAddress;

    @Column(name = "detail_address", length = 100)
    private String detailAddress;

    @Column(name = "sido_name", length = 30)
    private String sidoName;

    @Column(name = "sigungu_name", length = 50)
    private String sigunguName;

    @Column(name = "eupmyeondong_name", length = 50)
    private String eupmyeondongName;

    @Builder
    private Address(
            String zipCode,
            String roadAddress,
            String detailAddress,
            String sidoName,
            String sigunguName,
            String eupmyeondongName
    ) {
        this.zipCode = zipCode;
        this.roadAddress = roadAddress;
        this.detailAddress = detailAddress;
        this.sidoName = sidoName;
        this.sigunguName = sigunguName;
        this.eupmyeondongName = eupmyeondongName;
    }

    public static Address of(
            String zipCode,
            String roadAddress,
            String detailAddress,
            String sidoName,
            String sigunguName,
            String eupmyeondongName
    ) {
        return new Address(
                zipCode,
                roadAddress,
                detailAddress,
                sidoName,
                sigunguName,
                eupmyeondongName
        );
    }
}