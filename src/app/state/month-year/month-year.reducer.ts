import { createReducer, on } from "@ngrx/store";
import { MonthAndYear } from "src/app/shared/models/month-year.model";
import { setMonthAndYear } from "./month-year.actions";

export interface MonthYearState {
    monthAndYear: MonthAndYear | null;
}

export const initialState: MonthYearState = {
    monthAndYear: null,
}

export const monthYearReducer = createReducer(
    initialState,
    on(setMonthAndYear, (state, { monthAndYear }) => ({
        ...state,
        monthAndYear
    }))
);