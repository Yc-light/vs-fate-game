import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useGame } from '../hooks/useGame'
import './GamePage.css'

function GamePage() {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()
  const { gameState, selectedClass, useSkill, restartGame, loadGame } = useGame()

  // 检查登录状态
  useEffect(() => {
    if (!currentUser) {
      navigate('/')
    }
  }, [currentUser, navigate])

  const handleSkillClick = (skillId) => {
    useSkill(skillId)
  }

  const handleBackToLogin = () => {
    logout()
    navigate('/')
  }

  if (!currentUser || !gameState || !selectedClass) {
    return (
      <div className="loading-container">
        <div className="loading-text">加载中...</div>
        <button className="back-btn" onClick={() => navigate('/class-select')}>
          选择职业
        </button>
      </div>
    )
  }

  const getPlayerHpPercent = () => (gameState.player.hp / gameState.player.maxHp) * 100
  const getEnemyHpPercent = () => (gameState.enemy.hp / gameState.enemy.maxHp) * 100

  const isPlayerTurn = gameState.turn === 'player' && !gameState.isProcessing && !gameState.gameOver

  return (
    <div className="game-container">
      {/* 左侧面板 */}
      <div className="left-panel"></div>
      
      {/* 右侧面板 */}
      <div className="right-panel"></div>
      
      {/* 装饰圆环 */}
      <div className="decorative-ring"></div>
      
      {/* VS TATE 标题 */}
      <div className="vs-title">
        <div className="vs-text">VS</div>
        <div className="tate-text">TATE</div>
      </div>
      
      {/* 回合指示器 */}
      <div className={`turn-indicator ${gameState.turn === 'player' ? 'player-turn' : 'enemy-turn'}`}>
        {gameState.turn === 'player' ? '你的回合' : '敌方回合'}
      </div>
      
      {/* 左侧玩家 */}
      <div className="player-area player-left">
        <div className={`avatar-container ${gameState.player.invincible ? 'invincible' : ''}`}>
          <div className="avatar">{selectedClass.icon}</div>
        </div>
        <div className="status-bars">
          <div className="hp-bar-container">
            <div className="hp-bar-bg">
              <div className="hp-bar-fill" style={{ width: `${getPlayerHpPercent()}%` }}></div>
            </div>
            <div className="hp-text">{gameState.player.hp}/{gameState.player.maxHp} HP</div>
          </div>
          <div className="np-bar-container">
            <div className="np-text">NP: {gameState.player.np}/{gameState.player.maxNp}</div>
          </div>
          {gameState.player.shield > 0 && (
            <div className="shield-indicator">
              护盾: {gameState.player.shield}
            </div>
          )}
          {gameState.player.damageReduction > 0 && (
            <div className="defense-indicator">
              减伤: {gameState.player.damageReduction}
            </div>
          )}
        </div>
      </div>
      
      {/* 右侧敌人 */}
      <div className="player-area player-right">
        <div className="avatar-container">
          <div className="avatar">👹</div>
        </div>
        <div className="status-bars">
          <div className="hp-bar-container">
            <div className="hp-text">{gameState.enemy.hp}/{gameState.enemy.maxHp} HP</div>
            <div className="hp-bar-bg">
              <div className="hp-bar-fill" style={{ width: `${getEnemyHpPercent()}%` }}></div>
            </div>
          </div>
          <div className="np-bar-container">
            <div className="np-text">NP: {gameState.enemy.np}/{gameState.enemy.maxNp}</div>
          </div>
        </div>
      </div>
      
      {/* 战斗日志 */}
      <div className="battle-log">
        {gameState.logs.map((log) => (
          <div key={log.id} className={`log-entry ${log.type}`}>
            {log.message}
          </div>
        ))}
      </div>
      
      {/* 敌方行动提示 */}
      <div className={`enemy-action ${gameState.turn === 'enemy' ? 'show' : ''}`}>
        敌方正在行动...
      </div>
      
      {/* 技能按钮 - 动态生成 */}
      <div className="skills-container">
        {selectedClass.skills.map((skill) => (
          <button
            key={skill.id}
            className="skill-btn"
            style={{
              background: `linear-gradient(135deg, ${skill.color} 0%, ${adjustColor(skill.color, -30)} 100%)`,
              border: `3px solid ${skill.color}`,
              boxShadow: `0 6px 0 ${adjustColor(skill.color, -50)}, 0 8px 20px ${skill.color}66`
            }}
            disabled={!isPlayerTurn || gameState.player.np < skill.npCost}
            onClick={() => handleSkillClick(skill.id)}
          >
            <div className="skill-name">{skill.name}</div>
            <div className="skill-desc">
              {skill.description}<br/>
              消耗: {skill.npCost}NP
            </div>
          </button>
        ))}
        <button
          className="skill-btn skill-giveup"
          disabled={!isPlayerTurn}
          onClick={() => handleSkillClick('giveup')}
        >
          <div className="skill-name">放弃战斗</div>
          <div className="skill-desc">直接结束对局</div>
        </button>
      </div>
      
      {/* 游戏结束弹窗 */}
      {gameState.gameOver && (
        <div className="game-over-modal show">
          <div className="modal-content">
            <div className="modal-title">
              {gameState.player.hp <= 0 ? '失败...' : 
               gameState.enemy.hp <= 0 ? '胜利!' : 
               gameState.player.hp > gameState.enemy.hp ? '胜利!' : '失败...'}
            </div>
            <button className="modal-btn btn-restart" onClick={restartGame}>重新开始</button>
            <button className="modal-btn btn-load" onClick={loadGame}>读取存档</button>
            <button className="modal-btn btn-exit" onClick={handleBackToLogin}>返回登录</button>
          </div>
        </div>
      )}
    </div>
  )
}

// 辅助函数：调整颜色亮度
function adjustColor(color, amount) {
  const num = parseInt(color.replace('#', ''), 16)
  const r = Math.max(0, Math.min(255, (num >> 16) + amount))
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount))
  const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount))
  return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`
}

export default GamePage
