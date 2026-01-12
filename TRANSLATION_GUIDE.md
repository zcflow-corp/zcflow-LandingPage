# Translation Guide: How to Use `t` Function

This guide shows you how to use the translation function `t` in different types of files in your Astro project.

## Overview

The translation system works by:

1. Loading locale JSON files (`en.json`, `es.json`) in page files
2. Creating a `t` function that looks up translations
3. Passing `t` as a prop to components
4. Using `t(key)` to translate text

---

## 1. **Astro Pages** (`src/pages/*.astro`)

**Purpose**: Load locale JSON files and create the `t` function, then pass it to components.

### Example: `src/pages/[lang].astro`

```astro
---
// pages/[lang].astro
import BaseLayout from '@/layouts/BaseLayout.astro'
import Header from '@/components/Header.astro'
import Hero from '@/components/Hero.astro'

export function getStaticPaths() {
  return ['es', 'en'].map((lang) => ({ params: { lang } }))
}

const lang = Astro.params.lang ?? 'es'
const locale = ['en', 'es'].includes(lang) ? lang : 'es'

// ✅ Load locale JSON file
const messages = await import(`../i18n/${locale}.json`).then((m) => m.default)

// ✅ Create translation function
const t = (key) => messages[key] ?? key
---

<BaseLayout>
  <Header t={t} />
  <main>
    <Hero t={t} />
  </main>
</BaseLayout>
```

### Example: `src/pages/index.astro`

```astro
---
const locale = Astro.currentLocale || 'es'
const messages = await import(`../i18n/${locale}.json`).then((m) => m.default)
const t = (k) => messages[k] ?? k
---

<BaseLayout>
  <Header t={t} />
</BaseLayout>
```

---

## 2. **Astro Components** (`src/components/*.astro`)

**Purpose**: Receive `t` as a prop and use it in the template.

### Pattern:

```astro
---
// ✅ Receive t from props
const { t: _t } = Astro.props
const t = typeof _t === 'function' ? _t : (k) => k

// ✅ Use t in frontmatter (for data, arrays, etc.)
const slides = [
  {
    title: t('Integración total'),
    description: t('ZCFlow conecta tu ecosistema financiero...'),
  },
]
---

<!-- ✅ Use t in template -->
<section>
  <h1>{t('Revolucionando la tesorería')}</h1>
  <p>{t('Decisiones en segundos, no en semanas.')}</p>

  <!-- ✅ Pass t to child components -->
  <CardSlider slides={slides} t={t} />
</section>
```

### Real Example: `src/components/Header.astro`

```astro
---
const { t: _t } = Astro.props
const t = typeof _t === 'function' ? _t : (k: unknown) => k
---

<header>
  <nav>
    <ul>
      <li><a href="#soluciones">{t('Empresas')}</a></li>
      <li><a href="#soluciones">{t('Socios')}</a></li>
      <li><a href="#soluciones">{t('Soluciones')}</a></li>
    </ul>
    <a href="#">{t('Ingresar')}</a>
    <a href="/contacto/">{t('Ver demo')}</a>
  </nav>
</header>
```

---

## 3. **React Islands** (`src/islands/*.jsx`)

**Purpose**: Receive `t` as a prop and use it in JSX.

### Pattern:

```jsx
'use client'
import { useState } from 'react'

export default function MyComponent({
  t: _t, // ✅ Receive t from props
  // ... other props
}) {
  // ✅ Create t function with fallback
  const t = typeof _t === 'function' ? _t : (k) => k

  return (
    <div>
      <h2>{t('Title')}</h2>
      <p>{t('Description')}</p>
    </div>
  )
}
```

### Real Example: `src/islands/CardSlider.jsx`

```jsx
'use client'
import { useState } from 'react'

export default function CardSlider({
  t: _t,
  slides = [],
  // ... other props
}) {
  const t = typeof _t === 'function' ? _t : (k) => k

  return (
    <section>
      {slides.map((slide) => (
        <div key={slide.id}>
          <h3>{t(slide.title)}</h3>
          <p>{t(slide.description)}</p>
        </div>
      ))}
    </section>
  )
}
```

### Alternative: Import JSON Directly (Not Recommended)

If you need to load translations directly in a React component:

```jsx
'use client'
import { useEffect, useState } from 'react'
import enMessages from '../i18n/en.json'
import esMessages from '../i18n/es.json'

export default function MyComponent() {
  const [messages, setMessages] = useState({})

  useEffect(() => {
    // Get locale from document
    const getLocale = () => {
      if (typeof document === 'undefined') return 'es'
      return document.documentElement.lang === 'en' ? 'en' : 'es'
    }

    const locale = getLocale()
    const localeMessages = locale === 'en' ? enMessages : esMessages
    setMessages(localeMessages)
  }, [])

  const t = (key) => messages[key] ?? key

  return <div>{t('Hello')}</div>
}
```

**Note**: This approach is less efficient. Prefer passing `t` as a prop.

---

## 4. **Regular JavaScript/TypeScript Files**

### Option A: Pass `t` as Parameter

```js
// utils/helpers.js
export function formatMessage(t, key, ...args) {
  const message = t(key)
  // Do something with message
  return message
}
```

### Option B: Import Locale JSON Directly

```js
// utils/translations.js
import enMessages from '../i18n/en.json'
import esMessages from '../i18n/es.json'

function getLocale() {
  if (typeof document === 'undefined') return 'es'
  return document.documentElement.lang === 'en' ? 'en' : 'es'
}

export function getTranslations() {
  const locale = getLocale()
  const messages = locale === 'en' ? enMessages : esMessages
  return (key) => messages[key] ?? key
}

// Usage:
// const t = getTranslations()
// const text = t('Hello')
```

---

## 5. **Common Patterns**

### Pattern 1: Safe Translation Function

Always use this pattern to handle missing `t`:

```js
const t = typeof _t === 'function' ? _t : (k) => k
```

This ensures:

- If `t` is provided, use it
- If `t` is missing, return the key as-is (no errors)

### Pattern 2: Using `t` in Arrays/Objects

```astro
---
const { t: _t } = Astro.props
const t = typeof _t === 'function' ? _t : (k) => k

const features = [t('Feature 1'), t('Feature 2'), t('Feature 3')]

const data = {
  title: t('Title'),
  description: t('Description'),
}
---
```

### Pattern 3: Conditional Translations

```astro
---
const status = t('status') === 'beta' ? t('Beta Version') : t('Stable Version')
---
```

### Pattern 4: Passing `t` to Child Components

```astro
---
const { t: _t } = Astro.props
const t = typeof _t === 'function' ? _t : (k) => k
---

<MyComponent t={t} />
<MyIsland client:load t={t} />
```

---

## 6. **File Structure**

```
src/
├── i18n/
│   ├── en.json          # English translations
│   └── es.json          # Spanish translations
├── pages/
│   ├── [lang].astro     # ✅ Loads locale, creates t, passes to components
│   └── index.astro      # ✅ Loads locale, creates t, passes to components
├── components/
│   ├── Header.astro     # ✅ Receives t, uses in template
│   └── Hero.astro       # ✅ Receives t, uses in template
└── islands/
    ├── CardSlider.jsx    # ✅ Receives t, uses in JSX
    └── Tabs.jsx          # ⚠️  Loads JSON directly (alternative approach)
```

---

## 7. **Best Practices**

1. ✅ **Always pass `t` as a prop** from parent to child
2. ✅ **Use the safe pattern**: `const t = typeof _t === 'function' ? _t : (k) => k`
3. ✅ **Load translations once** at the page level
4. ✅ **Use translation keys** that match your JSON files exactly
5. ❌ **Don't** hardcode translations in components
6. ❌ **Don't** load JSON files multiple times unnecessarily

---

## 8. **Troubleshooting**

### Problem: `t is not a function`

**Solution**: Make sure you're receiving `t` as a prop and using the safe pattern:

```js
const { t: _t } = Astro.props
const t = typeof _t === 'function' ? _t : (k) => k
```

### Problem: Translations not working

**Check**:

1. Is the key in your JSON file? (`src/i18n/en.json` or `src/i18n/es.json`)
2. Is `t` being passed from the parent component?
3. Is the locale being detected correctly?

### Problem: Want to use `t` in a utility file

**Solution**: Either:

- Pass `t` as a parameter to the utility function
- Import the JSON files directly in the utility file

---

## Summary

| File Type            | How to Use `t`                                |
| -------------------- | --------------------------------------------- |
| **Astro Pages**      | Load JSON, create `t`, pass to components     |
| **Astro Components** | Receive `t` as prop, use in template          |
| **React Islands**    | Receive `t` as prop, use in JSX               |
| **JS/TS Utils**      | Pass `t` as parameter or import JSON directly |

The key pattern is: **Load once at the page level, pass down as props**.
<<<<<<< HEAD

=======

> > > > > > > f899b1f7cccd2f9a263980e6277cd9422c098046





