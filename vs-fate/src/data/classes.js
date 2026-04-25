export const CLASSES = {
  samurai: {
    id: 'samurai',
    name: '武士',
    icon: '⚔️',
    description: '攻守兼备的近战职业',
    hp: 50,
    maxHp: 50,
    np: 20,
    maxNp: 20,
    color: '#c94c4c',
    skills: [
      {
        id: 'juejin',
        name: '决进',
        npCost: 1,
        damage: 5,
        type: 'attack',
        description: '造成5点伤害',
        color: '#4a90d9'
      },
      {
        id: 'qianlong',
        name: '潜龙',
        npCost: 2,
        type: 'defense',
        description: '本回合无敌',
        color: '#c94c4c'
      },
      {
        id: 'jiushi',
        name: '酒诗',
        npCost: 4,
        heal: 10,
        type: 'heal',
        description: '回复10点HP',
        color: '#8b5a9f'
      }
    ]
  },
  mage: {
    id: 'mage',
    name: '法师',
    icon: '🔮',
    description: '高爆发远程魔法职业',
    hp: 40,
    maxHp: 40,
    np: 30,
    maxNp: 30,
    color: '#6b5ce7',
    skills: [
      {
        id: 'fireball',
        name: '火球术',
        npCost: 2,
        damage: 8,
        type: 'attack',
        description: '造成8点伤害',
        color: '#ff6b35'
      },
      {
        id: 'magicShield',
        name: '魔力盾',
        npCost: 3,
        shield: 5,
        type: 'defense',
        description: '获得5点护盾',
        color: '#4ecdc4'
      },
      {
        id: 'elementalStorm',
        name: '元素风暴',
        npCost: 6,
        damage: 15,
        type: 'attack',
        description: '造成15点伤害',
        color: '#a855f7'
      }
    ]
  },
  archer: {
    id: 'archer',
    name: '射手',
    icon: '🏹',
    description: '灵活多变的远程物理职业',
    hp: 45,
    maxHp: 45,
    np: 18,
    maxNp: 18,
    color: '#22c55e',
    skills: [
      {
        id: 'preciseShot',
        name: '精准射击',
        npCost: 1,
        damage: 4,
        type: 'attack',
        ignoreDefense: true,
        description: '造成4点伤害(无视防御)',
        color: '#16a34a'
      },
      {
        id: 'rapidFire',
        name: '连射',
        npCost: 3,
        damage: 6,
        type: 'attack',
        description: '造成6点伤害',
        color: '#15803d'
      },
      {
        id: 'poisonArrow',
        name: '毒箭',
        npCost: 2,
        damage: 3,
        poison: 2,
        type: 'attack',
        description: '造成3点伤害+2点持续伤害',
        color: '#84cc16'
      }
    ]
  },
  guardian: {
    id: 'guardian',
    name: '盾卫',
    icon: '🛡️',
    description: '坚不可摧的防御职业',
    hp: 70,
    maxHp: 70,
    np: 12,
    maxNp: 12,
    color: '#64748b',
    skills: [
      {
        id: 'block',
        name: '格挡',
        npCost: 1,
        damageReduction: 3,
        type: 'defense',
        description: '下回合减伤3点',
        color: '#475569'
      },
      {
        id: 'shieldBash',
        name: '盾击',
        npCost: 2,
        damage: 3,
        taunt: true,
        type: 'attack',
        description: '造成3点伤害+嘲讽',
        color: '#334155'
      },
      {
        id: 'ironWall',
        name: '铁壁',
        npCost: 3,
        heal: 5,
        shield: 3,
        type: 'heal',
        description: '回复5HP+3护盾',
        color: '#1e293b'
      }
    ]
  }
};

export const CLASS_LIST = Object.values(CLASSES);
