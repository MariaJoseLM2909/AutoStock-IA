import fs from 'fs';
let c = fs.readFileSync('src/app/login/page.tsx', 'utf8');
c = c.replace(
  "import { useState } from 'react';",
  "import { useState, useEffect } from 'react';"
);
c = c.replace(
  'export default function LoginPage() {',
  "export default function LoginPage() {\n  const [mounted, setMounted] = useState(false);\n  useEffect(() => setMounted(true), []);"
);
c = c.replace(
  '  return (',
  '  if (!mounted) return null;\n  return ('
);
fs.writeFileSync('src/app/login/page.tsx', c);
console.log('ok');
