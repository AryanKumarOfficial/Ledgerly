# Contributing Guide

Thank you for your interest in contributing! 🎉
This document outlines the process and guidelines to help you contribute effectively and maintain high code quality.

---

## 📌 Table of Contents

- Code of Conduct
- Getting Started
- Project Setup
- Branching Strategy
- Commit Guidelines
- Pull Request Process
- Coding Standards
- Reporting Bugs
- Suggesting Features

---

## 🤝 Code of Conduct

By participating in this project, you agree to:

- Be respectful and professional
- Provide constructive feedback
- Collaborate openly and responsibly

---

## 🚀 Getting Started

### 1. Fork the repository

Click **Fork** at the top right of the repository.

### 2. Clone your fork

```bash
git clone https://github.com/aryankumarofficial/ledgerly.git
cd ledgerly
```

### 3. Add upstream remote

```bash
git remote add upstream https://github.com/aryankumarofficial/ledgerly.git
```

---

## 🛠 Project Setup

Install dependencies:

```bash
bun install
```

Run development server:

```bash
bun run dev
```

Build project:

```bash
bun run build
```

---

## 🌿 Branching Strategy

Never commit directly to `main`.

Create a new branch:

```bash
git checkout -b feature/short-description
```

Branch naming examples:

```
feature/user-authentication
fix/login-error
refactor/api-structure
docs/update-readme
```

---

## 📝 Commit Guidelines (Conventional Commits)

We follow **Conventional Commits**.

Format:

```
type(scope): short description
```

Examples:

```
feat(auth): add JWT authentication
fix(api): resolve validation error
refactor(database): improve schema structure
docs: update installation guide
chore: update dependencies
```

Commit types:

| Type     | Description              |
| -------- | ------------------------ |
| feat     | New feature              |
| fix      | Bug fix                  |
| docs     | Documentation            |
| style    | Formatting only          |
| refactor | Code restructuring       |
| perf     | Performance improvements |
| test     | Add or update tests      |
| chore    | Maintenance              |

---

## 🔁 Pull Request Process

1. Ensure your branch is up to date:

```bash
git pull upstream main
```

2. Push your branch:

```bash
git push origin feature/your-feature-name
```

3. Open a Pull Request

Include:

- Clear title
- Description of changes
- Screenshots (if UI)
- Related issue number

Example:

```
Adds beneficiary linking system

Fixes #42
```

---

## 💻 Coding Standards

### General

- Use meaningful variable names
- Write clean, modular code
- Avoid unnecessary complexity

### Frontend (Next.js / React)

- Use functional components
- Use TypeScript where applicable
- Follow component-based architecture

### Backend

- Follow RESTful conventions
- Validate all inputs
- Handle errors properly

---

## 🐛 Reporting Bugs

Open an issue and include:

- Description
- Steps to reproduce
- Expected behavior
- Screenshots/logs

---

## 💡 Suggesting Features

Open an issue with:

- Problem description
- Proposed solution
- Use case

---

## ✅ Before Submitting

Ensure:

- Code builds successfully
- No console errors
- No lint errors
- Commit messages follow standard

---

## 🙌 Thank You

Your contributions help improve this project for everyone.
We appreciate your time and effort!
