import fs from 'fs';
let c = fs.readFileSync('src/app/login/page.tsx', 'utf8');
c = c.replace('const handleSubmit = async (e) => {', 'const handleSubmit = async (e: React.FormEvent) => {');
c = c.replace('} catch (err) {', '} catch (err: any) {');
fs.writeFileSync('src/app/login/page.tsx', c);
console.log('ok');
