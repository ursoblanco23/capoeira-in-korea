package io.github.ursoblanco23.capoeira_in_korea_backend.media.service;

import io.github.ursoblanco23.capoeira_in_korea_backend.media.dto.ImageFileUploadResult;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.dto.ImageMetadata;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.entity.MediaFile;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaFileType;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.metadata.ImageMetadataExtractor;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.repository.MediaFileRepository;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.validation.MediaFileValidator;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.validation.MediaFileValidatorResolver;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.validation.validator.MediaFileValidationSupport;
import io.github.ursoblanco23.capoeira_in_korea_backend.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class MediaFileServiceImpl implements MediaFileService {

    private final StorageService storageService;
    private final MediaFileRepository mediaFileRepository;
    private final MediaFileValidatorResolver mediaFileValidatorResolver;

    // TODO: dojang side cleanup is still pending; keep both upload flows until callers are unified.
    private final ImageMetadataExtractor imageMetadataExtractor;
    private final MediaFileValidationSupport mediaFileValidationSupport;

    // TODO: uploadImgFile 메서드는 기존에 도장 서비스에서 사용하던 (구)코드, user 작업 이후 dojang 코드 수정과 동시에 삭제 예정
    @Override
    public MediaFile uploadImgFile(MultipartFile file, MediaFileType fileType, String altText, User uploader) {
//        mediaFileValidationSupport.validateImageFile(file, fileType);

        ImageMetadata metadata = imageMetadataExtractor.extract(file);
        ImageFileUploadResult uploadResult = storageService.uploadFile(file, fileType);

        MediaFile mediaFile = MediaFile.builder()
                .width(metadata.getWidth())
                .height(metadata.getHeight())
                .filePath(uploadResult.getFilePath())
                .originalName(file.getOriginalFilename())
                .fileName(uploadResult.getFileName())
                .fileSize(file.getSize())
                .mimeType(file.getContentType())
                .altText(altText)
                .uploadedBy(uploader)
                .uploadedAt(LocalDateTime.now())
                .build();

        log.info("mediaFile={}", mediaFile);
        return mediaFileRepository.save(mediaFile);
    }

    @Override
    public void deleteFile(MediaFile file) {
        mediaFileRepository.delete(file);
        storageService.deleteFile(file.getFilePath());
    }

    @Override
    public MediaFile storeFile(User me, MultipartFile file, MediaFileType mediaType) {
        MediaFileValidator validator = mediaFileValidatorResolver.resolve(mediaType);
        validator.validate(file);

        // TODO: 네이밍에서 img 제거 범용으로 해당 클래스 타입들 재점검 필요.
        ImageMetadata metadata = imageMetadataExtractor.extract(file);
        ImageFileUploadResult uploadResult = storageService.uploadFile(file, mediaType);

        //TODO: duration, altText 관련 설정 없음.
        MediaFile mediaFile = MediaFile.builder()
                .width(metadata.getWidth())
                .height(metadata.getHeight())
                .filePath(uploadResult.getFilePath())
                .originalName(file.getOriginalFilename())
                .fileName(uploadResult.getFileName())
                .fileSize(file.getSize())
                .mimeType(file.getContentType())
                .uploadedBy(me)
                .uploadedAt(LocalDateTime.now())
                .build();

        return mediaFileRepository.save(mediaFile);
    }
}
