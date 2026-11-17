import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

const COLOUR_LITERAL = /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/;
const SOURCE_FILE = /\.tsx?$/;
const TEST_FILE = /\.test\.tsx?$/;

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return name === '__tests__' ? [] : sourceFiles(full);
    return SOURCE_FILE.test(name) && !TEST_FILE.test(name) ? [full] : [];
  });
}

describe('package source', () => {
  it('in every source file, has no hard-coded colour literal', () => {
    const files = sourceFiles(join(__dirname, '..'));

    const offenders = files.filter((file) => COLOUR_LITERAL.test(readFileSync(file, 'utf8')));

    expect(offenders).toEqual([]);
    expect(files.length).toBeGreaterThan(10);
  });
});
