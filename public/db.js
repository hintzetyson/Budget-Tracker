let db;

window.addEventListener('online', onlineCheck)

function onlineCheck() {
    const transaction = db.transaction(['pending'], 'readwrite');

    const store = transaction.objectStore('pending');

    const getAll = store.getAll();

    getAll.onsuccess = () => {

    }
}