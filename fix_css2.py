with open('src/index.css', 'r', encoding='utf-8') as f:
    css = f.read()

css = css.replace(
    "@media (max-width: 768px) { .desktop-only { display: none !important; } .header-right-panel { justify-content: flex-end !important; flex: 1; flex-wrap: wrap; margin-top: 0; } .top-header { flex-wrap: nowrap !important; } }",
    "@media (max-width: 768px) { .desktop-only { display: none !important; } .top-header { flex-wrap: wrap !important; gap: 12px; } .mobile-filters-row { width: 100%; order: 5; } }"
)

# And on desktop, .mobile-filters-row should just flow naturally with width: auto
css += "\n@media (min-width: 769px) { .mobile-filters-row { order: 3; flex: 1; justify-content: flex-end; padding-right: 16px; } }"

with open('src/index.css', 'w', encoding='utf-8') as f:
    f.write(css)
