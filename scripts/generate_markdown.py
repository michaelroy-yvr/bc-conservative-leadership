#!/usr/bin/env python3
"""Generate markdown files for candidates from CSV."""

import csv
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
CANDIDATES_DIR = PROJECT_DIR / "content" / "candidates"
CSV_PATH = Path.home() / "Downloads" / "BC Conservative Leadership 2026 - Sheet1.csv"

# Candidates marked as withdrawn
WITHDRAWN = {"Chris Gardner", "Aaron Gunn", "Gavin Dew"}

CANDIDATES_DIR.mkdir(parents=True, exist_ok=True)


def slugify(name: str) -> str:
    """Convert name to filename-safe slug."""
    return name.lower().replace(" ", "-").replace(".", "")


def clean_bio(bio: str) -> str:
    """Convert bullet points to markdown format."""
    if not bio:
        return ""
    lines = bio.strip().split("\n")
    result = []
    for line in lines:
        line = line.strip()
        if line.startswith("•"):
            line = "-" + line[1:]
        result.append(line)
    return "\n".join(result)


def clean_supporters(supporters: str) -> str:
    """Format supporters list."""
    if not supporters:
        return ""
    return supporters.strip()


def generate_markdown(row: dict, order: int) -> str:
    """Generate markdown content for a candidate."""
    name = row['Name'].strip()
    slug = slugify(name)
    byline = row['By-line'].strip() if row.get('By-line') else ""
    website = row['Website'].strip() if row.get('Website') else ""
    bio = clean_bio(row.get('Bio', ''))
    supporters = clean_supporters(row.get('Supporters & staff', ''))
    withdrawn = name in WITHDRAWN

    # Social links
    x = row.get('X', '').strip()
    fb = row.get('FB', '').strip()
    tiktok = row.get('Tiktok', '').strip()
    insta = row.get('Insta', '').strip()
    youtube = row.get('Youtube', '').strip()

    # Check if photo exists
    photo_path = f"/photos/{slug}.jpg"

    md = f'''---
name: "{name}"
byline: "{byline}"
photo: "{photo_path}"
website: "{website}"
withdrawn: {str(withdrawn).lower()}
order: {order}
social:
  x: "{x}"
  facebook: "{fb}"
  instagram: "{insta}"
  youtube: "{youtube}"
  linkedin: ""
  tiktok: "{tiktok}"
  email: ""
---

## Bio

{bio if bio else "Biography coming soon."}

## Announcements

Campaign announcements will be posted here.

## Staff & Supporters

{supporters if supporters else "Information coming soon."}
'''
    return md


def main():
    with open(CSV_PATH, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    for order, row in enumerate(rows, start=1):
        name = row['Name'].strip()
        if not name:
            continue

        slug = slugify(name)
        md_content = generate_markdown(row, order)

        output_path = CANDIDATES_DIR / f"{slug}.md"
        output_path.write_text(md_content, encoding='utf-8')

        withdrawn_status = " (WITHDRAWN)" if name in WITHDRAWN else ""
        print(f"Created: {output_path.name}{withdrawn_status}")


if __name__ == '__main__':
    main()
