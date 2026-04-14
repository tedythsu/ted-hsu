// data/guides.ts
export interface Guide {
  title: string
  url: string        // external link — opens in new tab
  category: '新手入門' | '角色' | '副本' | '系統' | '進階'
  summary: string
  source: string     // e.g. '巴哈', '官網', 'YouTube'
  updatedAt: string
}

// 在這裡新增精選攻略連結（外部文章）
export const guides: Guide[] = [
  {
    title: '新手入門完整攻略（巴哈討論）',
    url: 'https://forum.gamer.com.tw/B.php?bsn=75703',
    category: '新手入門',
    summary: '燕雲十六聲巴哈姆特板塊，匯集玩家討論與攻略文章。',
    source: '巴哈',
    updatedAt: '2026-04-14',
  },
  {
    title: '戰鬥系統與閃避彈反教學',
    url: 'https://forum.gamer.com.tw/B.php?bsn=75703',
    category: '新手入門',
    summary: '了解閃避、彈反、武功系統與氣血機制，打好戰鬥基礎。',
    source: '巴哈',
    updatedAt: '2026-04-14',
  },
  {
    title: '角色與門派選擇指南',
    url: 'https://forum.gamer.com.tw/B.php?bsn=75703',
    category: '角色',
    summary: '各門派特色與初期角色選擇建議，找到最適合你的玩法。',
    source: '巴哈',
    updatedAt: '2026-04-14',
  },
]
