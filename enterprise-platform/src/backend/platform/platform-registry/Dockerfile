FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /build
COPY pom.xml ./
COPY shared/shared-common/pom.xml shared/shared-common/
COPY shared/shared-security/pom.xml shared/shared-security/
COPY shared/shared-messaging/pom.xml shared/shared-messaging/
COPY platform/platform-registry/pom.xml platform/platform-registry/
RUN apk add --no-cache maven \
    && mvn -B -e -ntp -pl platform/platform-registry -am dependency:go-offline -DskipTests
COPY . .
RUN mvn -B -e -ntp -pl platform/platform-registry -am package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /build/platform/platform-registry/target/platform-registry-service-*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java","-jar","/app/app.jar"]
