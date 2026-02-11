import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { CommonService } from "../services/common.service";

@Injectable({ providedIn: 'root' })
export class RFIDCheckResolver implements Resolve<boolean> {

  private _enabled: BehaviorSubject<boolean>;

  constructor(private service: CommonService) {
    this._enabled = new BehaviorSubject(null);
  }

  get isEnabled$(): Observable<boolean> {
    return this._enabled.asObservable();
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean>{
    return this.service.postHttpService({}, "GetRFIDConfig").pipe(
      tap((response: any) => {
        this._enabled.next(response.responseData.enabled == 1 ? true : false);
      })
    );
  }
}