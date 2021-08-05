var editorBox = document.querySelector('.editor-box');
var filesContainer = document.querySelector('.files-container');
var noteDataJson = localStorage.getItem("storedNoteData");
var noteFilesArr = [];
var modalBox = document.querySelector(".modal-box");
var modalContent = document.querySelector(".modal-content");

//check whether old data is present or not?
if(noteDataJson == null || noteDataJson == "") {
    localStorage.setItem("storedNoteData","");
}
else {
    noteFilesArr = JSON.parse(noteDataJson);
    //extract the note data from local storage and then, save it into newly created elements inside the filesContainer
    noteFilesArr.forEach((arrElement) => {
        let noteItem = document.createElement("div");
        noteItem.innerHTML = `<input type="text" placeholder="Add a title..." disabled>
                              <textarea disabled></textarea>`;
        noteItem.children[0].defaultValue = arrElement.title;
        noteItem.children[1].defaultValue = arrElement.content;
        createButtons(noteItem);
        filesContainer.appendChild(noteItem);
    });
}

//operations happen after clicking the "add note" button
function addToContainer() {
    if(editorBox.children[1].value == "");
    else {
        let noteItem = document.createElement("div");
        noteItem.innerHTML = `<input type="text" placeholder="Add a title..." disabled>
                              <textarea disabled></textarea>`;
        noteItem.children[0].defaultValue = editorBox.children[0].value;
        noteItem.children[1].defaultValue = editorBox.children[1].value;
        filesContainer.appendChild(noteItem);
        //clear the editorBox after getting the input
        editorBox.children[0].value = ""; //note title
        editorBox.children[1].value = ""; //note content
        
        //lets create 'update' and 'delete' buttons inside a note item
        createButtons(noteItem);

        //save the noteItem data into local storage
        let noteFileObj = {title: noteItem.children[0].value, content: noteItem.children[1].value};
        noteFilesArr.push(noteFileObj);
        storeDataLocally();//store the data into local storage
    }
}

function createButtons(noteItem) {
    noteItem.innerHTML += `<button class= 'update'>View</button`;
    noteItem.innerHTML += `<button class= 'delete'>Delete</button`;
    noteItem.children[3].addEventListener('click', deleteOperation);
    function deleteOperation() {
        if (confirm("Are you sure! you want to delete this file?")) {
            modalBox.style.visibility = "hidden";
            document.body.style.overflow = "auto";
            let len = noteFilesArr.length
            for(let index = 0; index<=len; index++) {
                if((noteItem.children[0].defaultValue == noteFilesArr[index].title) && (noteItem.children[1].defaultValue == noteFilesArr[index].content)) {
                    noteFilesArr.splice(index,1);
                    break;
                }
            }

            noteItem.remove();
            storeDataLocally();//after deleting, update the data inside the local storage
        }
    }
    // click event on "view" button
    noteItem.children[2].addEventListener('click', () => {
        modalContent.innerHTML = noteItem.innerHTML;
        noteItem.style.visibility = "hidden";
        noteItem.style.opacity = 0;
        modalBox.style.visibility = "visible";
        modalBox.style.opacity = 1;
        modalContent.children[0].style.fontSize = '150%';
        modalContent.children[0].removeAttribute("disabled");
        modalContent.children[1].removeAttribute("disabled");
        modalContent.children[1].style.overflow = "auto";
        modalContent.children[2].innerText = "Close";
        document.body.style.overflow = 'hidden';

        //close the modalBox
        modalContent.children[2].addEventListener('click', closeModal);
        function closeModal() {
            noteItem.style.visibility = "visible";
            noteItem.style.opacity = 1;
            modalBox.style.visibility = "hidden";
            modalBox.style.opacity = 0;
            document.body.style.overflow = 'auto';
            if(modalContent.children[0].value != noteItem.children[0].defaultValue || modalContent.children[1].value != noteItem.children[1].defaultValue) {
                noteItem.children[0].value = modalContent.children[0].value;
                noteItem.children[1].value = modalContent.children[1].value;

                //find a note file of which content was changed in the noteFilesArr, then update it.
                let len = noteFilesArr.length;
                for(let index = 0; index<=len; index++) {
                    if((noteItem.children[0].defaultValue == noteFilesArr[index].title) && (noteItem.children[1].defaultValue == noteFilesArr[index].content)) {
                        noteFilesArr[index].title = noteItem.children[0].value;
                        noteFilesArr[index].content = noteItem.children[1].value;
                        break;
                    }
                }
                storeDataLocally();
            }
        }
        window.onclick = (event) => {
            if(event.target == modalBox) {
                closeModal();
            }
        };

        // click event on "delete" button inside the "Modal Box"
        modalContent.children[3].addEventListener("click", () => {
            deleteOperation();
        });
    });
}

function storeDataLocally() {
    noteDataJson = JSON.stringify(noteFilesArr);
    localStorage.setItem("storedNoteData", noteDataJson);
}