# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
# Copy the entire structure
COPY . .
# Build the nested project
RUN mvn clean install -DskipTests -f auth-app-backend/auth-app-backend/pom.xml

# Stage 2: Run
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/auth-app-backend/auth-app-backend/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-Xmx300m", "-Xss512k", "-XX:CICompilerCount=2", "-jar", "app.jar"]