## Overview
This project is primarily written in typescript and it is mainly structured around a server meant for a mobile app which helps users order food items. It makes use of a few notable libraries such as:

- Pnpm (package manager).
- Pnpm monorepo (for managing inter-package dependencies in the workspace).
- Typespec for api documentation.
- Nx for making processes in the monorepo more efficient.

Throughout this styleguide I might call packages in this workspace `package` or `app`, when I do, just know that I mean the same thing. The only 'distinction' between an `app` and a `package` is that an `app` is meant to be run whereas a `package` is typically meant to be imported and used by an `app`.

The main structure of this monorepo is as follows
- Backend
  Package name: @grovine/backend
  Path: ./apps/backend
  Description: This is the main backend server.
  Notable technologies used:
    - hono (as the web server/router).
    - kysely (database client).
- Docs
  Package name: @grovine/docs
  Path: ./apps/docs
  Description: Visual documentation of the whole documentation for the project. The full documentation includes written documentation and the API documentation.
  Notable technologies used:
    - Vitepress (the main documentation tool)
- Media Server
  Package name: @grovine/media-server
  Path: ./apps/media-server
  Description: A makeshift media server meant to mock the main storage solution (which is Cloudinary) and run locally.
  Notable technologies used:
    - hono
- API
  Package name: @grovine/api
  Path: ./packages/api
  Description: This package contains the types and schemas used by other packages in this monorepo. The spec (typespec) files in the docs-openapi package project are used during the build stage to generate typescript types and schemas for this package.
  Notable technologies used:
    - openapi-typescript
- Docs OpenAPI
  Package name: @grovine/docs-openapi
  Path: ./packages/docs-openapi
  Description: API documentation (spec) for the backend. This package is primarily meant to serve as a source of truth for the API endpoints that need to be implemented by the backend.
  Notable technologies used:
    - typespec

### Quick Sidenotes

- To run any script for a specific package your can just add a `--filter` prefix to the `pnpm` command. e.g: `pnpm --filter @grovine/backend build`.
  But to be honest, most of the time it's preferred you run the script at the root of the project (if it's a command that other packages have). For example: Rather run `pnpm --filter @grovine/backend build` it's much preferred if you run `pnpm build`. The reason being that since this workspace uses nx, if there's other dependent packages that also need their build phase to be run, it'll be run in order.

- To perform database related tasks like creating a new migration, you can make use of the `db` script available in the backend package. E.g: `pnpm --filter @grovine/backend db migrate:make create_referrals_table` would create a new migration in the migrations folder in the backend package for creating referrals table.
