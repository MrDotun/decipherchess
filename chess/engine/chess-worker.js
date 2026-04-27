// chess-worker.js
// This is the COMPLETE file. 

// 1. Load the engine
importScripts('garbochess.js');

// 2. Explicitly handle messages to ensure they reach the engine logic
self.onmessage = function(e) {
    if (e.data.match("^position") == "position") {
        // This calls the engine's internal position handler
        if (typeof ResetGame === "function") ResetGame();
        var result = InitializeFromFen(e.data.substr(9, e.data.length - 9));
        if (result.length != 0) {
            postMessage("message " + result);
        }
    } else if (e.data.match("^search") == "search") {
        // This calls the engine's internal search handler
        // We use a fixed time (1000ms) to ensure it moves fast but accurately
        g_timeout = 1000; 
        Search(FinishMoveLocalTesting, g_maxmoves, 0);
    }
};

// This function tells the engine how to send the move back to your HTML
function FinishMoveLocalTesting(bestMove, value, timeTaken, ply) {
    if (bestMove != null) {
        MakeMove(bestMove);
        postMessage(FormatMove(bestMove));
    }
}
