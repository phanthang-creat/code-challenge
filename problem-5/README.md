# Problem 5

Project by: Thang Phan

<p align="center">
<a href="https://bun.sh/" target="_blank"><img src="https://img.shields.io/badge/Bun-000?logo=bun&logoColor=fff" alt="Bun" /></a>
<a href="https://www.typescriptlang.org/" target="_blank"><img src="https://img.shields.io/badge/Typescript-000?logo=typescript&logoColor=fff" alt="Typescript" /></a>
<a href="https://expressjs.com/" target="_blank"><img src="https://img.shields.io/badge/Express-000?logo=express&logoColor=fff" alt="Express JS" /></a>
<a href="https://sequelize.org/" target="_blank"><img src="https://img.shields.io/badge/Sequelize-000?logo=sequelize&logoColor=fff" alt="Sequelize" /></a>
<a href="https://swagger.io/" target="_blank"><img src="https://img.shields.io/badge/Swagger-000?logo=swagger&logoColor=fff" alt="Swagger" /></a>
<a href="https://www.postgresql.org/" target="_blank"><img src="https://img.shields.io/badge/PostgreSQL-000?logo=postgresql&logoColor=fff" alt="PostgreSQL" /></a>
    
</p>

## Table of contents

1. Technologies
2. Project Structure
3. Getting Started
    - Clone the repository
    - Migration
    - Install dependencies
    - Run the project
    - Run with Docker
4. Note


## 1. Technologies

The following technologies are used in the project:

1. **_Language_**: Typescript / Javascript
2. **_Environment_**: Bun
3. **_Database_**: PostgreSQL
4. **_Framework_**: Express
   - API Documentation: Swagger - OpenAPI
   - Builder: Bun
   - ORM: Sequelize
   - API Query Handler: sequelize-api-paginate
   - Validator field: Joi

## 2. Project Structure

```
└── 📁src
    └── 📁controller
        └── 📁api
        └── 📁routes
    └── 📁interface
    └── 📁middleware
        └── index.ts
        └── query-modifier.ts
        └── response.ts
        └── 📁validator
            └── 📁schema
                └── 📁dto
                └── 📁meta
            └── 📁uuid
    └── 📁repository
        └── 📁database
            └── 📁query
                └── 📁lib
        └── 📁model
        └── 📁provider
    └── 📁service
    └── 📁template
        └── 📁docs
    └── index.ts
    └── root.ts
    └── server.ts
```

## 3. 🚀 Getting Started

If you want to run the project, you can follow the steps below, or you can run the project with Docker.

1. **_Clone the repository_**

```bash
git clone https://github.com/phanthang-creat/code-challenge.git
cd problem-5
```

2. **_Migration_**

**Make sure you have PostgreSQL installed on your machine.**

```bash
bunx sequelize-cli db:migrate
```

**If you want to create seed data, you can run the following command:**

```bash
bunx sequelize-cli db:seed:all
```

3. **_Install dependencies_**

**Make sure you have bun installed on your machine.**

```bash
bun install
```

4. **_Run the project_**

```bash
# Development
bun start:dev
```

- The server will run on port 3000 by default so you can access it at `http://localhost:3000` in your browser.
- The API documentation will be available at `http://localhost:3000/api/docs` in your browser.

## Run with Docker

You can also run the project with Docker. Make sure you have Docker installed on your machine.

```bash
docker-compose up --build
```

- The server will run on port 3000 by default so you can access it at `http://localhost:3000` in your browser.
- The API documentation will be available at `http://localhost:3000/api/docs` in your browser.

## Note

- Because this project is public, I will include the local environment variables in the repository. However, in a real project, we should not include the environment variables in the repository. Instead, we should use the `.env` file to store the environment variables.
