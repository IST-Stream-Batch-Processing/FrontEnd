import {createSlice} from '@reduxjs/toolkit';

const inputDataSlice = createSlice({
    name: 'inputData',
    initialState: {
        value: {'input-key': 'test'}
    },
    reducers: {
        changeData: (state, action) => {
            state.value[`${action.payload.key}`] = action.payload.value;
        }
    }
});

export function selectInputData(state) {
    return state.inputData.value;
}

export const {changeData} = inputDataSlice.actions;

export default inputDataSlice.reducer;
