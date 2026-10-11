// chess-worker.js – bridge to GarboChess engine
// Must sit next to the engine/ folder:
//   chess-worker.js
//   engine/garbochess.js

try {
  importScripts('engine/garbochess.js');
} catch (err) {
  // Fallback relative path attempts (helps some hosting setups)
  try { importScripts('./engine/garbochess.js'); } catch (e2) {
    try { importScripts('/engine/garbochess.js'); } catch (e3) {
      console.error('GarboChess failed to load', err, e2, e3);
      self.postMessage('error engine-load-failed');
    }
  }
}

self.onmessage = function(e) {
  if (typeof e.data !== 'string') return;

  if (e.data.startsWith('position')) {
    try {
      ResetGame();
      var fen = e.data.substring(9).trim();
      var result = InitializeFromFen(fen);
      if (result.length === 0) {
        // Depth 4 = strong school-level / master-ish play
        Search(function(bestMove, value, timeTaken, ply) {
          if (bestMove != 0) {
            postMessage(FormatMove(bestMove));
          }
        }, 4, null);
      } else {
        postMessage('error ' + result);
      }
    } catch (err) {
      postMessage('error ' + (err.message || String(err)));
    }
  }
};
