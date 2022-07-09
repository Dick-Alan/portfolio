const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const scoreEl = document.querySelector('#scoreEl')
const score1 = document.querySelector('#score1')
const score2 = document.querySelector('#score2')
const score3 = document.querySelector('#score3')
const startGameBtn = document.querySelector('#startGameBtn')
const modalEl = document.querySelector('#modalEl')
const bigScoreEl = document.querySelector('#bigScoreEl')
const name1 = document.querySelector('#name1')
const name2 = document.querySelector('#name2')
const name3 = document.querySelector('#name3')
const playerName = document.querySelector('#name')



gameOn = false;

let animationId 
let score = 0
let gameLevel = 0
let highscores = [score1, score2, score3]


class Player {
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }
    
    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2,  false)
        c.fillStyle = this.color
        c.fill()
    }
}

class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity

    }
    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2,  false)
        c.fillStyle = this.color
        c.fill()
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity

    }
    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2,  false)
        c.fillStyle = this.color
        c.fill()
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

const friction = 0.99

class Particle{
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.alpha = 1

    }
    draw() {
        c.save()
        c.globalAlpha = this.alpha
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2,  false)
        c.fillStyle = this.color
        c.fill()
        c.restore()
    }

    update() {
        this.draw()
        this.velocity.x *= friction
        this.velocity.y *= friction
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        this.alpha -= 0.01
    }
}
const x = canvas.width / 2
const y = canvas.height / 2


let player = new Player(x, y, 10, 'white')
let projectiles = []
let enemies = []
let particles = []

function init() {
    player = new Player(x, y, 10, 'white')
    projectiles = []
    enemies = []
    particles = []
    score = 0
    scoreEl.innerHTML = score
    bigScoreEl.innerHTML = score


}

function spawnEnemies() {
    
    if (gameOn = true) {
        setInterval(() => {
            const radius = Math.random() * (30 - 4) + 4
            
            let x 
            let y 

            if (Math.random() < 0.5) {
                x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
                y = Math.random() * canvas.height

            } else {
                x = Math.random() * canvas.width
                y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius


            }
            const color = `hsl(${Math.random() * 360}, 50%, 50%)`

            const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x)
            const velocity = {
                x: Math.cos(angle) * (1 + gameLevel) ,
                y: Math.sin(angle) * (1 + gameLevel)
            }
            enemies.push(new Enemy(x, y, radius, color, velocity))
            
        }, 1000)

    } 
    
}

function animate() {
    gameLevel += score / 30000000
    animationId = requestAnimationFrame(animate)
    c.fillStyle = 'rgba(0, 0, 0, 0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.draw()
    particles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
            particles.splice(index, 1)
        } else {
            particle.update()
        }
        
    });
    projectiles.forEach((projectile, index) => {
        projectile.update()

        // remove projectiles from edges of screen
        if (projectile.x + projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.widith ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height) {
            setTimeout(() => {

                projectiles.splice(index, 1)

               }, 0)

        }
    })
    enemies.forEach((enemy, index) => {
        enemy.update()
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y) 
        if (dist - enemy.radius - player.radius < 1) {
            //end game
            gameOn = false
            cancelAnimationFrame(animationId)
            modalEl.style.display = 'flex'
            bigScoreEl.innerHTML = score
            // update scoreboard
            if (playerName.value < 1 || playerName.value.length > 10) {
                playerName.value = "Invalid Name"
            }
            let oldName1 = name1.innerHTML
            let oldName2 = name2.innerHTML
            let oldScore1 = score1.innerHTML
            let oldScore2 = score2.innerHTML
            if (score > score1.innerHTML) {
                name1.innerHTML = playerName.value
                score1.innerHTML = score 
                score2.innerHTML = oldScore1
                name2.innerHTML = oldName1
                score3.innerHTML = oldScore2
                name3.innerHTML = oldName2
            }


            if (score > score2.innerHTML && score < score1.innerHTML)  {
                name2.innerHTML = playerName.value
                score2.innerHTML = score
                score3.innerHTML = oldScore2
                name3.innerHTML = oldName2
            }

            if (score > score3.innerHTML && score < score2.innerHTML) {
                score3.innerHTML = score
                name3.innerHTML = playerName.value
            }

            

            
        }
//hit 
        projectiles.forEach((projectile, projectileIndex) => {
           const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y) 
          //update score

          //create explosions
           if (dist - enemy.radius - projectile.radius < 1) {



               for (let i = 0; i < enemy.radius * 2; i++) {
                   particles.push(new Particle(projectile.x, projectile.y, Math.random() * 2, enemy.color, {x: (Math.random() - 0.5) * (Math.random() * 8), y:  (Math.random() - 0.5) * (Math.random() * 8)}))
               }

               if (enemy.radius - 10 > 10) {
                score += 100
                scoreEl.innerHTML = score
                console.log(gameLevel);

                   enemy.radius -= 10
                   setTimeout(() => {

                    projectiles.splice(projectileIndex, 1)
    
                   }, 0)
               } else { 
                score += 250
                scoreEl.innerHTML = score
                console.log(score);
                setTimeout(() => {
                    enemies.splice(index, 1)
                    projectiles.splice(projectileIndex, 1)
    
                   }, 0)


               }


           }
        })
    })

}


addEventListener('click', (event) => {
    const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2)
    const velocity = {
        x: Math.cos(angle) * (5 + gameLevel),
        y: Math.sin(angle) * (5 + gameLevel)
    }
    projectiles.push(
        new Projectile(canvas.width / 2, canvas.height / 2, 5, 'white', velocity)
    )

 
})

addEventListener('touchstart', (event) => {
    const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2)
    const velocity = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5
    }
    projectiles.push(
        new Projectile(canvas.width / 2, canvas.height / 2, 5, 'white', velocity)
    )

 
})



startGameBtn.addEventListener('click', () => {
    gameOn == true
    init()
    animate()
    gameLevel = 0
    console.log(playerName.value)
    modalEl.style.display = 'none'


})


spawnEnemies()