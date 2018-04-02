var titleMenuMap = {
    '编码参考案例' : 'examples',
    '人员组织机构' : 'organization',
    '权限管理' : 'security'
};

var examples = [ {
    title : '部门管理参考',
    url : "synframe/examples/manageDept.do",
    action : [ {
        label : "刷新",
        img : "/lib/custom/images/arrow-refresh.png",
        event : "refresh"
    }, {
        label : "新建",
        img : "/lib/custom/images/add.gif",
        event : "add"
    }, {
        label : "删除",
        img : "/lib/custom/images/delete.png",
        event : "remove"
    }, {
        label : "修改",
        img : "/lib/custom/images/edit.png",
        event : "update"
    }, {
        label : "查询",
        img : "/lib/custom/images/search.png",
        event : "query"
    }, {
        label : "条件设置",
        img : "",
        event : "openEditWin"
    } ],
    childs : [ {
        title : '人员管理',
        url : "synframe/organization/user/manageUser.do",
        action : [ {
            label : "刷新",
            img : "/lib/custom/images/arrow-refresh.png",
            event : "refresh"
        }, {
            label : "新建",
            img : "/lib/custom/images/add.gif",
            event : "add"
        }, {
            label : "删除",
            img : "/lib/custom/images/delete.png",
            event : "remove"
        }, {
            label : "修改",
            img : "/lib/custom/images/edit.png",
            event : "update"
        }, {
            label : "查询",
            img : "/lib/custom/images/search.png",
            event : "query"
        }, {
            label : "条件设置",
            img : "",
            event : "openEditWin"
        } ]
    }, {
        title : '资源管理',
        url : "synframe/security/resource/manageResource.do",
        action : [ {
            label : "刷新",
            img : "/lib/custom/images/arrow-refresh.png",
            event : "refresh"
        }, {
            label : "新建",
            img : "/lib/custom/images/add.gif",
            event : "add"
        }, {
            label : "删除",
            img : "/lib/custom/images/delete.png",
            event : "remove"
        }, {
            label : "修改",
            img : "/lib/custom/images/edit.png",
            event : "update"
        }, {
            label : "查询",
            img : "/lib/custom/images/search.png",
            event : "query"
        }, {
            label : "条件设置",
            img : "",
            event : "openEditWin"
        } ]
    } ]
} ];

var organization = [ {
    title : '人员管理',
    url : "synframe/organization/user/manageUser.do",
    action : [ {
        label : "刷新",
        img : "/lib/custom/images/arrow-refresh.png",
        event : "refresh"
    }, {
        label : "新建",
        img : "/lib/custom/images/add.gif",
        event : "add"
    }, {
        label : "删除",
        img : "/lib/custom/images/delete.png",
        event : "remove"
    }, {
        label : "修改",
        img : "/lib/custom/images/edit.png",
        event : "update"
    }, {
        label : "查询",
        img : "/lib/custom/images/search.png",
        event : "query"
    }, {
        label : "条件设置",
        img : "",
        event : "openEditWin"
    } ]
}, {
    title : '部门管理',
    url : "synframe/organization/dept/manageDept.do",
    action : [ {
        label : "刷新",
        img : "/lib/custom/images/arrow-refresh.png",
        event : "refresh"
    }, {
        label : "新建",
        img : "/lib/custom/images/add.gif",
        event : "add"
    }, {
        label : "删除",
        img : "/lib/custom/images/delete.png",
        event : "remove"
    }, {
        label : "修改",
        img : "/lib/custom/images/edit.png",
        event : "update"
    }, {
        label : "查询",
        img : "/lib/custom/images/search.png",
        event : "query"
    }, {
        label : "条件设置",
        img : "",
        event : "openEditWin"
    } ]
}, {
    title : '组管理',
    url : "synframe/organization/group/manageGroup.do",
    action : [ {
        label : "刷新",
        img : "/lib/custom/images/arrow-refresh.png",
        event : "refresh"
    }, {
        label : "设置为组",
        img : "/lib/custom/images/add.gif",
        event : "add"
    }, {
        label : "删除",
        img : "/lib/custom/images/delete.png",
        event : "remove"
    }, {
        label : "修改",
        img : "/lib/custom/images/edit.png",
        event : "update"
    }, {
        label : "查询",
        img : "/lib/custom/images/search.png",
        event : "query"
    }, {
        label : "条件设置",
        img : "",
        event : "openEditWin"
    } ]
} ];

var security = [ {
    title : '角色管理',
    url : "synframe/security/role/manageRole.do",
    action : [ {
        label : "刷新",
        img : "/lib/custom/images/arrow-refresh.png",
        event : "refresh"
    }, {
        label : "新建",
        img : "/lib/custom/images/add.gif",
        event : "add"
    }, {
        label : "删除",
        img : "/lib/custom/images/delete.png",
        event : "remove"
    }, {
        label : "修改",
        img : "/lib/custom/images/edit.png",
        event : "update"
    }, {
        label : "人员设置",
        img : "/lib/custom/images/edit.png",
        event : "chooseUser"
    }, {
        label : "组设置",
        img : "/lib/custom/images/edit.png",
        event : "chooseGroup"
    }, {
        label : "查询",
        img : "/lib/custom/images/search.png",
        event : "query"
    }, {
        label : "条件设置",
        img : "",
        event : "openEditWin"
    } ]
},

{
    title : '资源管理',
    url : "synframe/security/resource/manageResource.do",
    action : [ {
        label : "刷新",
        img : "/lib/custom/images/arrow-refresh.png",
        event : "refresh"
    }, {
        label : "新建",
        img : "/lib/custom/images/add.gif",
        event : "add"
    }, {
        label : "删除",
        img : "/lib/custom/images/delete.png",
        event : "remove"
    }, {
        label : "修改",
        img : "/lib/custom/images/edit.png",
        event : "update"
    }, {
        label : "查询",
        img : "/lib/custom/images/search.png",
        event : "query"
    }, {
        label : "条件设置",
        img : "",
        event : "openEditWin"
    } ]
},

{
    title : '角色资源管理',
    url : "synframe/security/role-res/mainPage.do",
    action : [ {
        label : "刷新",
        img : "/lib/custom/images/arrow-refresh.png",
        event : "refresh"
    } ]
},

{
    title : '组资源管理',
    url : "synframe/security/group-res/mainPage.do",
    action : [ {
        label : "刷新",
        img : "/lib/custom/images/arrow-refresh.png",
        event : "refresh"
    } ]
},

{
    title : '人员资源管理',
    url : "synframe/security/user-res/mainPage.do",
    action : [ {
        label : "刷新",
        img : "/lib/custom/images/arrow-refresh.png",
        event : "refresh"
    } ]
} ];