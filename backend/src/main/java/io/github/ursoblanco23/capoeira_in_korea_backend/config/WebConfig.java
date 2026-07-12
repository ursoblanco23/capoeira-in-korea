package io.github.ursoblanco23.capoeira_in_korea_backend.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Slf4j
@Configuration
public class WebConfig implements WebMvcConfigurer { // MVC, CORS, Resource 관련 설정

// spring security config 에서 cors 설정 추가했음.
//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/**")
//                .allowedOrigins("http://localhost:5173") // React 개발 서버 주소
//                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
//                .allowedHeaders("*")
//                .allowCredentials(true);
//    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String location = "file:///C:/Users/taemin/workSpace/my-project/capoeira-in-korea-backend/upload/";

        registry.addResourceHandler("/upload/**")
                .addResourceLocations(location)
//                .setCachePeriod(60 * 60 * 24 * 7) // 1주일 동안 캐시 (초 단위)
        ;
    }
}
