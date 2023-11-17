import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  invoices: [],
};

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    addInvoice: (state, action) => {
      state.invoices.push(action.payload);
    },
    editInvoice: (state, action) => {
      const { id, updatedInvoice } = action.payload;
      const index = state.invoices.findIndex((invoice) => invoice.id === id);
      if (index !== -1) {
        state.invoices[index] = updatedInvoice;
      }
    },
    deleteInvoice: (state, action) => {
      const id = action.payload;
      state.invoices = state.invoices.filter((invoice) => invoice.id !== id);
    },
  },
});

export const { addInvoice, editInvoice, deleteInvoice } = invoiceSlice.actions;

export default invoiceSlice.reducer;