function Maker(label){
	return function(){
		var s =  "<"+label+">"+stringify(arguments)+"</"+label+">";
		return s; } }

var Html = {};
foreach(['table','tr','td'], function(item){Html[item]=Maker(item);})

function rowify(row /* array of cells */){ 
	return Html.tr(collect(Html.td, row));  }

function Table(rows){ return Html.table(collect(rowify,rows)); }

Html.Select = function (name, selectedValue, options){
	var s = '<select id="{name}">'.template({name: name});
	foreach(options, function(option){
		var selected = (option[0] == selectedValue)?' selected="selected"':"";
		s += '<option value="{value}"{selected}>{caption}</option>'.template({value: option[0], caption: option[1], selected: selected});
	});
	s += "</select>";
	return s;
}