# Capoeira in Korea

국내 카포에이라 도장 정보를 지도에서 조회하고 관리하는 웹 프로젝트입니다.
프론트엔드와 백엔드를 하나의 저장소에서 관리하는 모노레포 구조입니다.

## 프로젝트 구조

| 경로 | 역할 |
| --- | --- |
| `front/` | React 기반 프론트엔드 |
| `backend/` | Spring Boot 기반 REST API |
| `infra/` | Nginx 및 개발 인프라 설정 |
| `compose.dev.yaml` | 개발용 데이터베이스와 Nginx 컨테이너 구성 |

## 기술 스택

버전은 저장소 설정에 선언된 주요 버전 기준입니다.
프론트엔드의 정확한 설치 버전은 `front/package-lock.json`에서 관리합니다.
백엔드의 버전이 생략된 의존성은 Spring Boot의 의존성 관리를 따릅니다.

### Frontend

| 구분 | 기술 | 용도 |
| --- | --- | --- |
| 언어 | TypeScript 5.8 | 정적 타입 기반 개발 |
| UI | React 19 | 컴포넌트 기반 화면 구성 |
| 빌드 | Vite 6, SWC | 개발 서버 및 프론트엔드 빌드 |
| 라우팅 | React Router 7 | 페이지 이동 및 경로 관리 |
| 서버 상태 | TanStack Query 5 | API 데이터 조회 및 캐시 관리 |
| 클라이언트 상태 | Zustand 5, Immer 10 | 공유 상태 및 불변 상태 업데이트 |
| HTTP 통신 | Axios 1 | 백엔드 API 요청 |
| 스타일 | CSS, Tailwind CSS 3, PostCSS, Autoprefixer | 화면 스타일 및 CSS 처리 |
| 알림 | React Toastify 11 | 토스트 알림 |
| 코드 검사 | ESLint 9, typescript-eslint | TypeScript 및 React 코드 정적 검사 |
| 패키지 관리 | npm | 의존성 및 스크립트 관리 |

### Backend

| 구분 | 기술 | 용도 |
| --- | --- | --- |
| 언어 | Java 21 | 백엔드 애플리케이션 개발 |
| 프레임워크 | Spring Boot 3.5.0, Spring Web | REST API 및 애플리케이션 구성 |
| 데이터 접근 | Spring Data JPA, Hibernate | 엔티티 매핑 및 데이터 영속성 관리 |
| 보안 | Spring Security, JJWT 0.13.0 | 인증·인가 및 JWT 처리 |
| 입력 검증 | Jakarta Validation | 요청 데이터 유효성 검증 |
| 전화번호 처리 | libphonenumber 9.0.37 | 전화번호 파싱 및 검증 |
| 코드 생성 | Lombok | 반복적인 Java 코드 생성 |
| 빌드 | Gradle Wrapper 8.14 | 의존성 관리, 빌드 및 테스트 실행 |
| 테스트 | Spring Boot Starter Test, JUnit Jupiter, Mockito | 백엔드 테스트 및 의존성 모킹 |

### 개발 환경 및 외부 서비스

| 구분 | 기술 | 용도 |
| --- | --- | --- |
| 개발 환경 | Linux / WSL | 로컬 개발 및 실행 |
| 컨테이너 | Docker, Docker Compose | 개발용 인프라 실행 |
| 데이터베이스 | PostgreSQL 17, PostGIS 3.5 포함 이미지 | 개발용 관계형 데이터베이스 |
| 웹 서버 | Nginx 1.25 | 개발용 HTTPS, 리버스 프록시 및 업로드 파일 제공 |
| 지도 | Kakao Maps JavaScript API | 지도 표시 및 주소 좌표 변환 |
| 주소 검색 | Daum 우편번호 서비스 | 우편번호 및 주소 검색 |
