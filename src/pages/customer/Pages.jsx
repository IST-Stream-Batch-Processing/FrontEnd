import React, {useEffect, useState} from 'react';
import { getFrontLayoutsByProjectId } from '../../api/gui';
import {getProjectId, getToken} from '../../utils/token';
import LayoutCard from './Card';
import SimplePageWrapper from '../../components/SimplePageWrapper';

export default function Pages() {
    const [pages, setPages] = useState([]);
    useEffect(() => {
        getFrontLayoutsByProjectId(getProjectId(getToken())).then((res) => {
            setPages(res);
        });
    }, []);

    function getCards() {
        return (
            <div
                style={{
                    paddingInline: '5%',
                    display: 'flex',
                    flexWrap: 'wrap'
                }}
            >
                {
                    pages.map(item => <LayoutCard key={`${item.id}`} data={item} />)
                }
            </div>
        );
    }

    return (
        <div>
            {SimplePageWrapper(getCards(), {currentModel: 'Customer'})}
        </div>
    );
}
