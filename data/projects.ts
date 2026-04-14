export interface Project {
  name: string
  description: string
  url: string
  github: string
  tags: string[]
  screenshot: string
}

export const projects: Project[] = [
  {
    name: 'Battleship Game',
    description: 'The Classic Naval Combat Game, built with Angular 17 and full unit test coverage.',
    url: 'https://tedythsu.github.io/battleship-game/',
    github: 'https://github.com/tedythsu/battleship-game',
    tags: ['Angular 17', 'TypeScript', 'Unit Testing'],
    screenshot: '/screenshots/battleship.png',
  },
  {
    name: 'Sudoku',
    description: 'The Classic Number Puzzle Game, built with React 18.',
    url: 'https://tedythsu.github.io/sudoku/',
    github: 'https://github.com/tedythsu/sudoku',
    tags: ['React 18', 'TypeScript'],
    screenshot: '/screenshots/sudoku.png',
  },
  {
    name: 'Slot Game',
    description: 'An interactive slot machine simulation built with Angular 16.',
    url: 'https://tedythsu.github.io/slot-game/',
    github: 'https://github.com/tedythsu/slot-game',
    tags: ['Angular 16', 'TypeScript'],
    screenshot: '/screenshots/slot-game.png',
  },
]
