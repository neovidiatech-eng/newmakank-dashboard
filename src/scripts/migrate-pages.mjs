/**
 * Script to convert all dashboard list pages from async server-fetch to TableWithQuery (useApiQuery)
 * Run: node src/scripts/migrate-pages.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pagesDir = path.join(__dirname, '../pages/dashboard');

function getAllPageFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...getAllPageFiles(full));
    else if (entry.name === 'page.tsx') results.push(full);
  }
  return results;
}

function isListPage(content) {
  return (
    content.includes('fetchHelper') &&
    content.includes('TableBasic') &&
    content.includes('async function page') &&
    !content.includes('TableWithQuery')
  );
}

function extractEndPoint(content) {
  // Match: endPoint: ["something"]  or endPoint: ['something']
  const match = content.match(/endPoint:\s*(\[[^\]]+\])/);
  if (!match) return null;
  return match[1];
}

function extractColumns(content) {
  const match = content.match(/columns=\{([^}]+)\}/);
  if (!match) return null;
  return match[1].trim();
}

function extractTableActions(content) {
  const match = content.match(/tableActions=\{([\s\S]*?)\}/);
  if (!match) return null;
  return match[1].trim();
}

function extractCardHeader(content) {
  const match = content.match(/cardHeader=\{([^}]+)\}/);
  if (!match) return null;
  return match[1].trim();
}

function extractFilters(content) {
  const match = content.match(/filters=\{([\s\S]*?)\}\s*(?:\/?>|\n\s*[a-zA-Z])/);
  if (!match) return null;
  return match[1].trim();
}

function extractColumnImport(content) {
  const match = content.match(/import\s+(\w+)\s+from\s+['"]\.\/(\w+)['"]/g);
  if (!match) return [];
  return match.filter(imp => imp.includes('Columns') || imp.includes('columns'));
}

function extractPermissionKey(content) {
  const match = content.match(/permissions\?\.\["([^"]+)"\]/);
  if (match) return match[1];
  return null;
}

let converted = 0;
let skipped = 0;

for (const filePath of getAllPageFiles(pagesDir)) {
  const content = fs.readFileSync(filePath, 'utf8');

  if (!isListPage(content)) {
    skipped++;
    continue;
  }

  const endPoint = extractEndPoint(content);
  if (!endPoint) {
    console.log(`⚠️  Skipped (no endPoint): ${filePath}`);
    skipped++;
    continue;
  }

  const columns = extractColumns(content);
  const cardHeader = extractCardHeader(content);
  const filters = extractFilters(content);

  // Extract column import lines
  const colImports = extractColumnImport(content);

  // Extract tableActions block
  const tableActionsMatch = content.match(/tableActions=\{(\{[\s\S]*?\})\}/);
  const tableActions = tableActionsMatch ? tableActionsMatch[1] : null;

  // Extract hideCreateNew
  const hideCreateNewMatch = content.match(/hideCreateNew=\{([^}]+)\}/);
  const hideCreateNew = hideCreateNewMatch ? hideCreateNewMatch[1] : null;

  // Extract filters full block
  const filtersMatch = content.match(/filters=\{(\[[\s\S]*?\])\}/);
  const filtersBlock = filtersMatch ? filtersMatch[1] : null;

  // Build new page content
  const permKey = extractPermissionKey(content);

  let newContent = `import CustomHeader from "@/components/layouts/header/CustomHeader";
import TableWithQuery from "@/components/common/table/TableWithQuery";
import getPermissions from "@/api/permissions";
import { getTranslations } from "@/lib/i18n";
`;

  // Re-add column imports
  for (const imp of colImports) {
    newContent += imp + ';\n';
  }

  newContent += `
export default async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const permissions = await getPermissions();
  const permission = permissions?.["${permKey || ''}"];

  return (
    <>
      <CustomHeader />
      <TableWithQuery
        endPoint={${endPoint}}
        ${columns ? `columns={${columns}}` : ''}
        ${hideCreateNew ? `hideCreateNew={${hideCreateNew}}` : ''}
        ${cardHeader ? `cardHeader={${cardHeader}}` : ''}
        ${tableActions ? `tableActions={${tableActions}}` : ''}
        ${filtersBlock ? `filters={${filtersBlock}}` : ''}
      />
    </>
  );
}
`;

  fs.writeFileSync(filePath, newContent);
  console.log(`✅ Converted: ${path.relative(pagesDir, filePath)}`);
  converted++;
}

console.log(`\n✅ Done! Converted ${converted} pages, skipped ${skipped}.`);
