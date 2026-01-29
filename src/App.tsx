import { Header } from './components/Header'
import { Countdown } from './components/Countdown'
import { CandidateGrid } from './components/CandidateGrid'
import { candidates } from './data/candidates'

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Countdown />
        <CandidateGrid candidates={candidates} />
      </main>
      <footer className="bg-bc-blue-900 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm opacity-75">
            This is an unofficial tracker. Not affiliated with the BC Conservative Party.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
