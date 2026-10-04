import React from "react";

export default function Stepper({ value, min, max, onChange, unit = "人", label }) {
  return (
    <div className="stepper" role="group" aria-label={label}>
      <button type="button" className="stepper-btn" onClick={() => onChange(value - 1)}
        disabled={value <= min} aria-label="減らす">−</button>
      <output className="stepper-value" aria-live="polite">
        <span className="stepper-num">{value}</span><span className="stepper-unit">{unit}</span>
      </output>
      <button type="button" className="stepper-btn" onClick={() => onChange(value + 1)}
        disabled={value >= max} aria-label="増やす">＋</button>
    </div>
  );
}
