(function (global) {

    var document = global.document;
    var rootModel;

    var modelParser = function (model) {

        if (!model) {
            throw new Error("No model present");
        } else {
            return new modelParser.parse(model);
        }
    }

    var regExp = {

        rInputs: /^(?:input)$/i,
        rSelect: /^(?:select)$/i,
        objLiteral: /{{.*?}}/,
        objLiteralByVarValue: function (varValue) {
            return new RegExp("{{" + varValue + ".*?}}", "g");
        }


    };

    var assingValue = function (elem, obj) {
        if (typeof obj === "object") {
            var value = getObjValue(obj, elem.getAttribute("id"));
            if (isInput(elem)) {
                elem.value = value;
            } else {
                elem.innerHTML = value;
            }

        } else {
            if (isInput(elem)) {
                elem.value = obj;
            } else {
                elem.innerHTML = obj;
            }

        }
    }

    //the main method that parse de JSON or JavaScript Object to DOM Fields 
    modelParser.parse = function (model) {

        setRootModel(model);
        var ids = getAllIds();

        for (i = 0; i < ids.length; i++) {

            var elem = document.getElementById(ids[i]);

            if (elem) {

                var obj;
                if (isObject(ids[i])) {
                    obj = getObjValue(rootModel, ids[i]);
                } else {
                    obj = rootModel[ids[i]];
                }

                if (isMultiInput(elem)) {
                    fillMultiInput(elem, obj);
                } else {
                    assingValue(elem, obj);
                }
            }

        }

    };


    var isObject = function (str) {

        return str.split(".").length > 1;

    }

    var getAllIds = function () {
        var ids = [];
        var allElements = document.getElementsByTagName("*");

        for (var i = 0, n = allElements.length; i < n; ++i) {
            var el = allElements[i];
            if (el.id) {
                ids.push(el.id);
            }
        }

        return ids;

    }

    //set the model to an javascript object
    var setRootModel = function (model) {
        if (isJSON(model)) {
            rootModel = JSON.parse(model);
        } else {
            rootModel = model;
        }
    };

    //verify if is a input
    var isInput = function (elem) {
        return regExp.rInputs.test(elem.nodeName);
    };

    /*verify if is a multi select input like 
    * select
    * checkbox list 
    * radiobutton*/
    var isMultiInput = function (elem) {
        return elem.hasAttribute("var");
    };

    /*verify if is a multi select input like 
* select
* checkbox list 
* radiobutton*/
    var isSelect = function (elem) {
        return regExp.rSelect.test(elem.nodeName);
    };

    //verify if the model is 'JSON' or 'JavaScript Object'
    var isJSON = function (model) {
        try {
            JSON.parse(model);
        } catch (e) {
            return false;
        }
        return true;
    };

    /*return dive object values*/
    var getObjValue = function (obj, str) {
        var arr = str.split(".");

        if (arr.length == 1) {
            return obj[arr[0]];
        }

        var temp = obj;

        for (var i = 0; i < arr.length; i++) {
            temp = temp[arr[i]];
        }

        return temp;
    };


    /*Fill the <select> element with array object */
    var fillSelect = function (elem, collection) {

        var varValue = elem.getAttribute("var");

        if (elem.options) {
            var pivot;

            for (var i = 0; i < elem.options.length; i++) {
                var item = elem.options[i];
                if (item.value.includes(varValue) || item.text.includes(varValue)) {
                    pivot = item;
                    break;
                }
            }

            elem.remove(pivot.index);
            var valueAr = pivot.value.replace(varValue + ".", "").replace("{{", "").replace("}}", "");
            var textAr = pivot.text.replace(varValue + ".", "").replace("{{", "").replace("}}", "");


            collection.forEach(item => {
                var text;
                var value;

                if (typeof item === "object") {
                    text = getObjValue(item, textAr);
                    value = getObjValue(item, valueAr);
                    // text = "";
                    // value = "";
                } else {
                    text = item;
                    value = item;
                }
                var option = document.createElement("option");
                option.value = value;
                option.innerHTML = text;
                elem.appendChild(option);
            });


        }


    }

    /*Fill any element with array object */
    var fillMultiForm = function (elem, collection) {

        var varValue = elem.getAttribute("var");
        var parent = elem.parentElement;
        var reg = regExp.objLiteralByVarValue(varValue);

        var tempHtml = elem.innerHTML;
        var nodeElem = elem.nodeName;
        var objLiteralProperties = tempHtml.match(reg);
        elem.outerHTML = "";
        collection.forEach(item => {
            var newElement = document.createElement(nodeElem);
            if (typeof item === "object") {
                newElement.innerHTML = tempHtml;
                for (var i = 0; i < objLiteralProperties.length; i++) {
                    var textAr = objLiteralProperties[i].replace("{{", "").replace("}}", "").replace(varValue + ".", "");
                    newElement.innerHTML = newElement.innerHTML.replace(objLiteralProperties[i], getObjValue(item, textAr));
                }
                parent.appendChild(newElement);
            } else {
                newElement.innerHTML = tempHtml;
                for (var i = 0; i < objLiteralProperties.length; i++) {
                    var textAr = objLiteralProperties[i].replace("{{", "").replace("}}", "").replace(varValue + ".", "");
                    newElement.innerHTML = newElement.innerHTML.replace(objLiteralProperties[i], item);
                }
                parent.appendChild(newElement);
            }

        });




    }


    var fillMultiInput = function (elem, collection) {


        if (Array.isArray(collection)) {
            if (isSelect(elem)) {
                fillSelect(elem, collection);
            }
            else {
                fillMultiForm(elem, collection);
            }
        }
    }



    //there are the functions expose to outside
    modelParser.parse.prototype = modelParser.prototype = {}

    global.modelParser = global.$mp = modelParser;

}(window));