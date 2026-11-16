# Shorter sign-up (cadastro curto): design

Date: 2026-11-16

## Why

Signing up without Google takes too long. The email form asks for 7 required fields: name, email, phone, city, state (UF), password and confirm password. Google users get in with one click and never give phone or city, and the app works fine for them. People who don't use Google pay the cost, and it's worst for someone arriving for the first time to start or join a horta.

The two extra fields do matter, just not at sign-up:

- **City** lets Explore ("Encontre uma horta para participar") suggest hortas near the person.
- **Phone** is meant to let a horta's admins call a member when needed. Today it is saved but **never shown anywhere**: `/admin/horta/participantes` doesn't return it, and no screen shows it. Admins can't actually call anyone.

## Goals

1. Email sign-up asks only for **name, email and password**.
2. The sign-up page offers **"Continuar com Google"** at the top, like the login page already does.
3. **City** is asked for the first time a person opens Explore without one saved. They can use their location, type a city/UF, or skip.
4. **Phone** is asked when a person joins a horta. It's optional and they can skip it.
5. People can add or change their **phone on their profile**, next to the existing city editor.
6. Horta admins see each member's **phone in the participant list**, when the member gave one.

## Non-goals

- No change to Google sign-in itself (`/auth/google`), password rules, or password reset.
- No change to the "Criar uma horta" flow (`CreateGardenPage`) or to the horta's own contact field.
- No new notification/SMS/WhatsApp features. The phone is only shown so the admin can call.
- No migration or backfill of existing users. Members who already have phone/city keep them.

## Anti-goals (would be a failure even if it "works")

- Phone becomes required anywhere, or prompting for it blocks joining a horta.
- The city prompt blocks Explore or keeps coming back after the person skipped it.
- A member's phone is visible to anyone other than the admins of a horta that member belongs to.
- Email sign-up still feels longer than Google.

## Current state (as of this design)

There are **uncommitted changes in the working tree** that split horta creation out of sign-up (`OnboardingPage` → `CreateGardenPage`, slimmer `RegisterPage`, etc.). This work builds on top of them.

Relevant code:

- `frontend/src/components/RegisterPage.tsx`: the 7-field form; client-side validation for phone/city/UF.
- `frontend/src/contexts/AuthContext.tsx`: `register(nome, email, senha, { telefone, cidade, uf })`, `loginWithGoogle`.
- `frontend/src/components/LoginPage.tsx`: renders the Google Identity button (`window.google.accounts.id`, `GOOGLE_CLIENT_ID` from `config.ts`).
- `backend/index.js`, `POST /auth/register`: requires telefone, cidade, uf (400 if missing).
- `backend/index.js`, `GET/PUT /me/localizacao`: reads/saves the user's city+UF (both or neither).
- `frontend/src/components/ProfileLocationEditor.tsx`: city editor, used on `ProfilePage` and `AdminProfilePage`.
- `frontend/src/components/ExplorePage.tsx`: loads the profile city to center results; has "Usar minha localização" (browser geolocation); `participar()` calls `POST /hortas/:id/entrar`.
- `backend/index.js`, `POST /hortas/:id/entrar`: inserts the MEMBER role.
- `backend/index.js`, `GET /admin/horta/participantes`: member list for the horta's admins (`requireHortaAdmin`); rendered in `frontend/src/components/AdminHomePage.tsx`.
- `Usuario.telefone varchar(24) NULL` (column added at startup if missing).

## What changes

### 1. Sign-up page

Matches the approved mockup (right-hand side):

- "Continuar com Google" button at the top, then a small "ou com e-mail" divider.
- Fields: **Nome**, **E-mail**, **Senha** (min. 6 chars, with the existing show/hide eye). No "Confirmar senha".
- "Criar conta" button, "Já tem conta? Entrar" link.
- The left-hand image panel stays as it is.

Backend: `POST /auth/register` no longer requires telefone, cidade, uf. If any are sent they're still validated with the current rules (cidade+UF together), so older clients keep working. Otherwise they're stored as NULL.

### 2. City prompt on Explore

The first time a person opens Explore with no city saved and no active browser location, show an inline card above the list (not a modal): **"Onde você está?** Mostramos as hortas mais perto de você." It offers three things:

- **📍 Usar minha localização**: same behavior as the existing button.
- **Cidade / UF** input: saves via `PUT /me/localizacao`, then results use it the way they do today for profile city.
- **Agora não**: hides the card.

The list is visible and usable the whole time.

### 3. Phone prompt when joining a horta

When the person clicks "Participar desta horta" and has **no phone saved**, show a small step before joining: "Quer deixar um telefone? O administrador da horta pode precisar falar com você." It has an optional phone input and two buttons, **Entrar na horta** and **Pular**. Both join the horta. If a valid phone was typed, it's saved to the profile first. If the person already has a phone, joining works exactly as today, with no extra step.

### 4. Phone on the profile

Add a phone field to the profile, next to/inside the existing location editor, on both `ProfilePage` and `AdminProfilePage`. It's optional, can be cleared, and uses the same validation as today (`^\+?[0-9 ()-]{8,20}$`, max 24).

### 5. Phone in the admin participant list

`GET /admin/horta/participantes` returns `telefone` (null when missing). `AdminHomePage` shows it on each member row. Show "Telefone não informado" when it's missing.

## Decided by Alice

- Sign-up asks only name, email, password, with Google offered on the sign-up page (approved via mockup).
- City is asked on Explore, phone is asked when joining a horta (approved via mockup).
- Phone at join time is **optional / skippable**.
- Add a phone field to the profile.
- Show the phone in the admins' participant list.

## My calls (Claude), open to correction

- Drop "Confirmar senha"; the eye icon covers typos.
- The Explore city card is inline, not a modal.
- The backend keeps accepting phone/city/UF on register (validated if present) instead of rejecting them.
- Phone is shown only to admins of a horta the member belongs to, through the existing `requireHortaAdmin` participant endpoint. No other endpoint exposes it. Members can also read their own phone, to fill the profile field.
- **City card: any answer ends it.** A location the browser actually provides, saving a city, or clicking "Agora não" all hide the card for good for that account on that device, remembered in `localStorage` per user id. If the browser refuses location access, the card stays. It doesn't come back each session. A person who only used location keeps today's behavior: the position lasts for the session, and the "Usar minha localização" button stays available. No reverse geocoding.
- **Invalid phone at join time:** check it inline before joining. If it's invalid, show the error under the input and don't join yet. The person can fix it or click "Pular", so joining is never blocked. `POST /hortas/:id/entrar` takes an optional `telefone` and saves it together with joining, in one call. The backend validates it too (400 if invalid), so a phone is never dropped silently.
- The join-time phone step lives inside the existing horta details panel in Explore, not in a new modal.
- In the admin list the phone is a `tel:` link so it can be tapped on a phone.

## Left to the builder

- Exact endpoint shape for reading/saving phone on the profile (extend `/me/localizacao` or add `/me/telefone`).
- Component structure, copy polish, and tests, following the existing `node --test` setup in `backend/` and `role-audit.integration.cjs`.
