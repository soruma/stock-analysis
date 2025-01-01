import * as fs from 'node:fs';
import * as glob from 'glob';

/**
 * Function to recursively delete files and directories
 * @param targetPath Path to be deleted
 */
const deleteRecursively = (targetPath: string): void => {
  if (!fs.existsSync(targetPath)) return; // Skip if the path does not exist

  fs.rmSync(targetPath, { recursive: true, force: true });
};

/**
 * Delete files and directories based on the specified patterns
 * @param patterns Patterns of files/directories to delete
 * @param rootDir Root directory to start the search
 */
const cleanupGeneratedFiles = (patterns: string[], rootDir: string): void => {
  // Separate `node_modules` to delete it last
  const otherPatterns = patterns.filter((pattern) => pattern !== 'node_modules');
  const nodeModulesPattern = patterns.filter((pattern) => pattern === 'node_modules');

  // Delete other patterns first
  for (const pattern of otherPatterns) {
    const matches = glob.sync(pattern, { cwd: rootDir, absolute: true });
    for (const match of matches) {
      console.log(`Deleting: ${match}`);
      deleteRecursively(match);
    }
  }

  // Delete `node_modules` last
  for (const pattern of nodeModulesPattern) {
    const matches = glob.sync(pattern, { cwd: rootDir, absolute: true });
    for (const match of matches) {
      console.log(`Deleting (last): ${match}`);
      deleteRecursively(match);
    }
  }
};

// Specify the patterns to delete
const deletePatterns: string[] = [
  'cdk.out', // CDK output directory
  '**/*.d.ts', // Type definition files
  '**/*.js', // JavaScript files
  '**/*.js.map', // Source maps
  '**/dist', // Build artifacts
  '**/node_modules', // node_modules directory (deleted last)
];

// Root directory of the project
const rootDir: string = process.cwd();

// Delete generated files
cleanupGeneratedFiles(deletePatterns, rootDir);

console.log('Cleanup complete!');
