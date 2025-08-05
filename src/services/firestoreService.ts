import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  WhereFilterOp,
  OrderByDirection,
} from 'firebase/firestore';
import { db } from './firebase';

export interface FirestoreError {
  code: string;
  message: string;
}

export const firestoreService = {
  // Get a single document
  async getDocument<T>(collectionName: string, docId: string): Promise<T | null> {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  },

  // Get all documents from a collection
  async getDocuments<T>(collectionName: string): Promise<T[]> {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];
  },

  // Add a new document
  async addDocument<T>(collectionName: string, data: T): Promise<string> {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  },

  // Update a document
  async updateDocument<T>(collectionName: string, docId: string, data: Partial<T>): Promise<void> {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
  },

  // Delete a document
  async deleteDocument(collectionName: string, docId: string): Promise<void> {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  },

  // Listen to real-time updates for a single document
  onDocumentSnapshot<T>(
    collectionName: string,
    docId: string,
    callback: (data: T | null) => void
  ) {
    const docRef = doc(db, collectionName, docId);
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() } as T);
      } else {
        callback(null);
      }
    });
  },

  // Listen to real-time updates for a collection
  onCollectionSnapshot<T>(
    collectionName: string,
    callback: (data: T[]) => void,
    constraints?: {
      where?: Array<{ field: string; operator: WhereFilterOp; value: unknown }>;
      orderBy?: Array<{ field: string; direction?: OrderByDirection }>;
      limit?: number;
    }
  ) {
    let q = collection(db, collectionName);
    
    if (constraints?.where) {
      constraints.where.forEach(({ field, operator, value }) => {
        q = query(q, where(field, operator, value));
      });
    }
    
    if (constraints?.orderBy) {
      constraints.orderBy.forEach(({ field, direction = 'asc' }) => {
        q = query(q, orderBy(field, direction));
      });
    }
    
    if (constraints?.limit) {
      q = query(q, limit(constraints.limit));
    }
    
    return onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];
      callback(data);
    });
  },
}; 