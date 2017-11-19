(function () {

    var _deletenode, _editnode;


    jsPlumbToolkit.ready(function () {

        // ------------------------ toolkit 设置 ------------------------------------

        // 获取ID
        var idFunction = function (n) {
            return n.id;
        };

        // 获取节点
        var typeFunction = function (n) {
            return n.type;
        };

        var i;

        // 获取不同的dom元素
        var mainElement = document.querySelector("#jtk-demo"),
            canvasElement = mainElement.querySelector(".jtk-demo-canvas"),
            miniviewElement = mainElement.querySelector(".miniview"),
            nodePalette = mainElement.querySelector(".node-palette"),
            controls = mainElement.querySelector(".controls");

        // 声明工具箱的实例，并提供我们将用来从节点获得id和类型的函数。
        var toolkit = jsPlumbToolkit.newInstance({
            idFunction: idFunction,
            typeFunction: typeFunction,
            nodeFactory: function (type, data, callback) {
                jsPlumbToolkit.Dialogs.show({
                    id: "dlgText",
                    title: "Enter " + type + " name:",
                    onOK: function (d) {
                        data.text = d.text;
                        // if the user entered a name...
                        if (data.text) {
                            // and it was at least 2 chars
                            if (data.text.length >= 2) {
                                // set an id and continue.
                                data.id = jsPlumbToolkitUtil.uuid();
                                callback(data);
                            }
                            else
                            // else advise the user.
                                alert(type + " names must be at least 2 characters!");
                        }
                        // else...do not proceed.
                    }
                });
            },
            // edgeFactory:function (type, data, callback){
            //     // alert(data);
            //     // data.id = jsPlumbToolkitUtil.uuid();
            //     // data.type =
            //     // console.log(data);
            //     callback(data);
            // },
            beforeStartConnect: function (node, edgeType) {
                // limit edges from start node to 1. if any other type of node, return
                // uuid = jsPlumbToolkitUtil.uuid();
                i = 0;
                return {label: "..."};
            },
            beforeConnect: function (sourceNode, targetNode, data) {
                // return false;
                i++;
                if (i > 2) {
                    return false;
                } else {
                    return true;
                }

            }
        });

// ------------------------ / toolkit 设置 ------------------------------------

// ------------------------- 初始化对话框 -------------------------------------
        //初始化页面上所有对话框。
        jsPlumbToolkit.Dialogs.initialize({
            selector: ".dlg"
        });

// ------------------------- / 初始化对话框 ----------------------------------

// ------------------------ rendering ------------------------------------


        // Instruct the toolkit to render to the 'canvas' element. We pass in a view of nodes, edges and ports, which
        // together define the look and feel and behaviour of this renderer.  Note that we can have 0 - N renderers
        // assigned to one instance of the Toolkit..
        var renderer = window.renderer = toolkit.render({
            container: canvasElement,
            view: {
                nodes: {
                    "uml_simple_class": {
                        parent: "selectable",
                        template: "umlSimpleClass"
                    },
                    "uml_class": {
                        parent: "selectable",
                        template: "umlClass"
                    },
                    "uml_interface": {
                        parent: "selectable",
                        template: "umlInterface"
                    },
                    "uml_active_class": {
                        parent: "selectable",
                        template: "umlActiveClass"
                    },
                    "luoji1": {
                        parent: "selectable",
                        template: "luoji1"
                    },
                    "luoji2": {
                        parent: "selectable",
                        template: "luoji2"
                    },
                    "luoji3": {
                        parent: "selectable",
                        template: "luoji3"
                    },
                    "selectable": {
                        events: {
                            dblclick: function (params) {
                                toolkit.toggleSelection(params.node);
                            }
                        }
                    }
                },
                // There are two edge types defined - 'yes' and 'no', sharing a common
                // parent.
                edges: {
                    "default": {
                        endpoint: "Blank",
                        anchor: "Continuous",
                        // endpoints: [["Dot", {radius: 5}], ["Dot", {radius: 5}], ["Dot", {radius: 5}], ["Dot", {radius: 5}]],
                        // anchor: [[0, 0.5, -1, 0], [0.5, -0.1, 0, -1], [1, 0.5, 1, 0], [0.5, 1, 0, 1]],
                        connector: ["Flowchart", {cornerRadius: 5}],
                        paintStyle: {strokeWidth: 2, stroke: "#000", outlineWidth: 2, outlineStroke: "transparent"},	//	paint style for this edge type.
                        hoverPaintStyle: {strokeWidth: 2, stroke: "rgb(67,67,67)"}, // hover paint style for this edge type.
                        events: {
                            mouseover: function (params) {
                                _mouseoverThisEdge(params);
                            }
                        },
                        overlays: [
                            ["Arrow", {location: 1, width: 10, length: 10}],
                            // ["Custom", {
                            //     create:function(component) {
                            //         console.log(component);
                            //         return $("<select id='myDropDown'><option value='foo'>foo</option><option value='bar'>bar</option></select>");
                            //     },
                            //     location:0.7,
                            //     id:"customOverlay"
                            // }]
                            // [ "Arrow", { location: 0.3, width: 10, length: 10 }]
                        ],
                        // reattach: true, // 拖动端点可以解绑并可移动连接到别的节点
                        allowLoopback: false, //防止环回连接
                        // allowNodeLoopback: false
                    },
                    // "connection": {
                    //     parent: "default",
                    //     overlays: [
                    //         [
                    //             "Label", {
                    //             label: "${label}",
                    //             events: {
                    //                 click: function (params) {
                    //                     debugger
                    //                     // _editLabel(params.edge);
                    //                     var overlayId = params.overlay.id;
                    //                     var overlay = jsPlumb.getContainer();
                    //                     console.log(params)
                    //                     console.log(overlay);
                    //
                    //                 },
                    //                 mouseover: function (params) {
                    //                     _mouseoverThisEdge(params);
                    //                 }
                    //             }
                    //         }
                    //         ]
                    //     ]
                    // }
                },
                // 连接端点类型
                // ports: {
                //     "start": {
                //         edgeType: "default"
                //     },
                //     "source": {
                //         maxConnections: -1,
                //         edgeType: "connection"
                //     },
                //     "target": {
                //         maxConnections: -1,
                //         lineWidth: 2,
                //         dropOptions: {
                //             hoverClass: "connection-drop"
                //         }
                //     }
                // }
            },
            // Layout the nodes using an absolute layout
            layout: {
                type: "Absolute"
            },
            events: {
                // 画布点击事件
                canvasClick: function (e) {
                    // 清除选中的节点
                    toolkit.clearSelection();
                },
                edgeAdded: function (params) {
                    if (params.addedByMouse) {
                        console.log(params.edge.inspect());
                    }
                },
                nodeAdded: function (params) {
                    // console.log(params);
                },
                edgeRemoved: function (info) {
                    console.log(info);
                },
                nodeDropped: function (info) {
                    console.log("node ", info.source.id, "dropped on", info.target.id);
                }
            },
            miniview: {
                container: miniviewElement
            },
            // lassoInvert: true,
            // elementsDroppable: true,
            consumeRightClick: true,
            dragOptions: {
                filter: ".jtk-draw-handle, .node-action, .node-action i",
                magnetize: true,
                start: function (data) {},
                drag: function (data) {},
                stop: function (data) {
                    console.log(data);
                }

            }
        });

        var datasetView = new jsPlumbSyntaxHighlighter(toolkit, ".jtk-demo-dataset");


        //如果客户端浏览器支持h5
        if (typeof(Storage) !== "undefined") {
            var loadData = localStorage.getItem("data");
            if (loadData != null) {
                // 加载数据.
                toolkit.load({
                    data: JSON.parse(loadData)
                });
            }


            //当数据发生变化时触发
            toolkit.bind("dataUpdated", function () {
                var data = toolkit.exportData();
                localStorage.setItem("data", JSON.stringify(data));
            });
        }


        // listener for mode change on renderer.
        renderer.bind("modeChanged", function (mode) {
            jsPlumb.removeClass(controls.querySelectorAll("[mode]"), "selected-mode");
            jsPlumb.addClass(controls.querySelectorAll("[mode='" + mode + "']"), "selected-mode");
        });


        // pan mode/select mode
        jsPlumb.on(controls, "tap", "[mode]", function () {
            renderer.setMode(this.getAttribute("mode"));
        });

        // on home button click, zoom content to fit.
        jsPlumb.on(controls, "tap", "[reset]", function () {
            toolkit.clearSelection();
            renderer.setZoom(1);
        });

        // configure Drawing tools.
        new jsPlumbToolkit.DrawingTools({
            renderer: renderer
        });

        jsPlumb.on(canvasElement, "tap", ".node-delete", function () {
            var info = renderer.getObjectInfo(this);
            _deletenode(info)
        });

        //删除节点
        _deletenode = function (info) {
            jsPlumbToolkit.Dialogs.show({
                id: "dlgConfirm",
                data: {
                    msg: "Delete '" + info.obj.data.text + "'"
                },
                onMaybeClose: function () {
                    toolkit.removeNode(info.obj);
                }
            });
        };


        // change a question or action's label
        jsPlumb.on(canvasElement, "tap", ".node-edit", function () {
            // getObjectInfo is a method that takes some DOM element (this function's `this` is
            // set to the element that fired the event) and returns the toolkit data object that
            // relates to the element. it ascends through parent nodes until it finds a node that is
            // registered with the toolkit.
            var info = renderer.getObjectInfo(this);
            _editnode(info);
        });

        //编辑节点
        _editnode = function (info) {
            var type = info.obj.data.type;
            var title = info.obj.data.title;
            if (type == "uml_simple_class") {
                jsPlumbToolkit.Dialogs.show({
                    id: "dlgText",
                    data: info.obj.data,
                    title: title,
                    onMaybeClose: function (data) {
                        // if name is at least 2 chars long, update the underlying data and
                        // update the UI.
                        toolkit.updateNode(info.obj, data);
                    }
                });
            } else if (type == "uml_interface") {
                jsPlumbToolkit.Dialogs.show({
                    id: "dlgText1",
                    data: info.obj.data,
                    title: title,
                    onMaybeClose: function (data) {
                        // var textBody = data.textBody;
                        // data.textBody = "<div>"+textBody+"</div>";
                        toolkit.updateNode(info.obj, data);
                    }
                });
            } else if (type == "uml_class") {
                jsPlumbToolkit.Dialogs.show({
                    id: "dlgText2",
                    data: info.obj.data,
                    title: title,
                    onMaybeClose: function (data) {
                        // var textBody = data.textBody;
                        // data.textBody = "<div>"+textBody+"</div>";
                        toolkit.updateNode(info.obj, data);
                    }
                });
            } else if (type == "uml_active_class") {
                jsPlumbToolkit.Dialogs.show({
                    id: "dlgText3",
                    data: info.obj.data,
                    title: title,
                    onMaybeClose: function (data) {
                        // if (data.text && data.text.length > 2) {
                        // if name is at least 2 chars long, update the underlying data and
                        // update the UI.
                        toolkit.updateNode(info.obj, data);
                        // }
                    }
                });
            } else if (type == "luoji1" || type == "luoji2" || type == "luoji3") {
                jsPlumbToolkit.Dialogs.show({
                    id: "dlgText",
                    data: info.obj.data,
                    title: title,
                    onMaybeClose: function (data) {
                        // if (data.text && data.text.length > 2) {
                        // if name is at least 2 chars long, update the underlying data and
                        // update the UI.
                        toolkit.updateNode(info.obj, data);
                        // }
                    }
                });
            }
        };

        //编辑连接线内容
        var _editLabel = function (edge, deleteOnCancel) {

            jsPlumbToolkit.Dialogs.show({
                id: "dlgText",
                data: {
                    text: edge.data.label || ""
                },
                onMaybeClose: function (data) {
                    toolkit.updateEdge(edge, {label: data.text || ""});
                },
                onCancel: function () {
                    if (deleteOnCancel) {
                        toolkit.removeEdge(edge);
                    }
                }
            });
        };


        //鼠标移入事件绑定连接线对象右键菜单功能
        var _mouseoverThisEdge = function (params) {
            $('.dropdown-menu').each(function () {
                if ($(this).is(":hidden")) {
                    $(this).remove();
                }
            });
            var connectMenu = [
                {
                    icon: 'icon iconfont icon-xiugai',
                    text: '修改',
                    action: function (e, selector) {//修改
                        _editLabel(params.edge);
                    }
                },
                {
                    icon: 'icon iconfont icon-shanchu',
                    text: '删除',
                    action: function (e, selector) {//删除
                        jsPlumbToolkit.Dialogs.show({
                            id: "dlgConfirm",
                            data: {
                                msg: "Delete Edge"
                            },
                            onMaybeClose: function () {
                                // alert(params.edge.getId());
                                toolkit.removeEdge(params.edge);
                            }
                        });
                    }
                }
            ];
            context.attach('.jtk-connector', connectMenu);
            context.attach('.jtk-overlay', connectMenu);
        };





// ------------------------ / rendering ------------------------------------


// ------------------------ drag and drop new tables/views -----------------

        //
        // Here, we are registering elements that we will want to drop onto the workspace and have
        // the toolkit recognise them as new nodes.
        //
        //  typeExtractor: this function takes an element and returns to jsPlumb the type of node represented by
        //                 that element. In this application, that information is stored in the 'jtk-node-type' attribute.
        //
        //  dataGenerator: this function takes a node type and returns some default data for that node type.
        //
        renderer.registerDroppableNodes({
            droppables: canvasElement.querySelectorAll("img"),
            dragOptions: {
                magnetize: true,
                zIndex: 50000,
                cursor: "move",
                clone: true,

                start: function (data) {

                },
                drag: function (data) {

                },
                stop: function (data) {
                }
            },

            typeExtractor: function (el) {
                return el.getAttribute("jtk-node-type");
            },
            dataGenerator: function (type) {
                if (type == "uml_simple_class") {
                    return {
                        w: 120,
                        h: 80,
                        text: "简单类"
                    };
                } else if (type == "uml_interface") {
                    return {
                        w: 160,
                        h: 120,
                        textHead: "接口",
                        textBody: "接口内容"
                    };

                } else if (type == "uml_class") {
                    return {
                        w: 230,
                        h: 140,
                        textHead: type,
                        textAttr: "attribute",
                        textMethod: "method"
                    };
                } else if (type == "uml_active_class") {
                    return {
                        w: 160,
                        h: 120,
                        text: type
                    };
                } else if (type == "luoji1" || type == "luoji2" || type == "luoji3") {
                    return {
                        w: 160,
                        h: 120,
                        text: type
                    };
                }

            }
        });

// ------------------------ / drag and drop new tables/views -----------------


        //注册网页右键响应事件
        var menu = [
            {
                header: ''
            },
            {
                icon: 'icon iconfont icon-xiugai',
                text: '修改',
                action: function (e, selector) {
                    var info = renderer.getObjectInfo(selector.attr("data-jtk-node-id"));
                    _editnode(info);
                }
            },
            {
                icon: 'icon iconfont icon-shanchu',
                text: '删除',
                action: function (e, selector) {
                    var info = renderer.getObjectInfo(selector.attr("data-jtk-node-id"));
                    _deletenode(info);
                }
            }
        ];
        context.init({preventDoubleContext: true});


        //数据导出
        $('.icon-daochu').bind('click', function () {
            //数据导出
            var data_html = $('.jtk-demo-dataset').html();
            layer.open({
                title: '详细内容',
                shadeClose: false,
                shade: 0.6,
                area: ['60%', '65%'],
                closeBtn: 1,
                content: data_html
            });
        });

        //利用鼠标移入事件，给对节点象绑定鼠标右键响应状态
        $("body").on('mouseover', '.flowchart-object', function () {
            $('.dropdown-menu').each(function () {
                if ($(this).is(":hidden")) {
                    $(this).remove();
                }
            });
            context.attach('.flowchart-object', menu);
        })

    });

})();
