const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

class Sprite {
  constructor({ position, velocity, color, offset }) {
    this.position = position;
    this.velocity = velocity;
    (this.width = 50), (this.height = 150);
    this.lastKey;
    this.color = color;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 100,
      height: 50,
      offset: offset,
    };
    this.isAttacking;
    this.health = 100;
  }

  draw() {
    // c.fillStyle = "red";
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    //AttackBox

    if (this.isAttacking) {
    c.fillStyle = "green";
    c.fillRect(
      this.attackBox.position.x,
      this.attackBox.position.y,
      this.attackBox.width,
      this.attackBox.height
    );
    }
  }

  update() {
    this.draw();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else this.velocity.y += gravity;
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}

const player = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  color: "blue",
  offset: {
    x: 0,
    y: 0,
  },
});

const enemy = new Sprite({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "red",
  offset: {
    x: -50,
    y: 0,
  },
});

const keys = {
  KeyA: {
    pressed: false,
  },
  KeyD: {
    pressed: false,
  },
  KeyW: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
};

function rectangularCollision({ rectangle1, rectangle2 }) {
  return(
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
      rectangle1.attackBox.position.x <=
        rectangle2.position.x + rectangle2.width &&
      rectangle1.attackBox.position.y <=
        rectangle2.position.y + rectangle2.height &&
      rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
        rectangle2.position.y
  )
}

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //player movement
  if (keys.KeyA.pressed && player.lastKey === "KeyA") player.velocity.x = -5;
  else if (keys.KeyD.pressed && player.lastKey === "KeyD")
    player.velocity.x = 5;

  //enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft")
    enemy.velocity.x = -5;
  else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight")
    enemy.velocity.x = 5;

  //Player Attack
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    enemy.health -= 20
    document.querySelector('#enemyHealthBar').style.width = enemy.health + '%'
    console.log("Player Hit");
  }

  //Enemy Attack
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    player.health -= 20
    document.querySelector('#playerHealthBar').style.width = player.health + '%'
    console.log("Player Hit");
  }
}

animate();

window.addEventListener("keydown", (event) => {
  // console.log(event.code);
  switch (event.code) {
    case "KeyD":
      keys.KeyD.pressed = true;
      player.lastKey = "KeyD";
      break;
    case "KeyA":
      keys.KeyA.pressed = true;
      player.lastKey = "KeyA";
      break;
    case "KeyW":
      player.velocity.y = -20;
      break;
    case "Space":
      player.attack();
      break;

    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      enemy.velocity.y = -20;
      break;

    case "ArrowDown":
      enemy.attack()
      break;

    default:
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.code) {
    case "KeyD":
      keys.KeyD.pressed = false;
      break;
    case "KeyA":
      keys.KeyA.pressed = false;
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    default:
      break;
  }
});
