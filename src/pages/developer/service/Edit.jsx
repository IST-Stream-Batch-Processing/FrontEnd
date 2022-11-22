import React, {useState} from 'react';
import {Input} from 'antd';
import {EditOutlined, CheckOutlined, CloseOutlined} from '@ant-design/icons';
import {useDispatch} from 'react-redux';
import {updateAliasByKey} from '../../../redux/reducers/detailSlice';

export default function Edit(props) {
    const [editing, setEditing] = useState(false);
    const [customAlias, setCustomAlias] = useState('');
    const dispatch = useDispatch();
    const {myKey, defaultValue, myType} = props;

    const editElement = (
        <>
            <Input style={{width: '100px'}} onChange={(e) => { setCustomAlias(e.target.value); }} />
            &nbsp;
            <CloseOutlined
                onClick={() => {
                    setEditing(!editing);
                }}
            />
            &nbsp;
            <CheckOutlined
                onClick={() => {
                    dispatch(updateAliasByKey({type: myType, key: myKey, alias: customAlias}));
                    setEditing(!editing);
                }}
            />
        </>
    );
    const displayElement = (
        <>
            {defaultValue}
            &nbsp;
            <EditOutlined onClick={() => { setEditing(!editing); }} />
        </>
    );
    return (
        <>
            {editing ? editElement : displayElement}
        </>
    );
}
