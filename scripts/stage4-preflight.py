"""Static guardrails only. Not a substitute for build, CSS/network or browser QA."""
import json,re,pathlib,sys
root=pathlib.Path(__file__).resolve().parents[1]
gen=root/'content/generated'
pages=json.loads((gen/'pages.json').read_text());home=json.loads((gen/'home.json').read_text());site=json.loads((gen/'site.json').read_text());allpages=[home]+pages
expected=['','beginner-guide','birds','nesting-guide','survival-guide','gamepasses']
errors=[]
def assertcheck(cond,msg):
 if not cond:errors.append(msg)
assertcheck([p['slug'] for p in allpages]==expected,'Unexpected approved route set/order')
assertcheck(len(set(p['title'] for p in allpages))==6,'Duplicate page title')
assertcheck(len(set(p['description'] for p in allpages))==6,'Duplicate description')
assertcheck(site['hosting']['siteUrl']=='https://broodwing-wiki.github.io','Wrong canonical host')
assertcheck(site['theme']['skin']=='directory','Yorich UI skin changed')
assertcheck(site['readyForLaunch'] is True,'Indexing is disabled: readyForLaunch must be true in release source')
assertcheck(not any(p['slug'] in ['codes','best-birds'] for p in pages),'HOLD page enabled')
for p in allpages:
 slug=p['slug'] or '/'
 assertcheck(len(p['sections'])>=4,f'{slug}: missing section depth')
 assertcheck(len(p['faq'])>=2,f'{slug}: missing FAQs')
 assertcheck(p['hero']['heading'].lower().startswith('broodwing'),f'{slug}: primary heading missing game')
 ids=[s['id'] for s in p['sections']]
 assertcheck(len(ids)==len(set(ids)),f'{slug}: duplicated anchor id')
 for s in p['sections']:
  for l in s.get('links',[]):assertcheck(l['slug'] in expected,f'{slug}: broken link {l["slug"]}')
  for sub in s.get('subsections',[]):assertcheck(len(sub['paragraphs'])>0,f'{slug}: empty subsection')
print('Static source assertions:', 'PASS' if not errors else 'FAIL')
for error in errors:print('FAIL',error)
print('Approved content routes:',len(allpages))
print('Build/CSS/network/browser checks: UNVERIFIED by this script')
sys.exit(bool(errors))
