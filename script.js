  const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    // Jugador
    const player = {
      x: 50,
      y: 50,
      width: 30,
      height: 30,
      color: "#00F",
      speed: 5,
      velocityX: 0,
      velocityY: 0,
      jumping: false,
    };

    // Plataforma
    const platform = {
      x: 0,
      y: canvas.height - 20,
      width: canvas.width,
      height: 20,
      color: "#0F0",
    };

    // Monedas y plataformas debajo de las monedas
    const objects = [
      { type: "coin", x: 200, y: 300, width: 20, height: 20, color: "#FFD700" },
      { type: "coin", x: 400, y: 400, width: 20, height: 20, color: "#FFD700" },
      { type: "coin", x: 600, y: 400, width: 20, height: 20, color: "#FFD700" },
      { type: "platform", x: 180, y: 350, width: 40, height: 10, color: "#0F0" },
      { type: "platform", x: 380, y: 450, width: 40, height: 10, color: "#0F0" },
      { type: "platform", x: 580, y: 450, width: 40, height: 10, color: "#0F0" },
    ];

    let coinCounter = 0;
    let hasWon = false;

    function draw() {
      // Limpiar el lienzo
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dibujar jugador
      ctx.fillStyle = player.color;
      ctx.fillRect(player.x, player.y, player.width, player.height);

      // Dibujar plataforma
      ctx.fillStyle = platform.color;
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

      // Dibujar monedas y plataformas
      objects.forEach((object) => {
        ctx.fillStyle = object.color;
        ctx.fillRect(object.x, object.y, object.width, object.height);
      });

      // Mostrar contador de monedas
      ctx.fillStyle = "#000";
      ctx.font = "20px Arial";
      ctx.fillText(`Monedas: ${coinCounter}`, 10, 30);

      // Mostrar mensaje de victoria si todas las monedas han sido recogidas
      if (hasWon) {
        ctx.fillStyle = "#00F";
        ctx.font = "40px Arial";
        ctx.fillText("¡Has ganado!", canvas.width / 2 - 150, canvas.height / 2);
      }
    }

    function update() {
      if (hasWon) {
        // Si ya has ganado, no actualices nada
        return;
      }

      // Actualizar posición del jugador
      player.x += player.velocityX;
      player.y += player.velocityY;

      // Gravedad
      if (player.y < canvas.height - player.height) {
        player.velocityY += 0.5;
      } else {
        player.y = canvas.height - player.height;
        player.velocityY = 0;
        player.jumping = false;
      }

      // Colisiones con la plataforma
      if (
        player.x < platform.x + platform.width &&
        player.x + player.width > platform.x &&
        player.y + player.height > platform.y
      ) {
        player.y = platform.y - player.height;
        player.velocityY = 0;
        player.jumping = false;
      }

      // Colisiones con monedas y plataformas debajo de las monedas
      objects.forEach((object) => {
        if (
          player.x < object.x + object.width &&
          player.x + player.width > object.x &&
          player.y < object.y + object.height &&
          player.y + player.height > object.y
        ) {
          if (object.type === "coin") {
            // El jugador ha recogido la moneda
            objects.splice(objects.indexOf(object), 1);
            coinCounter++;

            // Verificar si todas las monedas han sido recogidas
            if (coinCounter == 3) {
              hasWon = true;
            }
          } else if (object.type === "platform" && player.velocityY > 0) {
            // El jugador está encima de una plataforma y va hacia abajo
            player.y = object.y - player.height;
            player.velocityY = 0;
            player.jumping = false;
          }
        }
      });
    }

    function gameLoop() {
      draw();
      update();
      requestAnimationFrame(gameLoop);
    }

    window.addEventListener("keydown", (e) => {
      if (e.code === "ArrowRight") {
        player.velocityX = player.speed;
      } else if (e.code === "ArrowLeft") {
        player.velocityX = -player.speed;
      } else if (e.code === "Space" && !player.jumping) {
        player.velocityY = -10;
        player.jumping = true;
      }
    });

    window.addEventListener("keyup", (e) => {
      if (e.code === "ArrowRight" || e.code === "ArrowLeft") {
        player.velocityX = 0;
      }
    });

    // Iniciar el bucle del juego
    gameLoop();