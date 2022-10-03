const pageCanvas = document.getElementById('pageCanvas')
const pctx = pageCanvas.getContext('2d')
const strStrokes = document.getElementById('strStrokes')

pageCanvas.height = 600
pageCanvas.width = 700

strokes = []

strokes = JSON.parse(strStrokes.textContent)
// console.log(strokes)
console.log(strokes.length)
console.log(pctx.strokeStyle)
strStrokes.textContent = ""
for(let i=0; i<strokes.length; i++){
    liftPan = true
    pctx.lineWidth = 2;
    pctx.lineCap = 'round';
    pctx.beginPath()
    for(let j=0; j < strokes[i].length; j++){
        if (liftPan){
            pctx.moveTo(strokes[i][j][0], strokes[i][j][1]);
            pctx.beginPath();

            liftPan = false;
        }
        else{
            pctx.lineTo(strokes[i][j][0], strokes[i][j][1]);
            pctx.stroke();
            if(strokes[i][j][2] == 1){
                liftPan = true
            }
        }
    }
}

const story = document.getElementById('story')

var txtStory = story.innerText;
txtStory = txtStory.replaceAll('<br>', '\n');
story.textContent = '';
pctx.font = "20px sans-serif"
// pctx.strokeText("測試測試",50,400)
var canvasWidth = pageCanvas.width;
var initHeight = 500;
var lastSubStrIndex = 0;
var lineWidth = 0;

for( let i=0; i<txtStory.length; i++){
    lineWidth += pctx.measureText(txtStory[i]).width;
    if(lineWidth > canvasWidth-50){
        pctx.fillText(txtStory.substring(lastSubStrIndex,i),50, initHeight);
        initHeight+=20;
        lineWidth = 0;
        lastSubStrIndex = i;
    }
    else if(i==txtStory.length-1){
        pctx.fillText(txtStory.substring(lastSubStrIndex, i+1), 50, initHeight);
    }
}
// pctx.fillText(txtStory,50, 500)