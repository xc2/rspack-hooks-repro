export const plugin = {
  /**
   * @param {import('webpack').Compiler} compiler
   */
  apply(compiler) {
    const name = "//test//";
    const isRspack = compiler.webpack.rspackVersion;
    const countTaps = (taps) => taps.filter((tap) => tap.name === name).length;

    compiler.hooks.compilation.tap(name, (compilation) => {
      compilation.hooks.optimizeChunkModules.tap(name, () => {
        console.log("optimizeChunkModules call");
      });
      console.log(
        "optimizeChunkModules taps:",
        countTaps(compilation.hooks.optimizeChunkModules.taps),
      );
    });

    compiler.hooks.make.tap(name, (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name,
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_REPORT,
        },
        () => {
          console.log("stageReport call");
        },
      );
      if (isRspack) {
        console.log(
          "stageReport taps:",
          countTaps(compilation.hooks.processAssets.stageReport.taps),
        );
      } else {
        console.log(
          "stageReport taps:",
          countTaps(
            compilation.hooks.processAssets.taps.filter(
              (tap) =>
                tap.stage ===
                compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_REPORT,
            ),
          ),
        );
      }
    });
  },
};
