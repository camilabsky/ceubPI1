# Cadastro curto (shorter sign-up) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Email sign-up asks only for name, email and password. City is asked on Explore, phone is asked (optionally) when joining a horta and can be edited on the profile, and horta admins see members' phones.

**Architecture:** One small backend validation module (`backend/userContact.js`) is shared by the register, `/me/localizacao`, new `/me/telefone`, and `/hortas/:id/entrar` endpoints. The frontend gets three small new components (Google button, Explore city prompt, profile phone editor) and targeted edits to `RegisterPage`, `ExplorePage` and `AdminHomePage`.

**Tech Stack:** Node/Express + mysql2 (CommonJS, `node --test`), React + TypeScript + Vite + Tailwind, `sonner` toasts, Google Identity Services.

**Spec:** `docs/superpowers/specs/2026-11-16-cadastro-curto-design.md`

**Before starting:** the working tree has uncommitted changes (OnboardingPage → CreateGardenPage split, slimmer RegisterPage, etc.). This plan builds on them. Ask Alice whether to commit them first; don't discard them.

## Global Constraints

- Phone format, everywhere (frontend and backend): `^\+?[0-9 ()-]{8,20}$`, trimmed, max 24 chars. Empty/whitespace-only = no phone (stored as NULL).
- City/UF rules unchanged: city and UF come together or not at all. City matches `^[\p{L}\p{M}][\p{L}\p{M}\s'.-]*$`u, max 100 chars. UF is one of the 27 Brazilian codes.
- Phone is never required anywhere. Prompting for it never blocks joining a horta ("Pular" always joins).
- A member's phone is exposed only through `GET /admin/horta/participantes` (guarded by `requireHortaAdmin`, scoped to `req.id_horta`), and to the member themself via `GET /me/telefone`.
- User-facing copy is Brazilian Portuguese. Exact strings come from the spec/mockup:
  - "Continuar com Google", "ou com e-mail"
  - "Onde você está?", "Mostramos as hortas mais perto de você.", "Usar minha localização", "Agora não"
  - "Quer deixar um telefone? O administrador da horta pode precisar falar com você.", "Entrar na horta", "Pular"
  - "Telefone não informado"
- City-prompt dismissal key: `localStorage['couve:explore-location-prompt-dismissed'] = '1'`.

## Review Focus

1. **Google-only user joins a horta.** They have no phone, so the phone step appears; "Pular" joins with phone still NULL. → Task 3 integration test + Task 6 manual check.
2. **User who already has a phone joins.** There's no extra step and the existing phone is unchanged. If the join body has no `telefone`, the saved phone must not be cleared. → Task 3 test `join without telefone keeps existing phone`.
3. **Join with `telefone: "   "`.** Treated as no phone: 200, nothing saved, no 400. → Task 3 test.
4. **Admin of horta B lists participants.** They must not see phones of horta A's members (only B's). → Task 3 test.
5. **Clearing the phone on the profile.** `PUT /me/telefone` with `""` sets NULL, and the admin list then shows "Telefone não informado". → Task 2 test + Task 8 manual check.

---

### Task 1: Shared contact validation module

**Files:**
- Create: `backend/userContact.js`
- Create: `backend/userContact.test.js`

**Interfaces:**
- Produces:
  - `ESTADOS: Set<string>` (27 UF codes)
  - `parsePhone(value: unknown) -> { ok: true, telefone: string | null } | { ok: false, error: string }`. Non-string or whitespace-only gives `{ ok: true, telefone: null }`.
  - `parseLocation(cidade: unknown, uf: unknown) -> { ok: true, cidade: string | null, uf: string | null } | { ok: false, error: string }`. UF is upper-cased. Both empty gives nulls.

- [ ] **Step 1: Write the failing tests** in `backend/userContact.test.js` (style of `geolocation.test.js`):

```js
test('parsePhone aceita vazio como sem telefone', () => {
  assert.deepEqual(parsePhone(undefined), { ok: true, telefone: null });
  assert.deepEqual(parsePhone('   '), { ok: true, telefone: null });
});
test('parsePhone valida e apara', () => {
  assert.deepEqual(parsePhone(' (61) 99999-0000 '), { ok: true, telefone: '(61) 99999-0000' });
  assert.equal(parsePhone('abc').ok, false);
  assert.equal(parsePhone('1234567').ok, false);          // 7 chars
  assert.equal(parsePhone('+'.padEnd(22, '1')).ok, false); // too long
});
test('parseLocation exige cidade e UF juntas', () => {
  assert.deepEqual(parseLocation('', ''), { ok: true, cidade: null, uf: null });
  assert.deepEqual(parseLocation(' Brasília ', 'df'), { ok: true, cidade: 'Brasília', uf: 'DF' });
  assert.equal(parseLocation('Brasília', '').ok, false);
  assert.equal(parseLocation('', 'DF').ok, false);
  assert.equal(parseLocation('Brasília', 'XX').ok, false);
  assert.equal(parseLocation('123', 'DF').ok, false);
});
```

- [ ] **Step 2: Run, expect FAIL.** `cd backend && node --test userContact.test.js` → "Cannot find module './userContact'".
- [ ] **Step 3: Implement `backend/userContact.js`.** Error messages reuse the existing ones from `/me/localizacao` and the horta endpoints.
- [ ] **Step 4: Run, expect PASS.** `cd backend && node --test` → all tests pass, including the existing ones.
- [ ] **Step 5: Commit.** `git add backend/userContact.js backend/userContact.test.js && git commit -m "feat(backend): modulo compartilhado de validacao de telefone e cidade"`

---

### Task 2: Register without phone/city + `/me/telefone`

**Files:**
- Modify: `backend/index.js`. Change `POST /auth/register` (~line 242) and `PUT /me/localizacao` (~line 421) to use `userContact`, and add `GET /me/telefone` and `PUT /me/telefone` next to `/me/localizacao`.
- Create: `backend/cadastro-curto.integration.cjs`. Copy the `request()` helper, DB pool and env defaults from `role-audit.integration.cjs`. Same run style: an IIFE that prints `{ pass: true, scenarios: [...] }`.

**Interfaces:**
- Consumes: `parsePhone`, `parseLocation` (Task 1).
- Produces:
  - `POST /auth/register` body `{ nome, email, senha, telefone?, cidade?, uf? }`. Only nome/email/senha are required. Optional fields are validated if present (400 on invalid) and stored as NULL when absent.
  - `GET /me/telefone` → `200 { telefone: string }` (`''` when NULL).
  - `PUT /me/telefone` body `{ telefone }` → `200 { telefone: string }`. `''` clears to NULL; invalid → `400 { error }`.

- [ ] **Step 1: Write the failing integration scenarios** in `cadastro-curto.integration.cjs`:
  - `POST /auth/register` with only `{ nome, email, senha }` → 201. The DB row has `telefone`, `cidade`, `uf` all NULL.
  - Register with `telefone: 'abc'` → 400. Register with `cidade: 'Brasília'` and no `uf` → 400.
  - Register with all old fields valid → 201 (old clients keep working).
  - `GET /me/telefone` for the minimal user → `{ telefone: '' }`. `PUT { telefone: '(61) 98888-0000' }` → 200, then GET returns it. `PUT { telefone: 'abc' }` → 400. `PUT { telefone: '' }` → 200, then GET returns `''` and the DB has NULL.
  - `GET /me/telefone` without a token → 401.
- [ ] **Step 2: Run, expect FAIL.** With the stack up (`docker compose up -d --build`, which exposes the API on `:8080` and the DB on `:3307`): `API_URL=http://localhost:8080 DB_PORT=3307 node backend/cadastro-curto.integration.cjs`. Use the same env vars for every integration run below. The script's defaults (`8082`/`3308`) come from `role-audit` and don't match compose. fails on the first register (400 "obrigatorios").
- [ ] **Step 3: Implement** the register change and the two `/me/telefone` routes (`requireAuth`, `UPDATE Usuario SET telefone = ? WHERE id = ?`). Switch `PUT /me/localizacao` to `parseLocation` with the same responses as today. Rebuild/restart the backend container (`docker compose up -d --build backend`).
- [ ] **Step 4: Run, expect PASS.** Run `node backend/cadastro-curto.integration.cjs` → `pass: true`. Then `node backend/role-audit.integration.cjs` → `pass: true` (it still sends phone/city at register).
- [ ] **Step 5: Commit.** `git commit -m "feat(backend): cadastro so com nome, e-mail e senha; endpoints de telefone"`

---

### Task 3: Phone on join + phone in admin participant list

**Files:**
- Modify: `backend/index.js`, `POST /hortas/:id/entrar` (~line 1713) and `GET /admin/horta/participantes` (~line 1605)
- Modify: `backend/cadastro-curto.integration.cjs`

**Interfaces:**
- Consumes: `parsePhone` (Task 1). Integration helpers from Task 2.
- Produces:
  - `POST /hortas/:id/entrar` with optional body `{ telefone?: string }`. If `parsePhone` gives a non-null phone, it's saved on `Usuario`, in the same transaction as the role insert. Missing/blank → phone untouched. Invalid → `400 { error }`, and the person does **not** join. The response shape is unchanged.
  - `GET /admin/horta/participantes`: each row gains `telefone: string | null`.

- [ ] **Step 1: Add the failing scenarios:**
  - Admin A creates horta A (via `POST /hortas`, as in `role-audit`). Admin B creates horta B.
  - A minimal user (no phone) joins A with `{ telefone: '(61) 97777-0000' }` → 200. Admin A's participant list has this member with `telefone === '(61) 97777-0000'`.
  - **`join without telefone keeps existing phone`**: the same user joins B with no body → 200. Their phone is still `(61) 97777-0000`.
  - A second minimal user joins A with `{ telefone: '   ' }` → 200. They appear with `telefone === null`.
  - A third minimal user joins A with `{ telefone: 'abc' }` → 400, and they're absent from admin A's list.
  - Admin B's list (horta B) contains only B's members. No row for the users who joined only A.
  - A member's token calling `GET /admin/horta/participantes?id_horta=A` → 403.
- [ ] **Step 2: Run, expect FAIL.** `node backend/cadastro-curto.integration.cjs` → `telefone` is undefined in the list.
- [ ] **Step 3: Implement.** For `entrar`, use a connection + transaction like `/hortas/:id/sair` does. For the participants list, add `u.telefone` to SELECT, GROUP BY and the row mapping.
- [ ] **Step 4: Run, expect PASS.** Both integration files print `pass: true`, and `cd backend && node --test` passes.
- [ ] **Step 5: Commit.** `git commit -m "feat(backend): telefone opcional ao entrar na horta e visivel para admins"`

---

### Task 4: Short sign-up page with Google

**Files:**
- Create: `frontend/src/components/GoogleSignInButton.tsx`. Move the GIS script-wait + `initialize` + `renderButton` logic out of `LoginPage.tsx` (lines ~69–103).
- Modify: `frontend/src/components/LoginPage.tsx`. Use the new component.
- Modify: `frontend/src/components/RegisterPage.tsx`
- Modify: `frontend/src/contexts/AuthContext.tsx`. In `register`, make `opts` optional.

**Interfaces:**
- Produces: `GoogleSignInButton({ text }: { text: 'signin_with' | 'continue_with' })`. It calls `loginWithGoogle(credential)` from `useAuth` and shows the existing toast "Nao foi possivel entrar com Google" on failure.
- Produces: `register(nome: string, email: string, senha: string, opts?: { telefone?: string; cidade?: string; uf?: string }) => Promise<void>`.

- [ ] **Step 1: Build `GoogleSignInButton`** and switch `LoginPage` to `<GoogleSignInButton text="signin_with" />`. Keep its current render options (theme/size/width) as they are.
- [ ] **Step 2: Rewrite the RegisterPage form** to match the right-hand mockup:
  - `<GoogleSignInButton text="continue_with" />` on top, then the "ou com e-mail" divider.
  - Fields: Nome, E-mail, Senha (label "Senha (mín. 6 caracteres)", with the existing eye toggle).
  - Then "Criar conta" and "Já tem conta? Entrar".
  - Remove the telefone/cidade/uf/confirmarSenha state, the `UFS` set and their validations. Keep the `nome/email/senha` required check, `senha.length < 6`, and the `enviando` guard.
  - Call `register(nome, email, senha)`. The left image panel is unchanged.
- [ ] **Step 3: Verify the build.** `cd frontend && npm run build` → it builds with no errors.
- [ ] **Step 4: Manual check.** Run `npm run dev` with the backend up:
  - Sign up with name/email/password → you land in the app.
  - The Google button shows on both the login and sign-up pages.
  - A password with fewer than 6 characters → toast "A senha deve ter no mínimo 6 caracteres".
- [ ] **Step 5: Commit.** `git commit -m "feat(frontend): cadastro curto com Google na tela de cadastro"`

---

### Task 5: "Onde você está?" card on Explore

**Files:**
- Create: `frontend/src/components/ExploreLocationPrompt.tsx`
- Modify: `frontend/src/components/ExplorePage.tsx`

**Interfaces:**
- Produces: `ExploreLocationPrompt({ onUseLocation, onSaveCity, onDismiss }: { onUseLocation: () => void; onSaveCity: (cidade: string, uf: string) => Promise<boolean>; onDismiss: () => void })`. It's presentational: a city input, a UF input (max 2, upper-cased), a save button, and the copy from Global Constraints.
- In `ExplorePage`: `const [perfilSemCidade, setPerfilSemCidade] = useState(false)` is set by the existing `carregarLocalizacaoPerfil` effect (lines ~158–191) when the response has no cidade/uf. Add `const [promptDispensado, setPromptDispensado] = useState(() => localStorage flag === '1')`.

- [ ] **Step 1: Wire up the show rule.** Render the card above the list when `token && !posicao && perfilSemCidade && !promptDispensado`. `dismissPrompt()` sets the localStorage key (wrapped in try/catch, like the existing sessionStorage code) and the state.
- [ ] **Step 2: Wire up the three actions.**
  - `onUseLocation` → `usarLocalizacao()` then `dismissPrompt()`.
  - `onSaveCity` → `PUT /me/localizacao`. On 200: `dismissPrompt()`, `setPerfilSemCidade(false)`, and re-run the profile-location effect by adding a `localizacaoVersao` counter to its deps. On error: toast the server's `error`, return `false`, and keep the card open.
  - `onDismiss` → `dismissPrompt()`.
- [ ] **Step 3: Verify the build.** `cd frontend && npm run build` → no errors.
- [ ] **Step 4: Manual check.** With a fresh minimal user:
  - The card shows. The list stays usable underneath it.
  - "Agora não" hides it, and it stays hidden after a reload.
  - On another browser profile, saving "Brasília"/"DF" hides it and the list sorts as "Mais próximas".
  - A user whose profile already has a city never sees the card.
- [ ] **Step 5: Commit.** `git commit -m "feat(explorar): pergunta a cidade na primeira visita"`

---

### Task 6: Optional phone step when joining a horta

**Files:**
- Create: `frontend/src/lib/contact.ts`
- Modify: `frontend/src/components/ExplorePage.tsx`, `participar()` (~line 222) and the details-panel footer (~line 374)

**Interfaces:**
- Consumes: `POST /hortas/:id/entrar` with `{ telefone? }` (Task 3). `GET /me/telefone` (Task 2).
- Produces: `isValidPhone(value: string): boolean` in `frontend/src/lib/contact.ts`. It uses the trimmed Global Constraints regex. Task 7 uses it too.
- `participar(telefone?: string)` sends `body: JSON.stringify(telefone ? { telefone } : {})` with `Content-Type: application/json`.

- [ ] **Step 1: Load the user's phone.** When the details panel opens and the user isn't already a MEMBER of `selecionada`, fetch `GET /me/telefone` into `telefoneAtual: string | null`.
- [ ] **Step 2: Footer behavior.**
  - "Participar desta horta" with `telefoneAtual` non-empty, or the user already a member → call `participar()` as today.
  - Otherwise, replace the button with the phone step: the copy, a `tel` input with placeholder "(61) 99999-9999 (opcional)", and "Entrar na horta" / "Pular".
  - "Entrar na horta" with a non-empty, invalid value → an inline red message under the input, "Informe um telefone válido ou toque em Pular", and no request. With a valid or empty value → `participar(valor.trim() || undefined)`.
  - "Pular" → `participar()`.
  - If the server returns 400 → its error goes in the same inline message and the step stays open.
- [ ] **Step 3: Verify the build.** `cd frontend && npm run build` → no errors.
- [ ] **Step 4: Manual check** (covers Review Focus 1–3):
  - A Google or minimal user sees the step. "Pular" joins.
  - Typing "abc" → inline error, not joined.
  - A valid phone → joins, and the profile then shows the phone (after Task 7).
  - A user who has a phone joins with no step.
- [ ] **Step 5: Commit.** `git commit -m "feat(explorar): telefone opcional ao entrar numa horta"`

---

### Task 7: Phone field on the profile

**Files:**
- Create: `frontend/src/components/ProfilePhoneEditor.tsx`. It mirrors `ProfileLocationEditor` (same `variant: 'inline' | 'card'` prop, same view/edit/save pattern, same styling).
- Modify: `frontend/src/components/ProfilePage.tsx`, `frontend/src/components/AdminProfilePage.tsx`. Render it right after `ProfileLocationEditor`, with the same `variant` each page already passes.

**Interfaces:**
- Consumes: `GET/PUT /me/telefone` (Task 2), `isValidPhone` (Task 6).
- Produces: `ProfilePhoneEditor({ variant }: { variant?: 'inline' | 'card' })`.

- [ ] **Step 1: Implement it.**
  - View mode shows the phone, or "Telefone não informado".
  - Edit mode: a non-empty, invalid value → toast "Informe um telefone válido", no request. An empty value saves `''` (clears).
  - Success toast: "Telefone atualizado. Ele fica visível apenas para os administradores das suas hortas."
- [ ] **Step 2: Verify the build.** `cd frontend && npm run build` → no errors.
- [ ] **Step 3: Manual check.** Add, change and clear the phone on both profile pages. Reload → the value persists.
- [ ] **Step 4: Commit.** `git commit -m "feat(perfil): campo de telefone editavel"`

---

### Task 8: Phone in the admin participant list

**Files:**
- Modify: `frontend/src/components/AdminHomePage.tsx`. Change `ParticipantActivity` (~line 39) and the participant row (~line 249).

**Interfaces:**
- Consumes: `telefone: string | null` on participant rows (Task 3).

- [ ] **Step 1: Implement it.**
  - Add `telefone: string | null` to `ParticipantActivity`.
  - In the row, under the name/status line, render `<a href={`tel:${telefone.replace(/[^\d+]/g, '')}`}>{telefone}</a>` when present, otherwise the muted text "Telefone não informado". Use the row's existing text sizes and colors.
- [ ] **Step 2: Verify the build.** `cd frontend && npm run build` → no errors.
- [ ] **Step 3: Manual check** (Review Focus 5):
  - As a horta admin, a member who gave a phone shows a tappable number.
  - A member who skipped shows "Telefone não informado".
  - Clearing a member's phone on their profile → after a reload the admin sees "Telefone não informado".
- [ ] **Step 4: Commit.** `git commit -m "feat(admin): mostra telefone dos participantes"`
