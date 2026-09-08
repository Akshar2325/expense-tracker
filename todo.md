# Smart Expense Tracker — Build Progress

## Sprint 1 — Foundation

- [x] 1. Monorepo setup (pnpm workspaces, Turborepo, config packages)
- [x] 2. Infrastructure setup (Docker compose for PostgreSQL, Redis)
- [x] 3. Prisma 7 schema design (all tables from PRD)
- [x] 4. NestJS API scaffold + project structure
- [x] 5. NestJS authentication module (Argon2id, JWT, refresh tokens)
- [x] 6. NestJS user/session/devices modules
- [x] 7. Next.js web app scaffold + Tailwind + design system
- [x] 8. Design system components (buttons, inputs, cards, nav, etc.)
- [x] 9. Web auth pages (login, register, forgot-password)
- [x] 10. Web dashboard layout + route structure
- [x] 11. Commit Sprint 1 to GitHub (API commit 40802c2 + web commit)

## Sprint 2 — Financial Core

- [x] 12. NestJS accounts module (CRUD API)
- [x] 13. NestJS categories module (CRUD + system categories)
- [x] 14. NestJS payment-methods module (CRUD)
- [x] 15. NestJS transactions module (CRUD + idempotency + filters)
- [x] 16. NestJS transactions search/filter engine
- [x] 17. Web dashboard widgets (balance, income, expense, budget)
- [x] 18. Web transactions list page + filters UI
- [x] 19. Web add/edit transaction page
- [x] 20. Commit Sprint 2 to GitHub (commit 3a06e05)

## Sprint 3 — Filters + Budgets

- [x] 21. NestJS budgets module (CRUD + progress calculation)
- [x] 22. NestJS saved-filters module
- [x] 23. Web budgets page + progress bars
- [x] 24. Web saved filters UI
- [x] 25. NestJS recurring-transactions module
- [x] 26. Web recurring transactions page
- [ ] 27. Commit Sprint 3 to GitHub

## Sprint 4 — Reports + Insights

- [x] 28. NestJS reports module (summary, category breakdown, trends)
- [x] 29. NestJS insights module (deterministic insights engine)
- [x] 30. Web reports page with charts (Recharts)
- [x] 31. Web insights cards on dashboard
- [ ] 32. Commit Sprint 4 to GitHub

## Sprint 5 — Accounts + Export

- [x] 33. Web accounts page
- [x] 34. Web categories page
- [x] 35. Web settings pages
- [x] 36. NestJS export module (CSV)
- [x] 37. NestJS receipts module (presign upload)
- [ ] 38. Commit Sprint 5 to GitHub

## Sprint 6 — Testing & Polish

- [ ] 39. Backend unit tests
- [ ] 40. Backend integration tests
- [ ] 41. Web E2E tests (Playwright)
- [ ] 42. Error/loading states polish
- [ ] 43. Final commit
- [ ] 42. Error handling & empty states
- [ ] 43. Loading states & skeletons
- [ ] 44. Final commit & deployment docs
