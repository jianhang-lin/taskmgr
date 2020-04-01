import { ChangeDetectionStrategy, Component, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Identity, IdentityType } from '../../domain';
import { combineLatest, Observable, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-identity-input',
  templateUrl: './identity-input.component.html',
  styleUrls: ['./identity-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IdentityInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => IdentityInputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IdentityInputComponent implements OnInit, OnDestroy, ControlValueAccessor {
  constructor() { }

  get idType(): Observable<IdentityType> {
    return this.idType$.asObservable();
  }

  get idNo(): Observable<string> {
    return this.idNo$.asObservable();
  }

  identityTypes = [
    {
      value: IdentityType.IdCard, lable: '身份证'
    },
    {
      value: IdentityType.Insurance, lable: '医保'
    },
    {
      value: IdentityType.Passport, lable: '护照'
    },
    {
      value: IdentityType.Military, lable: '军官证'
    },
    {
      value: IdentityType.Other, lable: '其他'
    }
   ];
  identity: Identity = {identityType: null, identityNo: null};
  private idType$ = new Subject<IdentityType>();
  private idNo$ = new Subject<string>();
  private sub: Subscription;
  private propagateChange = (_: any) => {};

  ngOnInit(): void {
    const val$ = combineLatest(this.idNo$, this.idType$, (n, t) => {
      return {
        identityType: t,
        identityNo: n
      };
    });
    this.sub = val$.subscribe(id => {
      this.propagateChange(id);
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  onIdTypeChange(idType: IdentityType) {
    this.idType$.next(idType);
  }

  onIdNoChange(idNo: string) {
    this.idNo$.next(idNo);
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(obj: any): void {
    if (obj) {
      this.identity = obj;
    }
  }

  validate(c: FormControl): {[key: string]: any} {
    const val = c.value;
    if (!val) {
      return null;
    }
    switch (val.identityType) {
      case IdentityType.IdCard: {
        return this.validateIdCard(c);
      }
      case IdentityType.Passport: {
        return this.validatePassport(c);
      }
      case IdentityType.Military: {
        return this.validateMilitary(c);
      }
      case IdentityType.Insurance:
      default: {
        return null;
      }
    }
  }

  private validateIdCard(c: FormControl): {[key: string]: any} {
    const val = c.value.identityNo;
    if (val.length !== 18) {
      return {idInvalid: true};
    }
    const pattern = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}[x0-9]$/;
    return pattern.test(val) ? null : {idNotValid: true};
  }

  private validatePassport(c: FormControl): {[key: string]: any} {
    const val = c.value.identityNo;
    if (val.length !== 9) {
      return {idInvalid: true};
    }
    const pattern = /^[GgEe]\d{8}$/;
    return pattern.test(val) ? null : {idNotValid: true};
  }

  private validateMilitary(c: FormControl): {[key: string]: any} {
    const val = c.value.identityNo;
    const pattern = /[\u4e00-\u9fa5](字第)(\d{4,8})(号?)$/;
    return pattern.test(val) ? null : {idNotValid: true};
  }
}
