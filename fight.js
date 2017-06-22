//minden ellenfél 2d6 + a saját alapsebzését sebzi, ezt úgy lehetne módosítani h a táblázatba, ahova sebzését lementem az ellenfélnek, oda vmi hülye jellel (pl.: AP&#hány_kocka&#milyen_kocka) elválasztva be írom a random sebzést is (persze fenn lehet tartani neki külön 2 cellát is), amikor ajax-szal kiolvasom a táblázatból, akkor egy string sorként kapom meg az adatokat veszzővel elválasztva, ebből egy array lesz amikor szét darabolom a veszzőknél, és azt az array darabot ahol ezek vannak még egyszer szét lehet darabolni ennél a jelnél (ha küln cellákba rakom akkor nagyobb lesz az adatbázis és lehet kevésbé átláthatóbb)

(function() {

	//h globálisak legyenek az általános változók, amik több helyen is szerepelnek
	var enemy1
	var hero1

	function Enemy(name, maxHP, AP, dmg, DP) {
	//az ellenfeleket lehet vele definiálni (most a hős is ezzel van)
		this.alive = true;
		this.name = name;
		this.maxHP = maxHP;
		this.currentHP = maxHP;
		this.AP = AP;
		this.dmg = dmg;
		this.DP = DP;
	}

	function print_before(smth, id, tag) {
	//kiírja amit smth paraméterként megadok, a paraméterként megadott id-ba és tag-be
		var htmlElement = document.createElement(tag);
		var text = document.createTextNode(smth);
		htmlElement.appendChild(text);
		document.getElementById(id).insertBefore(htmlElement, document.getElementById(id).childNodes[0]);
	}

	function print(smth, id, tag) {
	//kiírja amit smth paraméterként megadok, a paraméterként megadott id-ba és tag-be
		var htmlElement = document.createElement(tag);
		var text = document.createTextNode(smth);
		htmlElement.appendChild(text);
		document.getElementById(id).appendChild(htmlElement);
	}

	function print_inner(smth, id) {
	//kiírja amit smth paraméterként megadok, a paraméterként megadott id-ba és tag-be
		document.getElementById(id).innerHTML = smth;
	}

	function printButton(smth, id, func) {
	//kiírja egy button tag-re amit smth paraméterként megadok, a paraméterként megadott id-ba; ha a gombra kattintunk, akkor futtatja a func paraméterben megadott függvényt
	//így lehet hívni: printButton("paraméter1", "paraméter2", function() {függvény_név(függvény_paraméter1, függvény_paraméter2)}); -> printButton("alma", "demo", function() {fight(hero1, enemy1)});
		var myButton = document.createElement("button");
		myButton.innerHTML = smth;
		myButton.onclick = func;
		document.getElementById(id).appendChild(myButton);
	}

	function image(link, where) {
	//beszúr egy képet a Where id-val rendelkező tag-be, a kép elérési útja a link paraméter
		var img = document.createElement("img");
		img.src = link;
		img.width = 300;
		img.height = 500;
		img.alt = "";
		document.getElementById(where).appendChild(img);
	}

	function remove(where, what) {
	//kitörli a where id-jú vmiből a what id-jú vmit
		var parent = document.getElementById(where);
		var child = document.getElementById(what);
		parent.removeChild(child);
	}

	function random(x) {
	//1 és x között ad egy random egész számot
		y = Math.floor(Math.random() * x + 1);
		return y;
	}

	function hit(p1, p2) {
	//ha p1 TÉ + d20 nagyobb mint p2 VÉ-je, akkor p1 megütötte p2-t -> true, egyébként false
		if (p1.AP + random(20) > p2.DP) {
			return true;
		} else {
			return false;
		}
	}

	function fight(hero, enemy) {
	//Lefutattja a teljes harcot, a hit() függvénnyel megnézi h sikerült-e az ütés, és ha igen kiszámolja a sebzést. Ha vmelyik harcoló fél HP-ja 0-ra csökken akkor nyert a másik.
	//azért tud ütni a szörny is ha már meghalt mert a szörny üt először csak az én ütésem van felülre listázva, mert ugye mindig a legfelső a legújabb (úgy oldottam meg, h csak egy változóba mentettem le h mi történik ütéskor, és csak azt iratom ki ami valójában is megtörtént)
		if (hero.alive && enemy.alive) {
			//amikor a hero üt
			if (hit(hero, enemy)) {
				dmg = hero.dmg + 2 * random(6);
				enemy.currentHP = enemy.currentHP - dmg;
				if (enemy.currentHP <= 0) {
					enemy.alive = false;
					hero_hit = "You did " + dmg + " points of damage and killed that monster! The " + enemy.name + " lies in front of you!", "fight", "h3";
					remove("buttons", "button_fight");
					printButton("Again", "button_end", function() {window.location.reload()});
					printButton("Save", "button_end", function() {save()});
				} else {
					hero_hit = "You hit the " + enemy.name + ", and you did " + dmg + " points of damage!", "fight", "h3";
				}
			} else {
				enemy.currnetHP = enemy.currentHP;
				hero_hit = "How can you miss a " + enemy.name + "!? Defend yourself, here it comes!", "fight", "h3";
			}

		}
		if (hero.alive && enemy.alive) {
			//amikor az ellenfél üt
			if (hit(enemy, hero)) {
				dmg = enemy.dmg + 2 * random(6);
				hero.currentHP = hero.currentHP - dmg;
				if (hero.currentHP <= 0) {
					hero.alive = false;
					enemy_hit = "It\'s over! You got " + dmg + " points of damage. He killed you, and now he\'s gonna roast you and eat you!", "fight", "h4";
					remove("buttons", "button_fight");
					printButton("Again", "button_end", function() {window.location.reload()});
					printButton("Save", "button_end", function() {save()});
				} else {
					enemy_hit = "The " + enemy.name + " hit you! You got " + dmg + " points of damage!", "fight", "h4";
				}
			} else {
				hero.currnetHP = enemy.currentHP;
				enemy_hit = "You\'re lucky. He missed you. Now it\'s your turn. Kill the " + enemy.name + "!", "fight", "h4";
			}
			
		}

		//az aktuális HP kiiratása
		print_inner(enemy.currentHP, "top-right-enemy");
		print_inner(hero.currentHP, "top-left-hero");

		//ütéseket itt iratom csak ki, nem a akkor amikor megtörténik a függvényben, mert különben még akkor is ütne egyet az ellenfél amikor épp meghal
		if (enemy.alive === false) {
			print_before(" ", "fight", "h4");
			print_before(hero_hit, "fight", "h3");
		} else {
			print_before(enemy_hit, "fight", "h4");
			print_before(hero_hit, "fight", "h3");
		}
	}

	function save() {
		alert("Hahaha! Foool! You can\'t save! Can you save in real life too?!");
	}

	function start_fight(enemy_SQL) {
	//maga a harcnak a lezajlása (az ajax-szal megkapott adatokat lementi az enemy1-be, definiálja a hero1-et is; megjeleníti az ellenfél képét, és a prológust a harchoz; kiírja a HP-kat és létrehozza a harc gombot)
		
		//feldarabolja az előző függvénnyel kapott szöveget array-já
		enemy_array = enemy_SQL.split(",");

		//a feldarabolt string-ben az adatok string-ként vannak lementve és ebből csinál integert
		enemy1 = new Enemy(enemy_array[1], parseInt(enemy_array[2]), parseInt(enemy_array[3]), parseInt(enemy_array[4]), parseInt(enemy_array[5]));

		hero1 = new Enemy("Te", 50, 5, 5, 25);

		image(enemy1.name + ".jpg", "image");
		print("Your oponent is a " + enemy1.name + "!", "fight", "p");
		print_inner(enemy1.maxHP, "top-right-enemy");
		print_inner(hero1.maxHP, "top-left-hero");
		printButton("Attack!", "button_fight", function() {fight(hero1, enemy1)});
}

	//lekérdezi a MySQL táblázatból Ajax és php segítségével a szörny adatait, majd ha megkapta a választ, hívja a start_fight függvényt, amiben a harc zajlik le
	var enemy_SQL = "";
	function enemy_Ajax() {
		if (window.XMLHttpRequest) {
			//IE7+, firefox, Chrome, ...
			xmlhttp = new XMLHttpRequest(); 
		} else {
			//IE6-
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); 
		}
		xmlhttp.onreadystatechange = function() {
			if (this.readyState === 4 && this.status === 200) {
				//ha minden rendben, akkor megkapja a táblázatból az ellenfél adatait
				enemy_SQL = this.responseText;
				//és ellen indul a harc
				start_fight(enemy_SQL);
			}
		}
		xmlhttp.open("POST", "fight_monsters.php", true);
		xmlhttp.send();
	}

	enemy_Ajax();
	//amikor ezt a függvényt hívom akkor kéri le/kapom meg a táblázatból az ellenfél adatait és akkor játszódik le a harc is, tekintve h ezen függvényen belül callback függvényként hívom a start_fight függvényt

})();

