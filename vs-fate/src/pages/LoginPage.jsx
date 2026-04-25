import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './LoginPage.css'

function LoginPage() {
  const navigate = useNavigate()
  const { currentUser, login, register } = useAuth()
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // 如果已登录，跳转到职业选择
  useEffect(() => {
    if (currentUser) {
      navigate('/class-select')
    }
  }, [currentUser, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!username.trim()) {
      setError('请输入用户名')
      return
    }

    if (!password.trim()) {
      setError('请输入密码')
      return
    }

    let result
    if (isLoginMode) {
      result = login(username, password)
    } else {
      result = register(username, password)
    }

    if (result.success) {
      setSuccess(isLoginMode ? '登录成功！' : '注册成功！')
      setTimeout(() => {
        navigate('/class-select')
      }, 1000)
    } else {
      setError(result.error)
    }
  }

  const handleExit = () => {
    if (confirm('确定要退出游戏吗？')) {
      window.close()
    }
  }

  return (
    <div className="cover-container">
      {/* 封面背景 */}
      <div className="cover-background"></div>
      
      {/* 按钮容器 */}
      <div className="button-container">
        <button className="game-btn btn-login" onClick={() => setIsLoginMode(true)}>
          登入
        </button>
        <button className="game-btn btn-start" onClick={handleSubmit}>
          开始游戏
        </button>
        <button className="game-btn btn-exit" onClick={handleExit}>
          退出
        </button>
      </div>
      
      {/* 提示信息 */}
      <div className="tip-message">
        请先登录账号后再开始游戏
      </div>

      {/* 登录/注册弹窗 */}
      <div className={`modal-overlay ${(username || password || error) ? 'show' : ''}`}>
        <div className="login-modal">
          <div className="modal-title">{isLoginMode ? '账号登录' : '账号注册'}</div>
          
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>用户名</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入用户名"
                maxLength={20}
              />
            </div>
            
            <div className="input-group">
              <label>密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                maxLength={20}
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            <div className="modal-buttons">
              <button type="submit" className="modal-btn btn-confirm">
                {isLoginMode ? '登录' : '注册'}
              </button>
            </div>
          </form>
          
          <div className="modal-buttons" style={{ marginTop: '15px' }}>
            <button
              className="modal-btn btn-switch"
              onClick={() => {
                setIsLoginMode(!isLoginMode)
                setError('')
                setSuccess('')
              }}
            >
              {isLoginMode ? '还没有账号？点击注册' : '已有账号？点击登录'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
