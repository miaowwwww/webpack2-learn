import arr from './index2';
import obj1 from './index1'
import obj from './index3'

import './css/index.less'
import './css/index.css';
window.onload = function() {
	let _div = document.createElement('div');
	let _body = document.body;
	_div.className = 'aa';
	_body.appendChild(_div);
	$('.aa').text('aadd1234')
	$('<div>create by $<div>').appendTo($('body'));

}

// for import()
// 若要使用该接口需要npm babel-plugin-syntax-dynamic-import
function useimport() {
	import('./modules/import.js')
		.then(imp => console.log(imp.a))
		.catch(err => console.log('import error!!!!!!!!!'))
}
useimport();

// for require.ensure
require.ensure([], function(require) {
  var foo = require("./modules/requireEnsure.js");
	console.log(foo.a)
}, "requireEnsure-chunk");