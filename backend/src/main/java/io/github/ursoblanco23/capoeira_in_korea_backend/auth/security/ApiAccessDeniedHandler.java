package io.github.ursoblanco23.capoeira_in_korea_backend.auth.security;

import io.github.ursoblanco23.capoeira_in_korea_backend.exception.constants.ErrorCode;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
@Component
public class ApiAccessDeniedHandler implements AccessDeniedHandler {
    private final SecurityErrorResponseWriter securityErrorResponseWriter;

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException {
        log.warn("Access denied. uri: {}, method: {}, message: {}",
                request.getRequestURI(),
                request.getMethod(),
                accessDeniedException.getMessage()
        );

        securityErrorResponseWriter.writeErrorResponse(response, ErrorCode.AUTH_ACCESS_DENIED);
    }
}
