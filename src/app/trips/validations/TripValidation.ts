import { ValidationErrors, ValidatorFn, AbstractControl} from "@angular/forms";

export class TripValidation{
    static dateRangeValidator: ValidatorFn = (form: AbstractControl): ValidationErrors | null => {
        const startControl = form.get('startDate');
        const endControl = form.get('endDate');

        if (!startControl || !endControl || !startControl.value || !endControl.value) {
            return null;
        }

        const startDate = new Date(startControl.value);
        const endDate = new Date(endControl.value);

        if (startDate > endDate) {
            endControl.setErrors({ dateMismatch: true }); 
            return { dateMismatch: true };
        } 
        
        if (endControl.hasError('dateMismatch')) {
            const errors = { ...endControl.errors };
            delete errors['dateMismatch'];
            endControl.setErrors(Object.keys(errors).length > 0 ? errors : null);
        }

        return null; 
    };

    static optionalMinValidator(minValue: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;

            if(value === null || value === undefined || value === "") return null;
            
            return value < minValue ? { min : { requiredMin: minValue, actual: value } } : null;
        };
    }

}