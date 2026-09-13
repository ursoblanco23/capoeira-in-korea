package io.github.ursoblanco23.capoeira_in_korea_backend.media.dto;

public interface MediaMetadata {

    Integer getWidth();

    Integer getHeight();

    default Integer getDurationSeconds() {
        return null;
    }
}
