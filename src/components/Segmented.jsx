import React from "react";

/** options: [{ value, label, disabled }] */
export default function Segmented({ options, value, onChange, label, wrap = false }) {
  return (
    <div className={`segmented ${wrap ? "is-wrap" : ""}`} role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button key={String(o.value)} type="button" role="radio"
          aria-checked={value === o.value}
          className={`seg ${value === o.value ? "is-on" : ""}`}
          disabled={o.disabled}
          onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
