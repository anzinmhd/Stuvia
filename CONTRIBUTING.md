# Contributing to Stuvia

First off, thank you for considering contributing to Stuvia! It's people like you that make Stuvia a great tool for our college community.

## 🏁 Getting Started

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/Stuvia.git
   cd Stuvia
   ```
3. **Set up your environment**:
   - Install dependencies: `npm install`
   - Copy `.env.example` to `.env.local` and fill in the values.
4. **Create a branch** for your feature or fix:
   ```bash
   git checkout -b feature/amazing-feature
   ```

## 🛠️ Development Workflow

- **Start Dev Server**: `npm run dev`
- **Linting**: `npm run lint` (Ensure your code follows our standards)
- **Type Checking**: `npm run type-check`
- **Testing**: `npm test`

### Branching Strategy
- `main`: Production-ready code.
- `develop`: Ongoing development.
- `feature/*`: New features.
- `fix/*`: Bug fixes.

## 📝 Pull Request Process

1. Ensure all tests pass and linting is clean.
2. Update documentation if you've added or changed functionality.
3. Push your branch to GitHub.
4. Open a Pull Request against the `develop` branch of the main repository.
5. Provide a clear description of the changes and link any related issues.

## 🎨 Code Style

- Use **TypeScript** for all new code.
- Prefer **Functional Components** and Hooks.
- Use **Tailwind CSS** for styling.
- Follow the structure and patterns defined in `docs/style-guide.md`.

## ❓ Questions?
If you have any questions or need help, feel free to open an issue or reach out to the project maintainers.

Happy coding! 🚀
