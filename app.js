let table = null;
let randomList = [];
let total = 0;

let isOnGame = false;
let gamerName = "";

let seconds = 0;
let minute = 0;
let timer = null;
let isPaused = false;
let listRanking = [];

let listIcon = [{
		num: 1,
		class: 'display-4 fas fa-user-md'
	},
	{
		num: 2,
		class: 'display-4 fas fa-bath'
	},
	{
		num: 3,
		class: 'display-4 fas fa-car'
	},
	{
		num: 4,
		class: 'display-4 fas fa-cubes'
	},
	{
		num: 5,
		class: 'display-4 fas fa-flag'
	},
	{
		num: 6,
		class: 'display-4 fas fa-plane'
	},
	{
		num: 7,
		class: 'display-4 fas fa-star'
	},
	{
		num: 8,
		class: 'display-4 fas fa-tree'
	}
];

window.onload = function () {
	init();
}

window.onbeforeunload = () => {
	if (isOnGame) {
		return "";
	}
}

function init() {
	manageDivs('gameEntrance');
	document.getElementById('txtPlayerName').focus();

	document.getElementById('formName').addEventListener('submit', (e) => {
		e.preventDefault();

		gamerName = document.getElementById('txtPlayerName').value;

		if (checkUsername(gamerName)) {
			document.getElementById('txtPlayerName').focus();
			document.getElementById('divErrorMessage').removeAttribute('hidden');
		} else {
			document.getElementById('divErrorMessage').setAttribute('hidden', true);
			manageDivs('gameContainer');

			isOnGame = true;
			document.getElementById('txtDisplayPlayerName').innerHTML = gamerName;
			document.getElementById('txtPlayerName').value = '';
			manageTable(true);
		}
	});

	if (localStorage.getItem('listRanking') === null) {
		setLocalStorage();
	}
	listRanking = JSON.parse(localStorage.getItem('listRanking'));
	initGame();
}

function initGame() {
	table = document.getElementById('tblGame');
	let ctr = 1;
	for (let i = 0, row; row = table.rows[i]; i++) {
		for (let j = 0, col; col = row.cells[j]; j++) {
			let item = col.firstChild;
			item.setAttribute('id', 'btn' + ctr);
			let itemValue = getRandomNumber();

			while (!isValidNum(itemValue)) {
				itemValue = getRandomNumber();
			}
			
			item.setAttribute('value', itemValue);
			item.setAttribute('onclick', 'performClick(this.id)');

			ctr++;
		}
	}
}

function sortListRanking() {
	listRanking.sort((first, second) => {
		if (first.minute < second.minute) {
			return -1;
		} else {
			if (first.seconds < second.seconds) {
				return -1;
			} else {
				return 1;
			}
		}
	});
}

function getSpanClass(valueNumber) {
	return listIcon.find(x => x.num == valueNumber).class;
}

function getBtnClass(newClass) {
	return 'btn ' + newClass + ' border-dark';
}

function getRandomNumber() {
	return Math.floor(Math.random() * 8) + 1;
}

function setLocalStorage() {
	localStorage.setItem('listRanking', JSON.stringify(listRanking));
}

function checkUsername(name) {
	return listRanking.findIndex(x => x.username == name) == -1 ? false : true;
}

function manageDivs(divId) {
	document.getElementById('gameContainer').style.display = 'none';
	document.getElementById('gameEntrance').style.display = 'none';
	document.getElementById('gameFinish').style.display = 'none';

	document.getElementById(divId).style.display = 'block';
}

function startGame() {
	manageTable(false);
	if (timer == null) {
		timer = setInterval(() => {
			seconds++;
			if (seconds == 60) {
				minute++;
				seconds = 0;
			}
			document.getElementById('txtTime').innerHTML = ((minute < 10) ? '0' + minute : minute) + ' : ' + (seconds < 10 ? '0' + seconds : seconds);
		}, 1000);
	}
	document.getElementById('btnStart').setAttribute('class', 'btn btn-lg btn-info');
	document.getElementById('btnStart').setAttribute('title', 'Continue');
	document.getElementById('btnStart').setAttribute('data-original-title', 'Continue');
	document.getElementById('btnRestart').removeAttribute('disabled');
}

function restartGame(isOnFinished) {
	if (isOnFinished) {
		manageDivs('gameContainer');
	}

	total = 0;
	seconds = 0;
	minute = 0;
	pauseTimer();
	isPaused = false;

	isOnGame = false;
	randomList = [];
	manageTable(true);

	document.getElementById('txtTime').innerHTML = '00 : 00';
	document.getElementById('btnStart').setAttribute('class', 'btn btn-lg btn-success');
	document.getElementById('btnStart').setAttribute('title', 'Start');
	document.getElementById('btnStart').setAttribute('data-original-title', 'Start');
	document.getElementById('btnRestart').setAttribute('disabled', true);

	for (let i = 0, row; row = table.rows[i]; i++) {
		for (let j = 0, col; col = row.cells[j]; j++) {
			let item = col.firstChild;

			let itemValue = getRandomNumber();

			while (!isValidNum(itemValue)) {
				itemValue = getRandomNumber();
			}

			item.style.visibility = 'visible';
			item.setAttribute('value', itemValue);
			let span = item.firstChild;
			span.setAttribute('class', '');
		}
	}
}

function quitGame() {
	gamerName = "";
	restartGame(false);
	manageDivs('gameEntrance');
	document.getElementById('txtPlayerName').focus();
}

function pauseTimer() {
	manageTable(true);
	if (timer != null) {
		clearInterval(timer);
		timer = null;
	}
}

function manageTable(isDisable) {
	document.getElementById('selectedId').value = '';
	for (let i = 0, row; row = table.rows[i]; i++) {
		for (let j = 0, col; col = row.cells[j]; j++) {
			let item = col.firstChild;
			if (isDisable) {
				item.setAttribute('disabled', true);
			} else {
				item.removeAttribute('disabled');
			}
			let span = item.firstChild;
			span.setAttribute('class', '');
			item.setAttribute('class', getBtnClass('btn-light'));
		}
	}
}

function performClick(id) {
	let span = document.getElementById(id).firstChild;
	span.setAttribute('class', getSpanClass(document.getElementById(id).value));
	document.getElementById(id).disabled = 'true';
	document.getElementById(id).setAttribute('class', getBtnClass('btn-info'));

	if (document.getElementById('selectedId').value == '') {
		document.getElementById('selectedId').value = id;
	} else {
		let firstId = document.getElementById('selectedId').value;
		document.getElementById('selectedId').value = '';
		if (document.getElementById(firstId).value == document.getElementById(id).value) {
			document.getElementById(firstId).setAttribute('class', getBtnClass('btn-success'));
			document.getElementById(id).setAttribute('class', getBtnClass('btn-success'));
		} else {
			document.getElementById(firstId).setAttribute('class', getBtnClass('btn-danger'));
			document.getElementById(id).setAttribute('class', getBtnClass('btn-danger'));
		}
		setTimeout(()=> {
			if (document.getElementById(firstId).value == document.getElementById(id).value) {
				document.getElementById(firstId).style.visibility = 'hidden';
				document.getElementById(id).style.visibility = 'hidden';
				total = total + 1;
				if (total == 8) {
					finishedGame();
				}
			} else {
				document.getElementById(firstId).removeAttribute('disabled');
				let spanFirst = document.getElementById(firstId).firstChild;
				spanFirst.setAttribute('class', '');
				document.getElementById(firstId).setAttribute('class', getBtnClass('btn-light'));

				document.getElementById(id).removeAttribute('disabled');
				let span = document.getElementById(id).firstChild;
				span.setAttribute('class', '');
				document.getElementById(id).setAttribute('class', getBtnClass('btn-light'));
			}

		}, 700);
	}
}

function finishedGame() {
	isOnGame = false;
	manageDivs('gameFinish');
	document.getElementById('txtWinner').innerHTML = gamerName;
	pauseTimer();
	document.getElementById('txtTotalTime').innerHTML = ((minute < 10) ? '0' + minute : minute) + ' : ' + (seconds < 10 ? '0' + seconds : seconds);

	let indexItem = listRanking.findIndex(x => x.username == gamerName);

	if (indexItem == -1) {
		listRanking.push({
			'username': gamerName,
			'minute': minute,
			'seconds': seconds
		});
	} else {
		listRanking[indexItem] = {
			'username': gamerName,
			'minute': minute,
			'seconds': seconds
		};
	}

	sortListRanking();

	let table = document.getElementById('tableRanking');

	let tableLength = document.getElementById("tableRanking").rows.length;

	for (let x = tableLength - 1; x > 0; x--) {
		document.getElementById("tableRanking").deleteRow(x);
	}

	let ctr = 1;
	listRanking.forEach((item) => {
		let row = table.insertRow(ctr);
		let cellRanking = row.insertCell(0);
		let cellUsername = row.insertCell(1);
		let cellTime = row.insertCell(2);

		cellRanking.innerHTML = ctr;
		cellUsername.innerHTML = item.username;
		cellTime.innerHTML = ((item.minute < 10) ? '0' + item.minute : item.minute) + ' : ' + (item.seconds < 10 ? '0' + item.seconds : item.seconds);

		if (item.username == gamerName) {
			row.setAttribute('class', 'table-active');
		}
		ctr++;
	});

	if (listRanking.length > 10) {
		listRanking.length = 10;
	}

	setLocalStorage();
}

function isValidNum(num) {
	let returnValue = false;
	if (randomList.length == 0) {
		randomList.push({
			'num': num,
			total: 1
		});
		returnValue = true;
	} else {
		let foundIndex = randomList.findIndex(x => x.num == num);
		if (foundIndex == -1) {
			randomList.push({
				'num': num,
				total: 1
			});
			returnValue = true;
		} else {
			if (randomList[foundIndex].total <= 1) {
				randomList[foundIndex].total = randomList[foundIndex].total + 1;
				returnValue = true;
			}
		}
	}
	return returnValue;
}