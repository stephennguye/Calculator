const outputEl = document.getElementById('output');
const historyEl = document.getElementById('history');
const keys = document.getElementById('keys');

let expression = '';

function render() {
  historyEl.textContent = expression ? '' : '\u00A0';
  outputEl.textContent = expression || '0';
}

function appendValue(v) {
  expression += v;
  render();
}

function clearAll() {
  expression = '';
  render();
}

function backspace() {
  expression = expression.slice(0, -1);
  render();
}

function evaluateExpression() {
  if (!expression.trim()) return;
  try {
    let jsExpr = expression.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-');
    if (!/^[0-9+\-*/().\s]+$/.test(jsExpr)) throw new Error('Invalid input');
    const result = Function('"use strict";return ('+jsExpr+')')();
    historyEl.textContent = expression + " =";
    expression = String(result);
    render();
  } catch (e) {
    historyEl.textContent = 'Error';
    outputEl.textContent = 'Invalid';
  }
}

keys.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const val = btn.dataset.value;
  const action = btn.dataset.action;

  if (action === 'clear') return clearAll();
  if (action === 'back') return backspace();
  if (action === 'equals') return evaluateExpression();
  if (val) appendValue(val);
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { e.preventDefault(); evaluateExpression(); }
  if (e.key === 'Backspace') { backspace(); }
  if (e.key === 'Escape') { clearAll(); }
  const allowed = '0123456789+-*/().';
  if (allowed.includes(e.key)) appendValue(e.key);
});

render();
