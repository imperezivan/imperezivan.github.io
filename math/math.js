let expectedResult;
let initTime;

function init() {
    initListeners();
    loadStatics();
    showChallenge();
}

function initListeners() {
    document.getElementById('btnNext').addEventListener('click', function (e) {
        document.getElementById('inUserResult').value = '';
        document.getElementById('txtRealResult').innerText = '';
        showChallenge()
    });
    document.getElementById('btnReset').addEventListener('click', function (e) {
        reset();
    });
    document.getElementById('inUserResult').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            validateResult();
        }
    });
}

function loadStatics() {
    let rs = loadResult();
    if (rs.ok) {
        document.getElementById('txtMin').innerText = rs.min;
        document.getElementById('txtMax').innerText = rs.max;
        document.getElementById('txtAvg').innerText = rs.avg.toFixed(0);
        document.getElementById('txtGames').innerText = rs.games;
        document.getElementById('txtPerc').innerText = ((rs.ok * 100) / rs.games).toFixed(0);
    } 
}

function showChallenge() {
    document.getElementById('inUserResult').focus();
    let a = getRandom();
    let b = getRandom();
    expectedResult = (a * b).toString();
    document.getElementById('txtOperation').innerText = `${a} x ${b}`;
    initTime = new Date().getTime();
}

function reset() {
    document.getElementById('txtMin').innerText = '';
    document.getElementById('txtMax').innerText = '';
    document.getElementById('txtAvg').innerText = '';
    document.getElementById('txtGames').innerText = '';
    document.getElementById('txtPerc').innerText = '';
    localStorage.removeItem('ls_rs');
    document.getElementById('inUserResult').value = '';
    document.getElementById('txtRealResult').innerText = '';
    showChallenge();
}

function validateResult() {
    let userResult = document.getElementById('inUserResult').value;
    let msg = ''
    if (userResult == expectedResult) {
        let time = new Date().getTime() - initTime;
        msg = `Ok in ${time} ms`;
        saveResult(time);
    } else {
        msg = `wrong product is ${expectedResult}`;
        let rs = loadResult();
        rs.games++;
        localStorage.setItem('ls_rs', JSON.stringify(rs));
    }
    document.getElementById('txtRealResult').innerText = msg;
    loadStatics();

}

function saveResult(time) {
    let rs = loadResult();
    rs.min = Math.min(rs.min, time);
    rs.max = Math.max(rs.max, time);
    rs.avg = (rs.avg * rs.games + time) / (rs.games + 1);
    rs.games++;
    rs.ok++;
    localStorage.setItem('ls_rs', JSON.stringify(rs));
}

function loadResult() {
    let rsStr = localStorage.getItem('ls_rs');
    let rs = rsStr != null ? JSON.parse(rsStr) : { min: 100000, max: 0, avg: 0, games: 0, ok: 0 };
    return rs;
}


function getRandom() {
    return parseInt((Math.random() * 19).toFixed(0)) + 1;
}

window.addEventListener('load', init);
