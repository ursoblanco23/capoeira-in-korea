package io.github.ursoblanco23.capoeira_in_korea_backend.media.service;

import io.github.ursoblanco23.capoeira_in_korea_backend.media.entity.MediaAttachment;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.entity.MediaFile;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaAttachmentType;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaFileType;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface MediaAttachmentService {

    public MediaFile replaceSingleAttachment(MediaFile newMedia, MediaFileType mediaType, long attachableId, MediaAttachmentType attachableType);

    public MediaAttachment createAttachment(MediaFile media, MediaFileType mediaType, long attachableId, MediaAttachmentType attachableType);

    public MediaAttachment getAttachment(MediaAttachmentType attachableType, long attachableId, MediaFileType mediaType);

    public Optional<MediaAttachment> findAttachment(MediaAttachmentType attachableType, long attachableId, MediaFileType mediaType);

    Optional<MediaAttachment> findActiveAttachment(MediaAttachmentType attachableType, long attachableId, MediaFileType mediaType);

    List<MediaAttachment> findAllActiveAttachments(MediaAttachmentType attachableType, Collection<Long> attachableIds, MediaFileType mediaType);

    public void deleteAttachment(MediaAttachment attachment);

}
