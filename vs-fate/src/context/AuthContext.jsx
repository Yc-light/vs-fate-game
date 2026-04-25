import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 从 localStorage 读取当前用户
    const user = localStorage.getItem('currentUser')
    if (user) {
      setCurrentUser(user)
    }
    setIsLoading(false)
  }, [])

  const login = (username, password) => {
    const users = JSON.parse(localStorage.getItem('vsFateUsers') || '{}')
    
    if (!users[username]) {
      return { success: false, error: '用户名不存在' }
    }
    
    if (users[username].password !== password) {
      return { success: false, error: '密码错误' }
    }
    
    localStorage.setItem('currentUser', username)
    setCurrentUser(username)
    return { success: true }
  }

  const register = (username, password) => {
    const users = JSON.parse(localStorage.getItem('vsFateUsers') || '{}')
    
    if (users[username]) {
      return { success: false, error: '用户名已存在' }
    }
    
    if (username.length < 3) {
      return { success: false, error: '用户名至少3个字符' }
    }
    
    if (password.length < 6) {
      return { success: false, error: '密码至少6个字符' }
    }
    
    users[username] = {
      password,
      createdAt: new Date().toISOString(),
      gameData: {
        playerHp: 50,
        playerNp: 30,
        wins: 0,
        losses: 0
      }
    }
    
    localStorage.setItem('vsFateUsers', JSON.stringify(users))
    localStorage.setItem('currentUser', username)
    setCurrentUser(username)
    return { success: true }
  }

  const logout = () => {
    localStorage.removeItem('currentUser')
    setCurrentUser(null)
  }

  const getUserGameData = () => {
    if (!currentUser) return null
    const users = JSON.parse(localStorage.getItem('vsFateUsers') || '{}')
    return users[currentUser]?.gameData || null
  }

  const saveUserGameData = (gameData) => {
    if (!currentUser) return
    const users = JSON.parse(localStorage.getItem('vsFateUsers') || '{}')
    if (users[currentUser]) {
      users[currentUser].gameData = gameData
      localStorage.setItem('vsFateUsers', JSON.stringify(users))
    }
  }

  const value = {
    currentUser,
    isLoading,
    login,
    register,
    logout,
    getUserGameData,
    saveUserGameData
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
