package io.github.ursoblanco23.capoeira_in_korea_backend.dojang.entity;

import io.github.ursoblanco23.capoeira_in_korea_backend.common.entity.BaseSoftDeleteEntity;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.entity.MediaFile;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

//TODO: capoeira_dojangs 테이블에서 thumbnail_id 칼럼 삭제했음 by 2026-07-03 user 쪽 작업 끝나고 다시 재정비 필요

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "capoeira_dojangs")
public class Dojang extends BaseSoftDeleteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "zip_code", length = 10)
    private String zipCode;

    @Column(name = "road_address", length = 100)
    private String roadAddress;

    @Column(name = "detail_address", length = 100)
    private String detailAddress;

    @Column(name = "sido_name", length = 30)
    private String sidoName;

    @Column(name = "sigungu_name", length = 30)
    private String sigunguName;

    @Column(name = "eupmyeondong_name", length = 50)
    private String eupmyeondongName;

    @Column(name = "latitude", nullable = false, precision = 10, scale = 8)
    private BigDecimal latitude;

    @Column(name = "longitude", nullable = false, precision = 11, scale = 8)
    private BigDecimal longitude;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "price_range", length = 50)
    private String priceRange;

    @Column(name = "instructor_name", length = 50)
    private String instructorName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "registrant_id", nullable = false)
    private Long registrantId;


    @Builder
    private Dojang(
            String name,
            String zipCode,
            String roadAddress,
            String detailAddress,
            String sidoName,
            String sigunguName,
            String eupmyeondongName,
            BigDecimal latitude,
            BigDecimal longitude,
            String phone,
            String priceRange,
            String instructorName,
            String description,
            Long registrantId
    ) {
        this.name = name;
        this.zipCode = zipCode;
        this.roadAddress = roadAddress;
        this.detailAddress = detailAddress;
        this.sidoName = sidoName;
        this.sigunguName = sigunguName;
        this.eupmyeondongName = eupmyeondongName;
        this.latitude = latitude;
        this.longitude = longitude;
        this.phone = phone;
        this.priceRange = priceRange;
        this.instructorName = instructorName;
        this.description = description;
        this.registrantId = registrantId;
    }

    public static Dojang create(
            String name,
            String zipCode,
            String roadAddress,
            String detailAddress,
            String sidoName,
            String sigunguName,
            String eupmyeondongName,
            BigDecimal latitude,
            BigDecimal longitude,
            String phone,
            String priceRange,
            String instructorName,
            String description,
            Long registrantId
    ) {
        return new Dojang(
                name,
                zipCode,
                roadAddress,
                detailAddress,
                sidoName,
                sigunguName,
                eupmyeondongName,
                latitude,
                longitude,
                phone,
                priceRange,
                instructorName,
                description,
                registrantId
        );
    }

    // 더 좋은 설계는 이렇게 쪼갤 수도 있다 (기준: “하나의 비즈니스 행위 단위”)
    /*
        updateLocation(...)
        updateContactInfo(...)
        updateDescription(...)
        changeThumbnail(...)
    * */
    public void updateBasicInfo(
            String name,
            String zipCode,
            String roadAddress,
            String detailAddress,
            String sidoName,
            String sigunguName,
            String eupmyeondongName,
            BigDecimal latitude,
            BigDecimal longitude,
            String phone,
            String priceRange,
            String instructorName,
            String description
    ) {
        this.name = name;
        this.zipCode = zipCode;
        this.roadAddress = roadAddress;
        this.detailAddress = detailAddress;
        this.sidoName = sidoName;
        this.sigunguName = sigunguName;
        this.eupmyeondongName = eupmyeondongName;
        this.latitude = latitude;
        this.longitude = longitude;
        this.phone = phone;
        this.priceRange = priceRange;
        this.instructorName = instructorName;
        this.description = description;
    }
}