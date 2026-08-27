import os
backend_path = '../lake-group-backend/backend_api'
for root, dirs, files in os.walk(backend_path):
    for f in files:
        if f.endswith('.py'):
            with open(os.path.join(root, f), 'r', encoding='utf-8') as file:
                if 'alert_rules' in file.read():
                    print(f"Found in {f}")
