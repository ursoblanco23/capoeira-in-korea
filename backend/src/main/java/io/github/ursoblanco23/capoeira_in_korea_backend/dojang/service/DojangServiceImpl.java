package io.github.ursoblanco23.capoeira_in_korea_backend.dojang.service;

import io.github.ursoblanco23.capoeira_in_korea_backend.dojang.dto.DojangCreateDTO;
import io.github.ursoblanco23.capoeira_in_korea_backend.dojang.dto.DojangFormDTO;
import io.github.ursoblanco23.capoeira_in_korea_backend.dojang.dto.DojangResponseDTO;
import io.github.ursoblanco23.capoeira_in_korea_backend.dojang.dto.DojangUpdateDTO;
import io.github.ursoblanco23.capoeira_in_korea_backend.dojang.entity.Dojang;
import io.github.ursoblanco23.capoeira_in_korea_backend.dojang.repository.DojangRepository;
import io.github.ursoblanco23.capoeira_in_korea_backend.exception.BusinessException;
import io.github.ursoblanco23.capoeira_in_korea_backend.exception.constants.ErrorCode;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.entity.MediaAttachment;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.entity.MediaFile;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaAttachmentType;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaFileType;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.service.MediaAttachmentService;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.service.MediaFileService;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.service.StorageService;
import io.github.ursoblanco23.capoeira_in_korea_backend.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class DojangServiceImpl implements DojangService {

    private final MediaFileService mediaFileService;
    private final MediaAttachmentService mediaAttachmentService;
    private final StorageService storageService;

    private final DojangRepository dojangRepository;

    @Override
    public List<DojangResponseDTO> getDojangs(String searchParam) {
        List<Dojang> dojangs;

        log.info("service > searchDojangs > searchParam : {}", searchParam);

        if (searchParam == null || searchParam.isEmpty()) {
            dojangs = dojangRepository.findAll();
        } else {
            dojangs = dojangRepository.findByNameContainingIgnoreCaseOrRoadAddressContainingIgnoreCaseOrDetailAddressContainingIgnoreCase(
                    searchParam.trim(), searchParam.trim(), searchParam.trim()
            );
        }

        return dojangs.stream()
                .map(DojangResponseDTO::from)
                .toList();
    }

    /**
     * 도장을 생성한다.
     *
     * @param request 도장 생성 요청 DTO
     * @param thumbnailImage 도장 썸네일 이미지 파일 (선택)
     * @return 생성된 도장의 ID
     */
    /*
    TODO: 왜 도장 save하고 뒤에 tumbnail 정보를 추가로 update하지? chk 및 리팩토링 하기.
    여기 때문에 run이 안됌. 로그인 후 고치기 26-06-04
    *  */

    @Override
    public Long createDojang(DojangCreateDTO request, MultipartFile thumbnailImage) {
        // 1. 비즈니스 유효성 검증
        validateDuplicateDojang(request);
        validateCreateDojangForm(request);

        // 2. 도장 엔터티 생성 및 저장
        Dojang dojang = createDojangEntity(request);
        log.info("createDojang >>> dojang={}", dojang);
        dojangRepository.save(dojang);

        // 3. 썸네일 이미지 처리 (있는 경우)
        if (thumbnailImage != null && !thumbnailImage.isEmpty()) {
//            MediaFile savedThumbnailFile = processAndAttachThumbnail(dojang, thumbnailImage, request.getAltText(), request.getRegistrantId());
//
//            //생성된 도장에 media_files 테이블에 생성된 thumbnail_id update 해주기
//            dojang.setThumbnailFile(savedThumbnailFile);
//            return dojangRepository.save(dojang).getId();
        }

        return dojang.getId();
    }

    @Override
    public Long updateDojang(Long dojangId, DojangUpdateDTO request, MultipartFile thumbnailImage) {
//        validateUpdateDojangForm(request);
//
//        Dojang dojang = dojangRepository.findById(dojangId)
//                .orElseThrow(() -> new BusinessException(ErrorCode.DOJANG_NOT_FOUND, "Dojang not found with id: " + dojangId));
//
//        applyDojangUpdates(dojang, request);
//
//        if (thumbnailImage != null && !thumbnailImage.isEmpty()) {
//            MediaFile thumbnailFile = dojang.getThumbnailFile();
//
//            if (thumbnailFile != null) {
//                removeFileFromDBAndStorage(thumbnailFile, MediaFileType.THUMBNAIL, dojang, MediaAttachmentType.DOJANG);
//            }
//
//            MediaFile savedThumbnailFile =
//                    processAndAttachThumbnail(dojang, thumbnailImage, request.getAltText(), request.getRegistrantId());
//
//            dojang.setThumbnailFile(savedThumbnailFile);
//        }
//
//        log.info("update Dojang >>> dojang={}", dojang);
//
//        return dojang.getId();
        return null;
    }

    @Override
    public void deleteDojangById(Long id) {
        Dojang dojang = dojangRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.DOJANG_NOT_FOUND, "Dojang not found with id: " + id));

//        MediaFile thumbnailFile =  dojang.getThumbnailFile();

//        log.info("deleteDojangById >>> thumbnailFile={}", thumbnailFile != null ? thumbnailFile.getFilePath() : "null");

        // 썸네일 이미지 제거
//        if (thumbnailFile != null) {
//            removeFileFromDBAndStorage(thumbnailFile, MediaFileType.THUMBNAIL, dojang, MediaAttachmentType.DOJANG);
//        }

        // 도장 삭제
        dojangRepository.delete(dojang);
    }

    //TODO: 도장 생성 form validation 메서드 완성하기.
    private void validateCommonDojangForm(DojangFormDTO request) {
        // 공통 검증
    }

    private void validateCreateDojangForm(DojangCreateDTO  request) {
        validateCommonDojangForm(request);
        // create 전용 검증
    }

    private void validateUpdateDojangForm(DojangUpdateDTO request) {
        // update 전용 검증
        // 필요하면 일부 공통 로직 재사용
    }

    private void validateDuplicateDojang(DojangCreateDTO request) {
        boolean isExist = dojangRepository.existsByNameAndRoadAddress(request.getName(), request.getRoadAddress());
        if (isExist) {
            throw new BusinessException(ErrorCode.DOJANG_DUPLICATE);
        }
    }

    /**
     * 도장 엔터티 생성 및 저장
     */
    public Dojang createDojangEntity(DojangCreateDTO request) {  // DojangCreateDTO로 가정
        return Dojang.builder()
                .name(request.getName())
                .zipCode(request.getZipCode())
                .roadAddress(request.getRoadAddress())
                .detailAddress(request.getDetailAddress())
                .sidoName(request.getSidoName())
                .sigunguName(request.getSigunguName())
                .eupmyeondongName(request.getEupmyeondongName())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .phone(request.getPhone())
                .priceRange(request.getPriceRange())
                .instructorName(request.getInstructorName())
                .description(request.getDescription())
                .registrantId(request.getRegistrantId())
                .build();
    }

    //TODO: 로그인 후 고쳐야함, entity에 setter삭제한 사이드 이펙트.
//    public void applyDojangUpdates(Dojang existingDojang, DojangUpdateDTO request) {
//        // Selective update: request 값이 null이 아니면 setter 호출 (기존 값 유지)
//        if (request.getName() != null) {
//            existingDojang.setName(request.getName());
//        }
//        if (request.getZipCode() != null) {
//            existingDojang.setZipCode(request.getZipCode());
//        }
//        if (request.getRoadAddress() != null) {
//            existingDojang.setRoadAddress(request.getRoadAddress());
//        }
//        if (request.getDetailAddress() != null) {
//            existingDojang.setDetailAddress(request.getDetailAddress());
//        }
//        if (request.getSidoName() != null) {
//            existingDojang.setSidoName(request.getSidoName());
//        }
//        if (request.getSigunguName() != null) {
//            existingDojang.setSigunguName(request.getSigunguName());
//        }
//        if (request.getEupmyeondongName() != null) {
//            existingDojang.setEupmyeondongName(request.getEupmyeondongName());
//        }
//        if (request.getLatitude() != null) {
//            existingDojang.setLatitude(request.getLatitude());
//        }
//        if (request.getLongitude() != null) {
//            existingDojang.setLongitude(request.getLongitude());
//        }
//        if (request.getPhone() != null) {
//            existingDojang.setPhone(request.getPhone());
//        }
//        if (request.getPriceRange() != null) {
//            existingDojang.setPriceRange(request.getPriceRange());
//        }
//        if (request.getInstructorName() != null) {
//            existingDojang.setInstructorName(request.getInstructorName());
//        }
//        if (request.getDescription() != null) {
//            existingDojang.setDescription(request.getDescription());
//        }
//        if (request.getRegistrantId() != null) {
//            existingDojang.setRegistrantId(request.getRegistrantId());
//        }
//    }

    //TODO: 아래부분 현재 dojang domain의 서비스 파일 내에 있는 게 맞는 건지 점검하기

    //TODO: 정리 순서 점검 필요
    /*
    *이 순서인데, 경우에 따라 실제 파일 삭제가 실패하면 DB는 이미 지워져서 불일치가 생길 수 있어.
    * 선택지 A
        실제 파일 먼저 삭제 → DB 삭제
        단, DB 트랜잭션과 파일 시스템은 원자성이 안 맞음
    * 실무처리 방식
        파일 삭제 실패 로그 남기기
        재시도/정리 배치
        soft delete 전략
    * 지금 단계에서는 큰 문제는 아니지만,
      “DB와 파일 삭제는 완전한 원자성이 보장되지 않는다” 는 건 알고 가는 게 좋아.
    * */
    private void removeFileFromDBAndStorage(MediaFile thumbnailFile, MediaFileType mediaFileType , Dojang dojang, MediaAttachmentType mediaAttachmentType) {
        // media_attachments 테이블 정리
        MediaAttachment attachment = mediaAttachmentService.getAttachment(mediaAttachmentType, dojang.getId(), mediaFileType);
        mediaAttachmentService.deleteAttachment(attachment);

        // media_files 테이블 정리
        mediaFileService.deleteFile(thumbnailFile);

        // 실제 디렉토리 파일 삭제
        storageService.deleteFile(thumbnailFile.getFilePath());
    }

    /**
     * 썸네일 이미지 처리 및 연결
     */
    public MediaFile processAndAttachThumbnail(Dojang dojang, MultipartFile thumbnailImage, String altText, User user) {
        // 파일 업로드 및 MediaFile 생성
        MediaFile media = mediaFileService.uploadImgFile(thumbnailImage, MediaFileType.THUMBNAIL, altText, user);

        // MediaAttachment 생성 및 연결
        mediaAttachmentService.createAttachment(
                media,
                MediaFileType.THUMBNAIL,
                dojang.getId(),
                MediaAttachmentType.DOJANG
        );

        return media;
    }

//    private void validateBusinessRules(DojangCreateRequest request) {
//        // 전화번호 형식 검증
//        if (!isValidPhoneNumber(request.getPhone())) {
//            throw new BusinessException(ErrorCode.INVALID_PHONE_FORMAT, "올바른 전화번호 형식이 아닙니다.");
//        }
//
//        // 좌표 유효성 검증
//        if (!isValidCoordinate(request.getLatitude(), request.getLongitude())) {
//            throw new BusinessException(ErrorCode.INVALID_COORDINATE, "올바른 좌표값이 아닙니다.");
//        }
//    }

//    private boolean isValidPhoneNumber(String phone) {
//        return phone != null && phone.matches("^\\d{2,3}-\\d{3,4}-\\d{4}$");
//    }
//
//    private boolean isValidCoordinate(String latitude, String longitude) {
//        try {
//            double lat = Double.parseDouble(latitude);
//            double lng = Double.parseDouble(longitude);
//            return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
//        } catch (NumberFormatException e) {
//            return false;
//        }
//    }

}