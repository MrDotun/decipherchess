// chess-worker.js – bridge to GarboChess engine
// Must sit next to the engine/ folder:
//   chess-worker.js
//   engine/garbochess.js
//
// Message format:  "position <FEN> [depth N] [time MS]"
// Reply:           "e2e4" (UCI move)  or  "error <msg>"

try {
  importScripts('engine/garbochess.js');
} catch (err) {
  try { importScripts('./engine/garbochess.js'); }
  catch (e2) {
    try { importScripts('/engine/garbochess.js'); }
    catch (e3) {
      console.error('GarboChess failed to load', err, e2, e3);
      self.postMessage('error engine-load-failed');
    }
  }
}

self.onmessage = function(e) {
  if (typeof e.data !== 'string') return;
  if (!e.data.startsWith('position')) return;

  try {
    ResetGame();

    // Strip leading "position " (8 chars)
    var rest = e.data.substring(8).trim();

    var depth  = 4;    // default
    var timeMs = 40;   // default (GarboChess internal g_timeout)

    // Optional "depth N"
    var dm = rest.match(/\bdepth\s+(\d+)/i);
    if (dm) {
      depth = Math.min(20, Math.max(1, parseInt(dm[1], 10)));
      rest = rest.replace(/\bdepth\s+\d+/i, '').replace(/\s+/g, ' ').trim();
    }

    // Optional "time MS"
    var tm = rest.match(/\btime\s+(\d+)/i);
    if (tm) {
      timeMs = Math.min(8000, Math.max(20, parseInt(tm[1], 10)));
      rest = rest.replace(/\btime\s+\d+/i, '').replace(/\s+/g, ' ').trim();
    }

    // Apply time budget to the engine
    try { g_timeout = timeMs; } catch (e) {}

    var fen = rest;
    var result = InitializeFromFen(fen);

    if (result.length === 0) {
      Search(function(bestMove, value, timeTaken, ply) {
        if (bestMove != 0) {
          postMessage(FormatMove(bestMove));
        }
      }, depth, null);
    } else {
      postMessage('error ' + result);
    }
  } catch (err) {
    postMessage('error ' + (err.message || String(err)));
  }
};
