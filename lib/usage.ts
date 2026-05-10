'use client';

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

export async function logToolUsage(tool: string, metadata: Record<string, unknown> = {}) {
  try {
    await addDoc(collection(db, 'tool_usage'), {
      tool,
      uid: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      metadata,
      createdAt: serverTimestamp(),
    });
  } catch {
    // Usage logging should never block a tool action.
  }
}
