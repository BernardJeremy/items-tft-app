# copilot-instructions.md

## 🧠 Project Context

This is a modern front-end web project built using:

- **React** (via Next.js)
- **TypeScript** (strict mode)
- **Tailwind CSS** for styling
- **App Router** in Next.js
- Fully typed, modular, and accessible components
- Clean and scalable architecture (e.g., feature-based or atomic design)
- Utility-first styling with minimal custom CSS

## 💡 How to Help

When Copilot responds or generates code, follow these **core principles**:

1. **Use Best Practices** for React, TypeScript, Next.js, and Tailwind.
2. **Be Concise and Readable** – prioritize clarity over cleverness.
3. **Always Type Everything** – use explicit interfaces, props, return types.
4. **Use Tailwind, Not CSS** – avoid custom stylesheets unless necessary.
5. **Prefer Functional Patterns** – especially hooks, composition, and pure functions.
6. **Avoid Anonymous Components** – always name components clearly.
7. **Handle Edge Cases** – include loading, error, empty states where relevant.
8. **Keep Accessibility in Mind** – use semantic HTML and ARIA when needed.

## ✅ DOs

- ✅ Use `use client` directive when necessary (e.g., for interactive components).
- ✅ Use Tailwind utility classes directly in JSX.
- ✅ Use Next.js' `<Link>` for internal navigation.
- ✅ Use `async/await` for all data fetching.
- ✅ Create reusable components where patterns repeat.

## ❌ DON'Ts

- ❌ Avoid writing inline styles or CSS modules unless necessary.
- ❌ Don’t use `any` as a type.
- ❌ Avoid `console.log` in production code.
- ❌ Don’t over-abstract prematurely.
- ❌ Don’t use `className` conditionals without `clsx` or template literals.
- ❌ Avoir `setTimeout` or any artificial waiting. React to event via signals or better yet, `useEffect`

## 📁 Folder Structure Hints

- Use **feature-based folder structure** (e.g., `/features/auth`, `/features/dashboard`)
- Keep components small and focused.
- Organize components in `/components`, utilities in `/lib` or `/utils`, and shared types in `/types`.

## 🔄 Patterns to Encourage

- Server Actions or `useServerAction` for server-side logic.
- Environment config via `process.env` (validated).
- Data fetching with `fetch` or `SWR`/`React Query` depending on use case.

## 🧹 Linting & Formatting

- Use **ESLint** with the following:
  - The official **Next.js core web vitals ruleset**
  - TypeScript support via `@typescript-eslint`
  - Prettier integration using `eslint-plugin-prettier`
  - Custom rules only when they reinforce clarity or catch real issues
- Use **Prettier** with these formatting preferences:
  - Enforce single quotes
  - Include semicolons
  - Use trailing commas wherever possible
  - Set a reasonable line length (e.g., 100 characters)
  - Use 2-space indentation
- Never disable rules unless necessary — and always comment the reason when doing so.

## 🗣️ Tone and Output Style

- Use natural, helpful tone in comments.
- Suggest improvements with reasoning.
- Keep responses clean and focused.
- If unsure about context, ask for clarification.

---

**Note for Copilot Agent:** Always assume the user prefers modern, clean, maintainable code with best practices by default. Offer suggestions, but never overcomplicate.
