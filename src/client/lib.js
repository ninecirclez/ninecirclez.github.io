window.delta = 0;
window.debug = false;
window._interpolate = true;
window._predict = false;
window.serverTickMs = 0;
window.stutter = false;
window.redness = 0;
window.showSnapshots = false;
window.mouse = { x: 0, y: 0 };
window.lerpRate = 30;
window.extraLag = 0;
window.inputsBuffered = 0;
window.rayLines = [];
window.uniqueRayPoints = [];
window.fric = -1;
window.speed = -1;
window.autoRespawn = false;
window.showChat = true;
window.movementMode = 'wasd';
window.font = 'Inter'
window.fps = 60;
window.overlayAlpha = 0;
window.overlaying = false;
window.times = [];
window.tab = false;
window.ghue = 0;
window.roundTime = 0;
window.music = true;
window.musicVolume = 0.4;
window.intermission = false;
window.interMissionMessage = 'we at darrows incorporated are very professional';
window.interMessages = [
	'we at darrows incorporated are very profesional',
	'generating more terrible quotes...',
	'you made no miskates',
	'imagine looking at this',
	'never gonna give you up!',
	'ctrl+w for aimbot',
	'no pain, no gain',
	'lag is great',
]
window.firstMessage = 'nice job you got first who cares';
window.defaultMessage = 'default... i like it';
window.fullscreened = false;
window.darkness = 0.3;
window.lighting = 0.7;
window.rayCalcT = 0;
window.rayFreq = 10;


function changeMovMode() {
	if (window.movementMode === 'wasd') {
		window.movementMode = 'arr'
	} else {
		window.movementMode = 'wasd'
	}
}

let iExist = false;
let chatOpen = false;
let dead = false;
let killedPlayerName = '';
let killedNotifTime = 0;
let _kills = 0;
let lastTime = window.performance.now()
let xoff = 0;
let yoff = 0;

window.currentWidth = 1600;
window.currentHeight = 900;
let shotPlayers = {}
let selfId;
let arena;
let spacing = 0;
let spacings = [];
let spacingLength = 120;
let lastReceivedStateTime;
let stateMessageDisplay = 0;
let stateMessageCount = 0;
let inputMessageDisplay = 0;
let inputMessageCount = 0;
let byteCount = 0;
let byteDisplay = 0;
let uploadByteCount = 0;
let uploadByteDisplay = 0;
let ping = 0;
let angle = 0;
let serverSpacing = Array(3).fill(0)
// let messages = [];
let leader = null;

const abilityCanvas = document.createElement('canvas');
abilityCanvas.width = 60;
abilityCanvas.height = 60;
const actx = abilityCanvas.getContext('2d')

/* state */

const players = {};
let arrows = {}
let obstacles = []
let blocks = []
let blockCanvas = document.createElement('canvas');
let blockCtx = blockCanvas.getContext('2d');
let hits = [];

window.teamMode = false;

/* state */

let input = createInput();
const gui = ref.gui
const canvas = ref.canvas
let ctx = canvas.getContext('2d');
const shadowCanvas = document.createElement('canvas');
const sctx = shadowCanvas.getContext('2d');
const leftCanvas = document.createElement('canvas');
const rightCanvas = document.createElement('canvas');
const lctx = leftCanvas.getContext('2d');
const rctx = rightCanvas.getContext('2d');
const width = 1600;
const height = 900;
const updateRate = 60;
let cprogress = 0;
const camera = { x: null, y: null }
let ws = null;

canvas.width = width;
canvas.height = height;
resize([canvas, gui, shadowCanvas, leftCanvas, rightCanvas])

const inputs = ["KeyW", "KeyA", "KeyS", "KeyD"];
const inputCodes = {
	[inputs[0]]: { key: "up" },
	[inputs[1]]: { key: "left" },
	[inputs[2]]: { key: "down" },
	[inputs[3]]: { key: "right" },
	Space: { key: 'space' },
	KeyZ: { key: 'space' },
}
const arrInputs = ["ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"]
const arrInputCodes = {
	[arrInputs[0]]: { key: "up" },
	[arrInputs[1]]: { key: "left" },
	[arrInputs[2]]: { key: "down" },
	[arrInputs[3]]: { key: "right" },
	Space: { key: 'space' },
	KeyZ: { key: 'space' },
}

function convert(seconds) {
    let minutes = Math.floor(seconds / 60);
    seconds = Math.round(seconds - minutes * 60)
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return String(minutes) + ":" + String(seconds);
}

function chatTest(string) {
   string = string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
   return /\S/.test(string) && string.length <= 60;
}

function computeLines() {
	window.rayLines = [];
	const rectToLines = ({ x, y, width, height }) => {
		return [
			new Line(x, y, x + width, y),
			new Line(x, y + height, x + width, y + height),
			new Line(x, y, x, y + height),
			new Line(x + width, y, x + width, y + height),
		]
	}
	for (const obj of obstacles) {
		if (obj.type !== 'point') {
			rectToLines(obj).forEach((line) => {
				rayLines.push(line);
			})
		}
	}
	const mapLines = [
		rectToLines({ x: 0, y: 0, width: arena.width, height: 1}),
		rectToLines({ x: 0, y: 0, width: 1, height: arena.height }),
		rectToLines({ x: 0, y: arena.height, width: arena.width, height: 1 }),
		rectToLines({ x: arena.width, y: 0, width: 1, height: arena.height }),
	]
	mapLines.forEach((lines) => {
		lines.forEach((line) => {
			rayLines.push(line);
		})
	})
	let points = [];
	rayLines.forEach((line) => {
		points.push(line.start.copy(), line.end.copy());
	})
	let pointSet = {};
	const maxDist = Infinity; 
	window.uniqueRayPoints = points.filter((point) => {
		const key = `${point.x},${point.y}`;
		if (key in pointSet) {
			return false; // not unique
		} else {
			pointSet[key] = true;
			return true;
		}
	})
}

function run(time =  0) {
	fpsTick(time)
	// processMessages();

	window.dt = (window.performance.now() - lastTime) / 1000;
	window.delta = getDelta(lastTime);
	window.redness -= dt * 1.5;
	if (window.redness <= 0) window.redness = 0;
	killedNotifTime -= dt * 1.5;
	if (killedNotifTime <= 0) killedNotifTime = 0;
	lastTime = window.performance.now();
	ghue += dt * 45;

	for (let i = hits.length - 1; i >= 0; i--) {
		hits[i].timer -= dt;
		if (hits[i].timer <= 0) {
			hits.splice(i, 1)
		}
	}

	if (overlaying) {
		overlayAlpha += dt;
		if (overlayAlpha > 0.6) {
			overlayAlpha = 0.6;
		}
	}

	for (const playerId of Object.keys(players)) {
		const player = players[playerId];

		player.smooth(delta);
		if (player.clones && player.clones.length > 0) {
			player.clones.forEach((clone) => {
				clone.smooth(delta)
			})
		}
		
		player.chatMessageTimer -= dt;

		if (player.chatMessageTimer <= 0) 
			player.chatMessageTimer = 0;
	}

	for (const arrowId of Object.keys(arrows)) {
		arrows[arrowId].smooth(delta)
		if (arrows[arrowId].alpha <= 0) 
			delete arrows[arrowId]
	}

	if (players[selfId] != null) {
		camera.x = players[selfId].pos.x;
		camera.y = players[selfId].pos.y;

		let targetX = players[selfId].arrowing ? 
			-Math.cos(players[selfId].interpAngle) * 100: 0;
		let targetY = players[selfId].arrowing ? 
			-Math.sin(players[selfId].interpAngle) * 100: 0;

		const dtC = Math.min(dt * 2, 1);
		xoff = lerp(xoff, targetX, dtC);
		yoff = lerp(yoff, targetY, dtC)

		if (Math.abs(targetX - xoff) < 0.5) xoff = targetX;
		if (Math.abs(targetY - yoff) < 0.5) yoff = targetY;
		if (players[selfId].clones.length > 0) {
			if (players[selfId].clones[0].lifeTime <= 1) {
				cprogress -= dt * 1.75;
				// cprogress = Math.max(players[selfId].clones[0].lifeTime, 0);
			} else {
				cprogress += dt * 1.75;
				if (cprogress > 1) {
					cprogress = 1;
				}
			}
		} else {
			cprogress = 0;
		}
	}


	render();
	requestAnimationFrame(run);
}






String.prototype.safe = function () {
    return this.replace(/&/g, "&amp;").replace(/ /g, "&nbsp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}