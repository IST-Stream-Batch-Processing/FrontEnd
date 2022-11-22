import {createSlice} from '@reduxjs/toolkit';

const update = (obj, action) => {
    if (!obj) return;
    if (obj.key) {
        if (obj.key === action.payload.key) {
            // eslint-disable-next-line no-param-reassign
            obj.alias = action.payload.alias;
        } else {
            update(obj.type, action);
        }
    } else if (obj.name === 'Object') {
        obj.fields.forEach((item) => {
            update(item, action);
        });
    }
};

const detailSlice = createSlice({
    name: 'serviceDetail',
    initialState: {
        // value: {key: 1, value: 1, son: {key: 2, value: 2, son: {key: 3, value: 3}}}
        value: {}
    },
    reducers: {
        setServiceDetail: (state, action) => {
            // eslint-disable-next-line no-param-reassign
            state.value = action.payload;
        },
        updateAliasByKey: (state, action) => {
            if (action.payload.type === 'In') {
                update(state.value.inType, action);
            } else {
                update(state.value.outType, action);
            }
        }
    }
});

export const { setServiceDetail, updateAliasByKey } = detailSlice.actions;

export function selectServiceDetail(state) {
    return state.serviceDetail.value;
}

export default detailSlice.reducer;
