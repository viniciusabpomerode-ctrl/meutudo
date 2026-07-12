// Gera o "Pix Copia e Cola" (BR Code / EMV QR Code do Banco Central) e
// desenha o QR code correspondente. Sem backend: e so um texto formatado
// que qualquer banco sabe ler.

function pixCrc16(str) {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) & 0xFFFF : (crc << 1) & 0xFFFF;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function pixField(id, value) {
  return id + String(value.length).padStart(2, "0") + value;
}

function pixStrip(s) {
  return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9 ]/g, "");
}

// opts: { key, name, city, amount, txid }
function buildPixPayload(opts) {
  const name = pixStrip(opts.name).slice(0, 25) || "DEUTSCHBLOOM";
  const city = pixStrip(opts.city).slice(0, 15).toUpperCase() || "BRASIL";
  const txid = (String(opts.txid || "").replace(/[^A-Za-z0-9]/g, "").slice(0, 25)) || "***";

  const merchantAccount = pixField("00", "br.gov.bcb.pix") + pixField("01", opts.key);
  const amountField = opts.amount ? pixField("54", Number(opts.amount).toFixed(2)) : "";

  let payload =
    pixField("00", "01") +
    pixField("01", "11") +
    pixField("26", merchantAccount) +
    pixField("52", "0000") +
    pixField("53", "986") +
    amountField +
    pixField("58", "BR") +
    pixField("59", name) +
    pixField("60", city) +
    pixField("62", pixField("05", txid)) +
    "6304";

  return payload + pixCrc16(payload);
}

// Desenha o QR num elemento (precisa da lib qrcode-generator ja carregada).
function renderPixQR(containerEl, payload) {
  if (!window.qrcode) return;
  const qr = window.qrcode(0, "M");
  qr.addData(payload);
  qr.make();
  containerEl.innerHTML = qr.createSvgTag({ scalable: true });
}
