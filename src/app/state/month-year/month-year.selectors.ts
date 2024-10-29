import { createFeatureSelector, createSelector } from "@ngrx/store";
import { MonthYearState } from "./month-year.reducer";

export const selectMonthYearState = createFeatureSelector<MonthYearState>('monthYear');

export const selectMonthAndYear = createSelector(
    selectMonthYearState,
    (state: MonthYearState) => state.monthAndYear
);