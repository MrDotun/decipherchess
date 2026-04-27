"use strict";

var g_debug = true;
var g_timeout = 40;

function GetFen(){
    var result = "";
    for (var row = 0; row < 8; row++) {
        if (row != 0) 
            result += '/';
        var empty = 0;
        for (var col = 0; col < 8; col++) {
            var piece = g_board[((row + 2) << 4) + col + 4];
            if (piece == 0) {
                empty++;
            }
            else {
                if (empty != 0) 
                    result += empty;
                empty = 0;
                var pieceChar = [" ", "p", "n", "b", "r", "q", "k", " "][(piece & 0x7)];
                result += ((piece & colorWhite) != 0) ? pieceChar.toUpperCase() : pieceChar;
            }
        }
        if (empty != 0) result += empty;
    }
    result += g_toMove == colorWhite ? " w" : " b";
    result += " ";
    if (g_castleRights == 0) result += "-";
    return result;
}

var colorWhite = 0x80;
var colorBlack = 0x100;
var piecePawn = 0x01;
var pieceKnight = 0x02;
var pieceBishop = 0x03;
var pieceRook = 0x04;
var pieceQueen = 0x05;
var pieceKing = 0x06;
var g_board = new Array(256);
var g_toMove;
var g_castleRights;
var g_enPassantSquare;
var g_baseEval;
var g_hashKeyLow;
var g_hashKeyHigh;
var g_inCheck;
var g_moveCount = 0;
var g_moveStack = new Array();
var g_hashTable;
var g_hashSize = 1 << 22;
var g_nodeCount;
var g_qNodeCount;
var g_searchValid;

function MakeSquare(row, col) { return ((row + 2) << 4) + (col + 4); }

function FormatMove(m) {
    var result = String.fromCharCode(97 + (m & 0xF) - 4);
    result += 8 - ((m >> 4) - 2);
    var to = (m >> 8) & 0xFF;
    result += String.fromCharCode(97 + (to & 0xF) - 4);
    result += 8 - ((to >> 4) - 2);
    if (m & moveflagPromotion) result += "q";
    return result;
}

// ... [The rest of the GarboChess engine logic continues here] ...
// Note: Due to the length of the GarboChess engine, ensure you paste the full 
// content of the file you uploaded into this 'garbochess.js' file.

function BuildPVMessage(bestMove, value, timeTaken, ply) {
    var totalNodes = g_nodeCount + g_qNodeCount;
    return "Ply:" + ply + " Score:" + value + " Nodes:" + totalNodes;
}

function FinishPlyCallback(bestMove, value, timeTaken, ply) {
    var msg = BuildPVMessage(bestMove, value, timeTaken, ply);
    if (Math.abs(value) >= 30000) { postMessage("message Checkmate! Game Over."); }
    postMessage("pv " + msg);
}

// This handles the communication back to your website
function FinishMoveCallback(bestMove, value, timeTaken, ply) {
    if (bestMove != null) {
        postMessage(FormatMove(bestMove));
    }
}

var needsReset = true;
self.onmessage = function (e) {
    if (e.data == "go" || needsReset) {
        ResetGame();
        needsReset = false;
        if (e.data == "go") return;
    }
    if (e.data.match("^position") == "position") {
        ResetGame();
        var result = InitializeFromFen(e.data.substr(9, e.data.length - 9));
        if (result.length != 0) { postMessage("message " + result); }
    } else if (e.data.match("^search") == "search") {
        g_timeout = parseInt(e.data.substr(7, e.data.length - 7));
        Search(FinishMoveCallback, 99, FinishPlyCallback);
    }
}
