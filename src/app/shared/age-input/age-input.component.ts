import { Component, forwardRef, OnInit, OnDestroy, Input } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map, merge, startWith } from 'rxjs/operators';
import { combineLatest, Subscription } from 'rxjs';
import {
  subDays,
  subMonths,
  subYears,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  isBefore,
  format,
  parse
} from 'date-fns';
import { isValidDate } from '../../utils/date.util';
export enum AgeUnit {
  Year = 0,
  Month,
  Day
}

export interface Age {
  age: number;
  unit: AgeUnit;
}

@Component({
  selector: 'app-age-input',
  templateUrl: './age-input.component.html',
  styleUrls: ['./age-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AgeInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AgeInputComponent),
      multi: true
    }
  ]
})
export class AgeInputComponent implements ControlValueAccessor, OnInit, OnDestroy {
  constructor(private fb: FormBuilder) { }

  @Input() daysTop = 90;
  @Input() daysBottom = 0;
  @Input() monthsTop = 24;
  @Input() monthsBottom = 1;
  @Input() yearsTop = 150;
  @Input() yearsBottom = 1;
  @Input() format = 'yyyy-MM-dd';
  @Input() debounceTime = 300;
  selectedUnit = AgeUnit.Year;
  ageUnits = [
    {value: AgeUnit.Year, label: '岁'},
    {value: AgeUnit.Month, label: '月'},
    {value: AgeUnit.Day, label: '日'},
  ];
  form: FormGroup;
  sub: Subscription;

  validateDate(c: FormControl): {[key: string]: any} {
    const val = c.value;
    return isValidDate(val) ? null : {
      birthDayInvalid: true
    };
  }
  private propagateChange = (_: any) => {};

  ngOnInit() {
    this.form = this.fb.group({
      birthday: ['', this.validateDate],
      age: this.fb.group({
        ageNum: [],
        ageUnit: [AgeUnit.Year]
      }, {validator: this.validateAge('ageNum', 'ageUnit')})
    });
    const birthday = this.form.get('birthday');
    const ageNum = this.form.get('age').get('ageNum');
    const ageUnit = this.form.get('age').get('ageUnit');

    const birthday$ = birthday.valueChanges.pipe(map(d => {
      return {date: JSON.stringify(d).indexOf('T') > -1 ? format(d, this.format) : d, from: 'birthday'};
    }), debounceTime(this.debounceTime), distinctUntilChanged(), filter(() => birthday.valid));
    const ageNum$ = ageNum.valueChanges.pipe(startWith(ageNum.value as object), debounceTime(this.debounceTime), distinctUntilChanged());
    const ageUnit$ = ageUnit.valueChanges.pipe(startWith(ageUnit.value as object), debounceTime(this.debounceTime), distinctUntilChanged());
    const age$ = combineLatest(ageNum$, ageUnit$, (n, u) => {
      return this.toDate({age: Number.isNaN(n) ? 0 : n, unit: u});
    }).pipe(map(d => {
      return {date: d, from: 'age'};
    }), filter(() => this.form.get('age').valid));

    age$.subscribe( d => {
      const age = this.toAge(d.date);
      const ageToCompare = this.toAge(birthday.value);
      if (age.age !== ageToCompare.age || age.unit !== ageToCompare.unit) {
        birthday.patchValue(d.date, {emitEvent: false});
        this.propagateChange(d.date);
      }
    });

    birthday$.subscribe( d => {
      const age = this.toAge(d.date);
      if (age.age !== ageNum.value) {
        ageNum.patchValue(age.age, {emitEvent: false});
      }
      if (age.unit !== ageUnit.value) {
        this.selectedUnit = age.unit;
        ageUnit.patchValue(age.unit, {emitEvent: false});
      }
      this.propagateChange(d.date);
    });

    // const merged$ = birthday$.pipe(merge(age$), filter(() => this.form.valid));

    /*merged$.subscribe(d => {
      console.log('merged$:' + d);
      const age = this.toAge(d.date);
      if (d.from === 'birthday') {
        if (age.age !== ageNum.value) {
          ageNum.patchValue(age.age, {emitEvent: false});
        }
        if (age.unit !== ageUnit.value) {
          this.selectedUnit = age.unit;
          ageUnit.patchValue(age.unit, {emitEvent: false});
        }
        this.propagateChange(d.date);
      } else {
        const ageToCompare = this.toAge(birthday.value);
        if (age.age !== ageToCompare.age || age.unit !== ageToCompare.unit) {
          birthday.patchValue(d.date, {emitEvent: false});
          this.propagateChange(d.date);
        }
      }
    });*/

  }

  writeValue(obj: any): void {
    if (obj) {
      const date = obj;
      this.form.get('birthday').patchValue(obj);
      const age = this.toAge(date);
      this.form.get('age').get('ageNum').patchValue(age.age);
      this.form.get('age').get('ageUnit').patchValue(age.unit);
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {

  }

  toAge(dateStr: string): Age {
    const date = parse(dateStr, this.format, new Date());
    const now = Date.now();
    let beforeFlag = isBefore(subDays(now, this.daysTop), date);
    if (beforeFlag) {
      return {age: differenceInDays(now, date), unit: AgeUnit.Day};
    } else {
      beforeFlag = isBefore(subMonths(now, this.monthsTop), date);
      if (beforeFlag) {
        return {age: differenceInMonths(now, date), unit: AgeUnit.Month};
      } else {
        return {age: differenceInYears(now, date), unit: AgeUnit.Year};
      }
    }
  }

  toDate(age: Age): string {
    const now = Date.now();
    switch (age.unit) {
      case AgeUnit.Year: {
        return format(subYears(now, age.age), this.format);
      }
      case AgeUnit.Month: {
        return format(subMonths(now, age.age), this.format);
      }
      case AgeUnit.Day: {
        return format(subDays(now, age.age), this.format);
      }
      default: {
        return null;
      }
    }
  }

  validate(c: FormControl): {[key: string]: any} {
    const val = c.value;
    if (!val) {
      return null;
    }
    if (isValidDate(val)) {
      return null;
    }
    return {
      dateOfBirthInvalid: true
    };
  }

  validateAge(ageNumkey: string, ageUnitKey: string) {
    return (group: FormGroup): {[key: string]: any} => {
      const ageNum = group.controls[ageNumkey];
      const ageUnit = group.controls[ageUnitKey];
      let result = false;
      const ageNumVal = ageNum.value;
      switch (ageUnit.value) {
        case AgeUnit.Year: {
          result = ageNumVal >= this.yearsBottom && ageNumVal < this.yearsTop;
          break;
        }
        case AgeUnit.Month: {
          result = ageNumVal >= this.monthsBottom && ageNumVal < this.monthsTop;
          break;
        }
        case AgeUnit.Day: {
          result = ageNumVal >= this.daysBottom && ageNumVal < this.daysTop;
          break;
        }
        default: {
          break;
        }
      }
      return result ? null : {ageInvalid: true};
    };
  }

  ngOnDestroy(): void {
    if (this.sub) {

    }
  }
}
