import { Routes, Route } from 'react-router-dom'
import { GameMenu } from './games/menu/GameMenu'
import { SnakeGame } from './games/snake/SnakeGame'
import { TicTacToeGame } from './games/tictactoe/TicTacToeGame'
import { MemoryGame } from './games/memory/MemoryGame'
import { QuizGame } from './games/quiz/QuizGame'

function App() {
  return (
    <Routes>
      <Route path="/" element={<GameMenu />} />
      <Route path="/menu" element={<GameMenu />} />
      <Route path="/games/snake" element={<SnakeGame />} />
      <Route path="/games/tictactoe" element={<TicTacToeGame />} />
      <Route path="/games/memory" element={<MemoryGame />} />
      <Route path="/games/quiz" element={<QuizGame />} />
    </Routes>
  )
}

export default App
