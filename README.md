# Roamly | Distributed Booking Platform 🌍

Roamly is a high-availability travel booking ecosystem engineered with a **Microservices Architecture**. The platform is designed to handle high loads and provide real-time pricing updates through event streaming.

---

## 🏗️ System Architecture
The project follows **Clean Architecture** and **DDD (Domain-Driven Design)** principles, ensuring high maintainability and scalability.

- **API Gateway (YARP)**: Unified entry point for all client requests.
- **Identity Service**: Secure stateless authentication using **JWT** and ASP.NET Identity.
- **Catalog Service**: High-performance hotel search powered by **Redis** caching.
- **Booking Service**: Transactional management of reservations.
- **Price Hunter (Price Tracking)**: Asynchronous service that monitors price changes via **Apache Kafka**.

---

## 🛠️ Tech Stack

- **Backend**: .NET 9 (ASP.NET Core Web API)
- **Communication**: Apache Kafka (Event-Driven), REST (Synchronous)
- **Storage**: PostgreSQL (Relational Data), Redis (Distributed Cache)
- **Security**: JWT Bearer Authentication
- **Observability**: Serilog (Structured Logging)
- **DevOps**: Docker & Docker Compose

---

## 🚀 Key Features

- **Event-Driven Price Updates**: Real-time notifications when hotel prices drop, powered by Kafka streams.
- **Stateless Auth**: Robust security implementation with JWT, allowing horizontal scaling of services.
- **Advanced Caching**: Minimal latency for hotel searches using optimized Redis storage.
- **Structured Logging**: Deep visibility into distributed transactions with Serilog.

---

## 🚦 Quick Start

### Prerequisites
- Docker & Docker Compose
- .NET 9 SDK

### Installation
1. Clone the repository:
   ```bash
   git clone [https://github.com/AmletixQ/Roamly-Platform.git](https://github.com/AmletixQ/Roamly-Platform.git)
2. Start all services:
   ```bash
   docker-compose up -d
   ```
