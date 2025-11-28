// Vite import query module declarations
// Allow imports like `import file from './foo.txt?raw'` to be typed as `string`
declare module '*?raw' {
	const value: string;
	export default value;
}

// Allow imports like `import WorkerCtor from './worker?worker'` so that
// `new WorkerCtor()` can be called in code (Vite returns a constructor for a Worker).
declare module '*?worker' {
	const ctor: {
		new (...args: any[]): Worker;
	};
	export default ctor;
}

// Also type-check file extensions imported with raw explicitly if desired
declare module '*.csv?raw' {
	const value: string;
	export default value;
}

declare module '*.xml?raw' {
	const value: string;
	export default value;
}

