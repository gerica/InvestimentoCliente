import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario} from '../../shared/entity/usuario';

@Component({
    moduleId: module.id,
    selector: 'top-nav',
    templateUrl: 'topnav.html',
})

export class TopNavComponent {
	usuario: Usuario;

	constructor(private router: Router) { 
		this.usuario = JSON.parse(localStorage.getItem('usuario_investimento'));		
	}

	changeTheme(color: string): void {
		var link: any = $('<link>');
		link
			.appendTo('head')
			.attr({type : 'text/css', rel : 'stylesheet'})
			.attr('href', 'themes/app-'+color+'.css');
	}

	rtl(): void {
		var body: any = $('body');
		body.toggleClass('rtl');
	}

	sidebarToggler(): void  {
		var sidebar: any = $('#sidebar');
		var mainContainer: any = $('.main-container');
		sidebar.toggleClass('sidebar-left-zero');
		mainContainer.toggleClass('main-container-ml-zero');
	}

	logout(): void{
	    localStorage.removeItem('id_token');
	    localStorage.removeItem('usuario_investimento');
    	this.router.navigate(['']);

	}
}
