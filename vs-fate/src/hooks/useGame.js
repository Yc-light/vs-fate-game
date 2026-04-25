import { useState, useCallback, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { CLASSES } from '../data/classes'
import { DIFFICULTY_MAP } from '../data/difficulties'

export function useGame() {
  const { currentUser, getUserGameData, saveUserGameData } = useAuth()
  const [selectedClass, setSelectedClass] = useState(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState(null)
  const [gameState, setGameState] = useState(null)

  // 初始化游戏 - 加载职业、难度和存档数据
  useEffect(() => {
    const userData = getUserGameData()
    if (userData && userData.selectedClass) {
      const classData = CLASSES[userData.selectedClass]
      const difficultyData = userData.selectedDifficulty ? DIFFICULTY_MAP[userData.selectedDifficulty] : DIFFICULTY_MAP.normal
      
      if (classData) {
        setSelectedClass(classData)
        setSelectedDifficulty(difficultyData)
        initializeGameState(classData, difficultyData, userData)
      }
    }
  }, [])

  const initializeGameState = (classData, difficultyData, userData = null) => {
    const initialState = {
      player: {
        hp: userData?.playerHp || classData.hp,
        maxHp: classData.maxHp,
        np: userData?.playerNp || classData.np,
        maxNp: classData.maxNp,
        invincible: false,
        shield: 0,
        poison: 0,
        damageReduction: 0
      },
      enemy: {
        hp: difficultyData.bossHp,
        maxHp: difficultyData.bossMaxHp,
        np: difficultyData.bossNp,
        maxNp: difficultyData.bossMaxNp,
        poison: 0
      },
      turn: 'player',
      gameOver: false,
      isProcessing: false,
      logs: [{ message: `战斗开始！难度：${difficultyData.name}`, type: 'system', id: Date.now() }]
    }
    setGameState(initialState)
  }

  const addLog = useCallback((message, type) => {
    setGameState(prev => ({
      ...prev,
      logs: [...prev.logs, { message, type, id: Date.now() }]
    }))
  }, [])

  const saveGame = useCallback(() => {
    if (!selectedClass) return
    saveUserGameData({
      selectedClass: selectedClass.id,
      selectedDifficulty: selectedDifficulty?.id || 'normal',
      playerHp: gameState.player.hp,
      playerNp: gameState.player.np,
      timestamp: new Date().toISOString()
    })
  }, [gameState?.player.hp, gameState?.player.np, selectedClass, selectedDifficulty, saveUserGameData])

  const checkGameOver = useCallback(() => {
    if (!gameState) return { over: false }
    if (gameState.player.hp <= 0) {
      setGameState(prev => ({ ...prev, gameOver: true }))
      return { over: true, victory: false }
    }
    if (gameState.enemy.hp <= 0) {
      setGameState(prev => ({ ...prev, gameOver: true }))
      return { over: true, victory: true }
    }
    return { over: false }
  }, [gameState?.player.hp, gameState?.enemy.hp])

  const checkBothNPZero = useCallback(() => {
    if (!gameState) return { over: false }
    if (gameState.player.np <= 0 && gameState.enemy.np <= 0) {
      setGameState(prev => ({ ...prev, gameOver: true }))
      
      let result
      if (gameState.player.hp > gameState.enemy.hp) {
        result = { over: true, victory: true, reason: 'hp' }
      } else if (gameState.player.hp < gameState.enemy.hp) {
        result = { over: true, victory: false, reason: 'hp' }
      } else {
        result = { over: true, victory: false, reason: 'draw' }
      }
      
      return result
    }
    return { over: false }
  }, [gameState?.player.np, gameState?.enemy.np, gameState?.player.hp, gameState?.enemy.hp])

  const getEnemyAction = useCallback((currentState) => {
    const difficulty = selectedDifficulty || DIFFICULTY_MAP.normal
    const aiBehavior = difficulty.aiBehavior
    
    // 根据AI行为模式选择行动
    let action
    
    if (aiBehavior === 'passive') {
      // 简单难度：更倾向于普通攻击和治疗
      if (currentState.enemy.hp < currentState.enemy.maxHp * 0.3 && currentState.enemy.np >= 4) {
        action = 'heal'
      } else if (currentState.enemy.np >= 1) {
        const actions = ['attack', 'attack', 'attack', 'heavy']
        action = actions[Math.floor(Math.random() * actions.length)]
      } else {
        action = null
      }
    } else if (aiBehavior === 'aggressive') {
      // 困难难度：更倾向于高伤害技能
      if (currentState.enemy.np >= 4) {
        // 高NP时优先使用重击或治疗
        if (currentState.enemy.hp < currentState.enemy.maxHp * 0.4) {
          action = Math.random() > 0.3 ? 'heal' : 'heavy'
        } else {
          action = Math.random() > 0.2 ? 'heavy' : 'attack'
        }
      } else if (currentState.enemy.np >= 2) {
        action = 'heavy'
      } else if (currentState.enemy.np >= 1) {
        action = 'attack'
      } else {
        action = null
      }
    } else {
      // 普通难度：均衡行为
      if (currentState.enemy.np >= 4) {
        const actions = ['attack', 'heavy', 'heal']
        action = actions[Math.floor(Math.random() * actions.length)]
      } else if (currentState.enemy.np >= 2) {
        action = Math.random() > 0.5 ? 'attack' : 'heavy'
      } else if (currentState.enemy.np >= 1) {
        action = 'attack'
      } else {
        action = null
      }
    }
    
    return action
  }, [selectedDifficulty])

  const calculateEnemyDamage = useCallback((action) => {
    const difficulty = selectedDifficulty || DIFFICULTY_MAP.normal
    
    if (action === 'attack') {
      return Math.floor(Math.random() * (difficulty.bossAttackMax - difficulty.bossAttackMin + 1)) + difficulty.bossAttackMin
    } else if (action === 'heavy') {
      return Math.floor(Math.random() * (difficulty.bossHeavyMax - difficulty.bossHeavyMin + 1)) + difficulty.bossHeavyMin
    }
    return 0
  }, [selectedDifficulty])

  const calculateEnemyHeal = useCallback(() => {
    const difficulty = selectedDifficulty || DIFFICULTY_MAP.normal
    return Math.floor(Math.random() * (difficulty.bossHealMax - difficulty.bossHealMin + 1)) + difficulty.bossHealMin
  }, [selectedDifficulty])

  const useSkill = useCallback((skillId) => {
    if (!gameState || gameState.isProcessing || gameState.turn !== 'player' || gameState.gameOver) {
      return
    }

    const skill = selectedClass?.skills.find(s => s.id === skillId)
    if (!skill) return

    if (gameState.player.np < skill.npCost) {
      addLog(`NP不足！需要${skill.npCost}点NP`, 'system')
      return
    }

    setGameState(prev => ({ ...prev, isProcessing: true }))

    let newState = { ...gameState }

    // 处理持续伤害（毒）
    if (newState.player.poison > 0) {
      const poisonDamage = newState.player.poison
      newState.player.hp = Math.max(0, newState.player.hp - poisonDamage)
      newState.player.poison = 0
      addLog(`毒发！受到${poisonDamage}点持续伤害！`, 'system')
    }

    // 处理护盾衰减
    if (newState.player.shield > 0) {
      newState.player.shield = 0
    }

    // 处理减伤衰减
    if (newState.player.damageReduction > 0) {
      newState.player.damageReduction = 0
    }

    switch (skillId) {
      case 'juejin':
      case 'fireball':
      case 'elementalStorm':
      case 'preciseShot':
      case 'rapidFire':
      case 'shieldBash':
        newState.player.np -= skill.npCost
        const damage = skill.damage
        newState.enemy.hp = Math.max(0, newState.enemy.hp - damage)
        addLog(`你使用了【${skill.name}】，对敌方造成${damage}点伤害！`, 'player')
        break

      case 'poisonArrow':
        newState.player.np -= skill.npCost
        const poisonDmg = skill.damage
        newState.enemy.hp = Math.max(0, newState.enemy.hp - poisonDmg)
        newState.enemy.poison = skill.poison
        addLog(`你使用了【${skill.name}】，造成${poisonDmg}点伤害并附加中毒！`, 'player')
        break

      case 'qianlong':
        newState.player.np -= skill.npCost
        newState.player.invincible = true
        addLog(`你使用了【${skill.name}】，本回合获得无敌状态！`, 'player')
        break

      case 'magicShield':
        newState.player.np -= skill.npCost
        newState.player.shield = skill.shield
        addLog(`你使用了【${skill.name}】，获得${skill.shield}点护盾！`, 'player')
        break

      case 'block':
        newState.player.np -= skill.npCost
        newState.player.damageReduction = skill.damageReduction
        addLog(`你使用了【${skill.name}】，下回合减伤${skill.damageReduction}点！`, 'player')
        break

      case 'jiushi':
        newState.player.np -= skill.npCost
        const healAmount = Math.min(skill.heal, newState.player.maxHp - newState.player.hp)
        newState.player.hp = Math.min(newState.player.maxHp, newState.player.hp + skill.heal)
        addLog(`你使用了【${skill.name}】，回复${healAmount}点HP！`, 'player')
        break

      case 'ironWall':
        newState.player.np -= skill.npCost
        const ironHeal = Math.min(skill.heal, newState.player.maxHp - newState.player.hp)
        newState.player.hp = Math.min(newState.player.maxHp, newState.player.hp + skill.heal)
        newState.player.shield = skill.shield
        addLog(`你使用了【${skill.name}】，回复${ironHeal}点HP并获得${skill.shield}点护盾！`, 'player')
        break

      case 'giveup':
        newState.player.hp = 0
        addLog('你放弃了战斗...', 'system')
        setGameState(newState)
        checkGameOver()
        return
    }

    setGameState(newState)
    saveGame()

    const gameOverResult = checkGameOver()
    if (gameOverResult.over) {
      setGameState(prev => ({ ...prev, isProcessing: false }))
      return
    }

    const npZeroResult = checkBothNPZero()
    if (npZeroResult.over) {
      setGameState(prev => ({ ...prev, isProcessing: false }))
      return
    }

    // 切换到敌方回合
    setTimeout(() => {
      setGameState(prev => ({ ...prev, turn: 'enemy' }))
      enemyTurn(newState)
    }, 1000)
  }, [gameState, selectedClass, addLog, saveGame, checkGameOver, checkBothNPZero])

  const enemyTurn = useCallback((currentState) => {
    setTimeout(() => {
      // 检查敌方NP
      if (currentState.enemy.np <= 0) {
        addLog('敌方NP不足，无法行动！', 'enemy')
        
        const newState = {
          ...currentState,
          player: { ...currentState.player, invincible: false },
          turn: 'player',
          isProcessing: false
        }
        
        setGameState(newState)

        const npZeroResult = checkBothNPZero()
        if (npZeroResult.over) return

        addLog('你的回合', 'player')
        return
      }

      // 使用AI行为选择行动
      const action = getEnemyAction(currentState)

      let newState = { ...currentState }

      switch (action) {
        case 'attack':
          newState.enemy.np = Math.max(0, newState.enemy.np - 1)
          if (newState.player.invincible) {
            addLog('敌方消耗1NP发动攻击，但你处于无敌状态！', 'enemy')
          } else {
            let damage = calculateEnemyDamage('attack')
            // 应用减伤
            if (newState.player.damageReduction > 0) {
              damage = Math.max(0, damage - newState.player.damageReduction)
              addLog(`格挡减少了${newState.player.damageReduction}点伤害！`, 'system')
            }
            // 应用护盾
            if (newState.player.shield > 0) {
              const shieldAbsorb = Math.min(damage, newState.player.shield)
              damage -= shieldAbsorb
              newState.player.shield -= shieldAbsorb
              if (shieldAbsorb > 0) {
                addLog(`护盾吸收了${shieldAbsorb}点伤害！`, 'system')
              }
            }
            newState.player.hp = Math.max(0, newState.player.hp - damage)
            addLog(`敌方消耗1NP发动攻击，对你造成${damage}点伤害！`, 'enemy')
          }
          break

        case 'heavy':
          newState.enemy.np = Math.max(0, newState.enemy.np - 2)
          if (newState.player.invincible) {
            addLog('敌方消耗2NP发动重击，但你处于无敌状态！', 'enemy')
          } else {
            let damage = calculateEnemyDamage('heavy')
            // 应用减伤
            if (newState.player.damageReduction > 0) {
              damage = Math.max(0, damage - newState.player.damageReduction)
              addLog(`格挡减少了${newState.player.damageReduction}点伤害！`, 'system')
            }
            // 应用护盾
            if (newState.player.shield > 0) {
              const shieldAbsorb = Math.min(damage, newState.player.shield)
              damage -= shieldAbsorb
              newState.player.shield -= shieldAbsorb
              if (shieldAbsorb > 0) {
                addLog(`护盾吸收了${shieldAbsorb}点伤害！`, 'system')
              }
            }
            newState.player.hp = Math.max(0, newState.player.hp - damage)
            addLog(`敌方消耗2NP发动重击，对你造成${damage}点伤害！`, 'enemy')
          }
          break

        case 'heal':
          newState.enemy.np = Math.max(0, newState.enemy.np - 4)
          const heal = calculateEnemyHeal()
          newState.enemy.hp = Math.min(newState.enemy.maxHp, newState.enemy.hp + heal)
          addLog(`敌方消耗4NP回复了${heal}点HP！`, 'enemy')
          break
      }

      newState.player.invincible = false
      setGameState(newState)

      const gameOverResult = checkGameOver()
      if (gameOverResult.over) return

      const npZeroResult = checkBothNPZero()
      if (npZeroResult.over) return

      // 检查玩家NP是否为0
      setTimeout(() => {
        if (newState.player.np <= 0) {
          setGameState(prev => ({ ...prev, turn: 'player', isProcessing: false }))
          addLog('你的NP不足，跳过回合！', 'system')
          
          const npZeroResult2 = checkBothNPZero()
          if (npZeroResult2.over) return
          
          setTimeout(() => {
            setGameState(prev => ({ ...prev, turn: 'enemy' }))
            enemyTurn({ ...newState, turn: 'enemy' })
          }, 1000)
        } else {
          setGameState(prev => ({ ...prev, turn: 'player', isProcessing: false }))
          addLog('你的回合', 'player')
        }
      }, 500)
    }, 1500)
  }, [addLog, checkGameOver, checkBothNPZero, getEnemyAction, calculateEnemyDamage, calculateEnemyHeal])

  const restartGame = useCallback(() => {
    if (!selectedClass || !selectedDifficulty) return
    const newState = {
      player: {
        hp: selectedClass.hp,
        maxHp: selectedClass.maxHp,
        np: selectedClass.np,
        maxNp: selectedClass.maxNp,
        invincible: false,
        shield: 0,
        poison: 0,
        damageReduction: 0
      },
      enemy: {
        hp: selectedDifficulty.bossHp,
        maxHp: selectedDifficulty.bossMaxHp,
        np: selectedDifficulty.bossNp,
        maxNp: selectedDifficulty.bossMaxNp,
        poison: 0
      },
      turn: 'player',
      gameOver: false,
      isProcessing: false,
      logs: [{ message: `战斗重新开始！难度：${selectedDifficulty.name}`, type: 'system', id: Date.now() }]
    }
    setGameState(newState)
    saveUserGameData({
      selectedClass: selectedClass.id,
      selectedDifficulty: selectedDifficulty.id,
      playerHp: selectedClass.hp,
      playerNp: selectedClass.np
    })
  }, [selectedClass, selectedDifficulty, saveUserGameData])

  const loadGame = useCallback(() => {
    const userData = getUserGameData()
    if (userData && selectedClass && selectedDifficulty) {
      setGameState({
        player: {
          hp: userData.playerHp || selectedClass.hp,
          maxHp: selectedClass.maxHp,
          np: userData.playerNp || selectedClass.np,
          maxNp: selectedClass.maxNp,
          invincible: false,
          shield: 0,
          poison: 0,
          damageReduction: 0
        },
        enemy: {
          hp: selectedDifficulty.bossHp,
          maxHp: selectedDifficulty.bossMaxHp,
          np: selectedDifficulty.bossNp,
          maxNp: selectedDifficulty.bossMaxNp,
          poison: 0
        },
        turn: 'player',
        gameOver: false,
        isProcessing: false,
        logs: [
          { message: '读取存档成功！', type: 'system', id: Date.now() },
          { message: '你的回合', type: 'player', id: Date.now() + 1 }
        ]
      })
    }
  }, [getUserGameData, selectedClass, selectedDifficulty])

  return {
    gameState,
    selectedClass,
    selectedDifficulty,
    useSkill,
    restartGame,
    loadGame
  }
}
