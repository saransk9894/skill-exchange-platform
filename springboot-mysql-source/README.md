# Skill Exchange System - Spring Boot & MySQL Backend Setup

Welcome to the backend reference source directory for the **Skill Exchange System**. This microservice is engineered to manage user authentications, peer-to-peer barters, messaging, scheduling, rating reviews, and notifications.

---

## 📂 Project Folder Structure

```text
skill-exchange-backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── example/
│   │   │           └── skillexchange/
│   │   │               ├── SkillExchangeApplication.java
│   │   │               ├── config/
│   │   │               │   └── WebSecurityConfig.java
│   │   │               ├── controller/
│   │   │               │   ├── UserController.java
│   │   │               │   ├── SkillController.java
│   │   │               │   └── ExchangeRequestController.java
│   │   │               ├── model/
│   │   │               │   ├── User.java
│   │   │               │   ├── Skill.java
│   │   │               │   └── ExchangeRequest.java
│   │   │               └── repository/
│   │   │                   ├── UserRepository.java
│   │   │                   ├── SkillRepository.java
│   │   │                   └── ExchangeRequestRepository.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── schema.sql
├── pom.xml
└── README.md
```

---

## 🛠️ Installation Steps

### Prerequisites
- **Java Development Kit (JDK 17+)**
- **Maven 3.6+**
- **MySQL Server 8.0+**

### Step 1: Database Setup
1. Log in to your MySQL terminal or workbench:
   ```bash
   mysql -u root -p
   ```
2. Execute the schema generation script:
   ```sql
   SOURCE path/to/springboot-mysql-source/schema.sql;
   ```

### Step 2: Configure Spring Boot Properties
Edit `src/main/resources/application.properties` to map your local database parameters:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/skill_exchange_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD_HERE
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### Step 3: Run the Application
From the project root folder:
```bash
mvn clean install
mvn spring-boot:run
```
The server will boot up and bind to `http://localhost:8080/`.

---

## 📋 REST API Documentation

### 1. User Authentication (`/api/auth`)
* `POST /register`: Registers a new barter profile.
* `POST /login`: Validates password matching and returns User profile.
* `POST /forgot-password`: Resets credentials or generates tokens.

### 2. Skill Management (`/api/skills`)
* `GET /`: Lists all active skills with filtering options.
* `POST /`: Registers a new knowledge domain offered by a user.
* `PUT /{id}`: Modifies an existing skill level or description.
* `DELETE /{id}`: Discards a knowledge domain.

### 3. Exchange Requests (`/api/requests`)
* `GET /?userId=X`: Returns inbox requests received or dispatched by User X.
* `POST /`: Sends a brand new barter petition.
* `PATCH /{id}?status=accepted`: Transition status to `accepted`, `rejected`, or `cancelled`.

---

## 🚀 Deployment Guide (Production)

### Deploying with Docker to Cloud Run or AWS ECS
1. Create a `Dockerfile` at the root:
   ```dockerfile
   FROM openjdk:17-jdk-slim
   COPY target/skill-exchange-0.0.1-SNAPSHOT.jar app.jar
   ENTRYPOINT ["java", "-jar", "/app.jar"]
   ```
2. Build and package with Maven:
   ```bash
   mvn package -DskipTests
   ```
3. Compile the Docker Image:
   ```bash
   docker build -t skill-exchange-api .
   ```
4. Push to Container Registry (GCR / ECR) and bind container ports to ingress handlers. Make sure environment secrets are injected at runtime!
