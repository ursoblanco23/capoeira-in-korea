package io.github.ursoblanco23.capoeira_in_korea_backend.media.service;

import io.github.ursoblanco23.capoeira_in_korea_backend.exception.BusinessException;
import io.github.ursoblanco23.capoeira_in_korea_backend.exception.constants.ErrorCode;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.entity.MediaAttachment;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.entity.MediaFile;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaAttachmentType;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaFileType;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.repository.MediaAttachmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class MediaAttachmentServiceImpl implements MediaAttachmentService {

    private final MediaAttachmentRepository mediaAttachmentRepository;

    /**
     * 싱글 media의 mediaFile Attachment의 연결을 교체 혹은 생성
     *
     * @param newMedia
     * @param mediaType
     * @param attachableId
     * @param attachableType
     * @return 기존에 mediaFile 존재 시 대체된 기존의 mediaFile entity
     */
    @Override
    public MediaFile replaceSingleAttachment(MediaFile newMedia, MediaFileType mediaType, long attachableId, MediaAttachmentType attachableType) {
        Optional<MediaAttachment> attachment = findAttachment(attachableType, attachableId, mediaType);

        if (attachment.isPresent()) {
            MediaFile oldMedia = attachment.get().getMedia();
            attachment.get().replaceMedia(newMedia);
            return oldMedia;
        }

        createAttachment(newMedia, mediaType, attachableId, attachableType);
        return null;
    }

    @Override
    public MediaAttachment createAttachment(MediaFile media, MediaFileType mediaType, long attachableId, MediaAttachmentType attachableType) {
        MediaAttachment mediaAttachment = MediaAttachment.builder()
                .media(media)
                .attachableType(attachableType)
                .attachableId(attachableId)
                .mediaType(mediaType)
                .build();

        return mediaAttachmentRepository.save(mediaAttachment);
    }

    @Override
    public MediaAttachment getAttachment(MediaAttachmentType attachableType, long attachableId, MediaFileType mediaType) {
        return findAttachment(attachableType, attachableId, mediaType).orElseThrow(() -> new BusinessException(ErrorCode.MEDIA_ATTACHMENT_NOT_FOUND));
    }

    @Override
    public Optional<MediaAttachment> findAttachment(MediaAttachmentType attachableType, long attachableId, MediaFileType mediaType) {
        return mediaAttachmentRepository.findByAttachableTypeAndAttachableIdAndMediaType(attachableType, attachableId, mediaType);
    }

    @Override
    public Optional<MediaAttachment> findActiveAttachment(MediaAttachmentType attachableType, long attachableId, MediaFileType mediaType) {
        return mediaAttachmentRepository
                .findByAttachableTypeAndAttachableIdAndMediaTypeAndMedia_IsActiveTrue(
                        attachableType,
                        attachableId,
                        mediaType
                );
    }

    @Override
    public List<MediaAttachment> findAllActiveAttachments(MediaAttachmentType attachableType, Collection<Long> attachableIds, MediaFileType mediaType) {
        return mediaAttachmentRepository.findAllActiveAttachments(attachableType, mediaType, attachableIds);
    }


    @Override
    public void deleteAttachment(MediaAttachment attachment) {
        mediaAttachmentRepository.delete(attachment);
    }

}
