const pageCanvas = document.getElementById('pageCanvas')
const pctx = pageCanvas.getContext('2d')
const strWholeBookStrokes = document.getElementById('strStrokes')
const strWholeBookStrokesColors = document.getElementById('strStrokesColors')

pageCanvas.height = 600
pageCanvas.width = 700

let wholeBookStrokes = []
let wholeBookStrokesColors = []
wholeBookStrokes = JSON.parse(strWholeBookStrokes.textContent)
wholeBookStrokesColors = JSON.parse(strWholeBookStrokesColors.textContent)
strWholeBookStrokes.textContent = ""
strWholeBookStrokesColors.textContent = ""

let curPage = 1
let maxPage = wholeBookStrokes.length


function showCurPage(){
    pageInfo.textContent = "現在頁數" + curPage + "/" + maxPage
    pctx.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
    drawOnCanvas(wholeBookStrokes[curPage-1], wholeBookStrokesColors[curPage-1])
    fillTextOnCanvas(wholeBookStory[curPage-1])
}

const pageInfo = document.getElementById('pageInfo')

function drawOnCanvas(strokes, colors){
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
                pctx.strokeStyle = colors[i];
                pctx.lineTo(strokes[i][j][0], strokes[i][j][1]);
                pctx.stroke();
                if(strokes[i][j][2] == 1){
                    liftPan = true
                }
            }
        }
    }
}


const story = document.getElementById('story')

var wholeBookStory = JSON.parse(story.innerText);
story.textContent = '';

function fillTextOnCanvas(story){
    story = story.replaceAll('<br>', '\n');
    pctx.font = "20px sans-serif"
    // pctx.strokeText("測試測試",50,400)
    var canvasWidth = pageCanvas.width;
    var initHeight = 500;
    var lastSubStrIndex = 0;
    var lineWidth = 0;
    
    for( let i=0; i<story.length; i++){
        lineWidth += pctx.measureText(story[i]).width;
        if(lineWidth > canvasWidth-50){
            pctx.fillText(story.substring(lastSubStrIndex,i),50, initHeight);
            initHeight+=20;
            lineWidth = 0;
            lastSubStrIndex = i;
        }
        else if(i==story.length-1){
            pctx.fillText(story.substring(lastSubStrIndex, i+1), 50, initHeight);
        }
    }
    // pctx.fillText(txtStory,50, 500)
}

showCurPage();

const btnLastPage = document.getElementById('btnLastPage');
const btnNextPage = document.getElementById('btnNextPage');

btnLastPage.addEventListener('click', function(){
    if(curPage>1){
        curPage -= 1;
        showCurPage();
    }
})

btnNextPage.addEventListener('click', function(){
    if(curPage<maxPage){
        curPage += 1;
        showCurPage();
    }
})