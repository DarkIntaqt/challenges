# Contributing Guidelines

Thank you for considering contributing to this project! We welcome any contributions, big or small. Here are some guidelines to help you get started:

## Reporting Issues

If you encounter a bug or have a feature request, please create an issue in the GitHub repository. Be sure to provide a clear and detailed description of the problem, including any steps needed to reproduce it. 

## Making Changes

If you want to fix an issue or add a new feature, we encourage you to create a pull request (PR).
<br>
However, if you're not sure whether your feature is desired or would like some feedback before starting work, feel free to ask in an issue first. Here are the steps to follow:

1. Fork the repository and clone it to your local machine.
2. Create a new branch for your changes.
3. Make your changes and commit them with clear and concise commit messages.
4. Push your branch to your forked repository.
5. Open a PR to the main repository, with a clear description of the changes you made and why they are valuable.

We will review your PR and provide feedback as needed. 

## Getting Started

**This version of the frontend shouldn't be edited anymore, as it should be replaced by nextJS (see section below).**

To set up the project on your local machine, follow these steps:

1. Clone the repository to your local machine: 
```shell
git clone https://github.com/DarkIntaqt/challenges.git
```
2. Navigate to the challenges directory:
```shell
cd ./challenges
```
3. Install the required dependencies:
```shell
npm install
```
4. Start the project:
```shell
npm start
```

## NextJs Migration

Currently, the frontend is rewritten in nextJs [#136](https://github.com/DarkIntaqt/challenges/issues/136). 
To set up the nextJS branch on your local machine, follow these steps. 

1. Clone the repository to your local machine: 
```bash
git clone https://github.com/DarkIntaqt/challenges.git
```
2. Navigate to the challenges directory:
```bash
cd ./challenges
```
3. Change to the nextJS feature branch:
```shell
git checkout next
```
4. Install the required dependencies:
```shell
npm install
```
5. Start the project:
```shell
npm run dev
```