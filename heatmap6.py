with open('src/components/Dashboard.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

out_lines = []
in_matrix = False
matrix_divs = 0

for line in lines:
    if '<div className="data-grid camera-matrix"' in line:
        in_matrix = True
        out_lines.append('                <div style={{ marginTop: "0px" }}><SiteHealthHeatmap /></div>\n')
        matrix_divs += 1
        continue
    
    if in_matrix:
        if '<div' in line:
            matrix_divs += line.count('<div')
        if '</div' in line:
            matrix_divs -= line.count('</div')
        
        if matrix_divs == 0:
            in_matrix = False
        continue

    out_lines.append(line)

with open('src/components/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.writelines(out_lines)
