import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  WhereFilterOp,
  OrderByDirection,
  Query,
  DocumentData,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Course, CreateCourseData, UpdateCourseData } from '../types/course';
import { ClassInstance, CreateClassInstanceData, UpdateClassInstanceData } from '../types/classInstance';
import { User, UpdateUserProfileData } from '../types/user';

export interface FirestoreError {
  code: string;
  message: string;
}

export interface QueryConstraints {
  where?: Array<{ field: string; operator: WhereFilterOp; value: unknown }>;
  orderBy?: Array<{ field: string; direction?: OrderByDirection }>;
  limit?: number;
}

export interface FirestoreResponse<T> {
  data: T | null;
  error: FirestoreError | null;
}

export interface FirestoreListResponse<T> {
  data: T[];
  error: FirestoreError | null;
  totalCount: number;
}

// Generic Firestore Service
export const firestoreService = {
  // Generic CRUD operations
  async getDocument<T>(collectionName: string, docId: string): Promise<FirestoreResponse<T>> {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return { 
          data: { ...data, firebaseId: docSnap.id } as T, 
          error: null 
        };
      }
      return { data: null, error: null };
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'GET_DOCUMENT_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error occurred'
        }
      };
    }
  },

  async getDocuments<T>(collectionName: string, constraints?: QueryConstraints): Promise<FirestoreListResponse<T>> {
    try {
      let q: Query<DocumentData> = collection(db, collectionName);
      
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
      
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => {
        const docData = doc.data();
        return { ...docData, firebaseId: doc.id } as T;
      });
      
      return { 
        data, 
        error: null, 
        totalCount: querySnapshot.size 
      };
    } catch (error) {
      return {
        data: [],
        error: {
          code: 'GET_DOCUMENTS_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error occurred'
        },
        totalCount: 0
      };
    }
  },

  async addDocument<T>(collectionName: string, data: T): Promise<FirestoreResponse<{ id: string; firebaseId: string }>> {
    try {
      // Filter out undefined values from the data
      const cleanData = Object.fromEntries(
        Object.entries(data as any).filter(([_, value]) => value !== undefined)
      );
      
      const docRef = await addDoc(collection(db, collectionName), {
        ...cleanData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return { 
        data: { id: docRef.id, firebaseId: docRef.id }, 
        error: null 
      };
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'ADD_DOCUMENT_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error occurred'
        }
      };
    }
  },

  // Add document with specific ID (for users collection)
  async addDocumentWithId<T>(collectionName: string, docId: string, data: T): Promise<FirestoreResponse<{ id: string; firebaseId: string }>> {
    try {
      const docRef = doc(db, collectionName, docId);
      
      // Filter out undefined values from the data
      const cleanData = Object.fromEntries(
        Object.entries(data as any).filter(([_, value]) => value !== undefined)
      );
      
      await setDoc(docRef, {
        ...cleanData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return { 
        data: { id: docId, firebaseId: docId }, 
        error: null 
      };
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'ADD_DOCUMENT_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error occurred'
        }
      };
    }
  },

  async updateDocument<T>(collectionName: string, docId: string, data: Partial<T>): Promise<FirestoreResponse<void>> {
    try {
      const docRef = doc(db, collectionName, docId);
      
      // Filter out undefined values from the data
      const cleanData = Object.fromEntries(
        Object.entries(data as any).filter(([_, value]) => value !== undefined)
      );
      
      await updateDoc(docRef, {
        ...cleanData,
        updatedAt: serverTimestamp()
      });
      
      return { data: undefined, error: null };
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'UPDATE_DOCUMENT_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error occurred'
        }
      };
    }
  },

  async deleteDocument(collectionName: string, docId: string): Promise<FirestoreResponse<void>> {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
      
      return { data: undefined, error: null };
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'DELETE_DOCUMENT_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error occurred'
        }
      };
    }
  },

  // Real-time listeners
  onDocumentSnapshot<T>(
    collectionName: string,
    docId: string,
    callback: (data: T | null, error: FirestoreError | null) => void
  ) {
    const docRef = doc(db, collectionName, docId);
    return onSnapshot(
      docRef,
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          callback({ ...data, firebaseId: doc.id } as T, null);
        } else {
          callback(null, null);
        }
      },
      (error) => {
        callback(null, {
          code: 'SNAPSHOT_ERROR',
          message: error.message
        });
      }
    );
  },

  onCollectionSnapshot<T>(
    collectionName: string,
    callback: (data: T[], error: FirestoreError | null) => void,
    constraints?: QueryConstraints
  ) {
    let q: Query<DocumentData> = collection(db, collectionName);
    
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
    
    return onSnapshot(
      q,
      (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => {
          const docData = doc.data();
          return { ...docData, firebaseId: doc.id } as T;
        });
        callback(data, null);
      },
      (error) => {
        callback([], {
          code: 'SNAPSHOT_ERROR',
          message: error.message
        });
      }
    );
  },

  // Batch operations
  async batchWrite(operations: Array<{
    type: 'add' | 'update' | 'delete';
    collection: string;
    docId?: string;
    data?: any;
  }>): Promise<FirestoreResponse<void>> {
    try {
      const batch = writeBatch(db);
      
      operations.forEach(({ type, collection: collectionName, docId, data }) => {
        if (type === 'add') {
          const docRef = doc(collection(db, collectionName));
          batch.set(docRef, {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        } else if (type === 'update' && docId) {
          const docRef = doc(db, collectionName, docId);
          batch.update(docRef, {
            ...data,
            updatedAt: serverTimestamp()
          });
        } else if (type === 'delete' && docId) {
          const docRef = doc(db, collectionName, docId);
          batch.delete(docRef);
        }
      });
      
      await batch.commit();
      return { data: undefined, error: null };
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'BATCH_WRITE_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error occurred'
        }
      };
    }
  }
};

// Courses Collection Service
export const coursesService = {
  // Get course by Firebase ID
  async getCourseByFirebaseId(firebaseId: string): Promise<FirestoreResponse<Course>> {
    return firestoreService.getDocument<Course>('courses', firebaseId);
  },

  // Get course by numeric ID
  async getCourseById(id: number): Promise<FirestoreResponse<Course>> {
    const result = await firestoreService.getDocuments<Course>('courses', {
      where: [{ field: 'id', operator: '==', value: id }]
    });
    
    if (result.error) {
      return { data: null, error: result.error };
    }
    
    return { data: result.data[0] || null, error: null };
  },

  // Get all courses
  async getAllCourses(constraints?: QueryConstraints): Promise<FirestoreListResponse<Course>> {
    return firestoreService.getDocuments<Course>('courses', constraints);
  },

  // Create new course
  async createCourse(data: CreateCourseData): Promise<FirestoreResponse<Course>> {
    const result = await firestoreService.addDocument('courses', data);
    
    if (result.error) {
      return { data: null, error: result.error };
    }
    
    // Fetch the created course to return complete data
    return this.getCourseByFirebaseId(result.data!.firebaseId);
  },

  // Update course
  async updateCourse(firebaseId: string, data: UpdateCourseData): Promise<FirestoreResponse<void>> {
    return firestoreService.updateDocument('courses', firebaseId, data);
  },

  // Delete course
  async deleteCourse(firebaseId: string): Promise<FirestoreResponse<void>> {
    return firestoreService.deleteDocument('courses', firebaseId);
  },

  // Real-time listeners
  onCourseSnapshot(firebaseId: string, callback: (course: Course | null, error: FirestoreError | null) => void) {
    return firestoreService.onDocumentSnapshot<Course>('courses', firebaseId, callback);
  },

  onCoursesSnapshot(callback: (courses: Course[], error: FirestoreError | null) => void, constraints?: QueryConstraints) {
    return firestoreService.onCollectionSnapshot<Course>('courses', callback, constraints);
  }
};

// Instances Collection Service
export const instancesService = {
  // Get instance by Firebase ID
  async getInstanceByFirebaseId(firebaseId: string): Promise<FirestoreResponse<ClassInstance>> {
    return firestoreService.getDocument<ClassInstance>('instances', firebaseId);
  },

  // Get instance by numeric ID
  async getInstanceById(id: number): Promise<FirestoreResponse<ClassInstance>> {
    const result = await firestoreService.getDocuments<ClassInstance>('instances', {
      where: [{ field: 'id', operator: '==', value: id }]
    });
    
    if (result.error) {
      return { data: null, error: result.error };
    }
    
    return { data: result.data[0] || null, error: null };
  },

  // Get instances by course ID
  async getInstancesByCourseId(courseId: number): Promise<FirestoreListResponse<ClassInstance>> {
    return firestoreService.getDocuments<ClassInstance>('instances', {
      where: [{ field: 'courseId', operator: '==', value: courseId }]
    });
  },

  // Get all instances
  async getAllInstances(constraints?: QueryConstraints): Promise<FirestoreListResponse<ClassInstance>> {
    return firestoreService.getDocuments<ClassInstance>('instances', constraints);
  },

  // Create new instance
  async createInstance(data: CreateClassInstanceData): Promise<FirestoreResponse<ClassInstance>> {
    const result = await firestoreService.addDocument('instances', data);
    
    if (result.error) {
      return { data: null, error: result.error };
    }
    
    // Fetch the created instance to return complete data
    return this.getInstanceByFirebaseId(result.data!.firebaseId);
  },

  // Update instance
  async updateInstance(firebaseId: string, data: UpdateClassInstanceData): Promise<FirestoreResponse<void>> {
    return firestoreService.updateDocument('instances', firebaseId, data);
  },

  // Delete instance
  async deleteInstance(firebaseId: string): Promise<FirestoreResponse<void>> {
    return firestoreService.deleteDocument('instances', firebaseId);
  },

  // Real-time listeners
  onInstanceSnapshot(firebaseId: string, callback: (instance: ClassInstance | null, error: FirestoreError | null) => void) {
    return firestoreService.onDocumentSnapshot<ClassInstance>('instances', firebaseId, callback);
  },

  onInstancesSnapshot(callback: (instances: ClassInstance[], error: FirestoreError | null) => void, constraints?: QueryConstraints) {
    return firestoreService.onCollectionSnapshot<ClassInstance>('instances', callback, constraints);
  }
};

// Users Collection Service
export const usersService = {
  // Get user by ID (string)
  async getUserById(id: string): Promise<FirestoreResponse<User>> {
    return firestoreService.getDocument<User>('users', id);
  },

  // Get user by email
  async getUserByEmail(email: string): Promise<FirestoreResponse<User>> {
    const result = await firestoreService.getDocuments<User>('users', {
      where: [{ field: 'email', operator: '==', value: email }]
    });
    
    if (result.error) {
      return { data: null, error: result.error };
    }
    
    return { data: result.data[0] || null, error: null };
  },

  // Get all users
  async getAllUsers(constraints?: QueryConstraints): Promise<FirestoreListResponse<User>> {
    return firestoreService.getDocuments<User>('users', constraints);
  },

  // Create new user
  async createUser(data: Omit<User, 'id' | 'firebaseId' | 'createdAt' | 'updatedAt'>): Promise<FirestoreResponse<User>> {
    const result = await firestoreService.addDocument('users', data);
    
    if (result.error) {
      return { data: null, error: result.error };
    }
    
    // Fetch the created user to return complete data
    return this.getUserById(result.data!.firebaseId);
  },

  // Update user
  async updateUser(id: string, data: UpdateUserProfileData): Promise<FirestoreResponse<void>> {
    return firestoreService.updateDocument('users', id, data);
  },

  // Delete user
  async deleteUser(id: string): Promise<FirestoreResponse<void>> {
    return firestoreService.deleteDocument('users', id);
  },

  // Real-time listeners
  onUserSnapshot(id: string, callback: (user: User | null, error: FirestoreError | null) => void) {
    return firestoreService.onDocumentSnapshot<User>('users', id, callback);
  },

  onUsersSnapshot(callback: (users: User[], error: FirestoreError | null) => void, constraints?: QueryConstraints) {
    return firestoreService.onCollectionSnapshot<User>('users', callback, constraints);
  }
}; 