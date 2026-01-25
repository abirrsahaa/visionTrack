## 2024-05-23 - Build System Sensitivity
**Learning:** The project has strict linting rules enabled in the build process that are currently failing due to unescaped entities and other issues in existing files.
**Action:** When making changes, be aware that `npm run build` will fail due to pre-existing lint errors, but `Compiled successfully` indicates TypeScript validity. Future optimizations should ideally fix these if they touch the affected files, or CI might need adjustment (though I cannot change CI).
