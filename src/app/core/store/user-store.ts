import { Service } from '@angular/core';
import { AllData, profileUser } from '../../features/profile/profile.model';
import { signalStore, withComputed, withHooks, withMethods, withState, patchState } from '@ngrx/signals';
import { setLoaded } from '../../../lib/with-call-state';
const initailState : AllData ={
    userProfile:null
}
export const UserStore= signalStore (
    { providedIn: 'root' },
    withState(initailState),
    withComputed(()=>({})),
    withMethods((store)=>({
        loadUser() {
            const userProfile=localStorage.getItem('currentUser');
            let parsedUser: profileUser | null = null;

            if (userProfile) {
                try {
                    parsedUser = JSON.parse(userProfile) as profileUser;
                } catch {
                    localStorage.removeItem('currentUser');
                }
            }

            patchState(store, { userProfile: parsedUser, ...setLoaded});
        }
    })),
    withHooks({
        onInit(store){
            store.loadUser();
        }
    })
)
