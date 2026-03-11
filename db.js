```javascript
let db

let request=indexedDB.open("ledgerDB",1)

request.onupgradeneeded=e=>{
db=e.target.result
db.createObjectStore("transactions",{keyPath:"id"})
}

request.onsuccess=e=>{
db=e.target.result
renderTransactions()
}
```
