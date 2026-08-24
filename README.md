# Drivn

![status](https://img.shields.io/badge/status-development-brightgreen) [![CI](https://github.com/walid-olt/drivn/actions/workflows/CI.yml/badge.svg)](https://github.com/walid-olt/drivn/actions/workflows/CI.yml)

# Overview

Drivn is car rental platform built to provide a unified experience for both customers and agencies. It offers a interface for customers to browse and book cars, while providing agencies with tools to manage their fleet and reservations efficiently.

# The Problem

The car rental industry is fragmented, and most agencies operate independently, leading to a lack of standardization and inefficiencies in the booking process. Customers often have to navigate multiple platforms to find the best deals, while agencies struggle with managing their inventory and reservations effectively.

# The Solution

Drivn aims to solve these problems by creating a centralized platform that connects customers with multiple car rental agencies. This allows customers to easily compare prices and availability, while providing agencies with a solid system to manage their fleet and reservations.

# Features roadmap

- [ ] Agency Dashboard: A comprehensive dashboard for agencies to manage their fleet and reservations.
- [ ] Customer Interface: A user-friendly interface for customers to browse and book cars.
- [ ] Email Notifications: Automated email notifications for reservation confirmations, cancellations, and reminders.

# Tech Stack

| Component           |                                                                                                  Technology                                                                                                   |
| ------------------- | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| Frontend            |    [![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)](#) [![React Router](https://img.shields.io/badge/React_Router-CA4245?logo=react-router&logoColor=white)](#)    |
| UI                  | [![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000?logo=shadcnui&logoColor=fff)](#) [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?logo=tailwind-css&logoColor=white)](#) |
| State management    |                                                       [![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?logo=reactquery&logoColor=white)](#)                                                        |
| Backend             |     [![Node.js](https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white)](#) [![Express.js](https://img.shields.io/badge/Express.js-%23404d59.svg?logo=express&logoColor=%2361DAFB)](#)      |
| Database            |                                                       [![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?logo=mongodb&logoColor=white)](#)                                                        |
| API testing/docs    |                     ![Bruno](https://img.shields.io/badge/Bruno-F4AA41?logo=Bruno&logoColor=black) ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?logo=swagger&logoColor=173647)                      |
| Testing             |                                                             [![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=fff)](#)                                                              |
| CI/CD               |                                                [![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?logo=github-actions&logoColor=white)](#)                                                 |
| Containerization    |                                                            [![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)](#)                                                             |
| Deployment          |                                                             [![Render](https://img.shields.io/badge/Render-46E3B7?logo=render&logoColor=000)](#)                                                              |
| monorepo management |                                                          [![Turborepo](https://img.shields.io/badge/Turborepo-000?logo=turborepo&logoColor=fff)](#)                                                           |

# Repository Structure

- `apps/api/` - Node.js/Express backend API.
- `apps/client/` - React/React router frontend application.
- `packages/shared/` - Shared TypeScript types, validation schemas (zod), utility functions, and constants.

- the `packages/shared` package is used to share code between the frontend and backend, ensuring consistency and reducing duplication.
- each application (api and client) has its own `README.md` for documentation specific to that application.

# Getting Started

## Prerequisites

- Node.js (v24 or later)
- pnpm (v11 or later), you could also use npm or other package managers but pnpm is recommended
- turborepo (for monorepo management)
- Docker

## Installation and running

1. Clone the repository:

   ```bash
   git clone https://github.com/walid-olt/drivn.git
   cd drivn
   ```

2. Install dependencies:

   ```bash
   pnpm install # or npm install
   ```

3. Set up environment variables:
   - Create a `.env.development` file in the root directory and add the necessary environment variables (see `.env.example` for reference). Tests use `.env.test` and an in-memory MongoDB, so no setup is needed for them.
4. Start the development server:

   ```bash
   pnpm dev # builds the shared package and starts both the frontend and backend servers
   ```

## note

- you can also run the frontend and backend separately using `pnpm dev:client` and `pnpm dev:api` respectively.
- see the `package.json` scripts section for more details on available commands
