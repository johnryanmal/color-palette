import { createApp } from 'vue'
import './style.css'
import App from './App.vue'


document.addEventListener('keydown', (event) => {
	if (event.code === 'Escape') {
		document.activeElement.blur()
	}
})

createApp(App).mount('#app')
