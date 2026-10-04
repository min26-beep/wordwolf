import React, { useEffect, useRef } from "react";
import Button from "./Button.jsx";

export default function ConfirmDialog({ open, message, detail, confirmLabel = "OK",
  cancelLabel = "キャンセル", danger = false, onConfirm, onCancel }) {
  const cancelRef = useRef(null);
  useEffect(() => { if (open) cancelRef.current?.focus(); }, [open]);
  if (!open) return null;
  return (
    <div className="dialog-backdrop" onClick={onCancel}>
      <div className="dialog" role="alertdialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <p className="dialog-msg">{message}</p>
        {detail && <p className="dialog-detail">{detail}</p>}
        <div className="dialog-actions">
          <Button ref={cancelRef} variant="secondary" onClick={onCancel}>{cancelLabel}</Button>
          <Button variant={danger ? "danger" : "primary"} onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}
