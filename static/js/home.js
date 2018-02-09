$(function(){
const button = document.querySelector('button');
const cLoadMsg = 'Обробка, почекайте будь ласка...';
var table_users = $('#table_users');

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

if (button) {
    button.addEventListener('click', function() {
        //table_users.datagrid('loadData', {"total":1,"rows":[{'name': 'Сидоров Иван Степанович', 'age': 54}]});
        table_users.datagrid('reload', '/users');
	});
};

});