import {useSelector} from 'react-redux';
import {selectInputData} from '../../../../redux/reducers/inputDataSlice';

export function haveApi(button) {
    return button.apiInstance;
}

export function haveJump(jumpingLayoutInstance) {
    return jumpingLayoutInstance && jumpingLayoutInstance.layoutId
    && jumpingLayoutInstance.boundMap && jumpingLayoutInstance.bindingMap;
}

/**
 * 先在static中找text，如果没有再和input绑定
 */
export function renderText(component) {
    if (component.staticProperties && component.staticProperties.text) {
        return component.staticProperties.text;
    }
    if (component.boundMap && component.boundMap.text) {
        return component.boundMap.text;
    }
    if (component.bindingMap && component.bindingMap.text) {
        const dataSource = component.bindingMap.text;
        switch (dataSource.type) {
            case 'component':
                const inputData = useSelector(selectInputData);
                return inputData[`${dataSource.field}`];
            default:
        }
    }
    console.error('找不到text的数据');
    return '点击';
}
