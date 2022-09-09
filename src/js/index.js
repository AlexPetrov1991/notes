const $area = document.querySelector('.area');
const $btn = document.querySelector('.buttonAdd');
const $buttonArrow = document.querySelector('.container-group .image img');
const $containerGroup = document.querySelector('.container-group');
const $generateGroup = document.querySelector('.container-group .containerGenerateGroup');
const $note = document.querySelector('.area .note');

let $selectedNote = null;
let selectedNoteIndex = null;

let action = false;

const areaWidth  = $area.offsetWidth;
const areaHeight = $area.offsetHeight;

let noteWidth = null;
let noteHeight = null;

let closeIndex = null;

let startCoords = {
    x: 0,
    y: 0
}

let distance = {
    x: 0,
    y: 0 
}

let notes = [];

if (getFromLS('coords')) {
    notes = getFromLS('coords');
    noteGenerator(notes);
    generateGroup(notes);
}

function move(coords){
    $selectedNote.style.left = coords.x + 'px';
    $selectedNote.style.top = coords.y + 'px';
}

function setToLS(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
function getFromLS(key) {
    return JSON.parse(localStorage.getItem(key));
}
function delToLS (key, value){
    localStorage.removeItem(key, value);
}

function noteGenerator(list){
    let template = ' ';
    for(let i = 0; i < list.length; i++) {
        template += '<div class="note" style="left: ' + list[i].x + 'px; top: ' + list[i].y + 'px" data-index = "' + i + '">'+
                        '<div class="info">'+
                            '<div class="id" data-index = "' + i + '">ID <p>' + i + '</p></div>'+
                            '<div class="name">Name<input class="nameContainer" value="' + list[i].name + '" data-index = "' + i + '"></div>'+
                            '<div class="group">Group <input class="groupContainer" value="' + list[i].group + '" data-index = "' + i + '"></div>'+
                            '<div class="close" data-index = "' + i + '">X</div>'+
                        '</div>'+
                        '<textarea placeholder="Введите текст" class="text" data-index="' + i + '">' + list[i].note + '</textarea>'+
                    '</div>';
    }
    $area.innerHTML = template;

    document.querySelectorAll('.note > textarea').forEach(function (el) {
        el.addEventListener('input', function (e) {
            let noteIndex = this.getAttribute('data-index');
            notes[noteIndex].note = this.value;
            setToLS('coords', notes);
        });
    });

    document.querySelectorAll('.note .name .nameContainer').forEach(function (el) {
        el.addEventListener('input', function (e) {
            let nameIndex = this.getAttribute('data-index');
            notes[nameIndex].name = this.value;
            setToLS('coords', notes);
        });
    });

    document.querySelectorAll('.note .group .groupContainer').forEach(function (el) {
        el.addEventListener('input', function (e) {
            let groupIndex = this.getAttribute('data-index');
            notes[groupIndex].group = this.value;
            setToLS('coords', notes);
            generateGroup(notes);
        });
    });

    document.querySelectorAll('.note .info .close').forEach(function(el){
        el.addEventListener('click', function(){
            closeIndex = this.getAttribute('data-index');
            document.querySelector('.area .note[data-index="'+ closeIndex +'"]').classList.add('active');
            notes.splice(closeIndex, 1);
            noteGenerator(notes);
            setToLS('coords', notes);
        });         
    });
}

$area.addEventListener('mousedown', function(e){
    if(e.target.classList.contains('note')){
        action = true;
        $selectedNote = e.target;
        selectedNoteIndex = e.target.getAttribute('data-index')
        startCoords.x = e.pageX;
        startCoords.y = e.pageY;

        noteWidth = $selectedNote.offsetWigth;
        noteHeight = $selectedNote.offsetHeight;
    } 
});

$area.addEventListener('mouseup', function(e){
    if(action){
        notes[selectedNoteIndex].x = distance.x;
        notes[selectedNoteIndex].y = distance.y;
        setToLS('coords', notes);
        action = false;
    }
});

$area.addEventListener('mousemove', function(e){
    if(action) {
        distance.x = notes[selectedNoteIndex].x + (e.pageX - startCoords.x);
        distance.y = notes[selectedNoteIndex].y + (e.pageY - startCoords.y); 
    
        if (distance.x <= 0) distance.x = 0;
        if (distance.x >= (areaWidth - noteWidth)) distance.x = areaWidth - noteWidth;
        
        if (distance.y <= 0) distance.y = 0;
        if (distance.y >= (areaHeight - noteHeight)) distance.y = areaHeight - noteHeight;

        move(distance);
    }
});

$btn.addEventListener('click', function(e){
    notes.push(
        {
            x: 0,
            y: 0,
            note: ' ',
            name: ' ',
            group: ' '
        }
        
    );
    noteGenerator(notes);
});

function generateGroup (groupName) {
    let template = ' ';
    for(let i = 0; i < groupName.length; i++){
    template += '<div class="generate-group">'+
                    '<input class="checkbox" type="checkbox" value="' + groupName[i].group +'" id="opt-in" />'+
                    '<label for="opt-in">' + groupName[i].group +'</label>'+
                '</div>';
    }
    $generateGroup.innerHTML = template;

    document.querySelectorAll('.container-group .containerGenerateGroup .generate-group .checkbox').forEach(function(el){
        el.addEventListener('input', function(e){
            if (this.checked) {
                label.push(this.value.toLocaleLowerCase()); 
            } else {
                label.splice(label.indexOf(this.value), 1);
            }
            filterGroup(label);
        });
    });
}

let label = [];

function filterGroup (label) {
    if(label.length) {
        let filteredNotes = notes.filter(function (el) {
            return label.indexOf(el.group.toLocaleLowerCase()) + 1;
        }); 
        noteGenerator(filteredNotes); 
    }else {
        noteGenerator(notes);
    }
}

$buttonArrow.addEventListener('click', function(){
    $containerGroup.classList.toggle('active');
    $generateGroup.classList.toggle('active');
    $buttonArrow.classList.toggle('active');
})
//console.log(Date.now());