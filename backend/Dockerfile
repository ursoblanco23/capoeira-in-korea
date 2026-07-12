# 1) Build stage
FROM gradle:8.10-jdk21-alpine AS build
WORKDIR /app

# 캐시 효율을 위해 먼저 설정 파일들만 복사
COPY build.gradle settings.gradle gradlew /app/
COPY gradle /app/gradle

# 의존성 캐시 (선택이지만 빌드 속도에 도움)
RUN ./gradlew dependencies --no-daemon || true

# 소스 복사 후 빌드
COPY src /app/src
RUN ./gradlew bootJar -x test --no-daemon


# 2) Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# 빌드 결과물 복사
COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]


