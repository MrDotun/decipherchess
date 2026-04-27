<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ecobank Pre Tournament 2026 - Decipher Chess</title>
    <link rel="stylesheet" href="https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.css">
    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js"></script>
    <script src="https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-firestore.js"></script>

    <style>
        body { margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; background: #0f172a; color: white; display: flex; flex-direction: column; align-items: center; overflow-x: hidden;}
        #welcome-overlay { position: absolute; width: 100%; min-height: 100vh; background: #0f172a; display: flex; flex-direction: column; align-items: center; z-index: 1000; padding: 20px 0; }
        #matchmaking-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #0f172a; z-index: 1500; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
        .spinner { width: 50px; height: 50px; border: 5px solid #334155; border-top: 5px solid #005aab; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 20px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .loading-bar { width: 200px; height: 4px; background: #334155; border-radius: 2px; margin-top: 15px; overflow: hidden; }
        .loading-progress { width: 0%; height: 100%; background: #4ade80; transition: width 0.5s; }
        #round-results-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.95); z-index: 2500; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
        .login-card { background: #1e293b; padding: 25px; border-radius: 15px; border: 2px solid #005aab; width: 90%; max-width: 400px; text-align: center; margin-bottom: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .login-card input { width: 100%; padding: 12px; margin: 8px 0; border-radius: 5px; border: 1px solid #334155; background: #0f172a; color: white; box-sizing: border-box; }
        .rep-btn { background: #334155; color: white; padding: 10px; border: 1px solid #005aab; border-radius: 8px; cursor: pointer; width: 100%; margin: 5px 0; text-align: left; transition: 0.3s; }
        .rep-btn:hover { background: #005aab; }
        .rep-btn.selected { background: #005aab; border-color: #4ade80; }
        #game-container { display: none; width: 95vmin; max-width: 500px; padding: 20px 10px; }
        #board { width: 100%; border: 3px solid #005aab; border-radius: 8px; }
        .info-panel { background: #1e293b; padding: 15px; border-radius: 12px; border: 1px solid #005aab; text-align: center; }
        .submit-btn { background: #005aab; color: white; padding: 12px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; width: 100%; margin-top: 10px; }
        .opp-card { display: flex; justify-content: space-between; align-items: center; background: #0f172a; padding: 10px; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid #ef4444; }
        .league-table { width: 100%; border-collapse: collapse; font-size: 0.85em; }
        .league-table td { padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .timer-box { font-family: monospace; background: #000; padding: 5px 10px; border-radius: 4px; font-size: 1.2em; min-width: 80px; }
        .highlight-white { background: rgba(0, 90, 171, 0.5) !important; }
    </style>
</head>
<body>

<div id="round-results-overlay">
    <h1 style="color: #4ade80;">ROUND <span id="res-round-num">1</span> COMPLETE</h1>
    <div class="login-card" style="margin-top: 20px;">
        <h2 id="maryland-pos" style="color: white; margin: 10px 0;">Maryland Convent: 12th Place</h2>
        <p style="color: #4ade80; font-weight: bold;">Current Team Points: <span id="total-team-pts">0</span></p>
        <button id="next-round-btn" class="submit-btn" onclick="startWaitingCountdown()">PROCEED TO NEXT ROUND</button>
    </div>
</div>

<div id="matchmaking-overlay">
    <div class="spinner"></div>
    <h2 id="match-status">Searching for Live Opponent...</h2>
    <div class="loading-bar"><div class="loading-progress" id="load-bar"></div></div>
</div>

<div id="welcome-overlay">
    <div class="login-card">
        <h1 style="color: #005aab; margin: 0;">ECOBANK</h1>
        <h3 style="margin: 0 0 5px 0; color: #94a3b8;">Pre Tournament 2026</h3>
        <p style="color: #4ade80; font-size: 0.9em; margin-bottom: 15px;">Welcome, Maryland Convent Private School!</p>
        
        <div id="rep-list" style="margin-bottom: 15px; max-height: 250px; overflow-y: auto;">
            <button class="rep-btn" onclick="selectRep(this, 'Obi Chukwuemeka ')">Obi Chukwuemeka </button>
            <button class="rep-btn" onclick="selectRep(this, 'Onele Chierika')">Onele Chierika</button>
            <button class="rep-btn" onclick="selectRep(this, 'Beckley Semilore')">Beckley Semilore</button>
            <button class="rep-btn" onclick="selectRep(this, 'Andrew Nwagbale')">Andrew Nwagbale</button>
            <button class="rep-btn" onclick="selectRep(this, 'Oluwaseun Ajayi')">Oluwaseun Ajayi</button>
            <button class="rep-btn" onclick="selectRep(this, 'Eliana Lawrence')">Eliana Lawrence</button>
            <button class="rep-btn" onclick="selectRep(this, 'Sage Osafile')">Sage Osafile</button>
        </div>

        <input type="password" id="studentPass" placeholder="Enter Team Password">
        <button class="submit-btn" onclick="validateAndStart()">PROCEED TO ROUND 1</button>
    </div>
    <div style="width: 90%; max-width: 400px; background: #1e293b; padding: 15px; border-radius: 12px; margin-bottom: 50px;">
        <h3 style="text-align: center; color: #4ade80; margin-top:0;">🏆 Top 20 Nigeria Schools</h3>
        <table class="league-table"><tbody id="player-body"></tbody></table>
    </div>
</div>

<div id="game-container">
    <div class="info-panel">
        <div style="display:flex; justify-content: space-between; margin-bottom: 10px; font-size: 0.8em; color: #94a3b8; font-weight: bold;">
            <span id="round-header">ROUND 1 / 6</span>
            <span style="color:#4ade80">TEAM POINTS: <span id="live-points">0.0</span></span>
        </div>
        <div class="opp-card">
            <div style="text-align: left;"><b id="opp-name" style="color:#ef4444">Connecting...</b><br><small id="opp-school">Searching School</small></div>
            <div id="opp-timer" class="timer-box">10:00</div>
        </div>
        <div id="board"></div>
        <div class="opp-card" style="border-left: 4px solid #4ade80; margin-top: 10px;">
            <div style="text-align: left;"><b id="displayName" style="color:#4ade80"></b><br><small>Maryland Convent</small></div>
            <div id="user-timer" class="timer-box">10:00</div>
        </div>
        <div id="status" style="font-weight: bold; margin: 10px 0;">Waiting...</div>
        <button class="submit-btn" onclick="location.reload()" style="background: #334155;">QUIT MATCH</button>
    </div>
</div>

<script>
const chessWorker = new Worker('./chess-worker.js');
const firebaseConfig = { apiKey: "AIzaSyCcSVTifrJhzXvhQ4m1UyObtCKd8QnKEUw", authDomain: "assignments-de95a.firebaseapp.com", projectId: "assignments-de95a", storageBucket: "assignments-de95a.firebasestorage.app", messagingSenderId: "1088073398299", appId: "1:1088073398299:web:dab1f57ac1d63b10dba0be" };
firebase.initializeApp(firebaseConfig);

const nigerianNames = ["Chijioke Eze", "Adesua Balogun", "Tunde Owolabi", "Nkechi Okoro", "Femi Adeyemi", "Bolanle Williams", "Uchechi Nwosu", "Kelechi Iheanacho", "Amaka Udoh", "Oluwafemi Coker", "Zainab Abubakar", "Ibrahim Musa", "Yetunde Sowande", "Emeka Obi", "Chidimma Egwu"];
const nigerianSchools = ["Maryland Convent Private School", "Grange School", "Lekki British School", "Corona Private School", "St. Saviour's School", "Green Springs School", "Atlantic Hall", "Chrisland Primary", "British International School", "American International School", "Children's International School", "Meadow Hall School", "Pampers Private School", "Aureola School", "Vivian Fowler", "Loyola Jesuit", "Day Waterman College", "Temple School", "Riverbank School", "Lagos Preparatory School"];

var currentRound = 1, totalTeamPoints = 0, gameInProgress = false;
var game = new Chess(), board = null, selectedRepName = "", userColor = 'w';
var userTime = 600, oppTime = 600, timerInterval = null;

function initLeagues() {
    let pHTML = "";
    nigerianSchools.forEach((school, i) => {
        let rankText = (school === "Maryland Convent Private School") ? "12th" : (i+1) + ".";
        pHTML += `<tr><td><b>${rankText} ${school}</b></td><td style="text-align:right">0.0 pts</td></tr>`;
    });
    $('#player-body').html(pHTML);
}
initLeagues();

function selectRep(btn, name) {
    $('.rep-btn').removeClass('selected');
    $(btn).addClass('selected');
    selectedRepName = name;
}

function validateAndStart() {
    if (!selectedRepName) return alert("Select a representative!");
    if ($('#studentPass').val() !== "decipherchess") return alert("Wrong Password!");
    $('#welcome-overlay').hide();
    $('#matchmaking-overlay').css('display', 'flex');
    let progress = 0;
    let interval = setInterval(() => {
        progress += 10;
        $('#load-bar').css('width', progress + '%');
        if (progress >= 100) { clearInterval(interval); setupMatch(); }
    }, 200);
}

function formatTime(s) {
    return Math.floor(s/60) + ":" + (s%60).toString().padStart(2, '0');
}

function updateTimers() {
    if (game.turn() === userColor[0]) {
        userTime--; $('#user-timer').text(formatTime(userTime));
    } else {
        oppTime--; $('#opp-timer').text(formatTime(oppTime));
    }
}

async function setupMatch() {
    gameInProgress = true; userTime = 600; oppTime = 600; game = new Chess();
    userColor = Math.random() > 0.5 ? 'white' : 'black';
    $('#opp-name').text(nigerianNames[Math.floor(Math.random() * nigerianNames.length)]);
    $('#opp-school').text(nigerianSchools[Math.floor(Math.random()*19)+1]);
    $('#displayName').text(selectedRepName);
    $('#matchmaking-overlay').hide(); $('#game-container').show();
    
    board = ChessBoard('board', { 
        draggable: false, 
        position: 'start', 
        orientation: userColor,
        pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
    });

    timerInterval = setInterval(updateTimers, 1000);
    if (userColor === 'black') {
        $('#status').text("Opponent is thinking...");
        requestEngineMove();
    } else {
        $('#status').text("Your turn!");
    }
}

function requestEngineMove() {
    // UPDATED: Sending object with START_ANALYSIS to match your chess-worker.js
    chessWorker.postMessage({
        command: 'START_ANALYSIS',
        data: {
            fen: game.fen(),
            tokens: ["chunk"] // Dummy token to trigger your loop
        }
    });
}

// UPDATED: Handling the CHUNK_READY type from your worker
chessWorker.onmessage = function(e) {
    if (e.data.type === 'CHUNK_READY') {
        // This assumes your chunk contains a 'move' property in SAN or object format
        let move = game.move(e.data.chunk.move || e.data.chunk); 
        if (move) {
            board.position(game.fen());
            $('#status').text("Your turn!");
        }
    } else if (typeof e.data === 'string') {
        // Fallback for simple string moves
        let move = game.move({ from: e.data.substring(0, 2), to: e.data.substring(2, 4), promotion: 'q' });
        if (move) {
            board.position(game.fen());
            $('#status').text("Your turn!");
        }
    }
};

function onSquareClick(sq) {
    if (!gameInProgress || game.turn() !== userColor[0]) return;
    let sourceSquare = window.srcSq;
    if (!sourceSquare) {
        if (game.get(sq)?.color === userColor[0]) { 
            window.srcSq = sq; 
            $('.square-'+sq).addClass('highlight-white'); 
        }
        return;
    }
    let move = game.move({ from: sourceSquare, to: sq, promotion: 'q' });
    $('.highlight-white').removeClass('highlight-white'); window.srcSq = null;
    if (move) {
        board.position(game.fen());
        $('#status').text("Opponent is thinking...");
        setTimeout(requestEngineMove, 1000);
    }
}

$('#board').on('click', '[class*="square-"]', function() { onSquareClick($(this).attr('data-square')); });
</script>
</body>
</html>
