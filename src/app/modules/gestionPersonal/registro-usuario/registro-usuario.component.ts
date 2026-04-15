import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector       : 'registro-usuario',
    templateUrl    : './registro-usuario.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistroUsuarioComponent
{
    constructor()
    {
    }
}
