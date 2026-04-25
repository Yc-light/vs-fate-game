import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { CLASS_LIST } from '../data/classes'
import './ClassSelectPage.css'

function ClassSelectPage() {
  const navigate = useNavigate()
  const { currentUser, saveUserGameData } = useAuth()

  const handleSelectClass = (classId) => {
    const selectedClass = CLASS_LIST.find(c => c.id === classId)
    
    // 保存选择的职业到用户数据
    saveUserGameData({
      selectedClass: classId,
      playerHp: selectedClass.hp,
      playerNp: selectedClass.np,
      timestamp: new Date().toISOString()
    })

    // 跳转到难度选择页面
    navigate('/difficulty-select')
  }

  return (
    <div className="class-select-container">
      <div className="class-select-bg"></div>
      
      <div className="class-select-content">
        <h1 className="class-select-title">选择你的职业</h1>
        <p className="class-select-subtitle">每个职业都有独特的战斗风格</p>
        
        <div className="class-cards">
          {CLASS_LIST.map((classData) => (
            <div
              key={classData.id}
              className="class-card"
              onClick={() => handleSelectClass(classData.id)}
              style={{ '--class-color': classData.color }}
            >
              <div className="class-card-inner">
                <div className="class-icon">{classData.icon}</div>
                <h2 className="class-name">{classData.name}</h2>
                <p className="class-description">{classData.description}</p>
                
                <div className="class-stats">
                  <div className="stat">
                    <span className="stat-label">HP</span>
                    <span className="stat-value hp">{classData.hp}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">NP</span>
                    <span className="stat-value np">{classData.np}</span>
                  </div>
                </div>
                
                <div className="class-skills-preview">
                  <h3>技能</h3>
                  <div className="skills-list">
                    {classData.skills.map((skill) => (
                      <div key={skill.id} className="skill-tag" style={{ backgroundColor: skill.color }}>
                        {skill.name}
                      </div>
                    ))}
                  </div>
                </div>
                
                <button className="select-btn">选择此职业</button>
              </div>
            </div>
          ))}
        </div>
        
        <button className="back-btn" onClick={() => navigate('/')}>
          返回登录
        </button>
      </div>
    </div>
  )
}

export default ClassSelectPage
