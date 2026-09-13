package io.github.ursoblanco23.capoeira_in_korea_backend.media.service;

import io.github.ursoblanco23.capoeira_in_korea_backend.media.dto.FileUploadResult;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.dto.MediaMetadata;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.entity.MediaFile;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaFileType;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.metadata.MediaMetadataExtractor;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.metadata.MediaMetadataExtractorResolver;
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


@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class MediaFileServiceImpl implements MediaFileService {

    private final StorageService storageService;
    private final MediaFileRepository mediaFileRepository;
    private final MediaFileValidatorResolver mediaFileValidatorResolver;

    // TODO: dojang side cleanup is still pending; keep both upload flows until callers are unified.
    private final MediaMetadataExtractorResolver mediaMetadataExtractorResolver;
    private final MediaFileValidationSupport mediaFileValidationSupport;

    @Override
    public void deleteFileRecord(MediaFile file) {
        mediaFileRepository.delete(file);
    }

    @Override
    public MediaFile storeFile(User me, MultipartFile file, MediaFileType mediaType, String altText) {
        MediaFileValidator validator = mediaFileValidatorResolver.resolve(mediaType);
        validator.validate(file);

        MediaMetadataExtractor metadataExtractor = mediaMetadataExtractorResolver.resolve(mediaType.getMediaKind());
        MediaMetadata metadata = metadataExtractor.extract(file);
        FileUploadResult uploadResult = storageService.uploadFile(file, mediaType);

        MediaFile mediaFile = MediaFile.builder()
                .width(metadata.getWidth())
                .height(metadata.getHeight())
                .durationSeconds(metadata.getDurationSeconds())
                .filePath(uploadResult.getFilePath())
                .originalName(uploadResult.getOriginalName())
                .fileName(uploadResult.getFileName())
                .fileSize(uploadResult.getFileSize())
                .mimeType(uploadResult.getMimeType())
                .uploadedBy(me)
                .uploadedAt(uploadResult.getUploadedAt())
                .altText(altText == null || altText.isBlank() ? null : altText.trim())
                .build();

        return mediaFileRepository.save(mediaFile);
    }
}
