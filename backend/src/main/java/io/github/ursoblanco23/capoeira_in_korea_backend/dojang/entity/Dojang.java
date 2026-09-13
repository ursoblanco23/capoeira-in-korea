package io.github.ursoblanco23.capoeira_in_korea_backend.dojang.entity;

import io.github.ursoblanco23.capoeira_in_korea_backend.common.entity.Address;
import io.github.ursoblanco23.capoeira_in_korea_backend.common.entity.BaseSoftDeleteEntity;
import io.github.ursoblanco23.capoeira_in_korea_backend.dojang.constants.DojangStatus;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "capoeira_dojangs")
public class Dojang extends BaseSoftDeleteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @NotNull
    @Digits(integer = 2, fraction = 8)
    @DecimalMin("-90.00000000")
    @DecimalMax("90.00000000")
    @Column(name = "latitude", nullable = false, precision = 10, scale = 8)
    private BigDecimal latitude;

    @NotNull
    @Digits(integer = 3, fraction = 8)
    @DecimalMin("-180.00000000")
    @DecimalMax("180.00000000")
    @Column(name = "longitude", nullable = false, precision = 11, scale = 8)
    private BigDecimal longitude;

    @Size(max = 20)
    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "price_info", columnDefinition = "TEXT")
    private String priceInfo;

    @Size(max = 50)
    @Column(name = "instructor_name", length = 50)
    private String instructorName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @NotNull
    @Column(name = "registrant_id", nullable = false)
    private long registrantId;

    @Enumerated(EnumType.STRING)
    @Column(name = "dojang_status", nullable = false, length = 20)
    private DojangStatus dojangStatus;

    @Valid
    @Embedded
    private Address address;


    @Builder
    private Dojang(
            String name,
            BigDecimal latitude,
            BigDecimal longitude,
            String phone,
            String priceInfo,
            String instructorName,
            String description,
            Long registrantId,
            Address address,
            DojangStatus dojangStatus
    ) {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.phone = phone;
        this.priceInfo = priceInfo;
        this.instructorName = instructorName;
        this.description = description;
        this.registrantId = registrantId;
        this.address = address;
        this.dojangStatus = DojangStatus.ACTIVE;
    }

    public static Dojang create(
            String name,
            Address address,
            BigDecimal latitude,
            BigDecimal longitude,
            String phone,
            String priceInfo,
            String instructorName,
            String description,
            Long registrantId
    ) {
        return new Dojang(
                name,
                latitude,
                longitude,
                phone,
                priceInfo,
                instructorName,
                description,
                registrantId,
                address,
                DojangStatus.ACTIVE
        );
    }

    public void hide() {
        this.dojangStatus = DojangStatus.HIDDEN;
    }

    public void activate() {
        if (isDeleted()) {
            throw new IllegalStateException("삭제된 도장은 바로 활성화할 수 없습니다.");
        }

        this.dojangStatus = DojangStatus.ACTIVE;
    }

    public void delete(Instant now) {
        this.dojangStatus = DojangStatus.DELETED;
        softDelete(now);
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
            Address address,
            BigDecimal latitude,
            BigDecimal longitude,
            String phone,
            String priceInfo,
            String instructorName,
            String description
    ) {
        this.name = name;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.phone = phone;
        this.priceInfo = priceInfo;
        this.instructorName = instructorName;
        this.description = description;
    }
}
