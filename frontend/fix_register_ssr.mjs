import fs from 'fs';
let c = fs.readFileSync('src/app/register/page.tsx', 'utf8');
c = "'use client';\nimport dynamic from 'next/dynamic';\n" + c.replace("'use client';", '');
c = c.replace(
  'export default function RegisterPage()',
  'function RegisterPage()'
);
c = c + "\nexport default dynamic(() => Promise.resolve(RegisterPage), { ssr: false });";
fs.writeFileSync('src/app/register/page.tsx', c);
console.log('ok');
