package io.github.ursoblanco23.capoeira_in_korea_backend.media.service;

import io.github.ursoblanco23.capoeira_in_korea_backend.media.entity.MediaAttachment;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.entity.MediaFile;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaAttachmentType;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaFileType;

import java.util.Optional;

public interface MediaAttachmentService {

    public MediaFile replaceSingleAttachment(MediaFile newMedia, MediaFileType mediaType, Long attachableId, MediaAttachmentType attachableType);

    public MediaAttachment createAttachment(MediaFile media, MediaFileType mediaType, Long attachableId, MediaAttachmentType attachableType);

    public MediaAttachment getAttachment(MediaAttachmentType attachableType, Long attachableId, MediaFileType mediaType);

    public Optional<MediaAttachment> findAttachment(MediaAttachmentType attachableType, Long attachableId, MediaFileType mediaType);

    public void deleteAttachment(MediaAttachment attachment);

}
