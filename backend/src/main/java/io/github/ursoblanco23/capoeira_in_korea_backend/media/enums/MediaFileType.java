package io.github.ursoblanco23.capoeira_in_korea_backend.media.enums;

public enum MediaFileType {
    GENERAL(MediaKind.IMAGE),
    THUMBNAIL(MediaKind.IMAGE),
    PROFILE_IMAGE(MediaKind.IMAGE);

    private final MediaKind mediaKind;

    MediaFileType(MediaKind mediaKind) {
        this.mediaKind = mediaKind;
    }

    public MediaKind getMediaKind() {
        return mediaKind;
    }
}