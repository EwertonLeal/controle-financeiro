import { createAction, props } from "@ngrx/store";
import { MonthAndYear } from "src/app/shared/models/month-year.model";

export const setMonthAndYear = createAction(
    '[Month Selector] Set month and year',
    props<{monthAndYear: MonthAndYear}>()
)