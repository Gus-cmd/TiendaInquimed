const assert = require('assert');
const filter = require('../js/filter.js');

const sample = [
  { name: 'Ácido clorhídrico 37%', formula: 'HCl', category: 'Reactivo', tags: ['reactivo', 'ácido'] },
  { name: 'Etanol absoluto', formula: 'C2H6O', category: 'Solvente', tags: ['solvente', 'orgánico'] },
  { name: 'Solución salina', formula: 'NaCl', category: 'Reactivo', tags: ['sal'] }
];

// basic tests
assert.strictEqual(filter(sample, 'ácido').length, 1, 'Buscar por ácido debe devolver 1');
assert.strictEqual(filter(sample, 'HCl').length, 1, 'Buscar por fórmula HCl');
assert.strictEqual(filter(sample, 'solven').length, 1, 'Buscar con substring solven');
assert.strictEqual(filter(sample, '').length, 3, 'Buscar vacío devuelve todos');
assert.strictEqual(filter(sample, 'no-existe').length, 0, 'Término no existente devuelve 0');

console.log('filter tests: OK');
