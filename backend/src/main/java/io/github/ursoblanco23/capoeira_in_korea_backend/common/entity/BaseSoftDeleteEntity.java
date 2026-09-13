package io.github.ursoblanco23.capoeira_in_korea_backend.common.entity;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;

@Getter
@MappedSuperclass
@RequiredArgsConstructor
public abstract class BaseSoftDeleteEntity extends BaseTimeEntity {

    @Column(name = "deleted_at")
    private Instant deletedAt;

    public void softDelete(Instant now) {
        this.deletedAt = now;
    }

    public void restore() {
        this.deletedAt = null;
    }

    public boolean isDeleted() {
        return this.deletedAt != null;
    }
}
