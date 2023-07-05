# Grocery list NextJS Experiment

[![Playwright Tests](https://github.com/vviikk/nextjs-research/actions/workflows/playwright.yml/badge.svg?branch=main)](https://github.com/vviikk/nextjs-research/actions/workflows/playwright.yml)

[Open in CodeSandbox](https://shorturl.at/ejwQV)

# What is this?

![Alt text](.docs/assets/image.png)

![Alt text](.docs/assets/image-1.png)

```bash
$ npm run dev # starts the dev server

# or
$ npm run build # builds the app
$ npm run start # starts the app
```

An example app allowing users to make their grocery lists.

Here are user stories that should be covered:

- As a user, I can view my grocery list
- As a user, I can add, edit and delete items to my grocery list
- As a user, I can add an amount to each item in the list
- As a user, I can mark an item as bought. This will cross out the title and mark the checkbox as checked.

Tech stack:

- NextJS
- react-query
- MUI
- Node
- Playwright for e2e tests
- Jest for unit tests
- supertest for Nodejs tests
- Github Actions for CI
