await Bun.build({
	entrypoints: ['src/index.ts'],
	outdir: 'dist',
	minify: true,
	packages: "bundle",
	target: "bun",
});

export { };
