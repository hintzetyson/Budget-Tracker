let db;

window.addEventListener("online", onlineCheck);

const index = indexedDB.open("budget", 1);

//runs if an upgrade is needed
index.onupgradeneeded = (event) => {
  const db = event.target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

//Runs if there is an error
index.onerror = (event) => {
  console.log(`There was an error with the code: ${event.target.errorcode}`);
};

index.onsuccess = (event) => {
  db = event.target.result;

  if (navigator.onLine) {
    //Looks in the database to see if anything is online
    onlineCheck();
  }
};

function onlineCheck() {
  const transaction = db.transaction(["pending"], "readwrite");

  const store = transaction.objectStore("pending");

  const getAll = store.getAll();

  //This is what to do if there is actually something within indexedDB
  getAll.onsuccess = () => {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          res.json();
        })
        .then(() => {
          const transaction = db.transaction(["pending"], "readwrite");

          const store = transaction.objectStore("pending");

          store.clear();
        });
    }
  };
}

function saveData(data) {
  const transaction = db.transaction(["pending"], "readwrite");

  const store = transaction.objectStore("pending");

  store.add(data);
}
