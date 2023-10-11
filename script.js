let Table = document.querySelector("table")
let TableBody = document.querySelector("tbody")
let monthHeading = document.querySelector("#month-heading")
let leftArrow = document.querySelector("#left-arrow")
let rightArrow = document.querySelector("#right-arrow")

let months = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"]
let m = -1;
let year = 2566;

let CurrentMonth;
let CurrentClickedDay;
let SelectedBox_ArrayData;
let SelectedBoxID = null;

let CurrentMonthtdElements = [];

let CurrentData = [];

let CurrentUsername = null;

const loginStatus = document.querySelector("#loginStatus")

const LoginForm = document.getElementById('LoginForm')
const GuestButton = document.getElementById('guestbtn');
const LoginToggle = document.getElementById('gologin');  
const SignInToggle = document.getElementById('signinbtn');

const LoginButton = document.querySelector("#loginbtn");
const SignInButton = document.getElementById('signinnew');

const LoginHeading = document.querySelector("#LoginHeading")

const DeleteData = document.querySelector("#DeleteData")

let ButtonState = false;

let id_user = null;

let TodoList_Div = document.querySelector(".List")
let TodoListAdd_Button = document.querySelector("#todo-listAddButton")

let CurrentDayIndicate = document.querySelector("#CurrentDayIndicate")

let TaskAddEnable = false

DeleteData.addEventListener("click", () => {
    if (TaskAddEnable == true){
        if (SelectedBoxID != null){
            TaskAddEnable = false;
            delete_item(SelectedBoxID)
    
            setTimeout(function(){
                LoadCurrentUserData()
                CurrentMonthtdElements[CurrentClickedDay - 1].className = "Month_TableData"
                TaskAddEnable = true;
            }, 1000)
        }
    }
})

function FindSelectedDate_Data(){
    console.log(CurrentData)
    if (CurrentData != null && CurrentData.length != 0){
        for (let i = 0; i < CurrentData.length; i++){
            if (CurrentData[i].day == CurrentClickedDay && CurrentData[i].month == CurrentMonth && CurrentData[i].year == year){
                console.log(CurrentData[i].todo)
                if (CurrentUsername != null) SelectedBoxID = CurrentData[i]._id;
                return CurrentData[i].todo
            }
        }
        console.log("None")
        if (CurrentUsername != null) SelectedBoxID = null;
        return null;
    }
}

TodoListAdd_Button.addEventListener("click", () => {
    if (TaskAddEnable == true){
        TaskAddEnable = false;

        TodoListAdd_Button.style.display = "none"

        let AddButton = document.createElement("button")
        AddButton.innerText = "Add"
        AddButton.id = "task-addButton"
        document.querySelector("#todo-listAddButton").parentElement.appendChild(AddButton)

        let TaskName_Input = document.createElement("input")
        
        TaskName_Input.placeholder = "Enter your task"
        TaskName_Input.id = "#TaskName-Input"
        TodoList_Div.appendChild(TaskName_Input)

        let CancelButton = document.createElement("button")
        CancelButton.innerText = "Cancel"
        CancelButton.id = "task-cancelButton"
        CancelButton.style = "margin-left: 2%"
        document.querySelector("#todo-listAddButton").parentElement.appendChild(CancelButton)
        
        function reset(){
            AddButton.remove()
            CancelButton.remove()
            TaskName_Input.remove()
            TodoListAdd_Button.style.display = null;
            TaskAddEnable = true
        }
        CancelButton.addEventListener("click", () => {
            reset()
        })

        AddButton.addEventListener("click", () => {
            let NewTask = TaskName_Input.value
            if (NewTask.length > 0){
                reset()

                let newTask = document.createElement("p")
                newTask.className = "Task"
                newTask.innerText = NewTask

                TodoList_Div.appendChild(newTask)

                console.log("Added value :", NewTask)
                console.log("Added to box id :", SelectedBoxID)

                if (CurrentUsername != null){
                    if (SelectedBoxID != null){
                        update_item(SelectedBox_ArrayData, NewTask, SelectedBoxID)
                    } else {
                        createitem(CurrentClickedDay, CurrentMonth, year, NewTask)
                        CurrentMonthtdElements[CurrentClickedDay - 1].className = "Month_TableData_Marked"
                    }
    
                    setTimeout(function(){
                        LoadCurrentUserData()
                    }, 500)
                } else {
                    let DateData = FindSelectedDate_Data()
                    console.log(DateData)
                    if (DateData == null){
                        CurrentData[CurrentData.length] = {
                            day: CurrentClickedDay,
                            month: CurrentMonth,
                            year: year,
                            todo: [NewTask]
                        }
                        CurrentMonthtdElements[CurrentClickedDay - 1].className = "Month_TableData_Marked"
                    } else {
                        for (let i = 0; i < CurrentData.length; i++){
                            if (CurrentData[i].day == CurrentClickedDay && CurrentData[i].month == CurrentMonth && CurrentData[i].year == year){
                                DateData[DateData.length] = NewTask;
                                CurrentData[i].todo = DateData;
                                break;
                            }
                        }
                    }
                }
            }
        })
    }
})

function OnLoadListOfDay(){
    CurrentDayIndicate.innerText = `Selected day : ${CurrentClickedDay} ${months[CurrentMonth - 1]} ${year}`
    const TasksLength = TodoList_Div.children.length
    for (let i = 0; i < TasksLength; i++){
        TodoList_Div.children[0].remove()
    }
    
    SelectedBox_ArrayData = FindSelectedDate_Data();
    if (SelectedBox_ArrayData != null){       
        function AddTask(TaskName){
            let newTask = document.createElement("p")
            newTask.className = "Task"
            newTask.innerText = TaskName

            TodoList_Div.appendChild(newTask)
        }

        for (let j = 0; j < SelectedBox_ArrayData.length; j++){
            AddTask(SelectedBox_ArrayData[j])
        }
    }

    TaskAddEnable = true
}
function RefreshCalendar(days, FirstDay, realmonth, christyear){
    CurrentMonthtdElements = []

    const length = TableBody.children.length
    for (let i = 0; i < length; i++)
        TableBody.children[0].remove()
    for (let i = 0; i < 6; i++){
        let newTableRow = document.createElement("tr")
        newTableRow.className = "table-row"
        for (let j = 0; j < 7; j++){
            let newTableCell = document.createElement("td")
            newTableRow.appendChild(newTableCell)
        }
        Table.children[1].appendChild(newTableRow);
    }
    /* background-color: rgb(217, 217, 217);  grey-color */
    let n = 0;
    let daycount = 0;
    let isstart = false;
    let currentDayOrder
    for (let i = 0; i < 6; i++){
        let TableRow = TableBody.children[i]
        for (let j = 0; j < 7; j++){
            const currentDayBox = TableRow.children[j]
            
            currentDayOrder = j;
            currentDayOrder++;
            if (currentDayOrder == 7) currentDayOrder = 0;
            
            if (currentDayOrder == FirstDay) isstart = true;
            if (daycount < days && isstart == true){
                const currentDay = ++daycount;

                currentDayBox.style.cursor = "pointer"
                currentDayBox.addEventListener("click", () => {
                    console.log(currentDay, currentDayBox.className)
                    CurrentClickedDay = currentDay
                    OnLoadListOfDay()
                })
                currentDayBox.addEventListener("mousedown", () => {
                    currentDayBox.style.opacity = 0.6
                })
                currentDayBox.addEventListener("mouseup", () => {
                    currentDayBox.style.opacity = 1
                })
                currentDayBox.addEventListener("mouseover", () => {
                    /* console.log("mouse enter", currentDayBox.style.height, currentDayBox.style.width) */
                    currentDayBox.style.opacity = 0.8
                })
                currentDayBox.addEventListener("mouseout", () => {
                    /* console.log("mouse left", currentDay) */
                    currentDayBox.style.opacity = 1
                })

                currentDayBox.className = "Month_TableData"
                currentDayBox.innerText = ++n;
                CurrentMonthtdElements[CurrentMonthtdElements.length] = currentDayBox
            } else {
                if (isstart == true){
                    if (++n > days) n = 1;
                    currentDayBox.innerText = n;
                }
            }
        }
    }
    /* console.log(CurrentMonthtdElements)
    /* add day number for before and next month */
    currentDayOrder = FirstDay
    if (currentDayOrder == 0) currentDayOrder = 7;
    currentDayOrder--;
    let mbefore = realmonth - 1;
    if (mbefore < 1) mbefore = 12; 
    let mbefore_days = getDaysAmount(mbefore, christyear)
    for (let i = mbefore_days - currentDayOrder; i < mbefore_days; i++){
        TableBody.children[0].children[i - (mbefore_days - currentDayOrder)].innerText = i + 1;
    }

    LoadCurrentMonth_UserData()

    /* */
}

function getDaysAmount(realmonth, christyear){
    let days;
    if (realmonth == 4 || realmonth == 6 || realmonth == 9 || realmonth == 11){
        days = 30
    } else if (realmonth == 2){
        if ((christyear % 4 == 0 && christyear % 100 != 0) || christyear % 400 == 0){
            days = 29
        } else days = 28
    } else {
        days = 31
    }
    return days;
}

function ChangeMonth(status){
    m += status
    if (m < 0){
        m = 11;
        year--;
    }
    if (m > 11){
        m = 0;
        year++;
    }

    monthHeading.innerHTML = months[m] + " " + year

    let realmonth = m + 1;
    CurrentMonth = realmonth;
    let christyear = year - 543;
    let days = getDaysAmount(realmonth, christyear);

    let stringMonth = "0" + realmonth
    stringMonth = stringMonth.substring(stringMonth.length - 2)

    let date = new Date(christyear + "-" + stringMonth + "-01T00:00:00");
    let getDay = date.getDay();

    console.log(getDay)

    RefreshCalendar(days, getDay, realmonth, christyear)
}

leftArrow.addEventListener("click", () => {
    ChangeMonth(-1)
})
rightArrow.addEventListener("click", () => {
    ChangeMonth(1)
})

ChangeMonth(1)

function LoadCurrentMonth_UserData(){
    if (CurrentData != null){
        console.log(CurrentData, CurrentData.length);
        if (CurrentData.length != 0){
            for (let i = 0; i < CurrentData.length; i++){
                if (CurrentData[i].month == CurrentMonth && CurrentData[i].year == year){
                    const todo_Array = CurrentData[i].todo
                    
                    CurrentMonthtdElements[CurrentData[i].day - 1].className = "Month_TableData_Marked"
                    for (let j = 0; j < todo_Array.length; j++){
                        console.log(todo_Array[j])
                        /* let newText = document.createElement("p")
                        newText.innerText = todo_Array[j]
                        CurrentMonthtdElements[CurrentData[i].day - 1].appendChild(newText)
                        */
                    }
                    console.log("----------")
                }
            }
        }
    } else { /* For guest */

    }
}

function LoadCurrentUserData(){
    console.log(id_user)
    if (id_user != null){
        getAlltodolist()
            .then(function(result){
                CurrentData = result.itemformID
                LoadCurrentMonth_UserData()
            })
    }
}

function LoginErrorDisplay(text, duration){
    loginStatus.innerText = text
    loginStatus.style.display = "block"

    setTimeout(function(){
        loginStatus.style.display = "none"
    }, duration * 1000)
}

LoginButton.addEventListener('click', () => {
    if (ButtonState == false){
        ButtonState = true

        let Username = document.querySelector("#username").value
        let Password = document.querySelector("#psw").value
        data = {userName: Username, password: Password}
        console.log(Username, Password);
        id_user = Login(Username, Password)
        .then(function(result){
            for (var key in result) {
                if (key != "error"){
                    id_user = result[key]
                    console.log(id_user)
                    closeForm()
                    LoadCurrentUserData()

                    CurrentUsername = Username
                    document.querySelector(".open-button").innerHTML = CurrentUsername
                } else {
                    LoginErrorDisplay("Incorrect password or username", 2)

                    /* Incorrect Username/Password */
                }
                break;
            }
        })

        setTimeout(function(){
            ButtonState = false
        }, 1000)
    }
});

async function Login(Username, Password) {
    const body = {
        "userName":Username,
        "password":Password
    };
    let s = await fetch('http://localhost:5000/api/users/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    return await s.json();
}

async function createitem(d, m, y, newTask) {
    const body = {
    "day": d,
    "month": m,
    "year": y,
    "id_user":id_user,
    "todo":[newTask]
    };
    await fetch('http://localhost:5000/api/items/create', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    return ;
 }

async function createuser(SignIn_Username, SignIn_Password) {
    const data = {
    "name": " ",
    "userName": SignIn_Username,
    "password": SignIn_Password
    };
    console.log(data)
    try {
        await fetch('http://localhost:5000/api/users/create', {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        return "Completed";
    } catch {
        return "Error"
    }
 }

 async function update_item(prevData, newTask, idbox) {
    let DataToOverwrite = prevData
    DataToOverwrite[DataToOverwrite.length] = newTask
    const body = {
        "todo":DataToOverwrite
    };
    await fetch(`http://localhost:5000/api/items/put/${idbox}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    return ;
 }

 async function delete_item(idbox) {
    await fetch(`http://localhost:5000/api/items/delete/${idbox}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
    return ;
 }

 async function getAlltodolist(month, year) {
    let todolist = await fetch(`http://localhost:5000/api/items/get/${id_user}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
    return todolist.json();
 }

 SignInButton.addEventListener("click", () => {
    if (ButtonState == false){
        ButtonState = true

        let Username = document.querySelector("#username").value
        let Password = document.querySelector("#psw").value
        data = {userName: Username, password: Password}
        console.log(Username, Password);
        Login(Username, Password)
        .then(function(result){
            for (var key in result) {
                if (key == "error" && result[key] == "Username not found"){
                    console.log("No account registered yet")
                    createuser(Username, Password)
                        .then(function(status){
                            console.log(status)
                            if (status == "Completed"){
                                gotoLogin()
                            }
                        })
                    /* id_user = result[key]
                    console.log(id_user)
                    closeForm()
                    LoadCurrentUserData()
                    */
                } else {
                    LoginErrorDisplay("There is already an account with this username.", 3)
                    console.log("There is already account registed")
                    /* Incorrect Username/Password */
                }
                break;
            }
        })

        setTimeout(function(){
            ButtonState = false
        }, 1000)
    }
 })


  
function closeForm() {
    LoginForm.style.display = "none";
    calendar.style.display = "flex";
}

function gotoSignIn(){
    LoginHeading.innerText = "Sign Up"
    GuestButton.style.display = "none";
    LoginButton.style.display = "none";
    SignInToggle.style.display = "none";
    SignInButton.style.display = "block";
    LoginToggle.style.display = "block";
}

function gotoLogin(){
    LoginHeading.innerText = "Login"
    GuestButton.style.display = "block";
    LoginButton.style.display = "block";
    SignInToggle.style.display = "block";
    SignInButton.style.display = "none";
    LoginToggle.style.display = "none";
}
    
SignInToggle.addEventListener("click", gotoSignIn)

LoginToggle.addEventListener("click", gotoLogin)
