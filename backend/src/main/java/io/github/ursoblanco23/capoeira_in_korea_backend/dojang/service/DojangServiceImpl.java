package io.github.ursoblanco23.capoeira_in_korea_backend.dojang.service;

import io.github.ursoblanco23.capoeira_in_korea_backend.auth.security.UserPrincipal;
import io.github.ursoblanco23.capoeira_in_korea_backend.common.entity.Address;
import io.github.ursoblanco23.capoeira_in_korea_backend.common.util.PhoneUtils;
import io.github.ursoblanco23.capoeira_in_korea_backend.dojang.dto.DojangFormDTO;
import io.github.ursoblanco23.capoeira_in_korea_backend.dojang.dto.DojangResponseDTO;
import io.github.ursoblanco23.capoeira_in_korea_backend.dojang.entity.Dojang;
import io.github.ursoblanco23.capoeira_in_korea_backend.dojang.repository.DojangRepository;
import io.github.ursoblanco23.capoeira_in_korea_backend.exception.BusinessException;
import io.github.ursoblanco23.capoeira_in_korea_backend.exception.constants.ErrorCode;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.entity.MediaAttachment;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.entity.MediaFile;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaAttachmentType;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaFileType;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.facade.MediaManagementFacade;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.service.MediaAttachmentService;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.service.MediaFileService;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.service.StorageService;
import io.github.ursoblanco23.capoeira_in_korea_backend.user.constants.RoleName;
import io.github.ursoblanco23.capoeira_in_korea_backend.user.entity.User;
import io.github.ursoblanco23.capoeira_in_korea_backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class DojangServiceImpl implements DojangService {

    private static final Set<String> DOJANG_CREATE_ROLES = Set.of(
            RoleName.ROLE_DOJANG_ADMIN.name(),
            RoleName.ROLE_SITE_ADMIN.name()
    );

    private final MediaFileService mediaFileService;
    private final MediaAttachmentService mediaAttachmentService;
    private final StorageService storageService;
    private final MediaManagementFacade mediaManagementFacade;

    private final DojangRepository dojangRepository;
    private final UserService userService;

    @Override
    public List<DojangResponseDTO> getDojangs(String searchParam) {
        List<Dojang> dojangs;

        if (searchParam == null || searchParam.isBlank()) {
            dojangs = dojangRepository.findAllByDeletedAtIsNullOrderByCreatedAtDescIdDesc();
        } else {
            dojangs = dojangRepository.searchByNameOrAddressAndDeletedAtIsNull(
                    searchParam.strip()
            );
        }

        Map<Long, String> thumbnailUrlsByDojangId =
                getActiveThumbnailUrlsByDojangId(dojangs);

        return dojangs.stream()
                .map(dojang -> DojangResponseDTO.from(
                        dojang,
                        thumbnailUrlsByDojangId.get(dojang.getId())
                ))
                .toList();
    }

    @Override
    public DojangResponseDTO getDojangById(long id) {
        if (id < 1) {
            throw new BusinessException(ErrorCode.DOJANG_NOT_FOUND, "도장ID: {"+ id +"} 정보를 찾을 수 없습니다.");
        }

        Dojang dojang = dojangRepository
                .findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new BusinessException(
                    ErrorCode.DOJANG_NOT_FOUND,
                    "도장ID: " + id + " 정보를 찾을 수 없습니다."
        ));

        String thumbnailUrl = mediaAttachmentService.findActiveAttachment(
                        MediaAttachmentType.DOJANG,
                        id,
                        MediaFileType.THUMBNAIL
                )
                .map(MediaAttachment::getMedia)
                .map(MediaFile::getFilePath)
                .orElse(null);

        return DojangResponseDTO.from(dojang, thumbnailUrl);
    }

    private Map<Long, String> getActiveThumbnailUrlsByDojangId(List<Dojang> dojangs) {
        if (dojangs.isEmpty()) {
            return Map.of();
        }

        List<Long> dojangIds = dojangs.stream()
                .map(Dojang::getId)
                .toList();

        return mediaAttachmentService.findAllActiveAttachments(
                        MediaAttachmentType.DOJANG,
                        dojangIds,
                        MediaFileType.THUMBNAIL
                )
                .stream()
                .collect(Collectors.toMap(
                        MediaAttachment::getAttachableId,
                        attachment -> attachment.getMedia().getFilePath(),
                        (first, ignored) -> first
                ));
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
    public Long createDojang(DojangFormDTO request, MultipartFile thumbnailImage, UserPrincipal requester) {
        // 권한 검증
        validateCreatePermission(requester);

        // 비즈니스 유효성 검증
        validateCreateDojangForm(request);

        // 도장 엔터티 생성 및 저장
        Dojang dojang = createDojangEntity(request, requester.getUserId());
        log.info("createDojang >>> dojang={}", dojang);
        dojangRepository.save(dojang);

        // 썸네일 이미지 처리 (있는 경우)
        if ( thumbnailImage != null && !thumbnailImage.isEmpty() ) {
            replaceDojangThumbnail(thumbnailImage, requester, dojang, request.getAltText());
        }

        return dojang.getId();
    }

    private void replaceDojangThumbnail(MultipartFile thumbnailImage, UserPrincipal requester, Dojang dojang, String altText) {
        User uploader = userService.getUserById(requester.getUserId());
        mediaManagementFacade.replaceSingleAttachment(
                uploader
                , thumbnailImage
                ,MediaFileType.THUMBNAIL
                ,MediaAttachmentType.DOJANG
                , dojang.getId()
                ,altText
        );
    }

    @Override
    public Long updateDojang(Long dojangId, DojangFormDTO request, MultipartFile thumbnailImage, UserPrincipal requester) {
        Dojang dojang = dojangRepository.findByIdAndDeletedAtIsNull(dojangId)
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.DOJANG_NOT_FOUND,
                        "Dojang not found with id: " + dojangId
                ));

        // validation
        validateUpdatePermission(requester, dojang.getRegistrantId());
        validateUpdateDojangForm(dojangId, request);

        dojang.updateBasicInfo(
                request.getName().strip(),
                createAddress(request),
                request.getLatitude(),
                request.getLongitude(),
                normalizeDojangPhone(request.getPhone()),
                normalizeNullable(request.getPriceInfo()),
                normalizeNullable(request.getInstructorName()),
                normalizeNullable(request.getDescription())
        );

        if (thumbnailImage != null && !thumbnailImage.isEmpty()) {
            replaceDojangThumbnail(thumbnailImage, requester, dojang, request.getAltText());
        }

        return dojang.getId();
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

    private void validateCreateDojangForm(DojangFormDTO request) {
        validateDojangAddress(request);
        validateDuplicateDojang(request, null);
    }

    /**
     * 기본 정보 입력 여부만 판단 -> 실제 주소 및 도장 운영 여부는 사이트 관리자가 확인
     * @param request 도장 등록, 수정 FORM
     */
    private void validateDojangAddress(DojangFormDTO request) {
        if (request.getAddress() == null || request.getAddress().hasMissingValue()) {
            throw new BusinessException(ErrorCode.DOJANG_ADDRESS_INCOMPLETE);
        }
    }

    private void validateCreatePermission(UserPrincipal requester) {
        boolean hasPermission = requester.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(DOJANG_CREATE_ROLES::contains);

        if (!hasPermission) {
            throw new BusinessException(ErrorCode.AUTH_ACCESS_DENIED);
        }
    }

    private void validateUpdatePermission(UserPrincipal requester, long dojangRegistrantId) {
        validateCreatePermission(requester);

        boolean isSiteAdmin = requester.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(RoleName.ROLE_SITE_ADMIN.name()::equals);

        if (isSiteAdmin) return;

        if (!requester.getUserId().equals(dojangRegistrantId)) {
            throw new BusinessException(ErrorCode.AUTH_ACCESS_DENIED);
        }
    }

    private void validateUpdateDojangForm(Long dojangId, DojangFormDTO request) {
        validateDojangAddress(request);
        validateDuplicateDojang(request, dojangId);
    }

    private void validateDuplicateDojang(DojangFormDTO request, Long excludedDojangId) {
        String name = request.getName().strip();
        String roadAddress = normalizeAddress(request.getAddress().getRoadAddress());
        String detailAddress = normalizeAddress(request.getAddress().getDetailAddress());

        boolean duplicate = excludedDojangId == null
                ? dojangRepository.existsByNameAndAddress_RoadAddressAndAddress_DetailAddressAndDeletedAtIsNull(
                        name,
                        roadAddress,
                        detailAddress
                )
                : dojangRepository.existsByNameAndAddress_RoadAddressAndAddress_DetailAddressAndIdNotAndDeletedAtIsNull(
                        name,
                        roadAddress,
                        detailAddress,
                        excludedDojangId
                );

        if (duplicate) {
            throw new BusinessException(ErrorCode.DOJANG_DUPLICATE);
        }
    }

    /**
     * 도장 엔터티 생성 및 저장
     */
    public Dojang createDojangEntity(DojangFormDTO request, Long registrantId) {
        return Dojang.builder()
                .name(request.getName().strip())
                .address(createAddress(request))
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .phone(normalizeDojangPhone(request.getPhone()))
                .priceInfo(normalizeNullable(request.getPriceInfo()))
                .instructorName(normalizeNullable(request.getInstructorName()))
                .description(normalizeNullable(request.getDescription()))
                .registrantId(registrantId)
                .build();
    }

    private Address createAddress(DojangFormDTO request) {
        return Address.of(
                normalizeAddress(request.getAddress().getZipCode()),
                normalizeAddress(request.getAddress().getRoadAddress()),
                normalizeAddress(request.getAddress().getDetailAddress()),
                normalizeAddress(request.getAddress().getSidoName()),
                normalizeAddress(request.getAddress().getSigunguName()),
                normalizeAddress(request.getAddress().getEupmyeondongName())
        );
    }

    private String normalizeDojangPhone(String phone) {
        try {
            return PhoneUtils.normalizeKoreanPhoneToE164(phone);
        } catch (IllegalArgumentException exception) {
            throw new BusinessException(
                    ErrorCode.COMMON_VALIDATION_ERROR,
                    "올바른 한국 도장 전화번호를 입력해 주세요",
                    exception
            );
        }
    }

    /**
     * 의미 없는 빈 값을 Nullable column에 null이 들어가도록 정규화
     * @param value
     * @return
     */
    private String normalizeNullable(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.strip();
    }

    private String normalizeAddress(String value) {
        String normalized = normalizeNullable(value);

        if (normalized == null) {
            return null;
        }

        return normalized.replaceAll("(?U)\\s+", " ");
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
        mediaFileService.deleteFileRecord(thumbnailFile);

        // 실제 디렉토리 파일 삭제
        storageService.deleteFile(thumbnailFile.getFilePath());
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
