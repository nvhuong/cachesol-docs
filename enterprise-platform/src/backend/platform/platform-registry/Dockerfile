# =====================================================
# cachesol multi-service build pattern
# =====================================================

FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /build
ARG SERVICE_PATH

COPY pom.xml pom.xml
COPY shared/shared-common/pom.xml shared/shared-common/pom.xml
COPY shared/shared-security/pom.xml shared/shared-security/pom.xml
COPY shared/shared-messaging/pom.xml shared/shared-messaging/pom.xml
COPY platform/iam/pom.xml platform/iam/pom.xml
COPY platform/platform-registry/pom.xml platform/platform-registry/pom.xml
COPY platform/tenant-manager/pom.xml platform/tenant-manager/pom.xml

RUN apk add --no-cache maven \
    && mvn -B -e -ntp dependency:go-offline -DskipTests || true

COPY shared/ shared/
COPY platform/ platform/

RUN mvn -B -e -ntp -pl "${SERVICE_PATH}" -am package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
ARG SERVICE_PATH
COPY --from=builder /build/${SERVICE_PATH}/target/*.jar /app/app.jar
EXPOSE 8081
ENTRYPOINT ["java","-jar","/app/app.jar"]
