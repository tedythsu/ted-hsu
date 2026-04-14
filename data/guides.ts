export interface Guide {
  slug: string
  title: string
  category: '新手入門' | '角色' | '副本' | '系統' | '進階'
  summary: string
  updatedAt: string
  ready: boolean
}

// 在這裡新增攻略條目，ready: false 代表內容準備中
export const guides: Guide[] = [
  {
    slug: 'beginner-guide',
    title: '新手入門完整攻略',
    category: '新手入門',
    summary: '從零開始的燕雲十六聲完整入門教學，包含基礎操作、初期任務流程與推薦配置。',
    updatedAt: '2026-04-14',
    ready: false,
  },
  {
    slug: 'combat-basics',
    title: '戰鬥系統基礎',
    category: '新手入門',
    summary: '了解閃避、彈反、武功系統與氣血機制，打好戰鬥基礎。',
    updatedAt: '2026-04-14',
    ready: false,
  },
  {
    slug: 'character-overview',
    title: '角色與門派選擇',
    category: '角色',
    summary: '各門派特色與初期角色選擇建議，找到最適合你的玩法。',
    updatedAt: '2026-04-14',
    ready: false,
  },
]
