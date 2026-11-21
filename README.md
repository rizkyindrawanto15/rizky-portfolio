# Rizky Indra Wanto — Personal Portfolio

**Concept:** `DIGITAL IDENTITY — BEYOND CODE`  
**Role:** Creative Developer & Grade XII Software Engineering (*Rekayasa Perangkat Lunak / RPL*) Student  
**Institution:** SMK Krian 1 Sidoarjo (`2026/2027`)

---

## Technical Stack

- **Framework:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS (Custom Dark Editorial Design System)
- **3D & Shaders:** Three.js (`WebGLRenderer`, Custom GLSL Point-Cloud Shaders)
- **Motion & Interactions:** Framer Motion
- **Icons:** Lucide React

---

## Project Structure

```text
rizky-portfolio/
├── public/
│   └── certificates/               # Place certificate images (.jpg/.png) or PDFs here
├── src/
│   ├── components/
│   │   ├── ParticleFaceCanvas.tsx  # 3D Point-Cloud Human Portrait & Cursor Field
│   │   ├── HeroSection.tsx         # Full-screen Hero + Calligraphic Signature Reveal
│   │   ├── Navbar.tsx              # Editorial Top Bar + Responsive Navigation
│   │   ├── AboutSection.tsx        # Personal Identity, Philosophy & Interests
│   │   ├── EducationTimelineSection.tsx # Interactive Academic Timeline
│   │   ├── ProjectsSection.tsx     # Selected Works Asymmetrical Showcase
│   │   ├── ProjectDetailModal.tsx  # Full Case Study Modal + Database Schema
│   │   ├── ProjectVisualPreview.tsx# Interactive Architectural Schematics
│   │   ├── CertificatesSection.tsx # Digital Credential Archive + Zoom Modal
│   │   ├── SkillsSection.tsx       # 5-Group Interactive Technology Matrix
│   │   ├── BehindTheCodeSection.tsx# Learning Process & Authentic Code Snippets
│   │   ├── ContactSection.tsx      # Closing CTA, Editable Channels & Footer
│   │   ├── CustomCursor.tsx        # Smooth Desktop Magnetic Cursor
│   │   └── MagneticButton.tsx      # Spring-Physics Magnetic Interactive Button
│   ├── data/
│   │   └── portfolioData.ts        # Centralized Data (Projects, Certificates, Profile, Skills)
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
```

---

## How to Edit Your Data

All personal details, education history, projects, certificates, and contact links are centralized in **[`src/data/portfolioData.ts`](./src/data/portfolioData.ts)**:

1. **Profile Photo:** Place your photo in `public/profile.jpg` and set `profilePhotoUrl: '/profile.jpg'` in `PERSONAL_INFO`.
2. **Previous Education (SMP / SD):** Update `EDUCATION_TIMELINE` entries in `src/data/portfolioData.ts` when ready.
3. **Certificates:** Place certificate files in `public/certificates/` and add items to `CERTIFICATES_DATA` in `src/data/portfolioData.ts`.
4. **Contact Links:** Populate the `url` field for `email`, `github`, `linkedin`, and `instagram` in `PERSONAL_INFO.contactLinks`.
