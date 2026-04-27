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
        :root {
            --bg-dark: #0f172a;
            --card-bg: #1e293b;
            --accent-blue: #005aab;
            --accent-green: #4ade80;
            --accent-red: #ef4444;
            --text-gray: #94a3b8;
        }

        body { 
            margin: 0; padding: 0; 
            font-family: 'Inter', 'Segoe UI', sans-serif; 
            background: var(--bg-dark); 
            color: white; 
            display: flex; flex-direction: column; align-items: center; 
            overflow-x: hidden;
            min-height: 100vh;
        }

        /* --- Aesthetic Welcome Page Styling --- */
        #welcome-overlay { 
            position: absolute; width: 100%; min-height: 100vh; 
            background: radial-gradient(circle at top right, #1e293b, #0f172a);
            display: flex; flex-direction: column; align-items: center; 
            z-index: 1000; padding: 40px 0; 
        }

        .hero-section {
            text-align: center;
            margin-bottom: 30px;
        }

        .hero-section h1 {
            font-size: 3rem;
            letter-spacing: 4px;
            color: var(--accent-blue);
            margin: 0;
            text-shadow: 0 0 20px rgba(0, 90, 171, 0.3);
        }

        .hero-section h3 {
            color: var(--text-gray);
            font-weight: 300;
            margin-top: 5px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        .main-layout {
            display: flex;
            gap: 30px;
            width: 90%;
            max-width: 1100px;
            justify-content: center;
            flex-wrap: wrap;
        }

        .login-card { 
            background: rgba(30, 41, 59, 0.7);
            backdrop-filter: blur(10px);
            padding: 30px; border-radius: 24px; 
            border: 1px solid rgba(255,255,255,0.1); 
            width: 100%; max-width: 450px; 
            box-shadow: 0 20px 50px rgba(0,0,0,0.4);
            display: flex; flex-direction: column;
        }

        .rep-btn { 
            background: rgba(15, 23, 42, 0.5); 
            color: white; padding: 14px 20px; 
            border: 1px solid rgba(0, 90, 171, 0.3); 
            border-radius: 12px; cursor: pointer; 
            width: 100%; margin: 6px 0; 
            text-align: left; transition: all 0.3s ease;
            font-size: 0.95rem;
        }
        
        .rep-btn:hover { background: rgba(0, 90, 171, 0.2); border-color: var(--accent-blue); transform: translateX(5px); }
        .rep-btn.selected { 
            background: var(--accent-blue); 
            border-color: var(--accent-green);
            box-shadow: 0 0 15px rgba(0, 90, 171, 0.4);
        }

        .leaderboard-card {
            background: rgba(30, 41, 59, 0.4);
            border-radius: 24px;
            padding: 25px;
            width: 100%; max-width: 400px;
            border: 1px solid rgba(255,255,255,0.05);
        }

        input[type="password"] { 
            width: 100%; padding: 14px; margin: 20px 0 10px 0; 
            border-radius: 12px; border: 1px solid #334155; 
            background: #0f172a; color: white; box-sizing: border-box; 
            outline: none; transition: 0.3s;
        }
        input[type="password"]:focus { border-color: var(--accent-blue); }

        .submit-btn { 
            background: var(--accent-blue); 
            color: white; padding: 16px; border: none; 
            border-radius: 12px; cursor: pointer; 
            font-weight: 700; width: 100%; margin-top: 10px; 
            transition: 0.3s; text-transform: uppercase; letter-spacing: 1px;
        }
        .submit-btn:hover { filter: brightness(1.2); transform: translateY(-2px); }

        /* --- Existing Game UI Styling (Unchanged) --- */
        #matchmaking-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: var(--bg-dark); z-index: 1500; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
        .spinner { width: 50px; height: 50px; border: 5px solid #334155; border-top: 5px solid var(--accent-blue); border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 20px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        #game-container { display: none; width: 95vmin; max-width: 500px; padding: 20px 10px; }
        #board { width: 100%; border: 3px solid var(--accent-blue); border-radius: 8px; }
        .info-panel { background: var(--card-bg); padding: 15px; border-radius: 12px; border: 1px solid var(--accent-blue); text-align: center; }
        .opp-card { display: flex; justify-content: space-between; align-items: center; background: var(--bg-dark); padding: 10px; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid var(--accent-red); }
        .league-table { width: 100%; border-collapse: collapse; font-size: 0.85em; }
        .league-table td { padding: 12px 8px; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .timer-box { font-family: monospace; background: #000; padding: 5px 10px; border-radius: 4px; font-size: 1.2em; min-width: 80px; }
        .highlight-white { background: rgba(0, 90, 171, 0.5) !important; }
    </style>
</head>
<body>

<div id="welcome-overlay">
    <div class="hero-section">
        <h1>ECOBANK</h1>
        <h3>Pre Tournament 2026</h3>
    </div>

    <div class="main-layout">
        <div class="login-card">
            <h4 style="margin: 0 0 10px 0; color: var(--accent-green);">School Representative Login</h4>
            <p style="color: var(--text-gray); font-size: 0.9em; margin-bottom: 20px;">Welcome, Maryland Convent Private School! Select your name to begin.</p>
            
            <div id="rep-list" style="max-height: 280px; overflow-y: auto; padding-right: 5px;">
                <button class="rep-btn" onclick="selectRep(this, 'Obi Chukwuemeka ')">Obi Chukwuemeka </button>
                <button class="rep-btn" onclick="selectRep(this, 'Onele Chierika')">Onele Chierika</button>
                <button class="rep-btn" onclick="selectRep(this, 'Beckley Semilore')">Beckley Semilore</button>
                <button class="rep-btn" onclick="selectRep(this, 'Andrew Nwagbale')">Andrew Nwagbale</button>
                <button class="rep-btn" onclick="selectRep(this, 'Oluwaseun Ajayi')">Oluwaseun Ajayi</button>
                <button class="rep-btn" onclick="selectRep(this, 'Eliana Lawrence')">Eliana Lawrence</button>
                <button class="rep-btn" onclick="selectRep(this, 'Sage Osafile')">Sage Osafile</button>
            </div>

            <input type="password" id="studentPass" placeholder="Team Access Code">
            <button class="submit-btn" onclick="validateAndStart()">Start Round 1</button>
        </div>

        <div class="leaderboard-card">
            <h3 style="text-align: left; color: var(--accent-green); margin-top:0; font-size: 1.1rem;">🏆 National Standings</h3>
            <table class="league-table"><tbody id="player-body"></tbody></table>
        </div>
    </div>
</div>

<div id="matchmaking-overlay">
    <div class="spinner"></div>
    <h2 id="match-status">Pairing with Opponent...</h2>
</div>

<div id="game-container">
    <div class="info-panel">
        <div style="display:flex; justify-content: space-between; margin-bottom: 10px; font-size: 0.8em; color: #94a3b8; font-weight: bold;">
            <span id="round-header">ROUND 1 / 6</span>
            <span style="color:var(--accent-green)">TEAM POINTS: <span id="live-points">0.0</span></span>
        </div>
        <div class="opp-card">
            <div style="text-align: left;"><b id="opp-name" style="color:var(--accent-red)">Connecting...</b><br><small id="opp-school">Searching School</small></div>
            <div id="opp-timer" class="timer-box">10:00</div>
        </div>
        <div id="board"></div>
        <div class="opp-card" style="border-left: 4px solid var(--accent-green); margin-top: 10px;">
            <div style="text-align: left;"><b id="displayName" style="color:var(--accent-green)"></b><br><small>Maryland Convent</small></div>
            <div id="user-timer" class="timer-box">10:00</div>
        </div>
        <div id="status" style="font-weight: bold; margin: 10px 0;">Ready</div>
        <button class="submit-btn" onclick="location.reload()" style="background: #334155;">QUIT MATCH</button>
    </div>
</div>

<script>
// --- Logic remains exactly as requested ---
const chessWorker = new Worker('./chess-worker.js');

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
    $('#welcome-overlay').fadeOut();
    $('#matchmaking-overlay').css('display', 'flex');
    setTimeout(setupMatch, 1500);
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
    if (userColor === 'black') { requestEngineMove(); }
}

function requestEngineMove() {
    chessWorker.postMessage({ command: 'START_ANALYSIS', data: { fen: game.fen(), tokens: ["chunk"] } });
}

chessWorker.onmessage = function(e) {
    if (e.data.type === 'CHUNK_READY') {
        let move = game.move(e.data.chunk.move || e.data.chunk); 
        if (move) { board.position(game.fen()); $('#status').text("Your turn!"); }
    }
};

function onSquareClick(sq) {
    if (!gameInProgress || game.turn() !== userColor[0]) return;
    let sourceSquare = window.srcSq;
    if (!sourceSquare) {
        if (game.get(sq)?.color === userColor[0]) { window.srcSq = sq; $('.square-'+sq).addClass('highlight-white'); }
        return;
    }
    let move = game.move({ from: sourceSquare, to: sq, promotion: 'q' });
    $('.highlight-white').removeClass('highlight-white'); window.srcSq = null;
    if (move) {
        board.position(game.fen());
        $('#status').text("Opponent thinking...");
        requestEngineMove();
    }
}

$('#board').on('click', '[class*="square-"]', function() { onSquareClick($(this).attr('data-square')); });
</script>
</body>
</html>
