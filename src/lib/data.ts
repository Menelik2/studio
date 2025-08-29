
'use server';

import type { Book, Planner1Item, Planner2Item, PlannerSignatures } from './definitions';
import { db } from './firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  limit,
  writeBatch
} from 'firebase/firestore';
import { z } from 'zod';


// Schema for validating book data read from Firestore
const BookSchemaFromDb = z.object({
  id: z.string(),
  title: z.string().default(''),
  author: z.string().default(''),
  category: z.enum(['ግጥም', 'ወግ', 'ድራማ', 'መነባንብ', 'መጣጥፍ', 'ሌሎች መፅሐፍት']).default('ሌሎች መፅሐፍት'),
  year: z.number().default(new Date().getFullYear()),
  description: z.string().default(''),
  filePath: z.string().default(''),
  comment: z.string().optional().default(''),
});

// --- BOOK FUNCTIONS ---

export async function getBooks(): Promise<Book[]> {
  const booksCol = collection(db, 'books');
  const bookSnapshot = await getDocs(booksCol);
  
  const bookList = bookSnapshot.docs.map(doc => {
    const data = { id: doc.id, ...doc.data() };
    // Validate and clean data on read to prevent undefined values
    const parsed = BookSchemaFromDb.safeParse(data);
    if (parsed.success) {
      return parsed.data as Book;
    } else {
      console.warn(`Invalid book data found for doc ${doc.id}:`, parsed.error.issues);
      // Return a default book structure or null
      return null;
    }
  }).filter((book): book is Book => book !== null); // Filter out any nulls from failed parsing

  return bookList;
}

export async function getBookById(id: string): Promise<Book | undefined> {
  const bookDocRef = doc(db, 'books', id);
  const bookSnap = await getDoc(bookDocRef);
  if (bookSnap.exists()) {
    const data = { id: bookSnap.id, ...bookSnap.data() };
    const parsed = BookSchemaFromDb.safeParse(data);
     if (parsed.success) {
      return parsed.data as Book;
    }
  }
  return undefined;
}

export async function addBook(book: Omit<Book, 'id'>): Promise<Book> {
    const booksCol = collection(db, 'books');
    const docRef = await addDoc(booksCol, book);
    return { id: docRef.id, ...book };
}

export async function updateBook(updatedBook: Book): Promise<Book | null> {
  const { id, ...bookData } = updatedBook;
  if (!id) return null;

  // Ensure comment is not undefined, which Firestore rejects.
  if (bookData.comment === undefined || bookData.comment === null) {
      bookData.comment = '';
  }
  
  const bookDocRef = doc(db, 'books', id);
  await updateDoc(bookDocRef, bookData);
  return updatedBook;
}

export async function deleteBook(id: string): Promise<boolean> {
  if (!id) return false;
  try {
    const bookDocRef = doc(db, 'books', id);
    await deleteDoc(bookDocRef);
    return true;
  } catch (error) {
    console.error("Error deleting book:", error);
    return false;
  }
}

// --- PLANNER 1 FUNCTIONS ---

export async function getPlanner1Items(): Promise<Planner1Item[]> {
    const planner1Col = collection(db, 'planner1');
    const planner1Snapshot = await getDocs(planner1Col);
    return planner1Snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Planner1Item));
}

export async function savePlanner1Items(items: Planner1Item[]): Promise<void> {
    const batch = writeBatch(db);
    const planner1Col = collection(db, 'planner1');

    // First, delete all existing items for simplicity.
    // A more advanced implementation might diff the changes.
    const existingItems = await getDocs(planner1Col);
    existingItems.forEach(doc => {
        batch.delete(doc.ref);
    });
    
    // Now, add the new items
    items.forEach(item => {
        const { id, ...itemData } = item;
        let docRef;
        // If an item has an ID from Firestore, use it. Otherwise, create a new one.
        if (id && !/^\d+$/.test(id)) { // check if it's a firestore id
            docRef = doc(db, 'planner1', id);
        } else {
            docRef = doc(planner1Col); // create a new doc
        }
        batch.set(docRef, itemData);
    });
    
    await batch.commit();
}


// --- PLANNER SIGNATURES FUNCTIONS ---

export async function getPlannerSignatures(year: number): Promise<Omit<PlannerSignatures, 'year'> | null> {
    const q = query(collection(db, 'plannerSignatures'), where("year", "==", year), limit(1));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0].data();
        return {
            preparationOfficer: docData.preparationOfficer,
            reviewOfficer: docData.reviewOfficer
        };
    }
    return null;
}

export async function savePlannerSignatures(signatures: PlannerSignatures): Promise<void> {
    const signaturesCol = collection(db, 'plannerSignatures');
    const q = query(signaturesCol, where("year", "==", signatures.year), limit(1));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, signatures);
    } else {
        await addDoc(signaturesCol, signatures);
    }
}


// --- PLANNER 2 FUNCTIONS ---

export async function getPlanner2Items(): Promise<Planner2Item[]> {
    const planner2Col = collection(db, 'planner2');
    const planner2Snapshot = await getDocs(planner2Col);
    return planner2Snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Planner2Item));
}

export async function savePlanner2Items(items: Planner2Item[]): Promise<void> {
    const batch = writeBatch(db);
    const planner2Col = collection(db, 'planner2');

    const existingItems = await getDocs(planner2Col);
    existingItems.forEach(doc => {
        batch.delete(doc.ref);
    });
    
    items.forEach(item => {
        const { id, ...itemData } = item;
        let docRef;
        if (id && !/^\d+$/.test(id)) {
            docRef = doc(db, 'planner2', id);
        } else {
            docRef = doc(planner2Col);
        }
        batch.set(docRef, itemData);
    });
    
    await batch.commit();
}
