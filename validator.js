/**
 * Nalezne rodi�ovsk� element vzhledem k dan�mu elementu
 * @param el Element, ke kter�mu se m� naj�t rodi�ovsk� element
 * @param nazev N�zev elementu, kter� se m� naj�t
 * @return Element el
 * @author xpalam00
 */
function rodic(el, nazev)
{
	do
	{
		el = el.parentNode;
	} while( el != null && el.tagName.toLowerCase() != nazev.toLowerCase() );
	return el;
}

/**
 * Valid�tor formul��ov�ch prvk�
 * - funguje pro input (text, checkbox), textarea
 * @param pravidlo Pravidlo pro element: min pro minim�ln� d�lku, max pro maxim�ln� d�lku, vzor pro shodu s regul�rn�m v�razem, volitelny pro ur�en� volitelnosti/povvinosti vypln�n� prvku
 * @param omezeni Atribut omezen� pravidlem: d�lka pro min/max, regexp pro vzor a true/false pro volitelny
 * @return aktu�ln� element
 * @author xpalam00
 */
var validator = function(pravidlo, omezeni)
{
	if( this.tagName.toLowerCase() == 'input' )
	{
		if( this.getAttribute('type') == 'text' ) this.typ = 'text';
		else return this;
	}
	else if( this.tagName.toLowerCase() == 'textarea' ) this.typ = 'textarea';
	else return this;

	// parametry omezen�
	var minDelka = null;
	var maxDelka = null;
	var vzor = null;
	var volitelny = null;

	var zvalidovano = true;

	if(pravidlo == 'min')
	{
		this.minDelka = omezeni;
	}
	else if( pravidlo == 'max' )
	{
		this.maxDelka = omezeni;
	}
	else if( pravidlo == 'vzor')
	{
		this.vzor = omezeni;
	}
	else if( pravidlo == 'volitelny')
	{
		this.volitelny = omezeni;
	}
	else
	{
		alert('Byla zad�na �patn� volba validace ('+pravidlo+').');
		return this;
	}

	/**
	 * Zkontroluje cel� formul�� a p�enastav� v�echny <input type=submit />
	 * @param el Element formul��e
	 * @return Element formul��e
	 */
	this.potvrdFormular = function(el)
	{
		var form = rodic(el, "form"); // element form prvku el
		var inputs = form.getElementsByTagName("input"); // v�echny elementy input formul��e
		var textareas = form.getElementsByTagName("textarea"); // v�echny elementy textarea
		var submits = new Array(); // v�echny elementy submit
		var validni = true; // p��znak validity cel�ho formul��e

		/*form.onreset = function(e)
		{
               for(var i=0; i<inputs.length; i++)
			{
				inputs[i].validovat(e);
			}
               for(var i=0; i<textareas.length; i++)
			{
				textareas[i].validovat(e);
			}
		}*/

		// projde v�echny elementy input a zkontroluje jejich validitu a ulo�� si submity
		for(var i=0; i<inputs.length; i++)
		{
			var type = inputs[i].getAttribute("type");
			if(type == 'submit') submits.push(inputs[i]);
			else
			{
				if(inputs[i].zvalidovano == false) validni = false;
			}
		}

		// projde v�echny elementy textarea a zkontroluje jejich validitu
		for(var i=0; i<textareas.length; i++)
		{
			if(textareas[i].zvalidovano == false) validni = false;
		}

		// nastav� atribut disabled v�em input�m typu "submit"
		for(var i=0; i<submits.length; i++)
		{
			submits[i].disabled = !validni;
		}
	}

	/**
	 * Pokud existuje p�ipraven� element pro zobrazen� chybov� zpr�vy, zobraz� ji tam
	 */
	this.chybovaHlaska = function(zprava)
	{
		if( this.id && document.getElementById(this.id+"-error") )
			document.getElementById(this.id+"-error").innerHTML = zprava || '';
	}

	/**
	 * Odstran� ji� zadanou t��du valid�toru a nastav� novou
	 * V�echny ostatn� t��dy zachov�
	 */
	this.nastavTridu = function(trida)
	{
		var tridy = (this.getAttribute('class') || '').split(' ');
		var noveTridy = '';
		for(var i=0; i<tridy.length; i++)
		{
			if( tridy[i] != 'valid-error' && tridy[i] != 'valid-ok' && tridy[i] != 'valid-optional' ) noveTridy += " "+tridy[i];
		}
		if(trida != null) noveTridy += " "+trida;
		this.setAttribute('class', noveTridy);
	}

	/**
	 * Zvaliduje element podle zadan�ch pravidel
	 */
	this.validovat = function(e)
	{

		if( this.typ == 'text' || this.typ == 'textarea' )
		{
			if( this.minDelka != null && this.minDelka <= this.value.length )
			{
				this.zvalidovano = true;
			}
			if( this.maxDelka != null && this.maxDelka >= this.value.length )
			{
				this.zvalidovano = true;
			}
			if( this.vzor != null && this.vzor.test(this.value) )
			{
				this.zvalidovano = true;
			}
               if( this.volitelny != null && this.volitelny == false && this.value.length != 0 )
			{
				this.zvalidovano = true;
			}
			if( this.maxDelka != null && this.maxDelka < this.value.length )
			{
				this.zvalidovano = false;
				this.chybovaHlaska("Maxim�ln� d�lka je "+this.maxDelka+" znak�.");
			}
			if( this.minDelka != null && this.minDelka > this.value.length )
			{
				this.zvalidovano = false;
				this.chybovaHlaska("Minim�ln� d�lka je "+this.minDelka+" znak�.");
			}
			if( this.vzor != null && !this.vzor.test(this.value) )
			{
				this.zvalidovano = false;
				this.chybovaHlaska("Vstup mus� b�t tvaru "+this.vzor+".");
			}
			if( this.volitelny != null && this.volitelny == false && this.value.length == 0 )
			{
				this.zvalidovano = false;
				this.chybovaHlaska("Prvek je povinn�.");
			}
			if( this.volitelny != null && this.volitelny == true && this.value.length == 0 )
			{
				this.zvalidovano = true;
			}
			if( this.zvalidovano == true ) this.chybovaHlaska(null);
		}
		this.nastavTridy();

		this.potvrdFormular(this);

		return this.zvalidovano;
	}

	this.nastavTridy = function()
	{
		if( this.volitelny != null && this.volitelny == true && this.value.length == 0 )
		{
			this.nastavTridu('valid-optional');
		}
		else
		{
			if( this.zvalidovano == false )
			{
				this.nastavTridu('valid-error');
			}
			else
			{
				this.nastavTridu('valid-ok');
			}
		}
	}

	// nastav� obsluhu ud�lost�
	this.onkeyup = function(e)
	{
		this.validovat(e);
	}

	this.onkeydown = function(e)
	{
		this.validovat(e);
	}

	this.onkeypress = function(e)
	{
		this.validovat(e);
	}

	this.onfocus = function(e)
	{
		this.validovat(e);
	}

	this.onblur = function(e)
	{
		this.validovat(e);
	}

	this.onload = function(e)
	{
		this.validovat(e);
	}

	this.onchange = function(e)
	{
		this.validovat(e);
	}

	this.onclick = function(e)
	{
		this.validovat(e);
	}
     //this.validovat(null);
	return this;
};

/** Nastaven� valid�toru pro list element�
 * - this je v kontextu funkce list element�
 * @param pravidlo Je pravidlo valid�toru
 * @param omezeni Je omezen� pravidla
 * @return seznam element� this
 */
var listValidator = function(pravidlo, omezeni)
{
	for(var i=0; i<this.length; i++)
	{
		this[i].validator(pravidlo, omezeni);
	}
	return this;
};
HTMLInputElement.prototype.validator = validator;
HTMLTextAreaElement.prototype.validator = validator;
HTMLCollection.prototype.validator = listValidator;