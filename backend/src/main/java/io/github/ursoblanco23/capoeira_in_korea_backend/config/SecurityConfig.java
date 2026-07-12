package io.github.ursoblanco23.capoeira_in_korea_backend.config;

import io.github.ursoblanco23.capoeira_in_korea_backend.auth.filter.JwtAuthenticationFilter;
import io.github.ursoblanco23.capoeira_in_korea_backend.auth.security.ApiAccessDeniedHandler;
import io.github.ursoblanco23.capoeira_in_korea_backend.auth.security.ApiAuthenticationEntryPoint;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

import org.springframework.core.annotation.Order;
import org.springframework.core.Ordered;

@Configuration
@EnableWebSecurity
public class SecurityConfig { // 인증/인가 관련

    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE) // 이 SecurityConfig를 우선 적용
    SecurityFilterChain filterChain(
            HttpSecurity http,
            JwtAuthenticationFilter jwtFilter,
            ApiAuthenticationEntryPoint authenticationEntryPoint,
            ApiAccessDeniedHandler accessDeniedHandler
    ) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)

//                // 혹시 oauth2 의존성 있으면 이것도 꺼줘야 redirect 사라짐
//                .oauth2Login(AbstractHttpConfigurer::disable)
//                .oauth2Client(AbstractHttpConfigurer::disable)

                .exceptionHandling(e -> e
                        .authenticationEntryPoint(authenticationEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler)
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // OPTIONS 메서드로 요청되는 모든 url은 허용한다는 의미
                        .requestMatchers(HttpMethod.GET,"/dojangs/**", "/upload/**").permitAll() // GET 메서드로 요청되는 모든 url중 왼쪽에 설정한 애들만 허용
                        .requestMatchers("/auth/**").permitAll() // 모든 메서드의 해당 url은 허용
                        .requestMatchers(HttpMethod.POST, "/auth/logout").authenticated()
//                        .requestMatchers("/admin/**").hasRole("ADMIN") // TODO: 나중에 정확한 url과 해당 url에 맞는 권한명으로 변경 필요
                        .anyRequest().authenticated() //나머지 요청 url은 인증이 필요하다.
                )
                .build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
                "http://localhost:5173"
                ,"https://app.local.test"
        ));
        config.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L); //Preflight 결과를 1시간 캐시

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

}
