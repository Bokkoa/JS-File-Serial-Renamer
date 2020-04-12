'use strict'

const input = document.querySelector('input[type="file"]');
const form = document.querySelector('form');

var numberR = document.getElementById('numberRight');
var numberL = document.getElementById('numberLeft');
var inputFormat = document.getElementById('nameFormat');
var inputAppend = document.getElementById('append');
var inputPreppend = document.getElementById('preppend');
var formatString = ``;

//WHEN DOCUMENT READY
document.addEventListener("DOMContentLoaded", function() {
    $("#fileList").sortable();
    $("#fileList").disableSelection();
});


//WHEN FILE INPUT CHANGE
input.addEventListener('change', function(){
   
    let files = input.files;
    let fileList = document.getElementById('fileList');
    
    //SEE THE NAME OF EACH FILE
    for( let iterator = 0; iterator < files.length; iterator++ ){
   
        let li = document.createElement('li');
        li.className = "list-group-item";
        li.innerHTML = `<span class="fileUploaded">
                        ${files[iterator].name}</span>
                        <div class="float-right">
                        <button type="button" class="btn btn-outline-danger">
                        <i class="fas fa-eraser">
                        </i></button>
                        </div>`; 
        li.className += " fade";
        fileList.appendChild(li);
    }

    //SET EVENT
    setBtnEvent();
    
});


//UX BEHAVIOR

//Number toggle
numberL.addEventListener('click', function(){
    if(numberL.checked) numberR.checked = false;
});

//Number toggle
numberR.addEventListener('click', function(){
    if(numberR.checked) numberL.checked = false;
});

//Allow submit & format string
inputFormat.addEventListener('change', function(){
    let submitButton = document.getElementById('btnSubmit');
    if(inputFormat.value.length > 0){
        submitButton.disabled = false;
        formatString = `${inputPreppend.value}${inputFormat.value}${inputAppend.value}`;
    }
});


//Delete a file from list
function setBtnEvent()
{   
    //select btns
    var btnsDel = document.getElementsByClassName('btn-outline-danger');

    //set events
    Array.from(btnsDel).forEach(function(button){
        button.addEventListener('click', function(){
        let parent = button.parentElement;
        let li = parent.parentElement;
        let ul = li.parentElement;
        ul.removeChild(li);
        });
    });
}


//FORMAT STRING CONFIGURATION
inputAppend.addEventListener('change', function(){
    if(inputAppend.value.length > -1){
        formatString = `${inputPreppend.value}${inputFormat.value}${inputAppend.value}`;
    }
});

inputPreppend.addEventListener('change', function(){
    if(inputPreppend.value.length > -1){
        formatString = `${inputPreppend.value}${inputFormat.value}${inputAppend.value}`;
    }
});


//GENERATE ZIP AND DOWNLOAD
form.addEventListener('submit', function(event){
    event.preventDefault();

    let files = input.files;
    let fileList = document.getElementById('fileList');
    let items = fileList.getElementsByTagName("li");

    var zip = new JSZip();
    
    //SEE THE NAME OF EACH FILE
    for( let iterator = 0; iterator < items.length; iterator++ ){
   
        for ( let search = 0; search < files.length; search++)
        {
            if(files[search].name == items[iterator].innerHTML)
            {
                let zipFileName;
                
                //GET EXTENSION
                let fileSplit = files[search].name.split('.');
                let fileExt = fileSplit[1];

                //SET NAME
                if(iterator < 8){
                    console.log("iterador: "+iterator);

                    zipFileName = (numberR.checked) ? formatString + '0' + (iterator + 1) : '0' + (iterator + 1) + formatString;
                }
                else{
                    zipFileName = (numberR.checked) ? formatString + (iterator + 1) : (iterator + 1) + formatString;
                }
                
                //STORE ON ZIP
                zip.file( zipFileName + `.${fileExt}`, files[search], {binary:true} );
            }
        }
        
    }

    //START THE ZIP DOWNLOAD
     zip.generateAsync({type:"blob"})
    .then(function(blob) {
        
        //CREATE LINK AND CONFIGURATE CONTENT OF HREF (AVOID NETWORK ERROR BY NAME LENGTH)
        let link = document.createElement('a');
        let uriContent = URL.createObjectURL(new Blob([blob], {type : 'text/plain'}));
       
        //SET ATTRIBS TO LINK
        link.setAttribute('href', uriContent);
        link.download = inputFormat.value+".zip";

        //GENERATE THE DOWNLOAD LINK
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    });

});
