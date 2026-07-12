package io.github.ursoblanco23.capoeira_in_korea_backend.auth.filter;

import io.github.ursoblanco23.capoeira_in_korea_backend.auth.security.SecurityErrorResponseWriter;
import io.github.ursoblanco23.capoeira_in_korea_backend.auth.security.UserPrincipal;
import io.github.ursoblanco23.capoeira_in_korea_backend.auth.service.UserPrincipalService;
import io.github.ursoblanco23.capoeira_in_korea_backend.auth.token.JwtProvider;
import io.github.ursoblanco23.capoeira_in_korea_backend.exception.BusinessException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider; // validate + access userId 추출용
    private final UserPrincipalService userPrincipalService;
    private final SecurityErrorResponseWriter securityErrorResponseWriter;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        try {
            String accessToken = resolveBearerToken(request);

            if (accessToken != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                Long userId = jwtProvider.getUserIdFromAccessToken(accessToken);

                UserPrincipal userPrincipal = userPrincipalService.loadByUserId(userId);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userPrincipal,
                                null,
                                userPrincipal.getAuthorities()
                        );

                authentication.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                SecurityContext context = SecurityContextHolder.createEmptyContext();
                context.setAuthentication(authentication);
                SecurityContextHolder.setContext(context);
            }

            filterChain.doFilter(request, response);
        } catch (BusinessException e) {
            SecurityContextHolder.clearContext();
            log.warn("JWT authentication failed. errorCode={}", e.getErrorCode().getCode());
            securityErrorResponseWriter.writeErrorResponse(response, e.getErrorCode());
            return;
        }
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();

        return "/auth/login".equals(path)
                || "/auth/signup".equals(path)
                || "/auth/refresh".equals(path); //
    }

    private String resolveBearerToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (!StringUtils.hasText(header)) return null;
        if (!header.startsWith("Bearer ")) return null;
        return header.substring(7).trim();
    }
}
