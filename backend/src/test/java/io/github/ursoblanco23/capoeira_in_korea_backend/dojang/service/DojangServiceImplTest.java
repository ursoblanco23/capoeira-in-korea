package io.github.ursoblanco23.capoeira_in_korea_backend.dojang.service;

import io.github.ursoblanco23.capoeira_in_korea_backend.auth.security.UserPrincipal;
import io.github.ursoblanco23.capoeira_in_korea_backend.common.dto.AddressRequest;
import io.github.ursoblanco23.capoeira_in_korea_backend.common.entity.Address;
import io.github.ursoblanco23.capoeira_in_korea_backend.dojang.dto.DojangFormDTO;
import io.github.ursoblanco23.capoeira_in_korea_backend.dojang.entity.Dojang;
import io.github.ursoblanco23.capoeira_in_korea_backend.dojang.repository.DojangRepository;
import io.github.ursoblanco23.capoeira_in_korea_backend.exception.BusinessException;
import io.github.ursoblanco23.capoeira_in_korea_backend.exception.constants.ErrorCode;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaAttachmentType;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaFileType;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.facade.MediaManagementFacade;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.service.MediaAttachmentService;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.service.MediaFileService;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.service.StorageService;
import io.github.ursoblanco23.capoeira_in_korea_backend.user.constants.RoleName;
import io.github.ursoblanco23.capoeira_in_korea_backend.user.entity.User;
import io.github.ursoblanco23.capoeira_in_korea_backend.user.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * {@link DojangServiceImpl}의 생성·수정 비즈니스 규칙을 검증하는 단위 테스트다.
 *
 * <p>Repository, 사용자 서비스, 미디어 facade는 Mock으로 대체하므로 실제 DB 쿼리,
 * 트랜잭션 커밋, 파일 저장은 검증하지 않는다. 그런 동작은 통합 테스트의 대상이다.</p>
 */
@ExtendWith(MockitoExtension.class)
class DojangServiceImplTest {

    private static final long REQUESTER_ID = 1L;
    private static final long DOJANG_ID = 10L;

    @Mock
    private MediaFileService mediaFileService;
    @Mock
    private MediaAttachmentService mediaAttachmentService;
    @Mock
    private StorageService storageService;
    @Mock
    private MediaManagementFacade mediaManagementFacade;
    @Mock
    private DojangRepository dojangRepository;
    @Mock
    private UserService userService;

    private DojangServiceImpl dojangService;

    @BeforeEach
    void setUp() {
        dojangService = new DojangServiceImpl(
                mediaFileService,
                mediaAttachmentService,
                storageService,
                mediaManagementFacade,
                dojangRepository,
                userService
        );
    }

    @Test
    void createDojangStoresNormalizedFormAndAuthenticatedRegistrant() {
        // given
        DojangFormDTO request = createValidRequest();
        UserPrincipal requester = createPrincipal(REQUESTER_ID, RoleName.ROLE_DOJANG_ADMIN);
        mockGeneratedDojangId();

        // when
        Long createdId = dojangService.createDojang(request, null, requester);

        // then
        ArgumentCaptor<Dojang> dojangCaptor = ArgumentCaptor.forClass(Dojang.class);
        verify(dojangRepository).save(dojangCaptor.capture());

        Dojang savedDojang = dojangCaptor.getValue();
        assertThat(createdId).isEqualTo(DOJANG_ID);
        assertThat(savedDojang.getName()).isEqualTo("카포에라 도장");
        assertThat(savedDojang.getAddress().getRoadAddress()).isEqualTo("서울시 강남대로 1");
        assertThat(savedDojang.getPhone()).isEqualTo("+821012345678");
        assertThat(savedDojang.getRegistrantId()).isEqualTo(REQUESTER_ID);
        verify(mediaManagementFacade, never()).replaceSingleAttachment(
                any(), any(), any(), any(), any(Long.class), any()
        );
    }

    @Test
    void createDojangRejectsDuplicateDojang() {
        // given
        DojangFormDTO request = createValidRequest();
        UserPrincipal requester = createPrincipal(REQUESTER_ID, RoleName.ROLE_DOJANG_ADMIN);
        when(dojangRepository.existsByNameAndAddress_RoadAddressAndAddress_DetailAddressAndDeletedAtIsNull(
                "카포에라 도장",
                "서울시 강남대로 1",
                "101호"
        )).thenReturn(true);

        // when / then
        assertBusinessException(
                () -> dojangService.createDojang(request, null, requester),
                ErrorCode.DOJANG_DUPLICATE
        );
        verify(dojangRepository, never()).save(any(Dojang.class));
    }

    @Test
    void createDojangRejectsRequesterWithoutRequiredRole() {
        // given
        DojangFormDTO request = createValidRequest();
        UserPrincipal requester = createPrincipal(REQUESTER_ID, RoleName.ROLE_USER);

        // when / then
        assertBusinessException(
                () -> dojangService.createDojang(request, null, requester),
                ErrorCode.AUTH_ACCESS_DENIED
        );
        verify(dojangRepository, never()).save(any(Dojang.class));
    }

    @Test
    void createDojangRegistersThumbnailWhenFileIsProvided() {
        // given
        DojangFormDTO request = createValidRequest();
        UserPrincipal requester = createPrincipal(REQUESTER_ID, RoleName.ROLE_DOJANG_ADMIN);
        MultipartFile thumbnail = createThumbnail();
        User uploader = org.mockito.Mockito.mock(User.class);

        mockGeneratedDojangId();
        when(userService.getUserById(REQUESTER_ID)).thenReturn(uploader);

        // when
        dojangService.createDojang(request, thumbnail, requester);

        // then
        verify(mediaManagementFacade).replaceSingleAttachment(
                uploader,
                thumbnail,
                MediaFileType.THUMBNAIL,
                MediaAttachmentType.DOJANG,
                DOJANG_ID,
                null
        );
    }

    @Test
    void updateDojangUpdatesOwnedDojangAndExcludesItFromDuplicateCheck() {
        // given
        DojangFormDTO request = createValidRequest();
        UserPrincipal requester = createPrincipal(REQUESTER_ID, RoleName.ROLE_DOJANG_ADMIN);
        Dojang existingDojang = createExistingDojang(REQUESTER_ID);

        when(dojangRepository.findByIdAndDeletedAtIsNull(DOJANG_ID))
                .thenReturn(Optional.of(existingDojang));

        // when
        Long updatedId = dojangService.updateDojang(DOJANG_ID, request, null, requester);

        // then
        assertThat(updatedId).isEqualTo(DOJANG_ID);
        assertThat(existingDojang.getName()).isEqualTo("카포에라 도장");
        assertThat(existingDojang.getPhone()).isEqualTo("+821012345678");
        verify(dojangRepository)
                .existsByNameAndAddress_RoadAddressAndAddress_DetailAddressAndIdNotAndDeletedAtIsNull(
                        "카포에라 도장",
                        "서울시 강남대로 1",
                        "101호",
                        DOJANG_ID
                );
        verify(mediaManagementFacade, never()).replaceSingleAttachment(
                any(), any(), any(), any(), any(Long.class), any()
        );
    }

    @Test
    void updateDojangRejectsDeletedOrUnknownDojang() {
        // given
        DojangFormDTO request = createValidRequest();
        UserPrincipal requester = createPrincipal(REQUESTER_ID, RoleName.ROLE_DOJANG_ADMIN);
        when(dojangRepository.findByIdAndDeletedAtIsNull(DOJANG_ID))
                .thenReturn(Optional.empty());

        // when / then
        assertBusinessException(
                () -> dojangService.updateDojang(DOJANG_ID, request, null, requester),
                ErrorCode.DOJANG_NOT_FOUND
        );
    }

    @Test
    void updateDojangRejectsDifferentRegistrant() {
        // given
        long differentRegistrantId = 2L;
        DojangFormDTO request = createValidRequest();
        UserPrincipal requester = createPrincipal(REQUESTER_ID, RoleName.ROLE_DOJANG_ADMIN);
        Dojang existingDojang = createExistingDojang(differentRegistrantId);

        when(dojangRepository.findByIdAndDeletedAtIsNull(DOJANG_ID))
                .thenReturn(Optional.of(existingDojang));

        // when / then
        assertBusinessException(
                () -> dojangService.updateDojang(DOJANG_ID, request, null, requester),
                ErrorCode.AUTH_ACCESS_DENIED
        );
        verify(
                dojangRepository,
                never()
        ).existsByNameAndAddress_RoadAddressAndAddress_DetailAddressAndIdNotAndDeletedAtIsNull(
                any(), any(), any(), any(Long.class)
        );
    }

    @Test
    void updateDojangAllowsSiteAdminToUpdateAnotherRegistrantsDojang() {
        // given
        DojangFormDTO request = createValidRequest();
        UserPrincipal requester = createPrincipal(REQUESTER_ID, RoleName.ROLE_SITE_ADMIN);
        Dojang existingDojang = createExistingDojang(2L);

        when(dojangRepository.findByIdAndDeletedAtIsNull(DOJANG_ID))
                .thenReturn(Optional.of(existingDojang));

        // when
        Long updatedId = dojangService.updateDojang(DOJANG_ID, request, null, requester);

        // then
        assertThat(updatedId).isEqualTo(DOJANG_ID);
        assertThat(existingDojang.getName()).isEqualTo("카포에라 도장");
    }

    @Test
    void updateDojangReplacesThumbnailWhenFileIsProvided() {
        // given
        DojangFormDTO request = createValidRequest();
        UserPrincipal requester = createPrincipal(REQUESTER_ID, RoleName.ROLE_DOJANG_ADMIN);
        Dojang existingDojang = createExistingDojang(REQUESTER_ID);
        MultipartFile thumbnail = createThumbnail();
        User uploader = org.mockito.Mockito.mock(User.class);

        when(dojangRepository.findByIdAndDeletedAtIsNull(DOJANG_ID))
                .thenReturn(Optional.of(existingDojang));
        when(userService.getUserById(REQUESTER_ID)).thenReturn(uploader);

        // when
        dojangService.updateDojang(DOJANG_ID, request, thumbnail, requester);

        // then
        verify(mediaManagementFacade).replaceSingleAttachment(
                uploader,
                thumbnail,
                MediaFileType.THUMBNAIL,
                MediaAttachmentType.DOJANG,
                DOJANG_ID,
                null
        );
    }

    private void mockGeneratedDojangId() {
        /*
         * 실제 JpaRepository.save()는 IDENTITY 전략으로 생성된 ID를 엔티티에 채운다.
         * Repository가 Mock인 단위 테스트에서는 그 동작이 없으므로 직접 흉내 낸다.
         */
        when(dojangRepository.save(any(Dojang.class))).thenAnswer(invocation -> {
            Dojang savedDojang = invocation.getArgument(0);
            ReflectionTestUtils.setField(savedDojang, "id", DOJANG_ID);
            return savedDojang;
        });
    }

    private DojangFormDTO createValidRequest() {
        AddressRequest address = new AddressRequest();
        address.setZipCode(" 06234 ");
        address.setRoadAddress("  서울시   강남대로 1  ");
        address.setDetailAddress("  101호  ");
        address.setSidoName(" 서울특별시 ");
        address.setSigunguName(" 강남구 ");
        address.setEupmyeondongName(" 역삼동 ");

        DojangFormDTO request = new DojangFormDTO();
        request.setName("  카포에라 도장  ");
        request.setAddress(address);
        request.setLatitude(new BigDecimal("37.12345678"));
        request.setLongitude(new BigDecimal("127.12345678"));
        request.setPhone("010-1234-5678");
        request.setPriceInfo(" 월 100,000원 ");
        request.setInstructorName(" Mestre Teste ");
        request.setDescription(" 테스트 도장 ");
        return request;
    }

    private Dojang createExistingDojang(long registrantId) {
        Dojang dojang = Dojang.create(
                "기존 도장",
                Address.of("06234", "기존 주소", "101호", "서울특별시", "강남구", "역삼동"),
                new BigDecimal("37.00000000"),
                new BigDecimal("127.00000000"),
                "+821011112222",
                null,
                null,
                null,
                registrantId
        );
        ReflectionTestUtils.setField(dojang, "id", DOJANG_ID);
        return dojang;
    }

    private UserPrincipal createPrincipal(long userId, RoleName roleName) {
        return new UserPrincipal(
                userId,
                "loginId",
                "test@example.com",
                "passwordHash",
                "tester",
                List.of(new SimpleGrantedAuthority(roleName.name())),
                true,
                true,
                true,
                true
        );
    }

    private MultipartFile createThumbnail() {
        return new MockMultipartFile(
                "thumbnailImage",
                "thumbnail.png",
                "image/png",
                new byte[]{1, 2, 3}
        );
    }

    private void assertBusinessException(Runnable invocation, ErrorCode expectedErrorCode) {
        assertThatThrownBy(invocation::run)
                .isInstanceOfSatisfying(
                        BusinessException.class,
                        exception -> assertThat(exception.getErrorCode()).isEqualTo(expectedErrorCode)
                );
    }
}

