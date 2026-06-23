import fs from 'fs';
let c = fs.readFileSync('src/app/login/page.tsx', 'utf8');
c = "'use client';\nimport dynamic from 'next/dynamic';\n" + c.replace("'use client';", '');
c = c.replace(
  'export default function LoginPage()',
  'function LoginPage()'
);
c = c + "\nexport default dynamic(() => Promise.resolve(LoginPage), { ssr: false });";
fs.writeFileSync('src/app/login/page.tsx', c);
console.log('ok');
