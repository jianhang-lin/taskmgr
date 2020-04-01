import { ChangeDetectionStrategy, Component, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Address } from '../../domain';
import { combineLatest, Observable, of, Subject, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { getProvinces, getAreaByCity, getCitiesByProvince } from '../../utils/area.util';

@Component({
  selector: 'app-area-list',
  templateUrl: './area-list.component.html',
  styleUrls: ['./area-list.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AreaListComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AreaListComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AreaListComponent implements OnInit, OnDestroy, ControlValueAccessor {

  // tslint:disable-next-line:variable-name
  _address: Address = {
    province: '',
    city: '',
    district: '',
    street: ''
  };
  provinceS = new Subject();
  cityS = new Subject();
  districtS = new Subject();
  streetS = new Subject();
  province$: Observable<string[]>;
  city$: Observable<string[]>;
  district$: Observable<string[]>;
  sub: Subscription;
  private propagateChange = (_: any) => {};
  constructor() { }

  ngOnInit(): void {
    const province$ = this.provinceS.asObservable().pipe(startWith(''));
    const city$ = this.cityS.asObservable().pipe(startWith(''));
    const district$ = this.districtS.asObservable().pipe(startWith(''));
    const street$ = this.streetS.asObservable().pipe(startWith(''));
    const val$ = combineLatest([province$, city$, district$, street$], (p, c, d, s) => {
      return {
        province: p,
        city: c,
        district: d,
        street: s
      };
    });
    this.sub = val$.subscribe(v => {
      this.propagateChange(v);
    });
    this.province$ = of(getProvinces());
    this.city$ = province$.pipe(map((p: string) => getCitiesByProvince(p)));
    this.district$ = combineLatest(province$, city$, (p: string, c: string) => getAreaByCity(p, c));
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  onIdTypeChange($event: Event, value: any) {

  }

  onIdNoChange(value: any) {

  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(obj: Address): void {
    if (obj) {
      this._address = obj;
      if (this._address.province) {
        this.provinceS.next(this._address.province);
      }
      if (this._address.city) {
        this.cityS.next(this._address.city);
      }
      if (this._address.district) {
        this.districtS.next(this._address.district);
      }
      if (this._address.street) {
        this.streetS.next(this._address.street);
      }
    }
  }

  validate(c: FormControl): {[key: string]: any} {
    const val = c.value;
    if (!val) {
      return null;
    }
    if (val.province && val.city && val.distrct && val.street) {
      return null;
    }
    return {
      addressInvalid: true
    };
  }

  onProvinceChange() {
    this.provinceS.next(this._address.province);
  }

  onCityChange() {
    this.cityS.next(this._address.city);
  }

  onDistrictChange() {
    this.districtS.next(this._address.district);
  }

  onStreetChange() {
    this.streetS.next(this._address.street);
  }
}
