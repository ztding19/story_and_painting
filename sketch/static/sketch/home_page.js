const coverCanvas = document.querySelectorAll(".coverCanvas")
var ctx;


for( let c = 0; c < coverCanvas.length; c++){
    coverCanvas[c].height = 180;
    coverCanvas[c].width = 280;
    drawCover(coverCanvas[c].getContext("2d"), coverCanvas[c].textContent);
}
coverCanvas[0].height = 180;
coverCanvas[0].width = 280;
drawCover(coverCanvas[0].getContext("2d"), coverCanvas[0].textContent);

function drawCover(ctx, strokes)
{
    strokes = JSON.parse(strokes);
    console.log(strokes);
    for( let i=0; i < strokes.length; i++){
        liftPan = true;
        ctx.lineWidth = 1;
        ctx.lineCap = 'round';
        ctx.beginPath();
        for( let j = 0; j < strokes[i].length; j++){
            if (liftPan){
                ctx.moveTo(strokes[i][j][0]*0.4, strokes[i][j][1]*0.4);
                ctx.beginPath();
                liftPan = false;
            }
            else{
                ctx.lineTo(strokes[i][j][0]*0.4, strokes[i][j][1]*0.4);
                ctx.stroke();
                if(strokes[i][j][2] == 1){
                    liftPan = true;
                }
            }
        }
    }
}