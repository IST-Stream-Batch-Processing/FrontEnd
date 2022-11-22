const tmp = {
    'id': '0',
    'displayName': '容器1',
    'type': 'form',
    'components': [
    {
        'id': '0',
        'displayName': '组件1',
        'type': 'input'
    },
        {
            'id': '1',
            'displayName': '组件2',
            'type': 'input'
        },
        {
            'id': '2',
            'displayName': '组件3',
            'type': 'input'
        }
],
    'viewBindings': [],
    'updateApiData':
    {
        // TODO
        'tableId': 'tableId',
        'type': 'Create',
        'bindings':
        [
            {
                'fromContext': false,
                'updateFieldName': 'qian',
                'componentId': '0'
            },
            {
                'fromContext': false,
                'updateFieldName': 'qian',
                'componentId': '1'
            },
            {
                'fromContext': false,
                'updateFieldName': 'qian',
                'componentId': '2'
            }
        ]
    }
};

export default tmp;
