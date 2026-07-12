package io.github.ursoblanco23.capoeira_in_korea_backend.media.util;

import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Locale;
import java.util.UUID;

@NoArgsConstructor
public final class FileNameUtils {

    public static String generateUniqueFileName(String originalFilename) {
        String extension = getExtension(originalFilename);
        String uuid = UUID.randomUUID().toString();

        if (extension.isBlank()) {
            return uuid;
        }
        return uuid + "." + extension;
    }

    public static String getExtension(String filename) {
        if (filename == null || filename.isBlank()) {
            return "";
        }

        String normalizedFilename = filename.replace("\\", "/");
        String submittedFilename = normalizedFilename.substring(normalizedFilename.lastIndexOf("/") + 1);
        int extensionIndex = submittedFilename.lastIndexOf(".");

        if (extensionIndex < 0 || extensionIndex == submittedFilename.length() - 1) {
            return "";
        }

        return submittedFilename.substring(extensionIndex + 1).toLowerCase(Locale.ROOT);
    }

    public static boolean hasExtensionIn(String filename, List<String> allowedExtensions) {
        String extension = getExtension(filename);
        return !extension.isBlank()
                && allowedExtensions.stream()
                .anyMatch(allowedExtension -> extension.equalsIgnoreCase(allowedExtension));
    }
}
