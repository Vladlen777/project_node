$(function(){
//const button = document.querySelector('button');
const cLoadMsg = 'Обробка, почекайте будь ласка...';
let table_users = $('#table_users');
let button_load = $('#button_load');
let button_ins = $('#button_ins');

table_users.datagrid({
    method: 'get',
    singleSelect: true,
    rownumbers: true,
    pagination: true,
    loadMsg: cLoadMsg,
    columns:[[
        {field:'name',title:'Фамилия, имя',width:300,align:'left',halign:'center'},
        {field:'age',title:'Возраст',width:80,align:'center',halign:'center'},
    ]],
    onLoadSuccess: function(data){
        table_users.datagrid('selectRow', 0);
    }
});

pagerUsers = table_users.datagrid('loadData', {
    "total":0,
    "rows":[],
    "footer":[]
}).datagrid('getPager');

function PagerOption(pagerName) {
    pagerName.pagination({
        beforePageText: "Сторінка",
        afterPageText: "з {pages}",
        displayMsg: "Показано від {from} по {to} з {total} элементів",
        showRefresh: false
    });
};

PagerOption(pagerUsers);

if (button_load) {
    button_load.on('click', function() {
        //addEventListener
        //table_users.datagrid('loadData', {"total":1,"rows":[{'name': 'Сидоров Иван Степанович', 'age': 54}]});
        table_users.datagrid('reload', '/users');
	});
};


button_ins.bind('click', function() {
    $.ajax({
        url: '/users/save',
        type: "POST",
        data: {name: 'John', age: 35},
        success: function(data){
            table_users.datagrid('reload', '/users');
        }
    });
});

});