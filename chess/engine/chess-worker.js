// chess-worker.js
importScripts('garbochess (4).js'); // Ensure this matches your filename

onmessage = function(e) {
    // GarboChess (garbochess.js) defines self.onmessage to handle 
    // string commands like "position ..." and "search ...".
    // This worker acts as the bridge.
    
    if (typeof e.data === 'string') {
        // The logic is handled internally by garbochess.js's self.onmessage
        // but we ensure the command is passed through if needed.
    }
};
