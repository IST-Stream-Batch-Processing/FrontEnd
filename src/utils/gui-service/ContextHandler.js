const key = 'ClientContext';

function initContext() {
    localStorage.setItem(key, JSON.stringify(new Map()));
}

function getValueFromContext(tableId, fieldName) {
    const context = JSON.parse(localStorage.getItem(key));
    if (!context) {
        console.error('上下文缺失！！！');
        return null;
    }
    const table = context[`${tableId}`];
    if (!table) {
        console.error('table不存在！！！');
        return null;
    }
    return table[`${fieldName}`];
}

function setValueInContext(tableId, fieldName, fieldValue) {
    let context = JSON.parse(localStorage.getItem(key));
    if (!context) {
        context = new Map();
        context[`${tableId}`] = new Map();
        context[`${tableId}`][`${fieldName}`] = fieldValue;
        localStorage.setItem(key, JSON.stringify(context));
        return;
    }
    const table = context[`${tableId}`];
    if (!table) {
        context[`${tableId}`] = new Map();
        context[`${tableId}`][`${fieldName}`] = fieldValue;
        localStorage.setItem(key, JSON.stringify(context));
        return;
    }
    table[`${fieldName}`] = fieldValue;
    context[`${tableId}`] = table;
    localStorage.setItem(key, JSON.stringify(context));
}

export {
    initContext, getValueFromContext, setValueInContext
};
