import React from 'react';
import {useHistory} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {Button, message} from 'antd';
import {haveApi, haveJump, renderText} from './renderUtil';
import {myConcat} from '../api-util/TypeTree';
import {selectInputData} from '../../../../redux/reducers/inputDataSlice';
import {generalInvokeASServiceSync} from '../../../../api/developer';
import {
    generalNewDataItem, generalUpdateDataItem, generalDeleteDataItem
} from '../../../../api/data';
import {generalInvokeOSService} from '../../../../api/osService';

export default function MyButton(props) {
    const {component} = props;
    const inputData = useSelector(selectInputData);
    const history = useHistory();

    function getValueForComponent(key, currentComponent) {
        if (currentComponent.boundMap[`${key}`]) {
            return currentComponent.boundMap[`${key}`];
        }
        if (currentComponent.bindingMap[`${key}`]) {
            switch (currentComponent.bindingMap[`${key}`].type) {
                case 'component':
                    return inputData[`${currentComponent.bindingMap[`${key}`].field}`];
                default:
                    console.error('getValueFromApi: 未知的绑定类型');
            }
        }
        return '';
    }

    function collectDataToInput(key, api, currentField, fatherObject) {
        switch (currentField.type.name) {
            case 'Object':
                fatherObject[`${currentField.name}`] = {};
                currentField.type.fields.forEach((item) => {
                    collectDataToInput(myConcat(key, currentField.name), api, item, fatherObject[`${currentField.name}`]);
                });
                break;
            default:
                fatherObject[`${currentField.name}`] = getValueForComponent(myConcat(key, currentField.name), api);
        }
    }

    function compareValue(fieldValue, queryType, value) {
        switch (queryType) {
            case 'lt':
                return fieldValue < value;
            case 'le':
                return fieldValue <= value;
            case 'eq':
                return fieldValue == value;
            case 'ge':
                return fieldValue >= value;
            case 'gt':
                return fieldValue > value;
            case 'like':
                return fieldValue.indexOf(value) > -1;
            default:
                return false;
        }
    }

    function fulfillConditionRecursively(queryCondition, res) {
        if (queryCondition.logicType) {
            if (queryCondition.logicType === 'or') {
                return (fulfillConditionRecursively(queryCondition.left, res) || fulfillConditionRecursively(queryCondition.right, res));
            }
            if (queryCondition.logicType === 'and') {
                return (fulfillConditionRecursively(queryCondition.left, res) && fulfillConditionRecursively(queryCondition.right, res));
            }
        }
        const fieldValue = JSON.parse(res)[queryCondition.fieldName];
        const value = queryCondition.value;
        return compareValue(fieldValue, queryCondition.queryType, value);
    }

    function fulfillCondition(queryCondition, res) {
        if ((queryCondition.fieldName === 'none' || queryCondition.fieldName === 'requestSuccess')
            && queryCondition.queryType === null && queryCondition.value === null) return true;
        return fulfillConditionRecursively(queryCondition, res);
    }

    function handleNextPageInput(jump) {
        let nextPageInput = {};
        if (jump.boundMap) {
            nextPageInput = {...jump.boundMap};
        }
        if (jump.bindingMap) {
            Object.keys(jump.bindingMap).forEach((key) => {
                const currentBinding = jump.bindingMap[`${key}`];
                if (currentBinding.type === 'component') {
                    nextPageInput[`${key}`] = inputData[`${currentBinding.field}`] ? inputData[`${currentBinding.field}`] : '';
                }
            });
        }
        history.push(`/view/${jump.layoutId}`, nextPageInput);
    }

    function handleJump(button, res) {
        // 跳转问题解决方案
        const conditionalOutputs = button.conditionalOutputInstances;
        for (let i = 0; i < conditionalOutputs.length; i += 1) {
            const item = conditionalOutputs[i];
            if (res !== 'error' && fulfillCondition(item.queryCondition, res)) {
                // 无条件/条件满足
                if (item.successMsg) {
                    if (item.successMsg.indexOf('{') === 0 && item.successMsg.indexOf('}') === item.successMsg.length - 1) {
                        const fieldName = item.successMsg.substring(1, item.successMsg.length - 1);
                        message.success(JSON.parse(res)[fieldName]);
                    } else message.success(item.successMsg);
                }
                if (haveJump(item.jumpingLayoutInstances[0])) handleNextPageInput(item.jumpingLayoutInstances[0]);
            } else {
                if (item.failMsg) {
                    if (item.failMsg.indexOf('{') === 0 && item.failMsg.indexOf('}') === item.failMsg.length - 1) {
                        const fieldName = item.failMsg.substring(1, item.failMsg.length - 1);
                        if (res === 'error') message.error('发生未知错误！');
                        else message.error(JSON.parse(res)[fieldName]);
                    } else message.error(item.failMsg);
                }
                if (haveJump(item.jumpingLayoutInstances[1])) handleNextPageInput(item.jumpingLayoutInstances[1]);
            }
        }
    }

    /**
     * 通过func发送请求，处理loading动画，得到结果后调用jump
     * @param func
     * @param id
     * @param data
     * @param button
     */
    function handleRequest(func, id, data, button) {
        props.setIsLoading(true);
        func(id, data).then((res) => {
            props.setIsLoading(false);
            handleJump(button, res);
        });
    }

    function transferData(data) {
        const formData = new FormData();
        Object.keys(data).forEach((i) => {
            formData.append(i, data[i]);
        });
        return formData;
    }

    function onClickButton(button) {
        if (haveApi(button)) {
            const api = button.apiInstance;
            switch (api.type) {
                case 'multiService':
                case 'atomicService':
                    // 整理好发请求的参数，先发请求运行原子服务，然后根据返回的实例id，处理运行结果
                    if (api.in.name === 'Object') {
                        const parent = {};
                        api.in.fields.forEach((item) => {
                            collectDataToInput('', api, item, parent);
                        });
                        if (api.type === 'atomicService') {
                            // invokeASServiceSync(api.serviceId, parent).then((res) => {
                            // console.log(res);
                            // handleJump(button);
                            // });
                            handleRequest(generalInvokeASServiceSync, api.serviceId, parent, button);
                        } else {
                            // invokeOSService(api.serviceId, parent).then((res) => {
                            //     console.log(res);
                            //     handleJump(button);
                            // });
                            handleRequest(generalInvokeOSService, api.serviceId, parent, button);
                        }
                    } else {
                        // eslint-disable-next-line no-lonely-if
                        if (api.type === 'atomicService') {
                            // invokeASServiceSync(api.serviceId, getValueForComponent('', api)).then((res) => {
                            //     console.log(res);
                            //     handleJump(button);
                            // });
                            handleRequest(generalInvokeASServiceSync, api.serviceId, getValueForComponent('', api), button);
                        } else {
                            // invokeOSService(api.serviceId, getValueForComponent('', api)).then((res) => {
                            //     console.log(res);
                            //     handleJump(button);
                            // });
                            handleRequest(generalInvokeOSService, api.serviceId, getValueForComponent('', api), button);
                        }
                    }
                    break;
                // TODO 对于dataModel来说，发送请求参数如何取决于type
                case 'dataModel':
                    switch (api.actionType) {
                        case 'post':
                            const postData = {};
                            // in
                            api.out.fields.forEach((item) => {
                                collectDataToInput('', api, item, postData);
                            });
                            // newDataItem(api.tableId, postData).then((res) => {
                            //     console.log(res);
                            //     handleJump(button);
                            // });
                            handleRequest(generalNewDataItem, api.tableId, transferData(postData), button);
                            break;
                        case 'put':
                            const putData = {};
                            api.in.fields.forEach((item) => {
                                collectDataToInput('', api, item, putData);
                            });
                            // updateDataItem(api.tableId, putData).then((res) => {
                            //     console.log(res);
                            //     handleJump(button);
                            // });
                            handleRequest(generalUpdateDataItem, api.tableId, transferData(putData), button);
                            break;
                        case 'delete':
                            const id = getValueForComponent('id', api);
                            // deleteDataItem(api.tableId, id).then((res) => {
                            //     console.log(res);
                            //     handleJump(button);
                            // });
                            handleRequest(generalDeleteDataItem, api.tableId, id, button);
                            break;
                        default:
                            console.error('未知的数据服务请求类型');
                    }
                    break;
                default:
                    console.error('未知的api类型！');
            }
        } else { handleJump(button, null); }
    }

    return (
        <Button
            type="primary"
            onClick={
                () => {
                    onClickButton(component);
                }
            }
            style={props.style}
            {...props.properties}
            className={props.className}
        >
            {renderText(component)}
        </Button>
    );
}
