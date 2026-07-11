import { defineConfig } from 'oxfmt';

export default defineConfig({
  singleQuote: true,
  semi: true,
  useTabs:true,
  tabWidth:2,
  overrides: [
    {
      files: ['*.test.js', '*.spec.js'],
      options: {
        printWidth: 100 
      }
    }
  ]
});
