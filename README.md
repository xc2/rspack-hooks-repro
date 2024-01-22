## Issue 1 - taps inflation on serve mode

```js
const plugin = {
    apply(compiler) {
        const name = 'plugin-xx';
        compiler.hooks.compilation.tap(name, (compilation) => {
            compilation.hooks.optimizeChunkModules.tap(name, () => {
                console.log('optimizeChunkModules called');
            })
            
            console.log('optimizeChunkModules taps:', compilation.hooks.optimizeChunkModules.taps.filter(tap => tap.name === name).length);
        })
    }
}
```

### Steps

- Run serve mode
- See once `optimizeChunkModules called` following `optimizeChunkModules taps: 1`
- Modify source codes like `src/index.js`
- See double `optimizeChunkModules called` following `optimizeChunkModules taps: 2`
- Modify source codes like `src/index.js`
- See triple `optimizeChunkModules called` following `optimizeChunkModules taps: 3`

### Expected

- Always see once `optimizeChunkModules called` following `optimizeChunkModules taps: 1` after every source change.

### More

I use `compiler.hooks.compilation` and `compilation.hooks.optimizeChunkModules` just for instance - seems that this issue applies to not only these hooks.

## Issue 2 - Node API compatibility with webpack

```js
const plugin = {
  /**
   * @param {import('webpack').Compiler} compiler
   */
  apply(compiler) {
    const name = "//test//";
    const isRspack = compiler.webpack.rspackVersion;

    compiler.hooks.make.tap(name, (compilation) => {
      const report = compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_REPORT;
      compilation.hooks.processAssets.tap({ name, stage: report }, () => {});
      if (isRspack) {
        const taps = compilation.hooks.processAssets.stageReport.taps;
      } else {
        const taps = compilation.hooks.processAssets.taps.filter((tap) => tap.stage === report);
      }
    });
  },
};
```

Webpack has all processAssets taps included in `compilation.hooks.processAssets.taps` while rspack separates them into  `compilation.hooks.processAssets.[stage].taps`.