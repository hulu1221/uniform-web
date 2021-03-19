import {NumberDirective} from "./_directive/_number.directive";
import {NgModule} from "@angular/core";
import {NumberAndTextOnlyDirective} from "./_directive/number-and-text-only.directive";
import {NumberAndTextViOnlyDirective} from "./_directive/number-and-text-vi-only.directive";
import {NumberAndTextViSentenceOnlyDirective} from "./_directive/number-and-text-vi-sentence-only.directive";
import { NumberAndTextLatinDirective } from "./_directive/number-and-text-latin.directive";
import {NumberAndTextOnlyLatinDirective} from "./_directive/number-and-text-only-latin.directive";
import {MoneyOnlyDirective} from './_directive/money-only.directive';
import { UpperTextDirective } from "./_directive/upper-text.directive";
import {DateOnlyDirective} from './_directive/date-only.directive';
import { UpperCaseTextDirective } from "./_directive/uppercase-text.directive";

@NgModule({
  declarations: [
    NumberDirective,
    NumberAndTextOnlyDirective,
    NumberAndTextViOnlyDirective,
    NumberAndTextViSentenceOnlyDirective,
    NumberAndTextLatinDirective,
    NumberAndTextOnlyLatinDirective,
    MoneyOnlyDirective,
    UpperTextDirective,
    DateOnlyDirective,
    UpperCaseTextDirective,
  ],
  exports: [
    NumberDirective,
    NumberAndTextOnlyDirective,
    NumberAndTextViOnlyDirective,
    NumberAndTextViSentenceOnlyDirective,
    NumberAndTextLatinDirective,
    NumberAndTextOnlyLatinDirective,
    MoneyOnlyDirective,
    UpperTextDirective,
    DateOnlyDirective,
    UpperCaseTextDirective,
  ]
})
export class SharedModule { }
