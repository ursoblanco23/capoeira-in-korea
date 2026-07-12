package io.github.ursoblanco23.capoeira_in_korea_backend.dojang.controller;

import io.github.ursoblanco23.capoeira_in_korea_backend.common.dto.ApiResponse;
import io.github.ursoblanco23.capoeira_in_korea_backend.dojang.dto.DojangCreateDTO;
import io.github.ursoblanco23.capoeira_in_korea_backend.dojang.dto.DojangResponseDTO;
import io.github.ursoblanco23.capoeira_in_korea_backend.dojang.dto.DojangUpdateDTO;
import io.github.ursoblanco23.capoeira_in_korea_backend.dojang.service.DojangService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/dojangs")
public class DojangController {

    private final DojangService dojangService;

    /**
     * 도장 검색 API
     * GET /dojangs?searchParam=검색어
     * 검색어가 있으면 조건 검색
     * 검색어가 없으면 전체 도장 목록 반환
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<DojangResponseDTO>>> getDojangs(@RequestParam(name = "searchParam", required = false) String searchParam) {
        List<DojangResponseDTO> dojangs = dojangService.getDojangs(searchParam);
        return ResponseEntity.ok(ApiResponse.success(dojangs));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Long>> createDojang(
            @RequestPart("data") DojangCreateDTO request
            ,@RequestPart(value = "thumbnailImage", required = false) MultipartFile thumbnailImage
    ) {
        log.info("createDojang > dojang : {}", request);
        log.info("createDojang > thumbnailImage : {}", thumbnailImage);

        long dojangId = dojangService.createDojang(request, thumbnailImage);
        return ResponseEntity.ok(ApiResponse.success(dojangId));
    }

    @PatchMapping(value = "/{dojangId}",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Long>> updateDojang(
            @PathVariable Long dojangId,
            @RequestPart("data") DojangUpdateDTO request
            ,@RequestPart(value = "thumbnailImage", required = false) MultipartFile thumbnailImage
    ) {
        Long updatedId = dojangService.updateDojang(dojangId, request, thumbnailImage);
        return ResponseEntity.ok(ApiResponse.success(updatedId));
    }

    @DeleteMapping("/{dojangId}")
    public ResponseEntity<ApiResponse<Void>> deleteDojnag(@PathVariable Long dojangId) {
        dojangService.deleteDojangById(dojangId);
        return ResponseEntity.ok(ApiResponse.success("삭제가 완료되었습니다."));
    }
}
