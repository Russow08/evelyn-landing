# Evelyn Valeria Guaman — Landing Page

Landing page premium en español para la consulta de odontología general y cosmetología de Evelyn Valeria Guaman, Riobamba, Ecuador.

## Abrir localmente

Doble clic en `index.html` o abrirlo desde un servidor local:

```bash
# Con Python (si está instalado)
python -m http.server 3000
# Luego abrir: http://localhost:3000

# Con Node / npx
npx serve .
```

## Estructura

```
evelyn-landing/
├── index.html   # Markup semántico, todo en español
├── styles.css   # Diseño mobile-first, paleta premium
├── script.js    # Nav scroll, animaciones, FAB
└── README.md    # Este archivo
```

## Información de contacto incluida

| Campo      | Valor                                              |
|------------|----------------------------------------------------|
| WhatsApp   | +593 999 262 846                                   |
| Instagram  | https://www.instagram.com/evelyn._.valeria/        |
| Dirección  | Primera Constituyente y Loja, Riobamba             |
| Horario    | Lunes a Viernes, 9:00 — 18:30                      |

## Secciones

1. **Hero** — Headline principal + CTA WhatsApp + CTA Servicios
2. **Sobre mí** — Presentación profesional con iniciales decorativas
3. **Servicios** — Cards de Odontología General y Cosmetología
4. **CTA intermedio** — Banda de conversión
5. **Contacto** — Ubicación, horario, WhatsApp, Instagram
6. **Footer** — Links sociales y créditos

## Pendiente / Próximos pasos

- [ ] **Logo**: no hay logo todavía. Cuando esté listo, agregar en la nav y footer reemplazando el texto.
- [ ] **Foto de Evelyn**: reemplazar el placeholder de iniciales (`.intro__deco`) con una foto real.
- [ ] **Foto de hero**: agregar una imagen de fondo al hero (actualmente usa un gradiente oscuro premium). Clase `.hero`, propiedad `background-image`.
- [ ] **Horario completo**: confirmar si atiende sábados y el horario exacto de cada día.
- [ ] **Servicios específicos**: las listas de servicios son representativas. Confirmar con Evelyn cuáles ofrece exactamente.
- [ ] **Dominio y hosting**: subir a Netlify (drag & drop de la carpeta), Vercel, o hosting propio.
- [ ] **Google Analytics / Meta Pixel**: agregar tracking antes de lanzar.
- [ ] **OG tags**: agregar imagen para preview en redes sociales.

## Paleta de colores

| Token         | Valor     | Uso                      |
|---------------|-----------|--------------------------|
| Gold          | `#B8965A` | Acento principal         |
| Gold Dark     | `#8C6E3F` | Textos de acento         |
| Rose          | `#C9A0A0` | Acento secundario        |
| Cream         | `#FAF8F5` | Fondo principal          |
| Ink           | `#1E1B18` | Texto principal          |

## Tipografía

- **Playfair Display** (Google Fonts) — headings, elegante, serif
- **Inter** (Google Fonts) — body, legible, moderno
