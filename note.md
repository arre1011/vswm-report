# notes

---

# VSME Report 
## todo 
- architecture datei anlegen ARCHITECTURE.md 
- Report Datebstruktur erarbeiten, noch unklar welceh vorm, eventuell json. Es wäre aber vermutlich auch sinnvoll die Struktur mal noch in ump oder DDD Darzustellen, besonders wenn wir inzukunft um den Gudians Teil erweitern wollen, sollten wir uns an der stelle vermtulich hier schon gedanken machen oder ist es vielleicht auch schon wieder zuweit gedacht und wir geben an das Backend einfach die Werte zurück, super Simpel 


# Future Imple
- Validierung mit tanstack und ich habe hierfür auch schon etwas recherchtier, was in der datei under /docs/future-impl/ zu fidnen ist 


### Report Struktur 
Reporten von wichtigen daten strukturen, hier könnte ich alle wichtigen Daten aus dem Efrag VSME template. Ich möchte die Daten sehr gut aufbereiten. hierfür muss ermittlet werden welche struktur die KI gut lesen kann. Die Daten sollen in einer Baumstruktur sein. Stepper -> module -> card -> inputs die genaue struktur der baum elmente wir im folgenden beschrieben
#### Stepper 
Der Stepper soll die einzelnen Reiter der Excel wieder spiegeln, hier soll aber zwischen den Core Steper, was den eigenlichen Repoer wiederspiegelt mit zusatzlichen inforamtionen um den Repoet unterschieden werden 
##### Core Report 
Der Core Report ist der Bereich in den der User den Input eingibt aus diesem Input wird dann am ende der VSME Report erzeugt. Dies geschieht, in dem die inputdaten des User aus dem frontend an das backend gesendet werden. im Backend werdn die Daten dann in die Excel übertragen. Die befühlte excel wird dann wieder an das frontend gesendet und der kunde kann diese herunterladen 
Der Core Report beinhaltet die Module 
##### Additional Report Information 
Report zusatz information. Dies sind alle Reiter auserhalb des Report Cores, also informationen die nicht für die erstellug des rposrts notwendig sind. Dies sind informationen, Wie beispielsweise Reiter 1 "Introduction" in der VSME Excel Template. Hier werden dem User wichtige Informationen zu dem Report gegeben. Ein weitere wichtiger stepper wird der letzte stepper sein, welches der eine art valudation und Confirmation stepper sien soll. Hier sollen noch einmal alle felder kompakt aufgelistet werden, damit der User siene eingaben noch einemal prüfen kann und dann mit einem button bestätigen kann und beim clicken die befüllte excel downloaded 

#### Modul 
Die Module sind die VSME Module, also beispielsweise die Basic Module von B1 bis B11 und Comprensive Module von C1 bis C9. In dem VSME Excel Template sind dies sehr gut in dem Zweiten Reiter aufgelistet "Tabel of Content and Valudaion"
Module beinhalten wiederum kategorien/ cards , welche in cards abgebildet werden  
#### Cards 
Cards kann sind cluster von tatsächlichen User input values. In dem VSME Excel Template sind dies auch sehr gut in dem Zweiten Reiter aufgelistet "Tabel of Content and Valudaion" hier sind dies unterpunkte der Module. 
Cards beinhalten Values 

#### User Inputs/ Report Values
Dies sind nun die tatsächlichen Wert, welche von dem KMU kommen und ende des Prozesses in der VSME Report stehen, also in der VSME Excel. Der User gibt diese Werte über ein Input formular ein, dies können Inputforms, Inputslects, oder checkboxen sein. hier kommt es darauf an wie es in dem VSME Excel Template dargestellt wurde und so soll es wieder dargestellt werden in der Anwendung, also wenn es in der excel ein normales inputfeld war soll es in der anwendung ein normales inputform sein. Wenn es in der Excel ein dropdownmenu war dann soll es in der Anwendung ein Selct input sein. 


---

## User Centre Designe

#### 1. understand User Real-life example

#### 2. Explain the impact 

#### 3. Explain the Scale 

Specifying User Needy & Business Goals
Involving User to the design, developer, mvp testet by User 



### Prinzipien des User centre design
Video auf youtube von älterem her, aber sehr inperierent

#### Focus on the People around the Product 
#### We dont have to fokus about the details of the tools 
those have to be understanbele and usable. Remember the important thing is the real goal of the people who use our products.

---

### Designe Patterns from junior to senior
- clearty is key -> Simplicity over flashiness. A simple clear graph will help a user more than a flush that is not understandbale 
  - Tool das helfen kann ist die 60,30.10% methode. 60% sind die primery color, 30% die Complimentary color und 10% der Ui ist die main brand color 
- Font sizes 
  - try not to use to many font sizes fpr example 4 sizes and two wheights
- Spacing 
  - between components 8pt grid system. Menas make it possible to devided by 8 or 4
- memerable experince wie bei dulingo mit dem vogel, der sich bewegt 




# Aeo
Video Intervio  Ethan

