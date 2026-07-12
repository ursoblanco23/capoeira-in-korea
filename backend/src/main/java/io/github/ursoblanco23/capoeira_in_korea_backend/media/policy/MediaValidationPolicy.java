package io.github.ursoblanco23.capoeira_in_korea_backend.media.policy;

import io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaFileType;

import java.util.List;

public interface MediaValidationPolicy {

    boolean supports(MediaFileType mediaFileType);

    long getMaxSize();

    List<String> getAllowedTypes();

    List<String> getAllowedExtensions();
}
