/**
 * 美術碩專修課盤 —— 雲端存檔後端（Google Apps Script）
 *
 * 用法：在一份 Google 試算表裡開 擴充功能 → Apps Script，
 * 把這整份程式碼貼上去，然後「部署 → 新增部署作業 → 網頁應用程式」，
 * 執行身分＝我，存取權限＝所有人，複製產生的 /exec 網址填進 index.html。
 */

var SHEET = 'plans';
var HEAD  = ['id', 'name', 'pin', 'cohort', 'done', 'plan', 'updatedAt', 'data'];

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET);
  if (!sh) {
    sh = ss.insertSheet(SHEET);
    sh.appendRow(HEAD);
    sh.setFrozenRows(1);
  }
  if (sh.getLastRow() === 0) sh.appendRow(HEAD);
  return sh;
}

function rows_() {
  var sh = sheet_();
  var last = sh.getLastRow();
  if (last < 2) return [];
  var vals = sh.getRange(2, 1, last - 1, HEAD.length).getValues();
  return vals.map(function (r, i) {
    var o = { _row: i + 2 };
    HEAD.forEach(function (h, c) { o[h] = r[c]; });
    return o;
  }).filter(function (o) { return String(o.id || '').length > 0; });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return json_({ ok: true, service: 'ntua-credit-board', plans: rows_().length });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try { lock.waitLock(15000); } catch (err) { return json_({ ok: false, error: '伺服器忙碌中，請再試一次' }); }
  try {
    var body = {};
    try { body = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: '格式錯誤' }); }

    if (body.op === 'list')   return json_(opList_());
    if (body.op === 'get')    return json_(opGet_(body));
    if (body.op === 'save')   return json_(opSave_(body));
    if (body.op === 'delete') return json_(opDelete_(body));
    return json_({ ok: false, error: '未知的操作' });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err) });
  } finally {
    lock.releaseLock();
  }
}

function opList_() {
  var plans = rows_().map(function (r) {
    return {
      id: String(r.id), name: String(r.name || ''), cohort: Number(r.cohort) || null,
      done: Number(r.done) || 0, plan: Number(r.plan) || 0,
      updatedAt: Number(r.updatedAt) || 0, hasPin: String(r.pin || '').length > 0
    };
  }).sort(function (a, b) { return b.updatedAt - a.updatedAt; });
  return { ok: true, plans: plans };
}

function opGet_(body) {
  var r = rows_().filter(function (x) { return String(x.id) === String(body.id); })[0];
  if (!r) return { ok: false, error: '找不到這筆課表' };
  var pin = String(r.pin || '');
  if (pin && pin !== String(body.pin || '')) return { ok: false, error: '密碼不對' };
  var data = {};
  try { data = JSON.parse(r.data || '{}'); } catch (err) {}
  return { ok: true, plan: { id: String(r.id), name: String(r.name || ''), data: data } };
}

function opSave_(body) {
  var name = String(body.name || '').trim().slice(0, 40);
  if (!name) return { ok: false, error: '請填姓名' };
  var pin = String(body.pin || '').trim();
  if (pin && !/^\d{4}$/.test(pin)) return { ok: false, error: '密碼要是 4 位數字' };

  var payload = JSON.stringify({
    cohort: body.cohort, place: body.place || {}, cat: body.cat || {},
    doneOv: body.doneOv || {}, custom: body.custom || [], check: body.check || {}
  });
  if (payload.length > 90000) return { ok: false, error: '資料太大，存不下' };

  var sh = sheet_();
  var now = Date.now();
  var id  = String(body.id || '');

  if (id) {
    var r = rows_().filter(function (x) { return String(x.id) === id; })[0];
    if (!r) return { ok: false, error: '找不到這筆課表' };
    var old = String(r.pin || '');
    if (old && old !== pin) return { ok: false, error: '密碼不對，無法覆蓋這筆課表' };
    sh.getRange(r._row, 1, 1, HEAD.length).setValues([[
      id, name, pin, body.cohort || '', body.done || 0, body.plan || 0, now, payload
    ]]);
    return { ok: true, id: id };
  }

  id = 'p' + now.toString(36) + Math.floor(Math.random() * 100000).toString(36);
  sh.appendRow([id, name, pin, body.cohort || '', body.done || 0, body.plan || 0, now, payload]);
  return { ok: true, id: id };
}

function opDelete_(body) {
  var r = rows_().filter(function (x) { return String(x.id) === String(body.id); })[0];
  if (!r) return { ok: true };
  var pin = String(r.pin || '');
  if (pin && pin !== String(body.pin || '')) return { ok: false, error: '密碼不對' };
  sheet_().deleteRow(r._row);
  return { ok: true };
}
