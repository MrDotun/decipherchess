/**
 * Chess Worker for Ecobank Pre Tournament 2026
 * Loads the GarboChess engine and handles communication with the main thread.
 */

// Import the engine script
importScripts('garbochess.js');

// No additional onmessage handler is needed here because 
// garbochess.js defines self.onmessage internally to process 
// the "position" and "search" string commands.
