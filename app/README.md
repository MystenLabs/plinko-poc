# Plinko app/ directory - UI, API & DB

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
This project is using the [NextJS App Router](https://nextjs.org/docs/app), and therefore following a corresponding project structure.

### Usage

- Install the npm dependencies with: `pnpm install`
- Start the development server with `pnpm run dev`
- Build the project with: `pnpm run build`
- Serve the built project with: `pnpm run start`

### Directories structure

- `src/`
  - `app/`:
    - contains all the .tsx files, that are rendered as pages of the UI
    - organized in subdirectories based on the desired URL path of each page in the final UI
    - for more details, see: [NextJS App Router: Defining Routes](https://nextjs.org/docs/app/building-your-application/routing/defining-routes)
  - `components/`:
    - contains the code for all the tsx components
    - organized in subdirectories based on the usage of each component
  - `constants/`
  - `contexts/`:
    - contains the code for all the React Providers and Contexts used to organize the project's global storage
  - `helpers/`
  - `hooks/`:
    - contains the TS code for all the custom react hooks that are being used in this app
  - `lib/`:
    - auto-generated directory, created upon the setup of the Radix UI and Shadcn libraries
  - `styles/`:
    - contains the global css file, used mainly for the colors of the UI components
  - `types/`:
    - contains some globally used TS interfaces of the project
