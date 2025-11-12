/**
 * Utility functions for handling video chunks in Firestore
 * Firestore has a 1MB limit per document, so we store chunks in a subcollection
 * Each chunk is stored as a separate document in videos/{videoId}/chunks/{chunkId}
 */

import { collection, doc, setDoc, getDocs, query, orderBy, deleteDoc, Firestore } from 'firebase/firestore'

const MAX_CHUNK_SIZE = 900000 // 900KB per chunk (leaves room for base64 overhead and metadata)
const MAX_CHUNKS = 50 // Maximum number of chunks (allows up to ~45MB videos)

/**
 * Splits a base64 string into chunks that fit within Firestore field limits
 * @param base64String - The base64 encoded string to split
 * @returns Array of chunk strings
 */
export function splitBase64IntoChunks(base64String: string): string[] {
  if (base64String.length <= MAX_CHUNK_SIZE) {
    return [base64String]
  }

  const chunks: string[] = []
  let offset = 0

  while (offset < base64String.length && chunks.length < MAX_CHUNKS) {
    const chunk = base64String.substring(offset, offset + MAX_CHUNK_SIZE)
    chunks.push(chunk)
    offset += MAX_CHUNK_SIZE
  }

  if (offset < base64String.length) {
    console.warn(`Video is too large, truncated after ${MAX_CHUNKS} chunks`)
  }

  return chunks
}

/**
 * Reconstructs a base64 string from chunks
 * @param chunks - Array of chunk strings
 * @returns The reconstructed base64 string
 */
export function reconstructBase64FromChunks(chunks: string[]): string {
  if (!chunks || chunks.length === 0) {
    return ''
  }

  // If it's a single chunk (backward compatibility)
  if (chunks.length === 1) {
    return chunks[0]
  }

  // Sort chunks by index if they're stored as videoUrlChunk0, videoUrlChunk1, etc.
  // Otherwise, just join them in order
  return chunks.join('')
}

/**
 * Converts chunk object from Firestore to array of chunks (for old format with chunks in same document)
 * @param videoData - Video data from Firestore
 * @returns Array of chunk strings in order
 */
export function extractChunksFromVideoData(videoData: any): string[] {
  if (!videoData) {
    return []
  }

  // First check if video is stored as chunks in same document (old format)
  if (videoData.videoUrlChunkCount && videoData.videoUrlChunkCount > 0) {
    const chunks: string[] = []
    for (let i = 0; i < videoData.videoUrlChunkCount; i++) {
      const chunkKey = `videoUrlChunk${i}`
      if (videoData[chunkKey]) {
        chunks.push(videoData[chunkKey])
      }
    }
    if (chunks.length > 0) {
      return chunks
    }
  }

  // Check if videoUrl exists (backward compatibility - single chunk in main document)
  if (videoData.videoUrl && typeof videoData.videoUrl === 'string') {
    return [videoData.videoUrl]
  }

  return []
}

/**
 * Creates a video data object for Firestore main document
 * Large videos will be stored in subcollection, small ones in the main document
 * @param base64String - The base64 encoded video string
 * @returns Object indicating if video should be stored in subcollection or main document
 */
export function createChunkedVideoData(base64String: string): {
  videoUrl?: string
  useSubcollection?: boolean
  chunkCount?: number
  chunks?: string[]
} {
  const chunks = splitBase64IntoChunks(base64String)

  // If single chunk and small enough (< 500KB), store in main document for backward compatibility
  if (chunks.length === 1 && chunks[0].length < 500000) {
    return {
      videoUrl: chunks[0],
      useSubcollection: false,
      chunkCount: 1,
    }
  }

  // Multiple chunks or large single chunk - use subcollection
  return {
    useSubcollection: true,
    chunkCount: chunks.length,
    chunks: chunks,
  }
}

/**
 * Saves video chunks to Firestore subcollection
 * @param db - Firestore instance
 * @param videoId - Video document ID
 * @param chunks - Array of chunk strings to save
 * @returns Promise that resolves when all chunks are saved
 */
export async function saveChunksToSubcollection(
  db: Firestore,
  videoId: string,
  chunks: string[]
): Promise<void> {
  if (!db || !videoId || !chunks || chunks.length === 0) {
    throw new Error('Invalid parameters for saving chunks')
  }

  const chunksRef = collection(db, 'videos', videoId, 'chunks')

  // Save each chunk as a separate document
  const savePromises = chunks.map(async (chunk, index) => {
    const chunkDocRef = doc(chunksRef, `chunk${index}`)
    await setDoc(chunkDocRef, {
      index,
      data: chunk,
      createdAt: new Date().toISOString(),
    })
  })

  await Promise.all(savePromises)
}

/**
 * Retrieves video chunks from Firestore subcollection
 * @param db - Firestore instance
 * @param videoId - Video document ID
 * @returns Promise that resolves with array of chunk strings in order
 */
export async function getChunksFromSubcollection(
  db: Firestore,
  videoId: string
): Promise<string[]> {
  if (!db || !videoId) {
    return []
  }

  const chunksRef = collection(db, 'videos', videoId, 'chunks')

  try {
    // Get all chunks ordered by index
    const chunksQuery = query(chunksRef, orderBy('index', 'asc'))
    const chunksSnapshot = await getDocs(chunksQuery)

    const chunks: string[] = []
    chunksSnapshot.docs.forEach((doc) => {
      const data = doc.data()
      if (data.data) {
        chunks.push(data.data)
      }
    })

    return chunks
  } catch (error) {
    console.error('Error fetching chunks from subcollection:', error)
    return []
  }
}

/**
 * Deletes video chunks from Firestore subcollection
 * @param db - Firestore instance
 * @param videoId - Video document ID
 * @returns Promise that resolves when all chunks are deleted
 */
export async function deleteChunksFromSubcollection(
  db: Firestore,
  videoId: string
): Promise<void> {
  if (!db || !videoId) {
    return
  }

  const chunksRef = collection(db, 'videos', videoId, 'chunks')

  try {
    const chunksSnapshot = await getDocs(chunksRef)
    const deletePromises = chunksSnapshot.docs.map((chunkDoc) =>
      deleteDoc(doc(chunksRef, chunkDoc.id))
    )
    await Promise.all(deletePromises)
  } catch (error) {
    console.error('Error deleting chunks from subcollection:', error)
  }
}

