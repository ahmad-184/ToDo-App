const input = document.querySelector("#input"),
btn = document.querySelector("#Btn"),
container = document.querySelector("#container")
const body = document.querySelector("body")
const alertText = document.querySelector("#alertText")
const puphops =document.querySelector("#puphops")
const closePop = document.querySelector("#closePop")
const returnListBtn = document.querySelector("#returnList")
const historySection = document.querySelector("#historysection")
const historyContainer = document.querySelector("#historyContainer")
const Hbutton = document.querySelector("#Hbutton")
const cListBtn = document.querySelector("#Cbutton")
const cAllfromDB = document.querySelector("#clDbbutton")
// const singlebox = document.querySelectorAll(".singleBox")
const containerFirst = document.querySelector(".container")

class buildBox {
    constructor(text,historyContainer) {
        this.text = text
        this.historyContainer = historyContainer
    }

    builder(cont,date,dataKey = "") {
        const buildboxes = (cont,date,dataKey) => {
            const date1 = new Date()
            const mainBox = document.createElement("div")
            mainBox.className = "singleBox"
            const secondBox = document.createElement("div")
            secondBox.className = "box"
            const thirdbox = document.createElement("div")
            thirdbox.className = "text"
            const span = document.createElement("span")
            span.id = "Data&Clock"
            span.className = "DataClock"
            const p = document.createElement("p")
            p.className = "closeBtn"
            const p2 = document.createElement("p")
            p2.className = 'returnBtn'

            p.setAttribute("data-key", dataKey)
            
            const val = p.getAttribute('data-key')
            if(val.length != '') {
                p.innerHTML = `<span><img src="images/recycleBin.png" alt=""></span>`
                p2.innerHTML = `<img src="images/Return Icons/return (1).png" alt="">`

            } else {p.innerHTML = `<span><i class="fas fa-times"></i></span>`}
            
            thirdbox.innerText = this.text
            span.innerText = date || `${date1.getFullYear()}-${date1.getDate()}-${date1.getMonth()} , ${date1.getHours()}:${date1.getMinutes()}:${date1.getSeconds()}`
        
            mainBox.appendChild(secondBox)
            secondBox.appendChild(thirdbox)
            secondBox.appendChild(span)
            secondBox.appendChild(p)
            secondBox.appendChild(p2)

            const events = () => {
                const key = p.getAttribute('data-key')
                mainBox.addEventListener("click", () => {
                    if(key.length == '') { mainBox.classList.toggle("active") }
                })
                p2.addEventListener("click",() => {
                    if(key.length != '') { returnBoxToMainpage(key) }
                })
                p.addEventListener("click", () => {
                    if(key.length != '') {
                        localforage.removeItem(key)
                    } else {console.log('empty');}
                    cont.removeChild(mainBox)
                })
            }
            events()

            cont.appendChild(mainBox)
        }
        buildboxes(cont,date,dataKey)
    }

    saveDetailToDB() {
        const date = new Date()
        const textValue = this.text
        const obj = {
            textValue: textValue,
            dateAndClock: `${date.getFullYear()}-${date.getDate()}-${date.getMonth()} , ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        }
        localforage.length().then(data => {
            let string = `ToDo${data}`
            localforage.setItem(string,obj).then(data => {
                console.log(string,data);
            })
        })
    }

    static returnOldLists() {
        localforage.length().then(num => {
            buildOldlist(num > 0)
        })
        const buildOldlist = (num) => {
            if (num == true) {
                newBuilder()
            } else {return}
        }
        const newBuilder = () => {
            container.innerHTML = ""
            localforage.iterate((value,key,iterationNumber) => {
                const date1 = new Date()
                const one = new buildBox(value.textValue,historyContainer)
                one.builder(container, value.dateAndClock)
            })
        }
    }
}

btn.addEventListener("click",() => clicked())
const clicked = () => {
    if(input.value == "") {
        alertText.style.display="block"
        setTimeout(() => {
            alertText.style.display="none"
        }, 2500);
        return
    } else {
        const one = new buildBox(input.value,historyContainer)
        one.builder(container)
        one.saveDetailToDB()
        const builderHistory = () => {
            setTimeout(() => {
                historyContainer.innerHTML =""
                localforage.iterate((value,key,iterationNumber) => {
                const two = new buildBox(value.textValue,historyContainer)
                two.builder(historyContainer, value.dateAndClock, key)
            })
            }, 200);
        }
        builderHistory()
    }

    input.value = ""
    ohShit()
}

const checkLenghtDB = () => {
    setTimeout(() => {
        puphops.style.display ="block"
        setTimeout(() => {
            puphops.style.transform ="translateY(0%)"
        }, 100);
    }, 2000);
}

window.addEventListener("load", () => {
    document.addEventListener("keydown", e => {
        if(e.code == "Escape") { input.value = "" }
        if(e.code == "Enter") { clicked() }
    })
    localforage.length().then(num => {
        if(num > 0) {
            checkLenghtDB()
        }
    })
    closePop.addEventListener("click",() => {
        puphops.style.transform ="translateY(100%)"
        setTimeout(() => {
            puphops.style.display ="block"
        }, 600);
    })
    returnListBtn.addEventListener("click", () => {
        buildBox.returnOldLists()
        puphops.style.transform ="translateY(100%)"
        setTimeout(() => {
            puphops.style.display ="block"
        }, 600);
    })
    Hbutton.addEventListener("click", () => {
        historySection.classList.toggle("height")
        containerFirst.classList.toggle("scrollhidden")
    })
    cListBtn.addEventListener("click", () => container.innerHTML = "")
    cAllfromDB.addEventListener("click", () => {
        localforage.clear()
        historyContainer.innerHTML = ""
    })
    const builderHistory = () => {
        localforage.iterate((value,key,iterationNumber) => {
            const two = new buildBox(value.textValue,historyContainer)
            two.builder(historyContainer, value.dateAndClock, key)
        })
    }
    builderHistory()
})

document.addEventListener("DOMContentLoaded", () => ohShit())
const ohShit = () => {
    // const btnP = document.getElementsByClassName("closeBtn")
}

const returnBoxToMainpage = (item) => {
    localforage.getItem(item).then((value,key) => {
        console.log(`text : ${value.textValue}, data : ${value.dateAndClock}`);
        const three = new buildBox(value.textValue,historyContainer)
        three.builder(container, value.dateAndClock)
    })
}