import App from './App.svelte';

const app = new App({
	target: document.body,
	//target: document.getElementById('mk'),
	props: {
		name: 'world'
	}
});

let tmp = document.getElementById('mk');
tmp.remove();

export default app;