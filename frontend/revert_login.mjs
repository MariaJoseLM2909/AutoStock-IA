import fs from 'fs';
let c = fs.readFileSync('src/app/login/page.tsx', 'utf8');
c = c.replace(
  "import { useState, useEffect } from 'react';",
  "import { useState } from 'react';"
);
c = c.replace(
  "export default function LoginPage() {\n  const [mounted, setMounted] = useState(false);\n  useEffect(() => setMounted(true), []);",
  'export default function LoginPage() {'
);
c = c.replace(
  '  if (!mounted) return null;\n  return (',
  '  return ('
);
fs.writeFileSync('src/app/login/page.tsx', c);
console.log('ok');
