FROM maven:3.9.6-eclipse-temurin-21 AS build
LABEL authors="Kuldeep"
WORKDIR /app

COPY pom.xml .

RUN mvn dependency:resolve

COPY src ./src

RUN mvn package -DskipTests

FROM eclipse-temurin:21-jre-alpine
LABEL authors="Kuldeep"

WORKDIR /app

COPY --from=build /app/target/*.jar ./app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]