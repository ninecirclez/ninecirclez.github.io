
window.CPlayer = class {
	constructor(pack) {
		this.clones = [];
		for (const key of Object.keys(pack)) {
			if (key === 'clones') {
				for (const clone of pack.clones) {
					this.clones.push(new CPlayer(clone))
				}
			} else {
				this[key] = pack[key]
			}
		}
		// if (this.clones != null) {
			// this.clones = this.clones.map((clone) => new CPlayer(clone));
			// console.log(this.clones);
		// }
		this.server = { x: pack.x, y: pack.y, xv: pack.xv, yv: pack.yv }
		this.pos = { x: this.x, y: this.y };
		this.interpAngle = pack.angle;
		this.chatMessage = '';
		this.chatMessageTimer = 0;
		this.chatMessageTime = 8;
		this.abilityCooldown = 0;
		this.dronePos = { x: this.droneX, y: this.droneY }

	}
	chat(msg) {
		this.chatMessageTimer = this.chatMessageTime;
		this.chatMessage = msg;
	}
	smooth(delta) {

		if (!_interpolate) {
			this.pos.x = this.x;
			this.pos.y = this.y;
			this.interpAngle = this.angle;
			this.dronePos.x = this.droneX;
			this.dronePos.y = this.droneY;
			return;
		}
		this.pos.x = lerp(this.pos.x, this.x, delta);
		this.pos.y = lerp(this.pos.y, this.y, delta);

		if (this.hasDrone) {
			this.dronePos.x = lerp(this.dronePos.x, this.droneX, delta);
			this.dronePos.y = lerp(this.dronePos.y, this.droneY, delta);
		}

		const dtheta = this.angle - this.interpAngle;
		if (dtheta > Math.PI) {
			this.interpAngle += 2 * Math.PI;
		} else if (dtheta < -Math.PI) {
			this.interpAngle -= 2 * Math.PI;
		}
		this.interpAngle = lerp(this.interpAngle, this.angle, delta);

		if (this.characterName === 'Conquest' && this.dashAngle != undefined) {
			if (this.iDashAngle == undefined) {
				this.iDashAngle = this.dashAngle;
			}
			const dtheta = this.dashAngle - this.iDashAngle;
			if (dtheta > Math.PI) {
				this.iDashAngle += 2 * Math.PI;
			} else if (dtheta < -Math.PI) {
				this.iDashAngle -= 2 * Math.PI;
			}
			this.iDashAngle = lerp(this.iDashAngle, this.dashAngle, delta);
		}

		// if (this.abilityCooldown > this.abilityCd) {
		// 	this.abilityCooldown = this.abilityCd;
		// } else {
		this.abilityCooldown = this.abilityCd;
		if (this.abilityCooldown === this.maxCd) {
			this.abilityCooldown = 0;
		}
		// this.abilityCooldown = lerp(this.abilityCooldown, this.abilityCd, delta);
		// if (this.abilityCd === this.maxCd) {
		// 	this.abilityCooldown = 0;
		// }
		// }
		// ability cooldown is the interpoalted version of cooldown

	}
	Snap(data) {
		const keys = []
		for (const key of Object.keys(data)) {
			if (key === 'clones') {
				const safeIds = [];
				for (const clone of data.clones) {
					// console.log(this.clones)
					const ind = this.clones.map((clone) => clone.id).findIndex((id) => id === clone.id)
					if (ind > -1) {
						this.clones[ind].Snap(clone);
						safeIds.push(clone.id);
					} else {
						this.clones.push(new CPlayer(clone));
						safeIds.push(clone.id);
					}
				}
				for (let i = this.clones.length - 1; i >= 0; i--) {
					if (!safeIds.includes(this.clones[i].id)) {
						this.clones.splice(i, 1);
					}
				}
			} else {
				this[key] = data[key]
				keys.push(key);
			}
		}
		if (keys.includes('hasDrone') && this.hasDrone) {
			this.dronePos = { x: this.droneX, y: this.droneY }
		}

		// console.log(data)

	
		this.server = {
			x: this.x,
			angle: this.angle,
			y: this.y,
			xv: this.xv,
			yv: this.yv
		};
	}
	pack() {
		return {
			x: this.x,
			y: this.y,
			radius: this.radius,
			name: this.name,
		};
	}
}