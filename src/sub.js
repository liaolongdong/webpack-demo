// // 使用commonJS编码风格
// function productText(){
// 	var element = document.createElement('h2');
// 	element.innerHTML = 'webpack demo h2';
// 	return element;
// }
// module.exports = productText;


// es6
export default function() {
	var element = document.createElement('h2');
	element.innerHTML = 'webpack demo h2';
	return element;
}