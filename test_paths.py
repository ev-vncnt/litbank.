import os

BASE_DIR = r"e:\litbank"

paths_to_check = [
    os.path.join(BASE_DIR, 'templates', 'index.html'),
    os.path.join(BASE_DIR, 'static', 'scripts.js'),
    os.path.join(BASE_DIR, 'static', 'style.css'),
    os.path.join(BASE_DIR, 'data', 'books.csv')
]

print("Checking file paths:")
for path in paths_to_check:
    exists = os.path.exists(path)
    status = "✓ EXISTS" if exists else "✗ MISSING"
    print(f"{status}: {path}")