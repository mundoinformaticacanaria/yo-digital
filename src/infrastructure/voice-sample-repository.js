const DEFAULT_DB_NAME = "yo_digital_voice_v2";
const DEFAULT_STORE_NAME = "samples";

function requestToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function transactionToPromise(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

export class IndexedDbVoiceSampleRepository {
  constructor({ dbName = DEFAULT_DB_NAME, storeName = DEFAULT_STORE_NAME } = {}) {
    this.dbName = dbName;
    this.storeName = storeName;
  }

  async open() {
    const request = indexedDB.open(this.dbName, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(this.storeName)) {
        db.createObjectStore(this.storeName, { keyPath: "id" });
      }
    };

    return requestToPromise(request);
  }

  async save(sample) {
    const db = await this.open();
    try {
      const transaction = db.transaction(this.storeName, "readwrite");
      transaction.objectStore(this.storeName).put(sample);
      await transactionToPromise(transaction);
    } finally {
      db.close();
    }
  }

  async findAll() {
    const db = await this.open();
    try {
      const transaction = db.transaction(this.storeName, "readonly");
      const request = transaction.objectStore(this.storeName).getAll();
      const samples = await requestToPromise(request);
      return samples.sort((left, right) => right.timestamp - left.timestamp);
    } finally {
      db.close();
    }
  }

  async remove(id) {
    const db = await this.open();
    try {
      const transaction = db.transaction(this.storeName, "readwrite");
      transaction.objectStore(this.storeName).delete(id);
      await transactionToPromise(transaction);
    } finally {
      db.close();
    }
  }

  async clear() {
    const db = await this.open();
    try {
      const transaction = db.transaction(this.storeName, "readwrite");
      transaction.objectStore(this.storeName).clear();
      await transactionToPromise(transaction);
    } finally {
      db.close();
    }
  }
}
