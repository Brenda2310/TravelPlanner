import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class PasswordValidators{
    static match(controlName: string, matchingControlName: string): ValidatorFn{
        return (form: AbstractControl): ValidationErrors | null => {
            const control = form.get(controlName);
            const matchingControl = form.get(matchingControlName);

            if (control && matchingControl && control.value !== matchingControl.value) {
                return { mismatch: true };
            }
            return null;
        }
    }

    static strongPassword(control: AbstractControl): ValidationErrors | null {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!()_+=\-]).{8,20}$/;
        if (control.value && !regex.test(control.value)) {
            return { strongPassword: true };
        }
        return null;
    }
}