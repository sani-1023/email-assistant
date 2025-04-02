FROM openjdk:17-oracle

# Define a build argument for the JAR file name
ARG JAR_FILE=email-helper-0.0.1-SNAPSHOT.jar

# Set the working directory inside the container
WORKDIR /app

# Copy the JAR file into the container
COPY target/${JAR_FILE} app.jar

# Set the entry point to run the application with specific JVM options
ENTRYPOINT ["java", "-Dfile.encoding=UTF-8", "-Xms50M", "-Xmx700M", "-XX:+CompactStrings", "-jar", "app.jar"]

# Expose the application port
EXPOSE 8080