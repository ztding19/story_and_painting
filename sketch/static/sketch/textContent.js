
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

function txtGet(){
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
}