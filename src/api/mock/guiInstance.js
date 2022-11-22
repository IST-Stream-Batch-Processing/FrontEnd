const text1 = {
    type: 'text',
    id: 2,
    displayName: '基础文本',
    staticProperties: {text: '今天天气很晴朗'},
    boundMap: {},
    bindingMap: {}
};

const text2 = {
    type: 'text',
    id: 3,
    displayName: '基础文本',
    staticProperties: {},
    boundMap: {},
    bindingMap: {text: {type: 'component', field: 'input-key'}}
};

const text3 = {
    type: 'text',
    id: 3,
    displayName: '基础文本',
    staticProperties: {},
    boundMap: {},
    bindingMap: {text: {type: 'component', field: 'input-key-3'}}
};

const title1 = {
    type: 'title',
    id: 1,
    displayName: '基础文本',
    staticProperties: {text: '日记'},
    boundMap: {},
    bindingMap: {}
};

const table1 = {
    type: 'table',
    id: 5,
    displayName: '展示用户',
    dataSet: ['{"用户名": "徐珺涵", "电话号码": "15044341612"}'],
    showFields: ['用户名', '电话号码'],
    buttons: [[{
        id: 3,
        type: 'button',
        displayName: '点击上传工资单',
        apiInstance: {
            type: 'atomicService',
            serviceId: 'serviceId',
            serviceName: 'serviceName',
            staticProperties: {},
            boundMap: {'salaryId': 1},
            bindingMap: {money: {type: 'component', field: 'input-key-2'}, text: {type: 'component', field: 'input-key-2'}},
            in: {
                'name': 'Object',
                'className': 'MyIn',
                'fields': [
                    {
                        'key': '2eb65737-a0f2-4ff4-8d5f-2e0493ba2c03',
                        'name': 'salaryId',
                        'alias': null,
                        'type': {
                            'name': 'Integer'
                        }
                    },
                    {
                        'key': '9512a510-9b51-4b3e-88f6-8af6e1c288cd',
                        'name': 'money',
                        'alias': null,
                        'type': {
                            'name': 'Integer'
                        }
                    }
                ]
            }
        }
    }]]
};

const layoutContainer = {
    id: 1,
    type: 'layout',
    displayName: '展示容器',
    components: [
        title1, text1, text2, table1
    ]
};

const input1 = {
    id: 1,
    type: 'input',
    displayName: '报价',
    staticProperties: {},
    field: 'input-key'
};

const input2 = {
    id: 2,
    type: 'input',
    displayName: '工资数目',
    staticProperties: {},
    field: 'input-key-2'
};

const input3 = {
    id: 3,
    type: 'input',
    displayName: '文本2',
    staticProperties: {},
    field: 'input-key-3'
};

const button = {
    id: 3,
    type: 'button',
    displayName: '点击上传工资单',
    apiInstance: {
        type: 'atomicService',
        serviceId: 'serviceId',
        serviceName: 'serviceName',
        staticProperties: {},
        boundMap: {'salaryId': 1},
        bindingMap: {money: {type: 'component', field: 'input-key-2'}, text: {type: 'component', field: 'input-key-2'}},
        in: {
            'name': 'Object',
            'className': 'MyIn',
            'fields': [
                {
                    'key': '2eb65737-a0f2-4ff4-8d5f-2e0493ba2c03',
                    'name': 'salaryId',
                    'alias': null,
                    'type': {
                        'name': 'Integer'
                    }
                },
                {
                    'key': '9512a510-9b51-4b3e-88f6-8af6e1c288cd',
                    'name': 'money',
                    'alias': null,
                    'type': {
                        'name': 'Integer'
                    }
                }
            ]
        }
    }
};

const formContainer = {
    id: 2,
    type: 'form',
    displayName: '表单容器',
    components: [
        text3, input1, input3, input2, button
    ]
};

const instance = {
    name: '新界面',
    containers: [
        layoutContainer, formContainer
    ]
};

export {instance};
