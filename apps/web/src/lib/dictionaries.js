// English uses a single word list (EN_WORDS_FULL, the public-domain ENABLE
// list, ~172,823 words), loaded on demand via dynamic import() in
// useWordUnscrambler.js — the same pattern every other language already uses.
//
// Note on NWL/CSW: this app previously offered a three-way ENABLE/NWL/CSW
// selector, but NWL2023 and CSW are commercial, copyrighted word lists
// (NASPA and Collins/HarperCollins respectively) that require a paid
// developer licence — they are not freely redistributable, and the
// selector's NWL/CSW options were never backed by genuine NWL/CSW content.
// Real NWL/CSW support would need pursuing an actual licence with NASPA
// and/or Collins as a deliberate product decision; until/unless that
// happens, English intentionally offers one honest dictionary (ENABLE),
// same as every other language.

export const DICTIONARIES = {
  ENABLE: {
    id: 'ENABLE',
    name: 'ENABLE',
    description: 'Enhanced North American Benchmark LExicon — comprehensive public-domain English word list',
    wordCount: 172823
  }
};
