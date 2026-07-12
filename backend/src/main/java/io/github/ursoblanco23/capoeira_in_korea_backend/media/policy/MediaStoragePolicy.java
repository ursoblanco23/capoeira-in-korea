package io.github.ursoblanco23.capoeira_in_korea_backend.media.policy;

import io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaFileType;

public interface MediaStoragePolicy {

    boolean supports(MediaFileType mediaFileType);

    String getBaseDir();

    String getDirectoryBy(MediaFileType mediaFileType);

}
