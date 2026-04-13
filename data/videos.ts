export interface Video {
  id: string
  title: string
  thumbnail: string
}

// Replace IDs with real YouTube video IDs from https://www.youtube.com/@TedHsu-v6s
// Thumbnail URL derives from: https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg
export const videos: Video[] = [
  {
    id: 'dQw4w9WgXcQ',
    title: 'My YouTube Video — replace this',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
  },
]
