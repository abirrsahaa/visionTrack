# Bolt's Journal ⚡

This document records critical performance learnings and insights.

## Learning Log

## 2026-02-05 - Canvas GPU Acceleration
**Learning:** `willReadFrequently: true` in Canvas 2D context disables GPU acceleration to optimize for read-back operations (getImageData). In animation loops that only draw (drawImage/fill), this flag causes significant performance degradation by forcing CPU rendering.
**Action:** Audit all canvas contexts and only enable `willReadFrequently` if `getImageData` is actually called.
