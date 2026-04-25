import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { DIFFICULTIES } from '../data/difficulties'
import './DifficultySelectPage.css'

function DifficultySelectPage() {
  const navigate = useNavigate()
  const { currentUser, saveUserGameData, getUserGameData } = useAuth()

  const handleSelectDifficulty = (difficultyId) => {
    const userData = getUserGameData() || {}
    
    // 保存选择的难度
    saveUserGameData({
      ...userData,
      selectedDifficulty: difficultyId,
      timestamp: new Date().toISOString()
    })

    // 跳转到游戏页面
    navigate('/game')
  }

  const handleBack = () => {
    navigate('/class-select')
  }

  return (
    <div className="difficulty-select-container">
      <div className="difficulty-select-bg"></div>
      
      <div className="difficulty-select-content">
        <h1 className="difficulty-select-title">选择战斗难度</h1>
        <p className="difficulty-select-subtitle">难度越高，Boss越强，但奖励也越丰厚</p>
        
        <div className="difficulty-cards">
          {DIFFICULTIES.map((difficulty) => (
            <div
              key={difficulty.id}
              className={`difficulty-card ${difficulty.id}`}
              onClick={() => handleSelectDifficulty(difficulty.id)}
            >
              <div className="difficulty-card-inner">
                <div className="difficulty-icon">{difficulty.icon}</div>
                <h2 className="difficulty-name">{difficulty.name}</h2>
                <p className="difficulty-description">{difficulty.description}</p>
                
                <div className="difficulty-stats">
                  <div className="difficulty-stat">
                    <span className="stat-label">Boss HP</span>
                    <span className="stat-value">{difficulty.bossHp}</span>
                  </div>
                  <div className="difficulty-stat">
                    <span className="stat-label">Boss NP</span>
                    <span className="stat-value">{difficulty.bossNp}</span>
                  </div>
                  <div className="difficulty-stat">
                    <span className="stat-label">攻击力</span>
                    <span className="stat-value">{difficulty.bossAttackMin}-{difficulty.bossAttackMax}</span>
                  </div>
                </div>
                
                <div className="difficulty-features">
                  <h3>Boss特性</h3>
                  <ul>
                    {difficulty.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
                
                <button className="select-difficulty-btn">
                  选择{difficulty.name}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <button className="back-btn" onClick={handleBack}>
          返回职业选择
        </button>
      </div>
    </div>
  )
}

export default DifficultySelectPage
