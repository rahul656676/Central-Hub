with open('src/index.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Fix the media query that ruins the mobile header layout
css = css.replace(
    "@media (max-width: 768px) { .desktop-only { display: none !important; } .header-right-panel { justify-content: flex-start !important; width: 100%; margin-top: 8px; } }",
    "@media (max-width: 768px) { .desktop-only { display: none !important; } .header-right-panel { justify-content: flex-end !important; flex: 1; flex-wrap: wrap; margin-top: 0; } .top-header { flex-wrap: nowrap !important; } }"
)

with open('src/index.css', 'w', encoding='utf-8') as f:
    f.write(css)
