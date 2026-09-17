# =====================================================
# cachesol multi-service build pattern:
# Stage 1: build tất cả modules 1 lần ở root (chứa parent POM)
# Stage 2: copy đúng jar của service cần build
# =====================================================

# ---------- Stage 1: build chung (parent + shared libs + service jar) ----------
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /build

# 1. Root pom.xml (parent POM, quản lý version + modules)
COPY pom.xml pom.xml

# 2. Tất cả shared module pom.xml (cache dependency)
COPY shared/shared-common/pom.xml shared/shared-common/pom.xml
COPY shared/shared-security/pom.xml shared/shared-security/pom.xml
COPY shared/shared-messaging/pom.xml shared/shared-messaging/pom.xml

# 3. Tất cả platform module pom.xml
COPY platform/iam/pom.xml            platform/iam/pom.xml
COPY platform/platform-registry/pom.xml platform/platform-registry/pom.xml
COPY platform/tenant-manager/pom.xml   platform/tenant-manager/pom.xml

# 4. Resolve deps (cache) — chỉ dùng modules được khai báo, không cần child src/java
RUN apk add --no-cache maven \
    && mvn -B -e -ntp dependency:go-offline -DskipTests || true

# 5. Copy source code cho TOÀN BỘ module được khai báo trong parent POM
COPY shared/         shared/
COPY platform/       platform/

# 6. Build ONLY parent + shared + service cần thiết (cụ thể sẽ override ở stage 2)
ARG SERVICE_PATH
RUN mvn -B -e -ntp -pl "${SERVICE_PATH}" -am package -DskipTests

# ---------- Stage 2: runtime ----------
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
ARG SERVICE_PATH
# Copy specific jar (pattern: <service>/target/*-SNAPSHOT.jar → "*.jar")
COPY --from=builder /build/${SERVICE_PATH}/target/*.jar /app/app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
