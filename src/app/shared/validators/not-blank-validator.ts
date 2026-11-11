import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

//Fails if the value is a string made of only whitespace
export function notBlank(control: AbstractControl): ValidationErrors | null{
    const value = control.value;
    if(typeof value === 'string' && value.length > 0 && value.trim().length === 0){
        return {blank: true};
    }
    return null;
}

export function forbiddenValue(word: string): ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        console.log(value)
        if(typeof value === 'string' && value === "test"){
            return {forbidden: true};
        }

        return null;
    }
} 

