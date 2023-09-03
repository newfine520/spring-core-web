//树父节点  树id 树显示的text
function BindChainTree(treeparent, treename, dpttxt) {
    var setting = {
        async: {
            enable: true,
            type: "post",
            url: "/System/BaseData/GetChainList",
            error: function () {
                $.ShowMessage('warning', '大区加载失败')
            },
            autoParam: ["id"]
        },
        view: {
            dblClickExpand: false,
            selectedMulti: true, //是否允许多选
            txtSelectedEnable: false //是否允许选中节点的文字
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            beforeClick: beforeClick,
            onClick: onClick,
            onAsyncSuccess: zTreeOnAsyncSuccess
        }
    };
    $.fn.zTree.init($("#" + treename + ""), setting);
    $("#" + dpttxt + "").on("click", function () {
        showMenu(treeparent, dpttxt);
    });
}

function showMenu(treeparent, dpttxt) {
    var structureObj = $("#" + dpttxt + "");
    var clientStructureOffset = $("#" + dpttxt + "").position();
    $("#" + treeparent + "").css({ left: clientStructureOffset.left + "px", top: clientStructureOffset.top + structureObj.outerHeight() + "px" }).slideDown("fast");
    $("body").bind("mousedown", onBodyDown);

}

function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {
    var zTree = $.fn.zTree.getZTreeObj(treeId);
    zTree.expandAll(true);
    var dpttxt = $("#" + treeId + "").parent().attr("id");
    var did = $("#" + treeId + "").parent().next().next().attr("id");
    var dtxt = $("#" + treeId + "").parent().next().attr("id");
    var node = zTree.getNodeByParam("id", $("#" + did + "").val(), null);
    if (node != null) {
        $("#" + dtxt + "").val(node.name);
    }
};
function beforeClick(treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj(treeId);
    //判断当前节点是否选中 如果选中则取消选中，反之选中
    if (zTree.isSelectedNode(treeNode)) {
        zTree.cancelSelectedNode(treeNode);
    } else {
        zTree.selectNode(treeNode);
    }
    return true;
}
function onClick(e, treeId, treeNode) {
    var did = $("#" + treeId + "").parent().next().next().attr("id");
    var dtxt = $("#" + treeId + "").parent().next().attr("id");
    var tparent = $("#" + treeId + "").parent().attr("id");
    $("#" + dtxt + "").val(treeNode.name);
    $("#" + did + "").val(treeNode.id);
    hideMenu(tparent);
    return false;
}

function hideMenu(tparent) {
    $("#" + tparent + "").fadeOut("fast");
    $("body").unbind("mousedown", onBodyDown);
}


