FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /build
COPY pom.xml ./
COPY shared/shared-common/pom.xml shared/shared-common/
COPY shared/shared-security/pom.xml shared/shared-security/
COPY shared/shared-messaging/pom.xml shared/shared-messaging/
COPY platform/tenant-manager/pom.xml platform/tenant-manager/
RUN apk add --no-cache maven \
    && mvn -B -e -ntp -pl platform/tenant-manager -am dependency:go-offline -DskipTests
COPY . .
RUN mvn -B -e -ntp -pl platform/tenant-manager -am package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /build/platform/tenant-manager/target/tenant-manager-service-*.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java","-jar","/app/app.jar"]
