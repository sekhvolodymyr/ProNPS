"use client";

import { QRCodeCanvas } from "qrcode.react";
import { Copy, Download } from "lucide-react";
import { useRef } from "react";

export function QrCard({ url }: { url: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  function download() {
    const canvas = ref.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "pronps-qr.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="panel qr-box">
      <strong>Посилання та QR</strong>
      <QRCodeCanvas includeMargin ref={ref} size={180} value={url} />
      <code className="small" style={{ wordBreak: "break-all" }}>
        {url}
      </code>
      <div className="nav-actions">
        <button className="button secondary" onClick={() => navigator.clipboard.writeText(url)} type="button">
          <Copy size={16} /> Скопіювати
        </button>
        <button className="button secondary" onClick={download} type="button">
          <Download size={16} /> QR
        </button>
      </div>
    </div>
  );
}

