import fs from 'fs';
let c = fs.readFileSync('src/components/layout/PublicLayout.tsx', 'utf8');
c = c.replace(
  "import Navbar from './Navbar';",
  "import dynamic from 'next/dynamic';\nconst Navbar = dynamic(() => import('./Navbar'), { ssr: false });"
);
fs.writeFileSync('src/components/layout/PublicLayout.tsx', c);
console.log('ok');
