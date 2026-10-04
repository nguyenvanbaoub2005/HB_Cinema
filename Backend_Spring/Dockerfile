# Sử dụng pre-built JAR - không cần Maven trên server
# JAR được build sẵn ở máy dev trước khi deploy
FROM amazoncorretto:21.0.4

WORKDIR /app

# Copy file JAR đã được build sẵn
COPY target/*.jar app.jar

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
