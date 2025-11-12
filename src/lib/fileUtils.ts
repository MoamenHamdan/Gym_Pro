/**
 * Utility functions for file handling
 * Converts files to base64 data URLs for storage in Firestore
 */

export interface FileUploadResult {
  dataUrl: string
  fileName: string
  fileSize: number
  fileType: string
}

/**
 * Converts a file to a base64 data URL
 * @param file - The file to convert
 * @param maxSizeMB - Maximum file size in MB (default: 10MB for images, 50MB for videos)
 * @returns Promise with the data URL and file info
 */
export async function fileToBase64(
  file: File,
  maxSizeMB: number = file.type.startsWith('video/') ? 50 : 10
): Promise<FileUploadResult> {
  return new Promise((resolve, reject) => {
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      reject(
        new Error(
          `File size exceeds ${maxSizeMB}MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`
        )
      )
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      const dataUrl = reader.result as string
      resolve({
        dataUrl,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      })
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsDataURL(file)
  })
}

/**
 * Validates if a file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

/**
 * Validates if a file is a video
 */
export function isVideoFile(file: File): boolean {
  return file.type.startsWith('video/')
}

/**
 * Gets a preview URL for an image file
 */
export function getImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Failed to preview image'))
    reader.readAsDataURL(file)
  })
}

/**
 * Formats file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / 1024 / 1024).toFixed(2) + ' MB'
}


