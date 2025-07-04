# Contributing to TaskFlowPro

We love your input! We want to make contributing to TaskFlowPro as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### Pull Requests

Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

### Development Setup

1. Clone your fork of the repository
2. Install dependencies: `npm install`
3. Set up environment variables (copy `.env.example` to `.env`)
4. Set up the database: `npm run db:push`
5. Start development server: `npm run dev`

### Code Style

- We use TypeScript throughout the project
- Follow the existing code style and formatting
- Use meaningful variable and function names
- Add comments for complex logic
- Ensure all TypeScript types are properly defined

### Project Structure Guidelines

- **Frontend Components**: Place reusable components in `client/src/components/`
- **Pages**: New pages go in `client/src/pages/`
- **API Routes**: Add new endpoints in `server/routes.ts`
- **Database Operations**: Extend the storage interface in `server/storage.ts`
- **Shared Types**: Define types and schemas in `shared/schema.ts`

### Commit Message Guidelines

- Use clear and descriptive commit messages
- Start with a verb (Add, Fix, Update, Remove, etc.)
- Keep the first line under 50 characters
- Reference issues and pull requests when applicable

Example:
```
Add Google Calendar integration for task scheduling

- Implement OAuth flow for Google Calendar
- Add calendar event creation from tasks
- Update API documentation
- Fixes #123
```

## Bug Reports

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/yourusername/taskflowpro/issues).

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Feature Requests

We're always looking for suggestions to improve TaskFlowPro. If you have ideas for new features:

1. Check if the feature has already been requested
2. Open a new issue with the "feature request" label
3. Describe the feature in detail
4. Explain why this feature would be useful
5. Consider implementation approaches if possible

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to reach out by opening an issue or contacting the maintainers directly.

## Recognition

Contributors will be recognized in our README and release notes. Thank you for helping make TaskFlowPro better!