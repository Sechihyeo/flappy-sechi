const canvas = document.getElementById("canvas")
let ctx

if (!canvas.getContext) { canvas.remove() }

let Y, Yv, scene, TukimX, TukimY, scoreGiven, score, window_anim

const main = new Image()
const main_fall = new Image()
const tukim_high = new Image()
const tukim_mid = new Image()
const tukim_bottom = new Image()
const window_ = new Image()
const logo = new Image()

const die1 = new Audio("src/sfx/die1.wav")
const die2 = new Audio("src/sfx/die2.wav")
const fly1 = new Audio("src/sfx/fly1.wav")
const fly2 = new Audio("src/sfx/fly2.wav")
const fly3 = new Audio("src/sfx/fly3.wav")
const point = new Audio("src/sfx/point.wav")

const audios = []

init()

function init(){
  main.src = 'src/sprites/main.png'
  main_fall.src = 'src/sprites/main_fall.png'
  tukim_high.src = 'src/sprites/tukim_high.png'
  tukim_mid.src = "src/sprites/tukim_mid.png"
  tukim_bottom.src = "src/sprites/tukim_bottom.png"
  window_.src = "src/sprites/window.png"
  logo.src = "src/sprites/logo.png"
  

  scene = 0

  

  gameStart()
  setInterval(loop, 20)

  let cool = false
  document.addEventListener('mousedown', function() {
    switch (scene){
      case 1:{ Yv = -10 }
    }
  })
  document.addEventListener('keydown', function(event) {
    if (event.keyCode === 32 || event.keyCode === 38 || event.keyCode === 87) {
      if (cool) return
      switch (scene){
        case 1:{Yv = -10; let i = Math.floor(Math.random()*3) + 1; setTimeout("fly" + i + ".pause(); fly" + i + ".currentTime = 0; fly" + i + ".play()", 0)}
        
      }
      

      cool = true
    }
    if (event.keyCode === 13 && scene != 1) {
      scene = 1
      gameStart()
    }
  })
  document.addEventListener('keyup', function(event) { if(event.keyCode === 32 || event.keyCode === 38 || event.keyCode === 87) return cool = false })
}

function gameStart(){
  TukimX = [360, 560, 760]
  TukimY = [Math.floor(Math.random()*290), Math.floor(Math.random()*290), Math.floor(Math.random()*290)]
  Y = 200
  Yv = 0
  scoreGiven = false
  score = 0
  window_anim = -300
}


function loop(){
  switch (scene) {
    case 0: {
      scene0()
      break
    }
    case 1: {
      scene1()
      break
    }
    case 2: {
      scene2()
      break
    }
  }
}

function scene0(){
  ctx = canvas.getContext('2d')

  ctx.imageSmoothingEnabled = false
  
  ctx.clearRect(0,0,360,540)
  ctx.drawImage(main, 60, 200, 50, 50)
  ctx.drawImage(logo, 30, 50, 300, 111)

  ctx.font = "30px Arial"
  ctx.fillText("Press Enter to start...", 40, 400)
}


function drawTukim(posX, posY, type){
  switch(type){
    case 1: {
      ctx.drawImage(tukim_high, posX, posY, 50, 50)
      for(i = 0; i < 8; i++){
        ctx.drawImage(tukim_mid, posX, posY + (i+1) * 50, 50, 50)
      }
      break
    }
    case 0: {
      ctx.drawImage(tukim_bottom, posX, posY, 50, 50)
      for(i = 0; i < 8; i++){
        ctx.drawImage(tukim_mid, posX, posY + (i+1) * -50, 50, 50)
      }
      break
    }
  }
}
function Tukim(posX, posY){
  drawTukim(posX, posY, 0)
  drawTukim(posX, posY+185, 1)
}

function scene1(){
  ctx = canvas.getContext('2d')

  ctx.imageSmoothingEnabled = false
  
  //logic
  Y += Yv
  Yv += 1

  if (Y >= 490 || Y < 0) { scene = 2; die2.play()}

  for (tukim_logic = 0; tukim_logic < 3; tukim_logic++){
    if (TukimX[tukim_logic] < -250){
      TukimX[tukim_logic] = 360
      TukimY[tukim_logic] = Math.floor(Math.random()*290)
      scoreGiven = false
    }
    else {TukimX[tukim_logic] -= 2}
  }
  for (tukim_collision = 0; tukim_collision < 3; tukim_collision++){
    if (TukimX[tukim_collision] - 50 < 60 && TukimX[tukim_collision] + 50 > 60){
      if (Y < TukimY[tukim_collision] + 50 || Y > TukimY[tukim_collision] + 135){
        scene = 2
        Yv = 0
        die1.play()
      }
      else{
        if (score == 1 && tukim_collision == 1) {
          score = 2
          point.pause()
          point.currentTime = 0
          point.play()
        }
        if (!scoreGiven){
          score ++
          scoreGiven = true
          point.pause()
          point.currentTime = 0
          point.play()
        }
        
      }
    }
  }

  //draw
  
  ctx.clearRect(0, 0, 360, 540)
  ctx.drawImage(main, 60, Y, 50, 50)

  for (tukim_draw = 0; tukim_draw < 3; tukim_draw++) {
    Tukim(TukimX[tukim_draw], TukimY[tukim_draw])
  }
  
  ctx.font = "30px Arial"
  ctx.fillText(score, 170, 100)
}


function drawWindow(posY){
  ctx.drawImage(window_, 30, posY, 300, 300)

  ctx.fillStyle = "rgb(0,0,0)"
  ctx.font = "30px Arial"
  ctx.fillText("U ded", 140, posY+110)

  ctx.font = "20px Arial"
  ctx.fillText("score: " + score, 150, posY + 150)

  ctx.font = "25px Arial"
  ctx.fillText("press Enter to restart...", 60, posY + 200)
}

function scene2(){
  ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = false

  //logic
  Yv++
  Y += Yv

  window_anim += 20
  if (window_anim > 50) {window_anim  = 50}

  //draw
  ctx.clearRect(0, 0, 360, 540)

  for (tukim_draw = 0; tukim_draw < 3; tukim_draw++) {
    Tukim(TukimX[tukim_draw], TukimY[tukim_draw])
  }

  ctx.drawImage(main_fall, 60, Y, 50, 50)

  drawWindow(window_anim)  
}
