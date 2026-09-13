package io.github.ursoblanco23.capoeira_in_korea_backend.media.facade;

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
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class MediaManagementFacade {

    private final MediaFileService mediaFileService;
    private final MediaAttachmentService mediaAttachmentService;
    private final StorageService storageService;

    /**
     * 지정한 첨부 대상과 미디어 유형에 단 하나의 파일만 연결되도록
     * 새 파일을 등록하거나 기존 파일을 교체한다.
     * <p>
     * 먼저 파일을 검증·저장한 후 기존 첨부가 있으면 새 파일로 교체하고,
     * 기존 첨부가 없으면 새 첨부를 생성한다. 교체된 기존 미디어 파일은
     * 데이터베이스에서 삭제하고, 트랜잭션 커밋 성공 후 스토리지에서 삭제한다.
     * </p>
     *
     * @param uploader 파일을 업로드한 사용자
     * @param file 새로 등록할 파일
     * @param mediaFileType 파일의 용도와 검증·저장 정책을 결정하는 유형
     * @param attachableType 파일이 첨부될 도메인 유형
     * @param attachableId 파일이 첨부될 도메인 객체 ID
     * @param altText 이미지 대체 텍스트. 없으면 {@code null}
     * @return 새로 저장되어 첨부된 미디어 파일
     */
    public MediaFile replaceSingleAttachment(
            User uploader,
            MultipartFile file,
            MediaFileType mediaFileType,
            MediaAttachmentType attachableType,
            long attachableId,
            String altText
    ) {
        MediaFile mediaFile = mediaFileService.storeFile(uploader, file, mediaFileType, altText);
        MediaFile oldMedia = mediaAttachmentService.replaceSingleAttachment(mediaFile, mediaFileType, attachableId, attachableType);

        if (oldMedia != null) {
            mediaFileService.deleteFileRecord(oldMedia);
            deleteFromStorageAfterCommit(oldMedia.getFilePath());
        }

        return mediaFile;
    }

    private void deleteFromStorageAfterCommit(String filePath) {
        TransactionSynchronizationManager.registerSynchronization(
                new TransactionSynchronization() {
                    @Override
                    public void afterCommit() {
                        try {
                            storageService.deleteFile(filePath);
                        } catch (RuntimeException exception) {
                            log.error(
                                    "Failed to delete media file after transaction commit: {}",
                                    filePath,
                                    exception
                            );

                            // TODO: Persist failed deletions and retry them through a batch job or task queue.
                        }
                    }
                }
        );
    }

}
