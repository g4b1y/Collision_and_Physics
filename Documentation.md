# <p style="text-align: center;">Physics Engine </p>
<p style="text-align: center;">von Gabriel Kraus 


* * *  

### Vorwort
In dieser Dokumentation werde ich weniger auf das Projekt, sondern auf die verwendeten Methoden und Algorithmen eingehen. Ich habe mich für dieses Projekt entschieden, da ich etwas ähliches in letztem Projekt probiert habe (dort allerdings mit C++) und es nicht gewüscht funktioniert hat. Das Ziel des Projektes war sich mit der Scriptingsprache JavaScript vertraut zu machen und fehler des alten Projektes zu verbessern. Aufgrund mangelder Zeit gerät diese Dokumention leider etwas kurz. 

- - - 
### <p style="text-align: center;"> Inhalt </p>

<ul>
    <li>Kollisions Erkennung    </li>
    <li>Collision Response      </li>
    <li>Klassen-[Strukturen]    </li>
    <li>UserInput               </li> 
    <li>Quellen                 </li>
</ul>



## Kollisions Erkennung

Um Kollision zwischen zwei Objekten festzustellen gibt es mehrere Optionen. 
Die einfachsten ist die Kollision zwischen zwei Kreisen. Man bildet die differenz zwischen den zwei Mittelpunkten und schaut ob diese kleiner ist als die Summe beider Radien. Der Code sähe dann etwas so aus. 

```` JS 
function CollisionCC(c1, c2) {
    if(Math.sqrt((c1.pos.x - c2.pos.x) ** 2 + (c1.pos.y + c2.pos.y) ** 2) > c1.r + c2.r ) {
        return false; 
    }
    return true; 
}
````
Da bei dem Aufruf von _return_ die Funktion abgebrochen wird, benötigt man kein else. 

Für zwei Vierecke sieht das schon ein wenig komplizierter aus, allerdings immer noch Überschaubar. Man schaut ob sich ein Eckpunkt in oder auf der Linie des anderen Rechtecks liegt. Der Code könnte dann so aussehen: 


````JS 
function CollisionRR(obj1, obj2) {
    if(obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y) 
        {
            return true; 
        }
        return false;  
    }   
} 
````

Allerdings wird es nun wirklich kompliziert wenn man ein Polygon hat das mehr als vier Ecken, die nicht rechtwinklig sind. Die Spieleindustrie hat dafür den Seperate-Axis-Theorem Algorithmus entwickelt. Die Idee dahinter ist zu probieren eine Linie zwischen zwei Objekten zu ziehen. Falls das möglich ist besteht keine Kollision. 

<p align="center">
  <img src="https://dyn4j.org/assets/posts/2010-01-01-sat-separating-axis-theorem/sat-ex-1.png" width="250" title="hover text">
</p>

Wenn wir die Normale zu der grauen gestrichelten Linie ziehen und darauf die Figuren projezieren. Etwa so...

<p align="center">
  <img src="https://dyn4j.org/assets/posts/2010-01-01-sat-separating-axis-theorem/sat-ex-2.png" width="250" title="hover text">
</p>

...dann sehen wir sofort das die porjezierten Linien (Blau und Pink) auf der Normalen nicht überlappen, und somit keine Kollision existiert. Der SAT eignet sich sehr gut für Simulation in denen viele Formen, jedoch mit wenig Kollisionen gerechnet wird. 
Bei einem Dreieck bzw. zwei Dreiecken wird zwischen jedem Eckpunkt eine Art Linie/Gerade gebildet und davon dann die Normale. Der Figuren werden dann auf die Linie projeziert. Das sieht dann etwa so aus... 

<p align="center">
  <img src="https://dyn4j.org/assets/posts/2010-01-01-sat-separating-axis-theorem/sat-ex-3.png" width="300" title="hover text">
</p>

Um nun eine Kollision zu erkennen muss auf jeder der Normalen projezierten Linien überlappen. 

```` JS 
function sat(o1, o2){
    axes1 = [];
    axes2 = [];
    axes1.push(o1.dir.normal());
    axes1.push(o1.dir);
    axes2.push(o2.dir.normal());
    axes2.push(o2.dir);
    let proj1, proj2 = 0;

    for(let i=0; i<axes1.length; i++){
        proj1 = projShapeOntoAxis(axes1[i], o1);
        proj2 = projShapeOntoAxis(axes1[i], o2);
        let overlap = Math.min(proj1.max, proj2.max) - Math.max(proj1.min, proj2.min);
        if (overlap < 0){
            return false;
        }
    };

    for(let i=0; i<axes2.length; i++){
        proj1 = projShapeOntoAxis(axes2[i], o1);
        proj2 = projShapeOntoAxis(axes2[i], o2);
        overlap = Math.min(proj1.max, proj2.max) - Math.max(proj1.min, proj2.min);
        if (overlap < 0){
            return false;
        }
    };

    return true;
}


function projShapeOntoAxis(axis, obj){
    let min = Vector.dot(axis, obj.vertex[0]);
    let max = min;
    for(let i=0; i<obj.vertex.length; i++){
        let p = Vector.dot(axis, obj.vertex[i]);
        if(p<min){
            min = p;
        } 
        if(p>max){
            max = p;
        }
    }
    return {
        min: min,
        max: max
    }
}
````
 

Bei einer Kapsel wird einfach der Radius, von einer der beiden Halbkreisen die das Ende einer Kapsel bilden, genommen und geschaut ob diese größer als die Entfernung von der zweiten Kapsel plus den Radius der zweiten Kapsel haben. Falls ja, gibt es eine Kollision. Davor werden die Punkte bestimmt die als nächsten zwischen den zwei Kapseln liegen. 

<p align="center">
  <img src="https://arrowinmyknee.com/2021/03/15/some-math-about-capsule-collision/image-20210315174151863.png" width="300" title="hover text">
</p>

## Collision Response
Wenn zwei Objekte aufeinander treffen gibt es zwei Fälle die eintreten können. Sie "kleben" zusammen oder sie prallen von einander ab. Damit soetwas funktionieren kann brauchen die Objekte und Formen in der Simulation Masse und Elastizität. 



## Klasse-Struktur
Um zu zeigen was für Klassen in diesem Projekt verwendet wurden, werde ich ein einfaches Klassendiagramm mit Mermaid generierne und noch etwas dazu schreiben. 

````Mermaid
classDiagram
    Vector <-- Line
    Vector <-- Circle
    Vector <-- Rectangle
    Vector <-- Triangle
    Vector <-- Body
    Vector <-- Ball
    Vector <-- Star
    Vector <-- Wall

    Matrix <-- Rectangle
    Matrix <-- Triangle

    Body <|-- Ball
    Body <|-- Capsule
    Body <|-- Box
    Body <|-- Star
    Body <|-- Wall
````

Das obige Klassendiagramm zeigt vererbung durch gefüllte Pfeile und Instanzen in kleinen gefülleten Pfeilen. Ich werde in dieser Dokumentation aufgrund von mangelnder Zeit nicht weiter auf die Klassenstruktur eingehen bzw. sie vertiefen. 

## UserInput
Bei der UserInput Funktion werden einfach nur die eingaben Verwaltet. Ob der Client eine Taste gedrückt hat und wann Er sie wieder losgelassen hat.
Daraufhin wird der Spieler (in unserem Fall ein weißer Kreis) umherbewegt. 
Dazu noch der Code...

````JS
function userInput(obj){
    canvas.addEventListener('keydown', function(e){
        if(e.keyCode === 37) { obj.left     = true;  }
        if(e.keyCode === 38) { obj.up       = true;  }
        if(e.keyCode === 39) { obj.right    = true;  }
        if(e.keyCode === 40) { obj.down     = true;  }       
        if(e.keyCode === 32) { obj.action   = true;  }
    });
    
    canvas.addEventListener('keyup', function(e){
        if(e.keyCode === 37) { obj.left     = false;  }
        if(e.keyCode === 38) { obj.up       = false;  }
        if(e.keyCode === 39) { obj.right    = false;  }
        if(e.keyCode === 40) { obj.down     = false;  }       
        if(e.keyCode === 32) { obj.action   = false;  }
    });    
}
````

Die Bediehnungstasten sind in disem Fall die Pfeil-Tasten. Diese haben die Keycodes von 32, 37 - 40. KeyCode 32 ist für diesen Fall unwichtig, da er nur zum Debuggen verwendet wurde. 

## Quellen
<ul>
    <li>https://dyn4j.org/2010/01/sat/</li>
    <li>https://arrowinmyknee.com/2021/03/15/some-math-about-capsule-collision/</li>
    <li>https://en.wikipedia.org/wiki/Collision_response#:~:text=In%20the%20context%20of%20classical,and%20other%20forms%20of%20contact.</li>
    <li>https://www.metanetsoftware.com/technique/tutorialA.html</li>
    <li>https://www.codeproject.com/Articles/15573/2D-Polygon-Collision-Detection</li>
    <li>https://www.myphysicslab.com/engine2D/collision-en.html</li>
    <li>https://github.com/mermaidjs/mermaidjs.github.io/blob/master/classDiagram.md</li>
    <li></li>
    <li></li>

</ul>