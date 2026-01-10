# Contributing to Shuleyetu

Thank you for your interest in contributing to Shuleyetu! This document provides guidelines for contributing to the project.

## Development Setup

1. **Prerequisites**
   - Node.js 18+ (LTS recommended)
   - Git
   - A Supabase account (for database)

2. **Clone and Install**
   ```bash
   git clone https://github.com/kadioko/Shuleyetu.git
   cd Shuleyetu/shuleyetu-web
   npm install
   ```

3. **Environment Configuration**
   - Copy `shuleyetu-web/.env.local.example` to `shuleyetu-web/.env.local`
   - Fill in your Supabase and ClickPesa credentials
   - Never commit `.env.local` files

4. **Database Setup**
   - Apply migrations in `supabase/migrations/` via Supabase Dashboard SQL Editor
   - Run migrations in chronological order (by filename)

## Development Workflow

1. **Run the dev server**
   ```bash
   cd shuleyetu-web
   npm run dev
   ```

2. **Run tests**
   ```bash
   npm run test
   ```

3. **Lint your code**
   ```bash
   npm run lint
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## Code Style

- Follow the existing TypeScript and React patterns
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Add tests for new features
- Keep functions small and focused

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to your fork (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Security

- Never commit API keys, secrets, or credentials
- Report security vulnerabilities privately to the maintainers
- Use environment variables for all sensitive configuration

## Questions?

Feel free to open an issue for questions or discussions about contributing.
