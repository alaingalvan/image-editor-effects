import * as esbuild from 'esbuild';

const isServe = process.argv.includes('--serve');

const options = {
  entryPoints: ['src/index.tsx'],
  bundle: true,
  outfile: 'dist/bundle.js',
  format: 'iife',
  jsx: 'automatic',
  sourcemap: true,
  target: 'es2020',
  logLevel: 'info',
};

if (isServe) {
  const ctx = await esbuild.context(options);
  const { host, port } = await ctx.serve({ servedir: '.', port: 8080 });
  console.log(`Your app running at http://${host || 'localhost'}:${port}`);
} else {
  await esbuild.build(options);
}
