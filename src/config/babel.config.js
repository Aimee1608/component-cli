export default function babelConfig() {
	const { BABEL_MODULE, NODE_ENV } = process.env;
	const isTest = NODE_ENV === 'test';
	const useESModules = BABEL_MODULE !== 'commonjs' && !isTest;

	return {
		presets: [
			[
				require.resolve('@babel/preset-env'),
				{
					loose: true,
					modules: useESModules ? false : 'commonjs',
				},
			]
		],
		plugins: [
			[
				require.resolve('@babel/plugin-transform-runtime'),
				{
					corejs: false,
					useESModules,
				},
			],
			require.resolve('@babel/plugin-proposal-export-default-from')
		],
	};
};
