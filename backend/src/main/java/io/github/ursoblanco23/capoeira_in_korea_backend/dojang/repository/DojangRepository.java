package io.github.ursoblanco23.capoeira_in_korea_backend.dojang.repository;

import io.github.ursoblanco23.capoeira_in_korea_backend.dojang.entity.Dojang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DojangRepository extends JpaRepository<Dojang, Long> {

    // 검색 키워드: 이름 or 도로명 or 상세주소
    List<Dojang> findByNameContainingIgnoreCaseOrRoadAddressContainingIgnoreCaseOrDetailAddressContainingIgnoreCase(
            String name, String roadAddress, String detailAddress
    );

    /**
     * 도장 중복 검사
     * @param name
     * @param roadAddress
     * @return
     */
    Boolean existsByNameAndRoadAddress(String name, String roadAddress);
}

