'use client';

import { useMemo, useState } from 'react';
import { logToolUsage } from '@/lib/usage';
import { ToolOutputPanel, ToolTwoColumn } from '@/components/tool-shell';
import { NumberInput } from './shared-panels';

export function PasswordTool() {
  const [length, setLength] = useState(16);
  const [symbols, setSymbols] = useState(true);
  const chars = `ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789${symbols ? '!@#$%^&*?' : ''}`;
  const password = useMemo(
    () => Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join(''),
    [chars, length],
  );
  return (
    <div className="card space-y-4">
      <div>
        <label className="label" htmlFor="pw-len">
          Length ({length})
        </label>
        <input
          id="pw-len"
          className="w-full"
          type="range"
          min={8}
          max={64}
          value={length}
          onChange={(event) => setLength(Number(event.target.value))}
        />
      </div>
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
        <input type="checkbox" checked={symbols} onChange={(event) => setSymbols(event.target.checked)} />
        Include symbols
      </label>
      <ToolOutputPanel value={password} slug="password-generator" title="Password" rows={3} />
    </div>
  );
}

export function AgeTool() {
  const [date, setDate] = useState('2000-01-01');
  const age = useMemo(() => {
    const start = new Date(date);
    const now = new Date();
    const days = Math.floor((now.getTime() - start.getTime()) / 86400000);
    return `Years: ${Math.floor(days / 365.25)}\nMonths approx: ${Math.floor(days / 30.44)}\nDays: ${days}`;
  }, [date]);
  return (
    <ToolTwoColumn>
      <div className="card space-y-3">
        <label className="label" htmlFor="age-date">
          Birth date
        </label>
        <input id="age-date" className="input" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
      </div>
      <ToolOutputPanel value={age} slug="age-calculator" title="Age" rows={6} />
    </ToolTwoColumn>
  );
}

export function UnitTool() {
  const [type, setType] = useState('km-mi');
  const [value, setValue] = useState(10);
  const result = type === 'km-mi' ? value * 0.621371 : type === 'kg-lb' ? value * 2.20462 : (value * 9) / 5 + 32;
  return (
    <ToolTwoColumn>
      <div className="card space-y-4">
        <label className="label" htmlFor="unit-type">
          Conversion
        </label>
        <select id="unit-type" className="input" value={type} onChange={(event) => setType(event.target.value)}>
          <option value="km-mi">Kilometers to miles</option>
          <option value="kg-lb">Kilograms to pounds</option>
          <option value="c-f">Celsius to Fahrenheit</option>
        </select>
        <NumberInput label="Value" value={value} setValue={setValue} />
      </div>
      <ToolOutputPanel value={result.toFixed(4)} slug="unit-converter" title="Result" />
    </ToolTwoColumn>
  );
}

export function TimestampTool() {
  const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000));
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const readable = new Date(timestamp * 1000).toLocaleString();
  const fromDate = Math.floor(new Date(date).getTime() / 1000);
  const output = `Timestamp to date: ${readable}\nDate to timestamp: ${fromDate}`;
  return (
    <ToolTwoColumn>
      <div className="card space-y-4">
        <NumberInput label="Unix seconds" value={timestamp} setValue={setTimestamp} />
        <div>
          <label className="label" htmlFor="ts-local">
            Local datetime
          </label>
          <input id="ts-local" className="input" type="datetime-local" value={date} onChange={(event) => setDate(event.target.value)} />
        </div>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            setTimestamp(Math.floor(Date.now() / 1000));
            void logToolUsage('timestamp-converter', { action: 'now' });
          }}
        >
          Set to now
        </button>
      </div>
      <ToolOutputPanel value={output} slug="timestamp-converter" title="Conversion" rows={8} />
    </ToolTwoColumn>
  );
}
