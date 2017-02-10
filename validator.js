/**
 * Nalezne rodièovský element vzhledem k danému elementu
 * @param el Element, ke kterému se má najít rodièovský element
 * @param nazev Název elementu, který se má najít
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
 * Validátor formuláøových prvkù
 * - funguje pro input (text, checkbox), textarea
 * @param pravidlo Pravidlo pro element: min pro minimální délku, max pro maximální délku, vzor pro shodu s regulárním výrazem, volitelny pro urèení volitelnosti/povvinosti vyplnìní prvku
 * @param omezeni Atribut omezení pravidlem: délka pro min/max, regexp pro vzor a true/false pro volitelny
 * @return aktuální element
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

	// parametry omezení
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
		alert('Byla zadána ¹patná volba validace ('+pravidlo+').');
		return this;
	}

	/**
	 * Zkontroluje celý formuláø a pøenastaví v¹echny <input type=submit />
	 * @param el Element formuláøe
	 * @return Element formuláøe
	 */
	this.potvrdFormular = function(el)
	{
		var form = rodic(el, "form"); // element form prvku el
		var inputs = form.getElementsByTagName("input"); // v¹echny elementy input formuláøe
		var textareas = form.getElementsByTagName("textarea"); // v¹echny elementy textarea
		var submits = new Array(); // v¹echny elementy submit
		var validni = true; // pøíznak validity celého formuláøe

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

		// projde v¹echny elementy input a zkontroluje jejich validitu a ulo¾í si submity
		for(var i=0; i<inputs.length; i++)
		{
			var type = inputs[i].getAttribute("type");
			if(type == 'submit') submits.push(inputs[i]);
			else
			{
				if(inputs[i].zvalidovano == false) validni = false;
			}
		}

		// projde v¹echny elementy textarea a zkontroluje jejich validitu
		for(var i=0; i<textareas.length; i++)
		{
			if(textareas[i].zvalidovano == false) validni = false;
		}

		// nastaví atribut disabled v¹em inputùm typu "submit"
		for(var i=0; i<submits.length; i++)
		{
			submits[i].disabled = !validni;
		}
	}

	/**
	 * Pokud existuje pøipravený element pro zobrazení chybové zprávy, zobrazí ji tam
	 */
	this.chybovaHlaska = function(zprava)
	{
		if( this.id && document.getElementById(this.id+"-error") )
			document.getElementById(this.id+"-error").innerHTML = zprava || '';
	}

	/**
	 * Odstraní ji¾ zadanou tøídu validátoru a nastaví novou
	 * V¹echny ostatní tøídy zachová
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
	 * Zvaliduje element podle zadaných pravidel
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
				this.chybovaHlaska("Maximální délka je "+this.maxDelka+" znakù.");
			}
			if( this.minDelka != null && this.minDelka > this.value.length )
			{
				this.zvalidovano = false;
				this.chybovaHlaska("Minimální délka je "+this.minDelka+" znakù.");
			}
			if( this.vzor != null && !this.vzor.test(this.value) )
			{
				this.zvalidovano = false;
				this.chybovaHlaska("Vstup musí být tvaru "+this.vzor+".");
			}
			if( this.volitelny != null && this.volitelny == false && this.value.length == 0 )
			{
				this.zvalidovano = false;
				this.chybovaHlaska("Prvek je povinný.");
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

	// nastaví obsluhu událostí
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

/** Nastavení validátoru pro list elementù
 * - this je v kontextu funkce list elementù
 * @param pravidlo Je pravidlo validátoru
 * @param omezeni Je omezení pravidla
 * @return seznam elementù this
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