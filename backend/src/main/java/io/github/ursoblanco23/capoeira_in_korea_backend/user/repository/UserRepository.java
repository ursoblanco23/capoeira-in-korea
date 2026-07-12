package io.github.ursoblanco23.capoeira_in_korea_backend.user.repository;

import io.github.ursoblanco23.capoeira_in_korea_backend.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findById(Long id);
    Optional<User> findByLoginId(String loginId);

    @Query("""
        select distinct u
        from User u
        left join fetch u.userRoles ur
        left join fetch ur.role
        where u.id = :userId
    """)
    Optional<User> findUserWithRolesById(@Param("userId") Long userId);

    boolean existsByLoginId(String loginId);
    boolean existsByEmail(String email);
    boolean existsByNickname(String nickname);
}
