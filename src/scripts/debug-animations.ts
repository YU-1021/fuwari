// 调试页面加载动画
document.addEventListener('DOMContentLoaded', () => {
	console.log('=== Page Load Animation Debug ===');
	
	const elements = [
		'#navbar',
		'#swup-sidebar', 
		'#content-wrapper',
		'#swup-footer'
	];
	
	elements.forEach(selector => {
		const el = document.querySelector(selector);
		if (el) {
			const styles = window.getComputedStyle(el);
			console.log(`${selector}:`, {
				hasOnloadClass: el.classList.contains('onload-animation'),
				opacity: styles.opacity,
				animation: styles.animation,
				animationDelay: styles.animationDelay
			});
		} else {
			console.log(`${selector}: NOT FOUND`);
		}
	});
});
