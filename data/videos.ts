export interface Video {
  id: string
  title: string
  thumbnail: string
}

// Replace IDs with real YouTube video IDs from https://www.youtube.com/@TedHsu-v6s
// Thumbnail URL derives from: https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg
export const videos: Video[] = [
  {
    id: 'B7Jzng2XDVk',
    title: 'My YouTube Video — replace this',
    thumbnail: 'https://img.youtube.com/vi/B7Jzng2XDVk/maxresdefault.jpg',
  },
    {
    id: 'HI1mWKGZjeQ',
    title: 'My YouTube Video — replace this',
    thumbnail: 'https://img.youtube.com/vi/HI1mWKGZjeQ/maxresdefault.jpg',
  },
]
