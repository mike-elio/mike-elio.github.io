import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const filenames = [
  "Adaptive-AI-Tool-Guide--10-complete-homepage.png",
  "Adaptive-AI-Tool-Guide--17-complete-ai-comparison-section.png",
  "Adaptive-AI-Tool-Guide--18-complete-what-if-recommendations.png",
  "Adaptive-AI-Tool-Guide--19-complete-crewai-recommendation-card.png",
  "Adaptive-AI-Tool-Guide--COVER.png",
  "AquaGuard-AI--01-agricultural-runoff-request-response.png",
  "AquaGuard-AI--03-organic-stress-request-response.png",
  "AquaGuard-AI--04-thermal-stress-request-response.png",
  "AquaGuard-AI--05-chemical-contamination-request-response.png",
  "AquaGuard-AI--COVER.png",
  "Fake-Image-Detector--21-experiment-05-complete-learning-curves.png",
  "Fake-Image-Detector--22-experiment-01-recorded-learning-curves.png",
  "Fake-Image-Detector--22-experiment-02-recorded-learning-curves.png",
  "Fake-Image-Detector--22-experiment-03-recorded-learning-curves.png",
  "Fake-Image-Detector--22-experiment-04-recorded-learning-curves.png",
  "Fake-Image-Detector--23-all-five-experiments-comparison.png",
  "Fake-Image-Detector--COVER.png",
  "Nahd-AI--02-python-interview-complete.png",
  "Nahd-AI--03-goalpath-home-desktop.png",
  "Nahd-AI--06-rag-retrieval-track-preference.png",
  "Nahd-AI--08-complete-fit-and-personalized-gap-plan.png",
  "Nahd-AI--COVER.png"
];

test('all 22 original project screenshots are committed as valid PNG files', () => {
  assert.equal(filenames.length, 22);
  for (const filename of filenames) {
    const path = join(process.cwd(), 'public', 'assets', 'projects', '2026-11-08', filename);
    const bytes = readFileSync(path);
    assert.ok(bytes.byteLength > 2000, 'Image too small: ' + filename);
    assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a',
      'Not a valid PNG: ' + filename);
  }
});
