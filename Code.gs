/* KELAKAR - Backend Google Apps Script
   JANGAN diunggah ke GitHub publik (berisi kata sandi admin). */
const CFG = {
  ADMIN_EMAIL: 'sdnegeri12badau12@gmail.com',
  ADMIN_PASS: 'SDN12Badau*',
  NOTIF_EMAIL: 'sartika4113@admin.sd.belajar.id',
  FOLDER_ID: '1-yvWpTIzY0EheN04uHAHIsXBRkN9WY0F',
  SHEET: 'Laporan'
};
const HEAD = ['Kode','Waktu','Nama','HP','Status Pelapor','Jenis','Deskripsi','Lampiran','Status','Tanggapan'];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let t = ss.getSheetByName(CFG.SHEET);
  if (!t) { t = ss.insertSheet(CFG.SHEET); t.appendRow(HEAD); }
  return t;
}
function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
function mask_(n) {
  n = String(n || '').trim();
  if (!n) return 'Anonim';
  return n.split(/\s+/).map(w => w[0] + '*'.repeat(Math.max(2, w.length - 1))).join(' ');
}
function isAdmin_(tok) { return tok && CacheService.getScriptCache().get(tok) === '1'; }

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    switch (d.action) {
      case 'submit': return out_(submit_(d));
      case 'list': return out_({ ok: true, rows: rows_().map(r => ({ kode: r[0], waktu: r[1], nama: mask_(r[2]), jenis: r[5], status: r[8] })).reverse() });
      case 'track': {
        const r = rows_().find(x => x[0] === d.kode);
        return out_(r ? { ok: true, status: r[8], jenis: r[5], tanggapan: r[9] } : { ok: false });
      }
      case 'login': {
        if (d.email === CFG.ADMIN_EMAIL && d.password === CFG.ADMIN_PASS) {
          const tok = Utilities.getUuid();
          CacheService.getScriptCache().put(tok, '1', 21600);
          return out_({ ok: true, token: tok });
        }
        return out_({ ok: false });
      }
      case 'adminList':
        if (!isAdmin_(d.token)) return out_({ ok: false });
        return out_({ ok: true, rows: rows_().map(r => ({ kode: r[0], waktu: r[1], nama: r[2] || 'Anonim', hp: r[3], statusPelapor: r[4], jenis: r[5], deskripsi: r[6], lampiran: r[7], status: r[8], tanggapan: r[9] })).reverse() });
      case 'delete': {
        if (!isAdmin_(d.token)) return out_({ ok: false });
        const t = sheet_(), v = t.getDataRange().getValues();
        for (let i = 1; i < v.length; i++) if (v[i][0] === d.kode) {
          const m = String(v[i][7]).match(/[-\w]{25,}/);
          if (m) { try { DriveApp.getFileById(m[0]).setTrashed(true); } catch (x) {} }
          t.deleteRow(i + 1);
          return out_({ ok: true });
        }
        return out_({ ok: false });
      }
      case 'update': {
        if (!isAdmin_(d.token)) return out_({ ok: false });
        const t = sheet_(), v = t.getDataRange().getValues();
        for (let i = 1; i < v.length; i++) if (v[i][0] === d.kode) {
          t.getRange(i + 1, 9, 1, 2).setValues([[d.status, d.tanggapan || '']]);
          return out_({ ok: true });
        }
        return out_({ ok: false });
      }
    }
    return out_({ ok: false, error: 'aksi tidak dikenal' });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  }
}
function rows_() { return sheet_().getDataRange().getValues().slice(1); }

function submit_(d) {
  if (!String(d.nama || '').trim()) throw new Error('Nama wajib diisi');
  const kode = 'KLK-' + Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyMMdd') + '-' + Math.floor(1000 + Math.random() * 9000);
  const waktu = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'dd MMM yyyy HH:mm');
  let url = '';
  if (d.file) {
    const blob = Utilities.newBlob(Utilities.base64Decode(d.file), d.mime, kode + '_' + d.fileName);
    url = DriveApp.getFolderById(CFG.FOLDER_ID).createFile(blob).getUrl();
  }
  sheet_().appendRow([kode, waktu, d.nama || '', "'" + d.hp, d.status, d.jenis, d.deskripsi, url, 'Diterima', '']);
  MailApp.sendEmail({
    to: CFG.NOTIF_EMAIL,
    subject: '[KELAKAR] Pengaduan baru ' + kode + ' - ' + d.jenis,
    body: 'Pengaduan baru diterima.\n\nKode: ' + kode + '\nWaktu: ' + waktu +
      '\nPelapor: ' + (d.nama || 'Anonim') + '\nHP: ' + d.hp + '\nStatus: ' + d.status +
      '\nJenis: ' + d.jenis + '\n\nDeskripsi:\n' + d.deskripsi +
      '\n\nLampiran: ' + (url || '-') + '\n\nTindak lanjuti melalui menu Admin di website KELAKAR.'
  });
  return { ok: true, kode: kode };
}
