import glob
import re

for fname in glob.glob('*.html'):
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    new_content = re.sub(r'[ \t]*<div class="footer-social">\s*<a[^>]*aria-label="Facebook"[^>]*>.*?</a>\s*</div>\n?', '', content, flags=re.DOTALL)
    if new_content != content:
        with open(fname, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Successfully removed from {fname}')
    else:
        print(f'Pattern did not match in {fname}')
