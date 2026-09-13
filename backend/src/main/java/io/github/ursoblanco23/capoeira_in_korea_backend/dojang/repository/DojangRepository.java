package io.github.ursoblanco23.capoeira_in_korea_backend.dojang.repository;

import io.github.ursoblanco23.capoeira_in_korea_backend.dojang.entity.Dojang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DojangRepository extends JpaRepository<Dojang, Long> {

    /**
     * 삭제되지 않은 모든 도장을 조회한다.
     */
    List<Dojang> findAllByDeletedAtIsNullOrderByCreatedAtDescIdDesc();

    /**
     * 삭제되지 않은 도장 중에서 도장명, 도로명 주소 또는 상세 주소에
     * 검색어가 포함된 도장을 대소문자 구분 없이 조회한다.
     *
     * @param searchParam 도장명 또는 주소에서 검색할 문자열
     * @return 검색 조건과 일치하는 삭제되지 않은 도장 목록
     */
    @Query("""
            select dojang
            from Dojang dojang
            where dojang.deletedAt is null
              and (
                  lower(dojang.name) like lower(concat('%', :searchParam, '%'))
                  or lower(dojang.address.roadAddress) like lower(concat('%', :searchParam, '%'))
                  or lower(dojang.address.detailAddress) like lower(concat('%', :searchParam, '%'))
              )
            order by dojang.createdAt desc, dojang.id desc
            """)
    List<Dojang> searchByNameOrAddressAndDeletedAtIsNull(
            @Param("searchParam") String searchParam
    );

    /**
     * 도장 중복 검사
     * @param name
     * @param roadAddress
     * @param DetailAddress
     * @return
     */
    boolean existsByNameAndAddress_RoadAddressAndAddress_DetailAddressAndDeletedAtIsNull(
            String name, String roadAddress, String detailAddress
    );

    boolean existsByNameAndAddress_RoadAddressAndAddress_DetailAddressAndIdNotAndDeletedAtIsNull(
            String name, String roadAddress, String detailAddress, Long id
    );

    Optional<Dojang> findByIdAndDeletedAtIsNull(Long id);

}

