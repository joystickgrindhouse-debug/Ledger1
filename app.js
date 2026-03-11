```javascript
function showTab(tab){

document.querySelectorAll("section").forEach(s=>s.classList.remove("active"))
document.getElementById(tab).classList.add("active")

}

function addTransaction(){

let tx={
id:Date.now(),
desc:desc.value,
amount:Number(amount.value),
type:type.value,
date:date.value
}

let transaction=db.transaction("transactions","readwrite")
transaction.objectStore("transactions").add(tx)

transaction.oncomplete=renderTransactions

}

function getAll(callback){

let tx=db.transaction("transactions")
let store=tx.objectStore("transactions")

let req=store.getAll()

req.onsuccess=()=>callback(req.result)

}

function renderTransactions(){

getAll(data=>{

let searchVal=search.value?.toLowerCase()||""

let container=document.getElementById("transactions")
container.innerHTML=""

let balance=0

data.forEach(t=>{

if(searchVal && !t.desc.toLowerCase().includes(searchVal)) return

if(t.type==="income") balance+=t.amount
if(t.type==="expense") balance-=t.amount

let div=document.createElement("div")
div.className="transaction"

div.innerHTML=`${t.desc} - $${t.amount}`

container.appendChild(div)

})

balanceEl.innerText="$"+balance

renderDebts(data)
renderChart(data)

})

}

function renderDebts(data){

let el=document.getElementById("debtList")
el.innerHTML=""

data.filter(t=>t.type==="owed"||t.type==="owe")
.forEach(t=>{

el.innerHTML+=`<div class="transaction">${t.desc} $${t.amount}</div>`

})

}

function calendarView(){

let date=calendarDate.value

getAll(data=>{

let res=document.getElementById("calendarResults")

res.innerHTML=""

data.filter(t=>t.date===date)
.forEach(t=>{

res.innerHTML+=`<div>${t.desc} $${t.amount}</div>`

})

})

}

function renderChart(data){

let income=0
let expense=0

data.forEach(t=>{

if(t.type==="income") income+=t.amount
if(t.type==="expense") expense+=t.amount

})

new Chart(chart,{
type:"pie",
data:{
labels:["Income","Expense"],
datasets:[{data:[income,expense]}]
}
})

}

function exportCSV(){

getAll(data=>{

let csv="desc,amount,type,date\n"

data.forEach(t=>{
csv+=`${t.desc},${t.amount},${t.type},${t.date}\n`
})

let blob=new Blob([csv])

let a=document.createElement("a")
a.href=URL.createObjectURL(blob)
a.download="ledger.csv"
a.click()

})

}

function exportData(){

getAll(data=>{

let blob=new Blob([JSON.stringify(data)])

let a=document.createElement("a")
a.href=URL.createObjectURL(blob)
a.download="ledger-backup.json"
a.click()

})

}

function importData(e){

let file=e.target.files[0]

let reader=new FileReader()

reader.onload=()=>{

let data=JSON.parse(reader.result)

let tx=db.transaction("transactions","readwrite")

let store=tx.objectStore("transactions")

data.forEach(d=>store.put(d))

}

reader.readAsText(file)

}

