'use client';

import * as Ariakit from '@ariakit/react';

interface DropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function Dropdown({
  label,
  value,
  options,
  onChange,
  placeholder,
}: DropdownProps) {
  return (
    <Ariakit.SelectProvider value={value} setValue={onChange}>
      <label className="text-sm font-medium text-[var(--text-muted)] mb-1">
        {label}
      </label>

      {/* This is the disclosure button */}
      <Ariakit.Select className="input w-full cursor-pointer">
        {value || placeholder || 'Select'}
      </Ariakit.Select>

      {/* Dropdown items */}
      <Ariakit.SelectPopover
        gutter={4}
        sameWidth
        className="z-50 mt-1 rounded-xl shadow-xl border bg-[var(--bg-light)] border-[var(--border-color)] p-1"
      >
        {options.map((opt) => (
          <Ariakit.SelectItem
            key={opt}
            value={opt}
            className="px-3 py-2 rounded-md cursor-pointer hover:bg-[var(--bg-hover)] text-sm text-[var(--text-normal)]"
          >
            {opt}
          </Ariakit.SelectItem>
        ))}
      </Ariakit.SelectPopover>
    </Ariakit.SelectProvider>
  );
}
