import {configureStore} from '@reduxjs/toolkit';
import serviceDetailSlice from './reducers/detailSlice';
import inputDataSlice from './reducers/inputDataSlice';

export default configureStore({
    reducer: {
        serviceDetail: serviceDetailSlice,
        inputData: inputDataSlice
    }
});
