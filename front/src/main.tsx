import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/styles/index.css'
import App from './App.tsx'
import 'react-toastify/dist/ReactToastify.css'

createRoot(document.getElementById('root')!).render(
  // StrictMode는 개발 모드에서만 활성화되어, 잠재적인 문제를 감지하는 데 도움을 줍니다. 프로덕션 빌드에서는 성능에 영향을 주지 않습니다.
  // 개발 모드에서 React 18은 StrictMode가 켜져 있으면 useEffect를 의도적으로 두 번 실행할 수 있다.
  <StrictMode>
    <App />
  </StrictMode>,
)
