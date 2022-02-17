import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/Home/Home';
import EditPage from './pages/Home/Edit';

function App() {
	return (
		<Router>
			<Routes>
				<Route element={<HomePage/>} path='/' exact/>
				<Route element={<EditPage/>} path='/edit/:id' />
			</Routes>
		</Router>
	);
}

export default App;
