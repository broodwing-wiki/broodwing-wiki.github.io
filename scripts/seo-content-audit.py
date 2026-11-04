"""Count published, visible article copy, not JSON key names or source URLs."""
import json, re
from pathlib import Path
root=Path(__file__).resolve().parents[1]/'content/generated'
items=[json.loads((root/'home.json').read_text())]+json.loads((root/'pages.json').read_text())

def text(x):
 if isinstance(x, str):return [x]
 if isinstance(x,list):return sum((text(z) for z in x),[])
 if not isinstance(x,dict):return []
 keys=('eyebrow','heading','lead','supportingText','intro','paragraphs','bullets','steps','subsections','sections','table','caption','columns','rows','faq','question','answer','label','description')
 return sum((text(x[k]) for k in keys if k in x),[])

print('Route | estimated displayed English words | characters | H2 sections')
ok=True
for p in items:
 raw=' '.join(text({'hero':p['hero'],'sections':p['sections'],'faq':p.get('faq',[])}))
 n=len(re.findall(r"\b[\w’-]+\b",raw)); chars=len(raw)
 print(f"/{p['slug']}/ | {n} | {chars} | {len(p['sections'])}")
 if n<1500 or n>2100:ok=False
print('WORD_TARGET:', 'PASS' if ok else 'FAIL')
raise SystemExit(0 if ok else 1)
