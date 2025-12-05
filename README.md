# 📦 Product Import & Management API

> A robust RESTful service built with **Node.js**, **Express**, and **MongoDB (Mongoose)** — designed to import, manage, filter, and query products from Excel at scale.

<p align="center"> <img src="https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js"/> <img src="https://img.shields.io/badge/Express.js-API-000000?style=for-the-badge&logo=express"/> <img src="https://img.shields.io/badge/MongoDB-6%2B-47A248?style=for-the-badge&logo=mongodb"/> <img src="https://img.shields.io/badge/Mongoose-ODM-880000?style=for-the-badge"/> <img src="https://img.shields.io/badge/ExcelJS-.xlsx-217346?style=for-the-badge&logo=microsoft-excel"/>

---

## 🚀 Overview

This project is a **RESTful backend service** that imports product data from Excel (.xlsx) into MongoDB and offers powerful querying, filtering, and pagination capabilities.

It is designed with **clean data modeling**, **duplicate prevention**, and **scalable query patterns** for real-world usage such as e-commerce platforms or large inventory systems.

Core Features:

- Excel-based data ingestion
- Duplicate prevention based on unique productCode
- Structured relationships:
  - Category → Subcategory → Product
- Advanced filtering
- Full-text multi-field search
- Pagination & sorting
- Date-based warranty analysis

## 🧩 Tech Stack

| Layer                | Technology              |
| -------------------- | ----------------------- |
| **Runtime**          | Node.js                 |
| **Framework**        | Express.js              |
| **ODM**              | Mongoose                |
| **Database**         | MongoDB                 |
| **File Parser**      | ExcelJS                 |
| **Validation**       | VineJS                  |
| **Containerization** | Docker + Docker Compose |
| **Logging**          | Winston / Console       |
| **Docs**             | Swagger                 |

---

## 🧱 Architecture Diagram

```mermaid
flowchart TD
    A[Client / Postman / Frontend]
    B[Express API]

    subgraph Database
        C[(Category)]
        D[(Subcategory)]
        E[(Product)]
    end

    A --> B
    B --> C
    B --> D
    B --> E

    D --> C
    E --> D
```

---

## 🧠 Design Highlights

- ✅ **Duplicate-safe import**  
  Uses productCode as a strict unique identifier
- 🧩 **Normalized data model**  
  Category → Subcategory → Product
- 🔍 **Multi-field search**  
  name, productCode, category, subcategory
- ⚡ **Optimized aggregation pipeline**
- 🧮 **Advanced filtering (AND-based)**
- 🗓️ **Warranty analysis (active / range filters)**
- 📄 **Detailed import report generation**

---

## 📦 Modules

---

## 🧱 Project Structure

---

## 🧰 Development Setup

```bash
# 1️⃣ Clone the repo
git clone https://github.com/SobhanHaghverdi/backend-task.git

# 2️⃣ Install dependencies
pnpm install

# 3️⃣ Set up environment
cp .env.example .env

# 4️⃣ Start development
pnpm run dev

```

---
