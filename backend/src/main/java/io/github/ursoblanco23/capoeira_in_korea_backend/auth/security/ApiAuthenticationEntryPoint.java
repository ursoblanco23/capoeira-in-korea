package io.github.ursoblanco23.capoeira_in_korea_backend.auth.security;

import io.github.ursoblanco23.capoeira_in_korea_backend.exception.constants.ErrorCode;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
@Component
public class ApiAuthenticationEntryPoint implements AuthenticationEntryPoint {
    private final SecurityErrorResponseWriter securityErrorResponseWriter;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException {
        log.warn("Authentication failed. uri: {}, method: {}, message: {}",
                request.getRequestURI(),
                request.getMethod(),
                authException.getMessage()
                );

        securityErrorResponseWriter.writeErrorResponse(response, ErrorCode.AUTH_UNAUTHORIZED);
    }
}
