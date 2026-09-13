package io.github.ursoblanco23.capoeira_in_korea_backend.auth.repository;

import io.github.ursoblanco23.capoeira_in_korea_backend.auth.entity.UserRefreshToken;

import java.time.Instant;
import java.util.Optional;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRefreshTokenRepository extends JpaRepository<UserRefreshToken, Long> {

    Optional<UserRefreshToken> findByRefreshTokenHash(String refreshTokenHash);

    // 활성 토큰만 + 동시성 방지용 락
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        select t
        from UserRefreshToken t
        join fetch t.user u
        where t.refreshTokenHash = :hash
          and t.revokedAt is null
          and t.expiresAt > :now
    """)
    Optional<UserRefreshToken> findActiveByHashForUpdate(
            @Param("hash") String hash,
            @Param("now") Instant now
    );

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
        update UserRefreshToken t
        set t.revokedAt = :now
        where t.user.id = :userId
          and t.revokedAt is null
    """)
    int revokeAllActiveByUserId(@Param("userId") Long userId, @Param("now") Instant now);

    void deleteAllByUser_Id(Long userId);
}
