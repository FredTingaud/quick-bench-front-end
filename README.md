![Build Status](https://github.com/FredTingaud/quick-bench-front-end/workflows/CI/badge.svg)

# quick-bench-front-end

Front end side of the Quick Bench Suite (Quick Bench and Build Bench) websites.

## Use online

The Quick Bench Suite is a set of online tools available for free.

### Quick Bench

Quick Bench is a micro benchmarking tool intended to quickly and simply compare the performance of two or more code snippets. It uses [Google Benchmark](https://github.com/google/benchmark/)'s API.

You can use it by going to https://quick-bench.com

### Build Bench

Build Bench is a tool to quickly and simply compare the build time of code snippets with various compilers.

You can use it by going to https://build-bench.com

## Run instances locally

You can run Quick Bench or Build Bench locally inside Docker using [Bench Runner](https://github.com/FredTingaud/bench-runner)

## Debug and run the code locally

If you want to build the front-end part of the Quick Bench Suite, you will need [Yarn](https://yarnpkg.com/).

Each tool has its own folder, with a shared `components` folder for all shared widgets.

### Quick Bench

Run

```
cd quick-bench
yarn
yarn start
```

It will start a local server on localhost:3000, that needs to communicate with a local [Bench Runner](https://github.com/FredTingaud/bench-runner) back-end.

### Build Bench

Run

```
cd build-bench
yarn
yarn start
```

It will start a local server on localhost:3000, that needs to communicate with a local [Bench Runner](https://github.com/FredTingaud/bench-runner) back-end.
