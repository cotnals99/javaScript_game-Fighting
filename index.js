const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 128,
  },
  imageSrc: "./img/shop.png",
  scale: 2.75,
  framesMax: 6,
});

const player = new Fighter({
  position: {
    x: 100,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  // color: "blue",
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/samuraiMack/Idle.png",
  scale: 2.5,
  framesMax: 8,
  offset: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: {
      imageSrc: "./img/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./img/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/samuraiMack/Fall.png",
      framesMax: 2,
    },
  },
});

const enemy = new Fighter({
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
  imageSrc: "./img/kenji/Idle.png",
  scale: 2.5,
  framesMax: 4,
  offset: {
    x: 215,
    y: 167,
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

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  background.update();
  shop.update();
  player.update();
  // enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //player movement
  if (keys.KeyA.pressed && player.lastKey === "KeyA") {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (keys.KeyD.pressed && player.lastKey === "KeyD") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else player.switchSprite("idle");
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) player.switchSprite("fall");

  //enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft")
    enemy.velocity.x = -5;
  else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight")
    enemy.velocity.x = 5;

  //Player Attack
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    enemy.health -= 20;
    document.querySelector("#enemyHealthBar").style.width = enemy.health + "%";
    console.log("Player Hit");
  }

  //Enemy Attack
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    player.health -= 20;
    document.querySelector("#playerHealthBar").style.width =
      player.health + "%";
    console.log("Player Hit");
  }

  //Determine Winner when it is over
  if (player.health <= 0 || enemy.health <= 0) {
    determineWinner({ player, enemy, timerId });
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
      enemy.attack();
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
