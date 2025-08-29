
'use server';

import { z } from 'zod';
import { db } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, setDoc, query, where } from 'firebase/firestore';
import type { Book, Planner1Item, Planner2Item, PlannerSignatures } from './definitions';

// --- BOOK FUNCTIONS ---

// Zod schema for validating book data from Firestore and providing defaults
const BookSchemaFromDb = z.object({
  title: z.string().default(''),
  author: z.string().default(''),
  category: z.enum(['ግጥም', 'ወግ', 'ድራማ', 'መነባንብ', 'መጣጥፍ', 'ሌሎች መፅሐፍት']).default('ሌሎች መፅሐፍት'),
  year: z.number().default(new Date().getFullYear()),
  description: z.string().default(''),
  filePath: z.string().default(''),
  comment: z.string().default(''),
});


export async function getBooks(): Promise<Book[]> {
  try {
    const booksCol = collection(db, 'books');
    const bookSnapshot = await getDocs(booksCol);
    const bookList = bookSnapshot.docs.map(doc => {
      const docData = doc.data();
      const validatedData = BookSchemaFromDb.parse(docData);
      return { id: doc.id, ...validatedData };
    });
    return bookList;
  } catch (error) {
    console.error("Error fetching books: ", error);
    return [];
  }
}

export async function getBookById(id: string): Promise<Book | undefined> {
  try {
    const bookDocRef = doc(db, 'books', id);
    const bookDoc = await getDoc(bookDocRef);
    if (!bookDoc.exists()) {
      return undefined;
    }
    const validatedData = BookSchemaFromDb.parse(bookDoc.data());
    return { id: bookDoc.id, ...validatedData };
  } catch (error) {
    console.error(`Error fetching book with ID ${id}: `, error);
    return undefined;
  }
}

export async function addBook(book: Omit<Book, 'id'>): Promise<Book> {
  const booksCol = collection(db, 'books');
  const docRef = await addDoc(booksCol, book);
  return { id: docRef.id, ...book };
}

export async function updateBook(bookData: Book): Promise<Book> {
  const { id, ...dataToUpdate } = bookData;
  const bookDocRef = doc(db, 'books', id);
  // Ensure comment is a string
  const sanitizedData = {
      ...dataToUpdate,
      comment: dataToUpdate.comment || '',
  }
  await updateDoc(bookDocRef, sanitizedData);
  return bookData;
}

export async function deleteBook(id: string): Promise<boolean> {
  try {
    const bookDocRef = doc(db, 'books', id);
    await deleteDoc(bookDocRef);
    return true;
  } catch (error) {
    console.error(`Error deleting book with ID ${id}:`, error);
    return false;
  }
}


// --- PLANNER 1 FUNCTIONS ---

export async function getPlanner1Items(): Promise<Planner1Item[]> {
  try {
    const plannerCol = collection(db, 'planner1');
    const plannerSnapshot = await getDocs(plannerCol);
    return plannerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Planner1Item));
  } catch (error) {
    console.error("Error fetching planner 1 items: ", error);
    return [];
  }
}

export async function savePlanner1Items(items: Planner1Item[]): Promise<void> {
    const batch = items.map(item => {
        const { id, ...data } = item;
        const docRef = doc(db, 'planner1', id || doc(collection(db, 'temp')).id); // generate new id if missing
        return setDoc(docRef, data);
    });
    await Promise.all(batch);
}


// --- PLANNER SIGNATURES FUNCTIONS ---

export async function getPlannerSignatures(year: number): Promise<Omit<PlannerSignatures, 'year'> | null> {
  try {
    const q = query(collection(db, "plannerSignatures"), where("year", "==", year));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    const data = querySnapshot.docs[0].data();
    return {
      preparationOfficer: data.preparationOfficer || '',
      reviewOfficer: data.reviewOfficer || ''
    };
  } catch (error) {
    console.error(`Error fetching signatures for year ${year}:`, error);
    return null;
  }
}

export async function savePlannerSignatures(signatures: PlannerSignatures): Promise<void> {
    const { year, ...rest } = signatures;
    const q = query(collection(db, "plannerSignatures"), where("year", "==", year));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        await addDoc(collection(db, "plannerSignatures"), signatures);
    } else {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, rest);
    }
}


// --- PLANNER 2 FUNCTIONS ---

export async function getPlanner2Items(): Promise<Planner2Item[]> {
    try {
        const plannerCol = collection(db, 'planner2');
        const plannerSnapshot = await getDocs(plannerCol);
        return plannerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Planner2Item));
    } catch (error) {
        console.error("Error fetching planner 2 items: ", error);
        return [];
    }
}

export async function savePlanner2Items(items: Planner2Item[]): Promise<void> {
    const batch = items.map(item => {
        const { id, ...data } = item;
        const docRef = doc(db, 'planner2', id || doc(collection(db, 'temp')).id); // generate new id if missing
        return setDoc(docRef, data);
    });
    await Promise.all(batch);
}
