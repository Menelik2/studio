'use server';

import type { Book, Planner1Item, Planner2Item, PlannerSignatures } from './definitions';
import { db } from './firebase';
import { collection, doc, getDocs, getDoc, setDoc, addDoc, deleteDoc, query, where } from 'firebase/firestore';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- EXPORTED FUNCTIONS ---

// Book Functions
export async function getBooks(): Promise<Book[]> {
  await delay(500);
  const booksCol = collection(db, 'books');
  const bookSnapshot = await getDocs(booksCol);
  const bookList = bookSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Book));
  return bookList;
}

export async function getBookById(id: string): Promise<Book | undefined> {
  await delay(200);
  const bookRef = doc(db, 'books', id);
  const bookSnap = await getDoc(bookRef);
  if (bookSnap.exists()) {
    return { id: bookSnap.id, ...bookSnap.data() } as Book;
  }
  return undefined;
}

export async function addBook(book: Omit<Book, 'id'>): Promise<Book> {
  await delay(300);
  const booksCol = collection(db, 'books');
  const docRef = await addDoc(booksCol, book);
  return { id: docRef.id, ...book };
}

export async function updateBook(updatedBook: Book): Promise<Book | null> {
  await delay(300);
  const bookRef = doc(db, 'books', updatedBook.id);
  // Firestore's setDoc will create the document if it doesn't exist, or update it if it does.
  // We need to separate the id from the rest of the data.
  const { id, ...bookData } = updatedBook;
  await setDoc(bookRef, bookData);
  return updatedBook;
}

export async function deleteBook(id: string): Promise<boolean> {
  await delay(300);
  const bookRef = doc(db, 'books', id);
  await deleteDoc(bookRef);
  return true;
}

// Planner 1 Functions
export async function getPlanner1Items(): Promise<Planner1Item[]> {
    await delay(300);
    const plannerCol = collection(db, 'planner1');
    const plannerSnapshot = await getDocs(plannerCol);
    return plannerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Planner1Item));
}

export async function savePlanner1Items(items: Planner1Item[]): Promise<void> {
    await delay(300);
    const batch = items.map(item => {
        // If an item has an ID, we update it. If not, we'll need to create it.
        // For simplicity, this assumes items passed will have IDs from getPlanner1Items.
        const docRef = doc(db, 'planner1', item.id);
        const { id, ...data } = item;
        return setDoc(docRef, data);
    });
    // This isn't a true batch write, but it's a simple parallel update.
    // For a real app, a Firestore batched write would be better.
    await Promise.all(batch);

    // This is a simplified save; a more robust version would handle additions and deletions.
    // Let's clear the collection and add all items again for simplicity.
    const plannerCol = collection(db, 'planner1');
    const plannerSnapshot = await getDocs(plannerCol);
    for (const document of plannerSnapshot.docs) {
        await deleteDoc(doc(db, 'planner1', document.id));
    }
    for (const item of items) {
        const { id, ...data } = item;
        await addDoc(plannerCol, data);
    }
}


// Planner Signatures Functions
export async function getPlannerSignatures(year: number): Promise<Omit<PlannerSignatures, 'year'> | null> {
    await delay(200);
    const q = query(collection(db, "plannerSignatures"), where("year", "==", year));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0].data();
        return { preparationOfficer: docData.preparationOfficer, reviewOfficer: docData.reviewOfficer };
    }
    return null;
}

export async function savePlannerSignatures(signatures: PlannerSignatures): Promise<void> {
    await delay(300);
    const q = query(collection(db, "plannerSignatures"), where("year", "==", signatures.year));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        // Update existing
        const docId = querySnapshot.docs[0].id;
        await setDoc(doc(db, 'plannerSignatures', docId), signatures);
    } else {
        // Add new
        await addDoc(collection(db, 'plannerSignatures'), signatures);
    }
}


// Planner 2 Functions
export async function getPlanner2Items(): Promise<Planner2Item[]> {
    await delay(300);
    const plannerCol = collection(db, 'planner2');
    const plannerSnapshot = await getDocs(plannerCol);
    return plannerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Planner2Item));
}

export async function savePlanner2Items(items: Planner2Item[]): Promise<void> {
    await delay(300);
    // This is a simplified save; a more robust version would handle additions and deletions.
    // Let's clear the collection and add all items again for simplicity.
    const plannerCol = collection(db, 'planner2');
    const plannerSnapshot = await getDocs(plannerCol);
    for (const document of plannerSnapshot.docs) {
        await deleteDoc(doc(db, 'planner2', document.id));
    }
    for (const item of items) {
        const { id, ...data } = item;
        await addDoc(plannerCol, data);
    }
}
