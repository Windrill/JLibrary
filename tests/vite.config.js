import { resolve } from 'path'
import { defineConfig } from 'vite'

// Really not sure why it's not effective. I've tried
//  vite --config ./JLibrary/tests/vite.config.js nested, and it doesn't work
// some websites suggest 'vite serve' but 2.9.9's help doesn't seem to have this option
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'test_bootstrap.html'),
        nested: resolve(__dirname, 'tests/index.html')
      }
    },
        commonjsOptions: {
      include: ["./text_layer"]
    }

  }
});

/*
import path from 'path'

export default {
  root: path.resolve(__dirname, 'src'),
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'src/index.html'),
        about: path.resolve(__dirname, 'src/about.html')
      }
    }
  }
}
 */