FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /build
COPY pom.xml ./
COPY shared/shared-common/pom.xml shared/shared-common/
COPY shared/shared-security/pom.xml shared/shared-security/
COPY shared/shared-messaging/pom.xml shared/shared-messaging/
COPY platform/iam/pom.xml platform/iam/
COPY platform/platform-registry/pom.xml platform/platform-registry/
COPY platform/tenant-manager/pom.xml platform/tenant-manager/

# Cache deps
RUN apk add --no-cache maven \
    && mvn -B -e -ntp -pl platform/iam -am dependency:go-offline -DskipTests

COPY . .
RUN mvn -B -e -ntp -pl platform/iam -am package -DskipTests

# === runtime ===
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /build/platform/iam/target/iam-service-*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java","-jar","/app/app.jar"]
