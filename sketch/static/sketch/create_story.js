//Do the sketch part first
let strokes = [];
let datasetName = "";
let datasetNameSave = "";
let AIstrokes = [];
let AIstrokesCopy = [];
let AIstrokesExist = false;
let penColor = '#000000';
const generatingCanvas = document.querySelector("#generatingBoard");
const gctx = generatingCanvas.getContext("2d");

const sketchingCanvas = document.querySelector("#sketchingBoard");
const ctx = sketchingCanvas.getContext("2d");

sketchingCanvas.height = 450
sketchingCanvas.width = 700
generatingCanvas.height = 250 
generatingCanvas.width = 250

canvasPosX = sketchingCanvas.offsetLeft;
canvasPosY = sketchingCanvas.offsetTop;

window.addEventListener("resize", ()=>{
    canvasPosX = sketchingCanvas.offsetLeft;
    canvasPosY = sketchingCanvas.offsetTop;
});


//from options get selected one
let datasetOptions = document.getElementById("options");
datasetOptions.onclick = changeDataset;

function changeDataset(){
    console.log(this.value)
    datasetName = this.value
}

//from optionsSave get selected one
let datasetOptionsSave = document.getElementById("optionsSave");
datasetOptionsSave.onclick = changeDatasetSave;

function changeDatasetSave(){
    console.log(this.value)
    datasetNameSave = this.value
}

//change the current color of pen
const palette = document.querySelectorAll('.btnColors')
palette.forEach(color => {
    color.addEventListener('click', (e) => penColor = e.target.style.backgroundColor)
})

//variables
let painting = false;
let newStroke = false;
let lastPanPositionX = 0
let lastPanPositionY = 0
let oneStroke = [];
function initStroke(){
    painting = false;
    newStroke = false;
    strokes = [];
    lastPanPositionX = 0;
    lastPanPositionY = 0;
}

function startPosition(e){
    if (e.button == 0){     //left button : draw on canvas
        if (lastPanPositionX != 0 && lastPanPositionY != 0){
            newStroke = true;
            let innerStroke = [e.clientX - canvasPosX - lastPanPositionX, e.clientY - canvasPosY - lastPanPositionY, 0];
            oneStroke.push(innerStroke);
        }
        painting = true;
        ctx.beginPath();
        draw(e);
    }
    else if(e.button == 1){ //middle button : generate AI strokes
        console.log('middle button')
        copyAIStrokes(e)
    }
    
}

function finishedPosition(){
    if (!painting)  return;
    painting = false;
    ctx.beginPath();
    oneStroke[oneStroke.length-1][2] = 1;
    strokes.push(oneStroke);
    oneStroke = [];
}

function draw(e){
    if(!painting) return;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = penColor;
    //current paiting board position is (500,100)
    ctx.lineTo(e.clientX-canvasPosX, e.clientY-canvasPosY);
    ctx.stroke();

    if(newStroke) {
        newStroke = false;
        
        lastPanPositionX = e.clientX - canvasPosX;
        lastPanPositionY = e.clientY - canvasPosY;
        return;
    }
    let innerStroke = [e.clientX - canvasPosX , e.clientY - canvasPosY, 0];
    oneStroke.push(innerStroke);
    lastPanPositionX = e.clientX - canvasPosX;
    lastPanPositionY = e.clientY - canvasPosY;
}   
//EventListeners
sketchingCanvas.addEventListener("mousedown", startPosition);
sketchingCanvas.addEventListener("mouseup", finishedPosition);
sketchingCanvas.addEventListener("mousemove", draw);

const buttonClear = document.getElementById("btnClear");
buttonClear.addEventListener("click", function(e){
    console.log(strokes);
    ctx.clearRect(0, 0, sketchingCanvas.width, sketchingCanvas.height);
    initStroke();
});

const btnUndo = document.getElementById("btnUndo");
btnUndo.addEventListener("click", function(){
    console.log("press undo")
    console.log(strokes.length)
    ctx.clearRect(0, 0, sketchingCanvas.width, sketchingCanvas.height);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = penColor;
    ctx.beginPath();
    liftPan = false
    if(strokes.length > 0){
        strokes.pop()
        
        for(let i = 0; i < strokes.length; i++){
            console.log(strokes[i])
            liftPan = false;
            ctx.beginPath()
            for(let j = 1; j < strokes[i].length; j++){ 
                if( liftPan ){
                    console.log('move')
                    
                    ctx.moveTo(strokes[i][j][0] , strokes[i][j][1] );
                    ctx.beginPath()
                    
                    liftPan = false
                }
                else{
                    ctx.lineTo(strokes[i][j][0] , strokes[i][j][1] );
                    ctx.stroke()
                    if(strokes[i][j][2] == 1){
                        liftPan = true
                    }    
                }
            }
            
        }
    }
    
})

function copyAIStrokes(e){
    console.log(AIstrokes)
    console.log(e.clientX, e.clientY)
    AIstrokesCopy = JSON.parse(JSON.stringify(AIstrokes))    //這是存對於畫布的絕對路徑的Array
    curPanX = e.clientX - canvasPosX;
    curPanY = e.clientY - canvasPosY;
    ctx.lineWidth = 2;
    ctx.strokeStyle = penColor;
    ctx.beginPath()
    let slowlydraw = setInterval(drawEachLine, 10);
    i = 0;
    len = AIstrokes.length;
    liftPan = false;
    function drawEachLine(){
        if(i>=len){
            clearInterval(slowlydraw);
            console.log("clearInterval")
            ctx.beginPath()
            return;
        }
        
        if(liftPan){
            AIstrokesCopy[i][0] = curPanX + AIstrokesCopy[i][0]*10;
            AIstrokesCopy[i][1] = curPanY + AIstrokesCopy[i][1]*10;
            // ctx.moveTo(AIstrokes[i][0], AIstrokes[i][1]);
            ctx.moveTo(curPanX + AIstrokes[i][0]*10, curPanY + AIstrokes[i][1]*10);
            curPanX = curPanX + AIstrokes[i][0]*10;
            curPanY = curPanY + AIstrokes[i][1]*10;
            // curPanX = AIstrokes[i][0]
            // curPanY = AIstrokes[i][1]
            liftPan = false
            console.log('lift')
        }else{
            AIstrokesCopy[i][0] = curPanX + AIstrokesCopy[i][0]*10;
            AIstrokesCopy[i][1] = curPanY + AIstrokesCopy[i][1]*10;
            // ctx.lineTo(AIstrokes[i][0], AIstrokes[i][1])
            ctx.lineTo(curPanX + AIstrokes[i][0]*10, curPanY + AIstrokes[i][1]*10);
            ctx.stroke()
            // curPanX = AIstrokes[i][0]
            // curPanY = AIstrokes[i][1]
            curPanX = curPanX + AIstrokes[i][0]*10;
            curPanY = curPanY + AIstrokes[i][1]*10;
            if (AIstrokes[i][2] == 1)    liftPan = true
        }
        i+=1;
    }
    console.log(AIstrokesCopy)
    strokes.push(AIstrokesCopy);
}

//Draw on the AI canvas
function generateSketch(response)
{
    gctx.clearRect(0,0, generatingCanvas.width, generatingCanvas.height);
    AIstrokesExist = true;
    gcanvasPosX = generatingCanvas.offsetLeft;
    gcanvasPosY = generatingCanvas.offsetTop;
    curPanX = gcanvasPosX + 50;
    curPanY = gcanvasPosY + 10;
    console.log(curPanX, curPanY);
    gctx.lineWidth = 1.5;
    gctx.lineCap = 'round';
    gctx.strokeStyle = '#008080';
    gctx.beginPath();
    i = 0;
    len = response.length;
    liftPan = false;

    let slowlydraw = setInterval(drawEachLine, 10);
    function drawEachLine(){
        if(i>=len){
            clearInterval(slowlydraw);
            console.log("clearInterval")
            return;
        }
        
        if(liftPan){
            gctx.moveTo(gcanvasPosX + curPanX + response[i][0]*10, gcanvasPosY + curPanY + response[i][1]*10);
            curPanX = curPanX + response[i][0]*10;
            curPanY = curPanY + response[i][1]*10;
            liftPan = false
            console.log('lift')
        }else{
            gctx.lineTo(gcanvasPosX + curPanX + response[i][0]*10, gcanvasPosY + curPanY + response[i][1]*10);
            gctx.stroke()
            curPanX = curPanX + response[i][0]*10;
            curPanY = curPanY + response[i][1]*10;
            if (response[i][2] == 1)    liftPan = true
        }
        i+=1;
    }

}


//Save strokes to datasetNameSave
$(document).ready(function(){
    $(".btnSubmit").click(function(){
        $.ajax({
            urls: '',
            type: 'POST',
            data: {
                'stroke_arr[]': strokes,
                'dataset_name': datasetNameSave
            },
        });
    });
});


//Get AI strokes and draw from datasetName
$(".btnGet").click(function(){
    AIstrokes = [];
    $.ajax({
        url: "/getStroke/",
        type: 'POST',
        data: {
            'dataset_name': datasetName
        },
    });
    drawAfterSubmitDataset();
});

//Only draw, and it's useless now
$('.btnDraw').click(function(){
    $.ajax({
        url: "/generating/",
        type: 'GET',
        success: function(response){
            console.log('success', response.test)
            AIstrokes = response.test
            generateSketch(AIstrokes);
        },
        error: function(error){
            console.log('error', error)
        }
    });
});

function drawAfterSubmitDataset(){
    let tryDrawingInterval = setInterval(tryToDraw, 2000);
    function tryToDraw(){
        if(AIstrokes.length <= 0){
            $.ajax({
                url: "/generating/",
                type: 'GET',
                success: function(response){
                    console.log('success', response.test)
                    AIstrokes = response.test
                    if(AIstrokes.length > 0){
                        generateSketch(AIstrokes);
                    }
                },
                error: function(error){
                    console.log('error', error)
                }
            });
        }else{
            console.log('get Stroke');
            clearInterval(tryDrawingInterval);
        }
    }
    
}

//From now on, it's word content area

inputContent = ""
story = ""

const textInput = document.getElementById('textInput')
const curContent = document.getElementById('curContent')
const resultContent = document.getElementById('storyResult')
const btnConfirm = document.getElementById('btnTxtConfirm')

textInput.addEventListener("input", getInputContent)
function getInputContent(e){
    inputContent = e.target.value
}

//Save the current responced sentence
btnConfirm.addEventListener("click", function(){
    console.log("story = \n", story);
    if(curContent.textContent != "" && !story.includes(curContent.textContent)){
        story += inputContent + curContent.textContent;
        story += '<br>';
        console.log("new content");
    }
    
})

//Send the first sentence and show the responce
$('.btnTxtSubmit').click(function(){
    $.ajax({
        url: "/getText/",
        type: 'POST',
        data: {
            'input_content': inputContent
        },
    });
    txtGet();
});

//Only show the result, it's useless now
$('.btnTxtGet').click(function(){
    // resultContent.textContent = "讓我想想……"
    $.ajax({
        url: "/generatingText/",
        type: 'GET',
        success: function(response){
            console.log('success', response.generatingText)
            curContent.textContent = response.generatingText
            resultContent.innerHTML = story + inputContent + response.generatingText
        },
        error : function(error){
            console.log('error', error)
        }
    });

});

function txtGet()
{
    $.ajax({
        url: "/generatingText/",
        type: 'GET',
        success: function(response){
            console.log('success', response.generatingText)
            curContent.textContent = response.generatingText
            resultContent.innerHTML = story + inputContent + response.generatingText
        },
        error : function(error){
            console.log('error', error)
        }

    });
};

//Now, we're going to save the whole book
title = ""
author = ""

const titleInput = document.getElementById('titleInput');
const authorInput = document.getElementById('authorInput');

titleInput.addEventListener("input", function(e){
    title = e.target.value;
});

authorInput.addEventListener("input", function(e){
    author = e.target.value;
})



$("#btnSaveStory").click(function(){
    strStrokes = JSON.stringify(strokes)
    if( title !=""){
        console.log('in POST')
        console.log(strokes)
        console.log(strStrokes)

        $.ajax({
            url: "/story-save/",
            type: "POST",
            data: {
                'title':title,
                'description':'',
                'author':author,
                'story':story,
                'sketch_strokes':strStrokes,
                'sketch_colors':'',
            }
        })
    }
});
