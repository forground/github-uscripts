// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Applying_styles_and_colors#A_globalAlpha_example

function draw() {

    var ctx = document.getElementById('canvas').getContext('2d');

    // desenhar background
    ctx.fillStyle = 'gold';
    ctx.fillRect(0,0,75,75);

    ctx.fillStyle = '#6C0';
    ctx.fillRect(75,0,75,75);

    ctx.fillStyle = '#09F';
    ctx.fillRect(0,75,75,75);

    ctx.fillStyle = 'hsl(12, 100%, 50%)';
    ctx.fillRect(75,75,75,75);

    ctx.fillStyle = 'rgba(255, 255, 255, 1)';

    ctx.globalAlpha = 0.2;
  
    // desenhar círculos semi-transparentes
    for (i=0;i<7;i++){
        ctx.beginPath();
        ctx.arc(75,75,10+10*i,0,Math.PI*2,true);
        ctx.fill();
    }

}

draw();
