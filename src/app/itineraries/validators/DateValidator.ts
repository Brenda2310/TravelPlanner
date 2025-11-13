import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { TripStore } from "../../trips/services/trip-store";

export class DateValidator {


    static dateWithinTripRange(tripStore: TripStore, dateControlName: string, tripControlName: string): ValidatorFn{
        return (form: AbstractControl): ValidationErrors | null => {
            const dateControl = form.get(dateControlName);
            const tripControl = form.get(tripControlName);

            if(!dateControl || !tripControl){
                return null;
            }

            const dateValue = dateControl.value;
            const tripId = Number(tripControl.value);

            if(!dateValue || !tripId){
                return null;
            }

            const trip = tripStore.trips().list.find(trip => trip.id === tripId);
            if(!trip){
                return null;
            }

            const itineraryDate = new Date(dateValue);
            const startDate = new Date(trip.startDate);
            const endDate = new Date(trip.endDate!);

            if(itineraryDate < startDate || itineraryDate > endDate){
                return { dateOutOfRange : true }
            }

            return null;
        }
    }

}