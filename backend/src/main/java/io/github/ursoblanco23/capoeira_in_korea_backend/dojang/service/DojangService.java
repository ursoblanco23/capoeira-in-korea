package io.github.ursoblanco23.capoeira_in_korea_backend.dojang.service;

import io.github.ursoblanco23.capoeira_in_korea_backend.auth.security.UserPrincipal;
import io.github.ursoblanco23.capoeira_in_korea_backend.dojang.dto.DojangFormDTO;
import io.github.ursoblanco23.capoeira_in_korea_backend.dojang.dto.DojangResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DojangService {

    /**
     * 통합 검색 메서드
     * - searchParam 있으면 이름 or 도로명 or 상세주소 검색
     * - searchParam 없으면 전체 조회
     */
    List<DojangResponseDTO> getDojangs(String searchParam);

    DojangResponseDTO getDojangById(long id);

    /**
     * 도장 등록 메서드
     * @param request: insert할 데이터
     * @param thumbnailImage: 썸네일용 이미지 파일
     * @return DojangId
     */
    Long createDojang(DojangFormDTO request, MultipartFile thumbnailImage, UserPrincipal requester);

    Long updateDojang(Long dojangId, DojangFormDTO request, MultipartFile thumbnailImage, UserPrincipal requester);

    void deleteDojangById(Long id);
}
