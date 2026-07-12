package io.github.ursoblanco23.capoeira_in_korea_backend.media.service;

import io.github.ursoblanco23.capoeira_in_korea_backend.exception.BusinessException;
import io.github.ursoblanco23.capoeira_in_korea_backend.exception.constants.ErrorCode;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.dto.ImageFileUploadResult;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.enums.MediaFileType;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.policy.MediaStoragePolicy;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.policy.resolver.MediaStoragePolicyResolver;
import io.github.ursoblanco23.capoeira_in_korea_backend.media.util.FileNameUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Slf4j
@RequiredArgsConstructor
@Service
@Transactional
public class LocalStorageService implements StorageService {

    private static final DateTimeFormatter YEAR_MONTH_FORMATTER = DateTimeFormatter.ofPattern("yyyy/MM");

    private final MediaStoragePolicyResolver mediaStoragePolicyResolver;

    // TODO: dojang side cleanup is still pending; keep this service contract aligned with existing callers.

    @Value("${storage.local.base-path}")
    private String basePath;

    @Override
    public ImageFileUploadResult uploadFile(MultipartFile file, MediaFileType mediaFileType) {
        LocalDateTime uploadedAt = LocalDateTime.now();
        String yearMonth = uploadedAt.format(YEAR_MONTH_FORMATTER);

        MediaStoragePolicy storagePolicy = mediaStoragePolicyResolver.resolve(mediaFileType);
        String publicDirectoryPath = createPublicPath(storagePolicy.getDirectoryBy(mediaFileType), yearMonth);

        ImageFileUploadResult uploadResult = saveFile(file, publicDirectoryPath, uploadedAt);

        log.info("DB filePath: {}", uploadResult.getFilePath());
        return uploadResult;
    }

    private ImageFileUploadResult saveFile(
            MultipartFile file,
            String publicDirectoryPath,
            LocalDateTime uploadedAt
    ) {
        try {
            String fileName = FileNameUtils.generateUniqueFileName(file.getOriginalFilename());
            String publicFilePath = createPublicPath(publicDirectoryPath, fileName);
            Path storedFilePath = resolveStoredFilePath(publicFilePath);

            createStoredDirectory(storedFilePath.getParent());
            file.transferTo(storedFilePath.toFile());

            return ImageFileUploadResult.builder()
                    .fileName(fileName)
                    .originalName(file.getOriginalFilename())
                    .filePath(publicFilePath)
                    .mimeType(file.getContentType())
                    .size(file.getSize())
                    .uploadedAt(uploadedAt)
                    .build();
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.STORAGE_FILE_SAVE_FAILED, e);
        }
    }

    @Override
    public void deleteFile(String filePath) {
        try {
            Path path = resolveStoredFilePath(filePath);

            if (Files.exists(path)) {
                log.info("Deleting file: {}, size: {}KB", path, Files.size(path) / 1024);
                Files.delete(path);
                log.info("File deleted: {}", path);
            } else {
                log.warn("File does not exist, skipping delete: {}", path);
            }
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.STORAGE_FILE_DELETE_FAILED, e);
        }
    }

    /**
     *
     * @param publicFilePath media type에 따른 논리 경로
     * @return Path =  local storage 저장소 경로 + publicFilePath
     */

    private Path resolveStoredFilePath(String publicFilePath) {
        if (publicFilePath == null || publicFilePath.isBlank()) {
            throw new BusinessException(ErrorCode.STORAGE_FILE_DELETE_FAILED, "File path is empty.");
        }

        Path rootDirectory = Paths.get(basePath).toAbsolutePath().normalize();
        String relativePath = publicFilePath.replaceFirst("^[\\\\/]+", "");
        Path resolvedPath = rootDirectory.resolve(relativePath).normalize();

        if (!resolvedPath.startsWith(rootDirectory)) {
            throw new BusinessException(ErrorCode.STORAGE_FILE_DELETE_FAILED, "Invalid file path: " + publicFilePath);
        }

        return resolvedPath;
    }

    private void createStoredDirectory(Path storedDirectory) {
        if (storedDirectory == null) {
            throw new BusinessException(ErrorCode.STORAGE_DIRECTORY_CREATE_FAILED, "Stored directory is empty.");
        }

        try {
            Files.createDirectories(storedDirectory);
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.STORAGE_DIRECTORY_CREATE_FAILED, e);
        }
    }

    private String createPublicPath(String basePath, String path) {
        String normalizedBasePath = basePath
                .replace('\\', '/')
                .replaceAll("/+$", "");
        String normalizedPath = path
                .replace('\\', '/')
                .replaceFirst("^/+", "");
        return normalizedBasePath + "/" + normalizedPath;
    }
}
