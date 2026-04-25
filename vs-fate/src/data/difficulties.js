export const DIFFICULTIES = [
  {
    id: 'easy',
    name: '简单',
    icon: '🌱',
    description: '适合新手体验，Boss较为温和',
    bossHp: 40,
    bossMaxHp: 40,
    bossNp: 20,
    bossMaxNp: 20,
    bossAttackMin: 3,
    bossAttackMax: 6,
    bossHeavyMin: 6,
    bossHeavyMax: 10,
    bossHealMin: 5,
    bossHealMax: 8,
    aiBehavior: 'passive',
    features: [
      'Boss攻击力降低30%',
      'Boss NP恢复速度较慢',
      'Boss倾向于使用普通攻击',
      'Boss治疗频率较低'
    ]
  },
  {
    id: 'normal',
    name: '普通',
    icon: '⚔️',
    description: '标准难度，平衡的挑战体验',
    bossHp: 50,
    bossMaxHp: 50,
    bossNp: 30,
    bossMaxNp: 30,
    bossAttackMin: 5,
    bossAttackMax: 10,
    bossHeavyMin: 10,
    bossHeavyMax: 15,
    bossHealMin: 5,
    bossHealMax: 10,
    aiBehavior: 'balanced',
    features: [
      'Boss属性为标准值',
      'Boss AI行为均衡',
      '攻击和治疗频率正常',
      '适合大多数玩家'
    ]
  },
  {
    id: 'hard',
    name: '困难',
    icon: '🔥',
    description: '高难度挑战，Boss极具威胁',
    bossHp: 60,
    bossMaxHp: 60,
    bossNp: 40,
    bossMaxNp: 40,
    bossAttackMin: 8,
    bossAttackMax: 12,
    bossHeavyMin: 15,
    bossHeavyMax: 20,
    bossHealMin: 8,
    bossHealMax: 12,
    aiBehavior: 'aggressive',
    features: [
      'Boss攻击力提升50%',
      'Boss拥有更多NP',
      'Boss AI更加激进',
      'Boss会优先使用高伤害技能',
      'Boss治疗更加频繁'
    ]
  }
];

export const DIFFICULTY_MAP = {
  easy: DIFFICULTIES[0],
  normal: DIFFICULTIES[1],
  hard: DIFFICULTIES[2]
};
