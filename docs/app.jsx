/* Coherence Science Interactive (browser build via Babel Standalone)
   Source adapted for GitHub Pages demo (no bundler).
*/
const { useState, useMemo, useCallback } = React;


// ─── DATA: CHEMISTRY ELEMENTS ───────────────────────────────────────────────
const CHEM_SECTORS = ["EN","CHI","MAT","NUM","SAN","AGR","ENV","SPA","DEF","NUC","RES"];
const CHEM_SECTOR_LABELS = {
  EN:"Énergie", CHI:"Chimie/Procédés", MAT:"Matériaux", NUM:"Numérique/Capteurs",
  SAN:"Santé/Vivant", AGR:"Agriculture/Sols", ENV:"Environnement/Géosciences",
  SPA:"Spatial/Cryo", DEF:"Défense/Sûreté", NUC:"Nucléaire", RES:"Recherche fondamentale"
};
const CHEM_ROLES = ["Contrainte","Modèle","Observable","Sonde","Standard","Système modèle","Traceur"];
const CHEM_ROLE_CODES = {CON:"Contrainte",MOD:"Modèle",OBS:"Observable",SON:"Sonde",STD:"Standard",SYS:"Système modèle",TRC:"Traceur"};
const CHEM_TYPES = ["TECH","MIXTE","EPIST"];

const chemElements = [
  {z:1,sym:"H",name:"Hydrogène",bloc:"S",grp:"1 (Alcalins)",util:"Convertir → piles → conversion électrochimique\nAlimenter → carburants → vecteurs énergétiques\nTransformer → chimie → transformations par réactions",epist:"Modèle atomique\nSonde → spectres → spectroscopie\nModèle → observables → cosmologie",sectors:["EN","CHI","SPA","NUM","RES"],roles:["Modèle","Sonde"],type:"MIXTE"},
  {z:2,sym:"He",name:"Hélium",bloc:"S",grp:"Gaz noble",util:"Refroidir → cryogénie → basse température\nPorter → ballons → enveloppes gonflées gaz",epist:"Système modèle → superfluidité\nModèle → états quantifiés → physique quantique",sectors:["SPA","NUM","EN","RES"],roles:["Modèle","Système modèle"],type:"MIXTE"},
  {z:3,sym:"Li",name:"Lithium",bloc:"S",grp:"1 (Alcalins)",util:"Stocker → batteries → stockage électrochimique\nStructurer → céramiques → matériaux inorganiques",epist:"Modèle → transition → phases\nModèle → mécanismes → stockage d'énergie",sectors:["EN","MAT","NUM","RES"],roles:["Modèle"],type:"TECH"},
  {z:4,sym:"Be",name:"Béryllium",bloc:"S",grp:"2 (Alcalino-terreux)",util:"Structurer → alliages → métallurgie\nSonder → rayons X → imagerie/sonde",epist:"Sonde → atténuation → transparence X\nModèle → structure–propriété → matériaux",sectors:["MAT","NUM","DEF","SPA","RES"],roles:["Modèle","Sonde"],type:"TECH"},
  {z:5,sym:"B",name:"Bore",bloc:"P",grp:"13",util:"Structurer → verres (amorphes)\nContrôler → semi-conducteurs (dopage)\nAbraser → abrasifs (dureté)",epist:"Modèle → liaisons hydrures (boranes)\nTraceur → ratios isotopiques (géochimie)",sectors:["MAT","CHI","ENV","RES"],roles:["Modèle","Traceur"],type:"MIXTE"},
  {z:6,sym:"C",name:"Carbone",bloc:"P",grp:"14",util:"Structurer → diamant (dureté)\nConduire → graphite (conduction)\nConvertir → carburants (énergie chimique)",epist:"Modèle → structures allotropiques\nTraceur → ratios isotopiques (datation)",sectors:["MAT","EN","ENV","RES"],roles:["Modèle","Traceur"],type:"MIXTE"},
  {z:7,sym:"N",name:"Azote",bloc:"P",grp:"15",util:"Produire → ammoniac (fertilisants)\nRéagir → composés nitrés (explosifs)\nStabiliser → atmosphères contrôlées",epist:"Observable → flux biogéochimiques (cycle N)\nModèle → fixation (enzymes)",sectors:["AGR","CHI","ENV","RES"],roles:["Modèle","Observable"],type:"MIXTE"},
  {z:8,sym:"O",name:"Oxygène",bloc:"P",grp:"16",util:"Supporter → respiration (fonction vitale)\nOxyder → réactions (oxydants)\nLiquéfier → cryogénie",epist:"Observable → flux (cycle O₂/photosynthèse)\nTraceur → signatures isotopiques (paléoclimat)",sectors:["SAN","CHI","ENV","RES"],roles:["Observable","Traceur"],type:"MIXTE"},
  {z:9,sym:"F",name:"Fluor",bloc:"P",grp:"17",util:"Stabiliser → fluorures (dentifrices)\nRefroidir → réfrigérants (CFC/HFC)\nProtéger → polymères (PTFE)",epist:"Observable → liaisons fortes (électronégativité)\nModèle → chimie organofluorée",sectors:["SAN","CHI","MAT","RES"],roles:["Modèle","Observable"],type:"MIXTE"},
  {z:10,sym:"Ne",name:"Néon",bloc:"P",grp:"18",util:"Émettre → éclairage (signes lumineux)\nRefroidir → cryogénie",epist:"Sonde → lignes atomiques (spectroscopie)\nObservable → inertie (gaz noble)",sectors:["NUM","SPA","RES"],roles:["Observable","Sonde"],type:"MIXTE"},
  {z:11,sym:"Na",name:"Sodium",bloc:"S",grp:"1 (Alcalins)",util:"Émettre → lampes → émission lumineuse\nFournir → sels → composés ioniques\nRéagir → réactifs",epist:"Sonde → potentiel/impédance → électrochimie\nModèle → diffusion/migration → dynamique ionique",sectors:["CHI","EN","MAT","RES"],roles:["Modèle","Sonde"],type:"TECH"},
  {z:12,sym:"Mg",name:"Magnésium",bloc:"S",grp:"2 (Alcalino-terreux)",util:"Structurer → alliages → métallurgie\nRéguler → biologie",epist:"Sonde → spectres → stellaire",sectors:["MAT","SPA","RES"],roles:["Sonde"],type:"MIXTE"},
  {z:13,sym:"Al",name:"Aluminium",bloc:"P",grp:"13",util:"Structurer → alliages (métallurgie légère)\nProtéger → emballages (barrières)\nConstruire → structures",epist:"Observable/Contrainte → passivation de surface\nObservable → conductivité",sectors:["MAT","EN","SPA","RES"],roles:["Contrainte","Observable"],type:"MIXTE"},
  {z:14,sym:"Si",name:"Silicium",bloc:"P",grp:"14",util:"Contrôler → puces (semi-conducteurs)\nConvertir → photovoltaïque (solaire)",epist:"Observable → bande interdite\nContrôler → dopage (impuretés)",sectors:["NUM","EN","MAT","RES"],roles:["Observable"],type:"MIXTE"},
  {z:15,sym:"P",name:"Phosphore",bloc:"P",grp:"15",util:"Produire → phosphates (fertilisants)\nDéclencher → ignition (allumettes)\nStructurer → biomolécules (ADN/ATP)",epist:"Observable → flux environnementaux (cycle P)\nSonde → luminescence",sectors:["AGR","SAN","CHI","RES"],roles:["Observable","Sonde"],type:"MIXTE"},
  {z:16,sym:"S",name:"Soufre",bloc:"P",grp:"16",util:"Produire → acide sulfurique\nModifier → caoutchouc (vulcanisation)",epist:"Observable → flux géochimiques (cycle S)\nSonde → réactions acide/base",sectors:["AGR","CHI","MAT","RES"],roles:["Observable","Sonde"],type:"MIXTE"},
  {z:17,sym:"Cl",name:"Chlore",bloc:"P",grp:"17",util:"Désinfecter → eau potable\nStructurer → polymères (PVC)\nRéagir → synthèse",epist:"Sonde → réactions redox (halogènes)\nObservable → cycle chlorure",sectors:["CHI","SAN","MAT","RES"],roles:["Observable","Sonde"],type:"MIXTE"},
  {z:18,sym:"Ar",name:"Argon",bloc:"P",grp:"18",util:"Protéger → atmosphère inerte (soudage)\nIsoler → fenêtres (double vitrage)",epist:"Observable → faible réactivité (gaz noble)\nTraceur → isotopes (datation)",sectors:["CHI","MAT","ENV","RES"],roles:["Observable","Traceur"],type:"MIXTE"},
  {z:19,sym:"K",name:"Potassium",bloc:"S",grp:"1 (Alcalins)",util:"Fertiliser → fertilisants → intrants\nRéguler → biologie → vivant",epist:"Sonde → signal électrique → potentiel d'action\nSonde → redox/ions → bioélectrochimie",sectors:["AGR","SAN","CHI","RES"],roles:["Sonde"],type:"TECH"},
  {z:20,sym:"Ca",name:"Calcium",bloc:"S",grp:"2 (Alcalino-terreux)",util:"Construire → construction → matériaux\nRéguler → biologie → vivant",epist:"Modèle → flux messagers → signalisation",sectors:["SAN","MAT","RES"],roles:["Modèle"],type:"TECH"},
  {z:21,sym:"Sc",name:"Scandium",bloc:"D",grp:"3",util:"Structurer → alliages → métallurgie",epist:"Sonde → diffraction → cristallographie",sectors:["MAT","SPA","RES"],roles:["Sonde"],type:"MIXTE"},
  {z:22,sym:"Ti",name:"Titane",bloc:"D",grp:"4",util:"Structurer → alliages → métallurgie\nIntégrer → implants → biocompatibilité",epist:"Observable → contrainte/déformation → résistance mécanique",sectors:["MAT","SAN","SPA","DEF","RES"],roles:["Observable"],type:"TECH"},
  {z:23,sym:"V",name:"Vanadium",bloc:"D",grp:"5",util:"Structurer → aciers → alliages Fe–C",epist:"Sonde → cycles redox → catalyse",sectors:["MAT","CHI","EN","RES"],roles:["Sonde"],type:"TECH"},
  {z:24,sym:"Cr",name:"Chrome",bloc:"D",grp:"6",util:"Structurer → aciers inox → passivation",epist:"Observable → valences → états d'oxydation",sectors:["MAT","CHI","DEF","RES"],roles:["Observable"],type:"TECH"},
  {z:25,sym:"Mn",name:"Manganèse",bloc:"D",grp:"7",util:"Structurer → aciers → alliages Fe–C",epist:"Sonde → cycles redox → catalyse",sectors:["MAT","CHI","RES"],roles:["Sonde"],type:"TECH"},
  {z:26,sym:"Fe",name:"Fer",bloc:"D",grp:"8",util:"Structurer → aciers → alliages Fe–C",epist:"Sonde → ordre magnétique → magnétisme\nTraceur → signatures → géophysique",sectors:["MAT","ENV","EN","RES"],roles:["Sonde","Traceur"],type:"TECH"},
  {z:27,sym:"Co",name:"Cobalt",bloc:"D",grp:"9",util:"Stocker → batteries → stockage\nProduire → aimants → magnétique",epist:"Traceur → désintégrations → radio-isotopes",sectors:["EN","NUM","SAN","RES"],roles:["Traceur"],type:"TECH"},
  {z:28,sym:"Ni",name:"Nickel",bloc:"D",grp:"10",util:"Structurer → alliages → métallurgie",epist:"Observable → Catalyse",sectors:["MAT","CHI","EN","RES"],roles:["Observable"],type:"TECH"},
  {z:29,sym:"Cu",name:"Cuivre",bloc:"D",grp:"11",util:"Conduire → conducteurs → transport électrique/thermique",epist:"Sonde → potentiel/impédance → électrochimie",sectors:["NUM","EN","CHI","RES"],roles:["Sonde"],type:"TECH"},
  {z:30,sym:"Zn",name:"Zinc",bloc:"D",grp:"12",util:"Protéger → galvanisation → anticorrosion",epist:"Modèle → sites métalliques → métalloprotéines",sectors:["MAT","SAN","RES"],roles:["Modèle"],type:"TECH"},
  {z:31,sym:"Ga",name:"Gallium",bloc:"P",grp:"13",util:"Contrôler → semi-conducteurs (III–V, LED)\nMesurer → thermométrie",epist:"Observable → bande interdite (optoélectronique)\nModèle → phases eutectiques",sectors:["NUM","MAT","RES"],roles:["Modèle","Observable"],type:"MIXTE"},
  {z:32,sym:"Ge",name:"Germanium",bloc:"P",grp:"14",util:"Contrôler → semi-conducteurs (transistors)\nTransmettre → optique infrarouge",epist:"Observable → bande interdite\nContrôler → dopage",sectors:["NUM","MAT","RES"],roles:["Observable"],type:"MIXTE"},
  {z:33,sym:"As",name:"Arsenic",bloc:"P",grp:"15",util:"Composer → semi-conducteurs (GaAs)\nExploiter → toxicité (historique)",epist:"Contrôler → impuretés (dopage)\nObservable → mécanismes cellulaires",sectors:["MAT","SAN","RES"],roles:["Observable"],type:"MIXTE"},
  {z:34,sym:"Se",name:"Sélénium",bloc:"P",grp:"16",util:"Détecter → photoconductivité\nModifier → verre\nRéguler → oligoélément",epist:"Observable → bande interdite\nContrainte → seuils (toxicité)",sectors:["NUM","MAT","SAN","RES"],roles:["Contrainte","Observable"],type:"MIXTE"},
  {z:35,sym:"Br",name:"Brome",bloc:"P",grp:"17",util:"Retarder → flamme (polymères)\nEnregistrer → photographie",epist:"Sonde → substitutions (halogènes)\nContrainte → toxicologie",sectors:["CHI","MAT","RES"],roles:["Contrainte","Sonde"],type:"MIXTE"},
  {z:36,sym:"Kr",name:"Krypton",bloc:"P",grp:"18",util:"Émettre → lampes (éclairage)\nÉmettre → lasers (excimer)",epist:"Sonde → transitions (spectroscopie)\nObservable → inertie",sectors:["NUM","RES"],roles:["Observable","Sonde"],type:"MIXTE"},
  {z:37,sym:"Rb",name:"Rubidium",bloc:"S",grp:"1 (Alcalins)",util:"Standardiser → horloges atomiques → temps",epist:"Système modèle → BEC → régime quantique",sectors:["NUM","RES"],roles:["Système modèle"],type:"TECH"},
  {z:38,sym:"Sr",name:"Strontium",bloc:"S",grp:"2 (Alcalino-terreux)",util:"Libérer → pyrotechnie → combustion",epist:"Traceur → ratios isotopiques → datation",sectors:["ENV","DEF","RES"],roles:["Traceur"],type:"TECH"},
  {z:39,sym:"Y",name:"Yttrium",bloc:"D",grp:"3",util:"Émettre → lasers → sources cohérentes\nAfficher → écrans",epist:"Système modèle → supraconductivité",sectors:["NUM","MAT","EN","RES"],roles:["Système modèle"],type:"TECH"},
  {z:40,sym:"Zr",name:"Zirconium",bloc:"D",grp:"4",util:"Convertir → réacteurs nucléaires",epist:"Observable/Contrainte → dégradation → corrosion\nSonde/Contrainte → neutrons",sectors:["NUC","MAT","EN","RES"],roles:["Contrainte","Observable","Sonde"],type:"MIXTE"},
  {z:41,sym:"Nb",name:"Niobium",bloc:"D",grp:"5",util:"Transporter → supraconducteurs → résistance nulle",epist:"Modèle → propriétés quantiques",sectors:["EN","NUM","MAT","RES"],roles:["Modèle"],type:"TECH"},
  {z:42,sym:"Mo",name:"Molybdène",bloc:"D",grp:"6",util:"Catalyser → contrôle cinétique\nStructurer → alliages",epist:"Modèle → catalyse → enzymes/biochimie",sectors:["CHI","MAT","SAN","RES"],roles:["Modèle"],type:"TECH"},
  {z:43,sym:"Tc",name:"Technétium",bloc:"D",grp:"7",util:"Imager → imagerie médicale",epist:"Traceur → production artificielle",sectors:["SAN","NUM","RES"],roles:["Traceur"],type:"TECH"},
  {z:44,sym:"Ru",name:"Ruthénium",bloc:"D",grp:"8",util:"Catalyser → catalyse → contrôle cinétique",epist:"Modèle → complexes métal–C → organométallique",sectors:["CHI","EN","RES"],roles:["Modèle"],type:"TECH"},
  {z:45,sym:"Rh",name:"Rhodium",bloc:"D",grp:"9",util:"Catalyser → catalyse → contrôle cinétique",epist:"Modèle → vitesses → cinétique",sectors:["CHI","EN","RES"],roles:["Modèle"],type:"TECH"},
  {z:46,sym:"Pd",name:"Palladium",bloc:"D",grp:"10",util:"Catalyser → catalyse → contrôle cinétique",epist:"Observable → ajout d'H → hydrogénation",sectors:["CHI","EN","RES"],roles:["Observable"],type:"TECH"},
  {z:47,sym:"Ag",name:"Argent",bloc:"D",grp:"11",util:"Enregistrer → photographie\nInterfacer → électronique",epist:"Observable → Optique\nObservable → plasmonique",sectors:["NUM","SAN","RES"],roles:["Observable"],type:"TECH"},
  {z:48,sym:"Cd",name:"Cadmium",bloc:"D",grp:"12",util:"Stocker → batteries → stockage",epist:"Contrainte → dose–réponse → toxicologie",sectors:["EN","SAN","ENV","RES"],roles:["Contrainte"],type:"TECH"},
  {z:49,sym:"In",name:"Indium",bloc:"P",grp:"13",util:"Interfacer → écrans tactiles\nAssembler → soudures",epist:"Contrôler/Observable → dopage\nObservable → bandes optoélectroniques",sectors:["NUM","MAT","RES"],roles:["Observable"],type:"MIXTE"},
  {z:50,sym:"Sn",name:"Étain",bloc:"P",grp:"14",util:"Assembler → soudures\nProtéger → revêtements",epist:"Système modèle → transition allotropique\nObservable → conductivité",sectors:["MAT","CHI","RES"],roles:["Observable","Système modèle"],type:"MIXTE"},
  {z:51,sym:"Sb",name:"Antimoine",bloc:"P",grp:"15",util:"Structurer → alliages (durcissement Pb)\nRetarder → flamme",epist:"Observable → propriétés électroniques\nModèle → alliages",sectors:["MAT","CHI","RES"],roles:["Modèle","Observable"],type:"MIXTE"},
  {z:52,sym:"Te",name:"Tellure",bloc:"P",grp:"16",util:"Convertir → solaire (CdTe)\nStructurer → alliages",epist:"Observable → propriétés électroniques\nModèle → tellurures",sectors:["EN","MAT","RES"],roles:["Modèle","Observable"],type:"MIXTE"},
  {z:53,sym:"I",name:"Iode",bloc:"P",grp:"17",util:"Désinfecter → antiseptiques\nRéguler → thyroïde\nImager → contraste",epist:"Traceur → radioisotopes\nObservable → cycle iode",sectors:["SAN","NUM","RES"],roles:["Observable","Traceur"],type:"MIXTE"},
  {z:54,sym:"Xe",name:"Xénon",bloc:"P",grp:"18",util:"Anesthésier → gaz médical\nPropulser → ions\nÉmettre → flash",epist:"Modèle → liaisons (composés Xe)\nObservable → inertie",sectors:["SAN","SPA","RES"],roles:["Modèle","Observable"],type:"MIXTE"},
  {z:55,sym:"Cs",name:"Césium",bloc:"S",grp:"1 (Alcalins)",util:"Standardiser → horloges atomiques → seconde SI",epist:"Standard → fréquence → seconde SI",sectors:["NUM","RES"],roles:["Standard"],type:"TECH"},
  {z:56,sym:"Ba",name:"Baryum",bloc:"S",grp:"2 (Alcalino-terreux)",util:"Imager → imagerie médicale",epist:"Sonde → atténuation → absorption X",sectors:["SAN","NUM","RES"],roles:["Sonde"],type:"MIXTE"},
  {z:57,sym:"La",name:"Lanthane",bloc:"F",grp:"3",util:"Catalyser → contrôle cinétique\nOptique → verres dopés",epist:"Modèle → remplissage orbital\nSonde → luminescence",sectors:["CHI","NUM","MAT","RES"],roles:["Modèle","Sonde"],type:"MIXTE"},
  {z:58,sym:"Ce",name:"Cérium",bloc:"F",grp:"3",util:"Catalyser → convertisseurs\nPolir → surfaces",epist:"Sonde → états redox multiples\nContrainte → adsorption",sectors:["CHI","MAT","EN","RES"],roles:["Contrainte","Sonde"],type:"MIXTE"},
  {z:59,sym:"Pr",name:"Praséodyme",bloc:"F",grp:"3",util:"Produire → aimants\nStructurer → alliages",epist:"Sonde → absorption sélective\nSonde → moments magnétiques",sectors:["MAT","NUM","EN","RES"],roles:["Sonde"],type:"MIXTE"},
  {z:60,sym:"Nd",name:"Néodyme",bloc:"F",grp:"3",util:"Produire → aimants\nÉmettre → lasers",epist:"Contrainte → champs intenses\nModèle → amplification photonique",sectors:["MAT","NUM","EN","RES"],roles:["Contrainte","Modèle"],type:"MIXTE"},
  {z:61,sym:"Pm",name:"Prométhium",bloc:"F",grp:"3",util:"Convertir → énergie radioactive\nÉmettre → luminescence",epist:"Contrainte → désintégrations\nSonde → rayonnement bêta",sectors:["EN","NUM","SAN","RES"],roles:["Contrainte","Sonde"],type:"MIXTE"},
  {z:62,sym:"Sm",name:"Samarium",bloc:"F",grp:"3",util:"Produire → aimants\nCatalyser → contrôle cinétique",epist:"Système modèle → transition pression\nSonde → cycles redox",sectors:["MAT","CHI","NUM","RES"],roles:["Sonde","Système modèle"],type:"MIXTE"},
  {z:63,sym:"Eu",name:"Europium",bloc:"F",grp:"3",util:"Émettre → phosphores\nÉmettre → lasers",epist:"Sonde → fluorescence\nModèle → résonances optoélectroniques",sectors:["NUM","MAT","SAN","RES"],roles:["Modèle","Sonde"],type:"MIXTE"},
  {z:64,sym:"Gd",name:"Gadolinium",bloc:"F",grp:"3",util:"Imager → agents de contraste (IRM)\nProduire → aimants",epist:"Sonde → paramagnétisme\nContrainte → contraste",sectors:["SAN","NUM","MAT","RES"],roles:["Contrainte","Sonde"],type:"MIXTE"},
  {z:65,sym:"Tb",name:"Terbium",bloc:"F",grp:"3",util:"Émettre → phosphores (vert)\nÉmettre → lasers",epist:"Traceur → isotopes (thérapeutique)\nSonde → luminescence",sectors:["NUM","SAN","MAT","RES"],roles:["Sonde","Traceur"],type:"MIXTE"},
  {z:66,sym:"Dy",name:"Dysprosium",bloc:"F",grp:"3",util:"Produire → aimants (haute T)\nÉmettre → lasers",epist:"Contrainte → absorption neutronique\nSonde → champs élevés",sectors:["MAT","EN","NUM","RES"],roles:["Contrainte","Sonde"],type:"MIXTE"},
  {z:67,sym:"Ho",name:"Holmium",bloc:"F",grp:"3",util:"Émettre → lasers (médical)\nProduire → aimants",epist:"Contrainte → émissions bêta/gamma\nModèle → interaction tissu",sectors:["SAN","MAT","NUM","RES"],roles:["Contrainte","Modèle"],type:"MIXTE"},
  {z:68,sym:"Er",name:"Erbium",bloc:"F",grp:"3",util:"Émettre → lasers (fibre optique)\nAmplifier → gain optique",epist:"Modèle → amplification photonique\nContrainte → longueurs d'onde",sectors:["NUM","SAN","MAT","RES"],roles:["Contrainte","Modèle"],type:"MIXTE"},
  {z:69,sym:"Tm",name:"Thulium",bloc:"F",grp:"3",util:"Émettre → lasers (médical)\nProduire → source X portable",epist:"Sonde → fluorescence bleue\nContrainte → absorption neutronique",sectors:["SAN","NUM","MAT","RES"],roles:["Contrainte","Sonde"],type:"MIXTE"},
  {z:70,sym:"Yb",name:"Ytterbium",bloc:"F",grp:"3",util:"Émettre → lasers (industriel)\nStructurer → alliages",epist:"Modèle → amplification IR\nStandard → transitions quantiques (horloges)",sectors:["NUM","MAT","EN","RES"],roles:["Modèle","Standard"],type:"MIXTE"},
  {z:71,sym:"Lu",name:"Lutétium",bloc:"F",grp:"3",util:"Traiter → radiothérapie ciblée\nCatalyser → contrôle cinétique",epist:"Contrainte → émission bêta\nSonde → imagerie (SPECT/TEP)",sectors:["SAN","CHI","NUM","RES"],roles:["Contrainte","Sonde"],type:"MIXTE"},
  {z:72,sym:"Hf",name:"Hafnium",bloc:"D",grp:"4",util:"Contrôler → contrôle neutronique",epist:"Contrainte → noyau/rayonnements",sectors:["NUC","EN","RES"],roles:["Contrainte"],type:"TECH"},
  {z:73,sym:"Ta",name:"Tantale",bloc:"D",grp:"5",util:"Interfacer → électronique → composants",epist:"Contrainte → stabilité en milieu réactif",sectors:["NUM","MAT","CHI","RES"],roles:["Contrainte"],type:"TECH"},
  {z:74,sym:"W",name:"Tungstène",bloc:"D",grp:"6",util:"Filaments → éléments résistifs\nProtéger → blindage",epist:"Contrainte → limite thermique → fusion",sectors:["MAT","DEF","NUM","SPA","RES"],roles:["Contrainte"],type:"TECH"},
  {z:75,sym:"Re",name:"Rhénium",bloc:"D",grp:"7",util:"Structurer → superalliages → haute T",epist:"Contrainte → T élevée → chimie",sectors:["MAT","SPA","DEF","CHI","RES"],roles:["Contrainte"],type:"TECH"},
  {z:76,sym:"Os",name:"Osmium",bloc:"D",grp:"8",util:"Alliages durs → haute dureté/usure",epist:"Observable → Densité extrême",sectors:["MAT","DEF","RES"],roles:["Observable"],type:"TECH"},
  {z:77,sym:"Ir",name:"Iridium",bloc:"D",grp:"9",util:"Interfacer → électrodes → conversion/mesure",epist:"Traceur → signatures → impacts",sectors:["NUM","ENV","RES"],roles:["Traceur"],type:"TECH"},
  {z:78,sym:"Pt",name:"Platine",bloc:"D",grp:"10",util:"Catalyser → catalyse → contrôle cinétique\nJoaillerie → ornemental",epist:"Modèle → complexes métal–C → organométallique",sectors:["CHI","EN","SAN","RES"],roles:["Modèle"],type:"TECH"},
  {z:79,sym:"Au",name:"Or",bloc:"D",grp:"11",util:"Interfacer → électronique\nFinance → réserve/actif",epist:"Modèle → surface/taille → nanoparticules\nContrainte → persistance → stabilité",sectors:["NUM","SAN","CHI","RES"],roles:["Contrainte","Modèle"],type:"TECH"},
  {z:80,sym:"Hg",name:"Mercure",bloc:"D",grp:"12",util:"Mesurer → thermomètres → température",epist:"Système modèle → métal liquide → fluides",sectors:["NUM","SAN","ENV","RES"],roles:["Système modèle"],type:"TECH"},
  {z:81,sym:"Tl",name:"Thallium",bloc:"P",grp:"13",util:"Structurer → verres optiques\nExploiter → toxicité (historique)",epist:"Observable → états d'oxydation (+1/+3)\nSonde → lignes atomiques",sectors:["MAT","SAN","RES"],roles:["Observable","Sonde"],type:"MIXTE"},
  {z:82,sym:"Pb",name:"Plomb",bloc:"P",grp:"14",util:"Stocker → batteries (acide)\nProtéger → blindages",epist:"Contrainte/Observable → bioaccumulation\nTraceur → signatures isotopiques",sectors:["EN","DEF","ENV","RES"],roles:["Contrainte","Observable","Traceur"],type:"MIXTE"},
  {z:83,sym:"Bi",name:"Bismuth",bloc:"P",grp:"15",util:"Assembler → alliages (bas point de fusion)\nTraiter → antiacides",epist:"Sonde → diamagnétisme\nModèle → alliages liquides",sectors:["MAT","SAN","RES"],roles:["Modèle","Sonde"],type:"MIXTE"},
  {z:84,sym:"Po",name:"Polonium",bloc:"P",grp:"16",util:"Neutraliser → charges (antistatique)\nChauffer → radioisotopes",epist:"Contrainte → désintégrations\nContrainte → toxicité (extrême)",sectors:["NUM","EN","RES"],roles:["Contrainte"],type:"MIXTE"},
  {z:85,sym:"At",name:"Astate",bloc:"P",grp:"17",util:"Traiter → radiothérapie alpha ciblée\nProduire → radiohalogène",epist:"Contrainte → désintégrations\nModèle → chimie halogène",sectors:["SAN","RES"],roles:["Contrainte","Modèle"],type:"MIXTE"},
  {z:86,sym:"Rn",name:"Radon",bloc:"P",grp:"18",util:"Détecter → gaz radioactif\nTraiter → radiothérapie (historique)",epist:"Contrainte → désintégrations\nTraceur → environnement",sectors:["NUM","SAN","ENV","RES"],roles:["Contrainte","Traceur"],type:"MIXTE"},
  {z:87,sym:"Fr",name:"Francium",bloc:"S",grp:"1 (Alcalins)",util:"Produire → recherche → observables/mesures",epist:"Contrainte → niveaux/instabilités → structure nucléaire",sectors:["RES"],roles:["Contrainte"],type:"EPIST"},
  {z:88,sym:"Ra",name:"Radium",bloc:"S",grp:"2 (Alcalino-terreux)",util:"Traiter → radiothérapie historique",epist:"Contrainte → désintégrations → radioactivité",sectors:["SAN","RES"],roles:["Contrainte"],type:"MIXTE"},
  {z:89,sym:"Ac",name:"Actinium",bloc:"F",grp:"3",util:"Traiter → radioisotopes (thérapie ciblée)\nProduire → sources de rayonnement",epist:"Contrainte → désintégrations alpha\nTraceur → chaînes de décroissance",sectors:["SAN","NUC","RES"],roles:["Contrainte","Traceur"],type:"MIXTE"},
  {z:90,sym:"Th",name:"Thorium",bloc:"F",grp:"3",util:"Convertir → combustible (cycle Th)\nStructurer → oxydes/alliages",epist:"Traceur → ratios isotopiques\nContrainte → désintégrations/sections efficaces",sectors:["NUC","EN","ENV","RES"],roles:["Contrainte","Traceur"],type:"MIXTE"},
  {z:91,sym:"Pa",name:"Protactinium",bloc:"F",grp:"3",util:"Produire → isotopes (cibles)\nConvertir → intermédiaires de cycle",epist:"Contrainte → valence/complexes\nTraceur → signatures de décroissance",sectors:["NUC","CHI","RES"],roles:["Contrainte","Traceur"],type:"MIXTE"},
  {z:92,sym:"U",name:"Uranium",bloc:"F",grp:"3",util:"Convertir → combustible (fission)\nProtéger → blindage (densité)",epist:"Traceur → ratios isotopiques\nContrainte → neutrons/désintégrations",sectors:["NUC","EN","DEF","ENV","RES"],roles:["Contrainte","Traceur"],type:"MIXTE"},
  {z:93,sym:"Np",name:"Neptunium",bloc:"F",grp:"3",util:"Produire → isotopes (cibles)\nConvertir → radioisotopes",epist:"Contrainte → états d'oxydation\nSonde → signatures radiatives",sectors:["NUC","CHI","NUM","RES"],roles:["Contrainte","Sonde"],type:"MIXTE"},
  {z:94,sym:"Pu",name:"Plutonium",bloc:"F",grp:"3",util:"Convertir → combustible (MOX)\nProduire → source de chaleur",epist:"Contrainte → fission/neutronique\nTraceur → signatures isotopiques",sectors:["NUC","EN","DEF","RES"],roles:["Contrainte","Traceur"],type:"MIXTE"},
  {z:95,sym:"Am",name:"Américium",bloc:"F",grp:"3",util:"Détecter → capteurs (jauges/détecteurs)\nProduire → sources de rayonnement",epist:"Sonde → émission alpha/gamma\nContrainte → radioprotection",sectors:["NUM","NUC","SAN","RES"],roles:["Contrainte","Sonde"],type:"MIXTE"},
  {z:96,sym:"Cm",name:"Curium",bloc:"F",grp:"3",util:"Produire → sources de chaleur\nProduire → cibles (transmutation)",epist:"Contrainte → désintégrations\nSonde → neutronique",sectors:["NUC","EN","RES"],roles:["Contrainte","Sonde"],type:"MIXTE"},
  {z:97,sym:"Bk",name:"Berkélium",bloc:"F",grp:"3",util:"Produire → cibles (synthèse lourds)",epist:"Contrainte → complexation\nSonde → signatures radiatives",sectors:["NUC","RES"],roles:["Contrainte","Sonde"],type:"MIXTE"},
  {z:98,sym:"Cf",name:"Californium",bloc:"F",grp:"3",util:"Produire → source de neutrons\nImager → radiographie neutronique",epist:"Sonde → activation/sections efficaces\nContrainte → dosimétrie",sectors:["NUC","NUM","EN","RES"],roles:["Contrainte","Sonde"],type:"MIXTE"},
  {z:99,sym:"Es",name:"Einsteinium",bloc:"F",grp:"3",util:"Produire → isotopes (études)",epist:"Contrainte → désintégrations\nModèle → tendances série actinides",sectors:["NUC","RES"],roles:["Contrainte","Modèle"],type:"MIXTE"},
  {z:100,sym:"Fm",name:"Fermium",bloc:"F",grp:"3",util:"Produire → isotopes (études)",epist:"Contrainte → désintégrations\nModèle → tendances structure nucléaire",sectors:["NUC","RES"],roles:["Contrainte","Modèle"],type:"MIXTE"},
  {z:101,sym:"Md",name:"Mendelevium",bloc:"F",grp:"3",util:"Produire → isotopes (études)",epist:"Contrainte → complexation\nSonde → signatures (spectrométrie)",sectors:["NUC","CHI","RES"],roles:["Contrainte","Sonde"],type:"MIXTE"},
  {z:102,sym:"No",name:"Nobélium",bloc:"F",grp:"3",util:"Produire → isotopes (études)",epist:"Contrainte → états stables relatifs\nSonde → signatures radiatives",sectors:["NUC","CHI","RES"],roles:["Contrainte","Sonde"],type:"MIXTE"},
  {z:103,sym:"Lr",name:"Lawrencium",bloc:"F",grp:"3",util:"Produire → isotopes (études)",epist:"Contrainte → effets relativistes\nContrainte → instabilité",sectors:["NUC","RES"],roles:["Contrainte"],type:"MIXTE"},
  {z:104,sym:"Rf",name:"Rutherfordium",bloc:"D",grp:"4",util:"Produire → recherche → observables/mesures",epist:"Observable → Structure superlourde",sectors:["RES"],roles:["Observable"],type:"EPIST"},
  {z:105,sym:"Db",name:"Dubnium",bloc:"D",grp:"5",util:"Produire → recherche → observables/mesures",epist:"Contrainte → effets relativistes → chimie",sectors:["RES"],roles:["Contrainte"],type:"EPIST"},
  {z:106,sym:"Sg",name:"Seaborgium",bloc:"D",grp:"6",util:"Produire → recherche → observables/mesures",epist:"Contrainte → instabilité → superlourds",sectors:["RES"],roles:["Contrainte"],type:"EPIST"},
  {z:107,sym:"Bh",name:"Bohrium",bloc:"D",grp:"7",util:"Produire → recherche → observables/mesures",epist:"Contrainte → niveaux/instabilités",sectors:["RES"],roles:["Contrainte"],type:"EPIST"},
  {z:108,sym:"Hs",name:"Hassium",bloc:"D",grp:"8",util:"Produire → recherche → observables/mesures",epist:"Contrainte → effets relativistes → chimie",sectors:["RES"],roles:["Contrainte"],type:"EPIST"},
  {z:109,sym:"Mt",name:"Meitnérium",bloc:"D",grp:"9",util:"Produire → recherche → observables/mesures",epist:"Observable → Structure superlourde",sectors:["RES"],roles:["Observable"],type:"EPIST"},
  {z:110,sym:"Ds",name:"Darmstadtium",bloc:"D",grp:"10",util:"Produire → recherche → observables/mesures",epist:"Contrainte → effets relativistes → chimie",sectors:["RES"],roles:["Contrainte"],type:"EPIST"},
  {z:111,sym:"Rg",name:"Roentgenium",bloc:"D",grp:"11",util:"Produire → recherche → observables/mesures",epist:"Contrainte → effets relativistes → chimie",sectors:["RES"],roles:["Contrainte"],type:"EPIST"},
  {z:112,sym:"Cn",name:"Copernicium",bloc:"D",grp:"12",util:"Produire → recherche → observables/mesures",epist:"Contrainte → effets relativistes → chimie",sectors:["RES"],roles:["Contrainte"],type:"EPIST"},
  {z:113,sym:"Nh",name:"Nihonium",bloc:"P",grp:"13",util:"Produire → observables (accélérateurs)",epist:"Contrainte → désintégrations alpha",sectors:["RES"],roles:["Contrainte"],type:"EPIST"},
  {z:114,sym:"Fl",name:"Flérovium",bloc:"P",grp:"14",util:"Produire → observables (recherche)",epist:"Contrainte → désintégrations\nContrainte → effets relativistes",sectors:["RES"],roles:["Contrainte"],type:"EPIST"},
  {z:115,sym:"Mc",name:"Moscovium",bloc:"P",grp:"15",util:"Produire → observables (recherche)",epist:"Contrainte → désintégrations",sectors:["RES"],roles:["Contrainte"],type:"EPIST"},
  {z:116,sym:"Lv",name:"Livermorium",bloc:"P",grp:"16",util:"Produire → observables (recherche)",epist:"Contrainte → désintégrations\nContrainte → effets relativistes",sectors:["RES"],roles:["Contrainte"],type:"EPIST"},
  {z:117,sym:"Ts",name:"Tennessine",bloc:"P",grp:"17",util:"Produire → observables (recherche)",epist:"Contrainte → instabilité",sectors:["RES"],roles:["Contrainte"],type:"EPIST"},
  {z:118,sym:"Og",name:"Oganesson",bloc:"P",grp:"18",util:"Produire → observables (recherche)",epist:"Contrainte → instabilité",sectors:["RES"],roles:["Contrainte"],type:"EPIST"},
];

// ─── DATA: MATH SYMBOLS ────────────────────────────────────────────────────
const MATH_SECTORS = ["LOG","ENS","FON","LIN","ANA","PROB","INFO","GRA","OPT","DYN","META"];
const MATH_SECTOR_LABELS = {
  LOG:"Logique & preuve", ENS:"Ensembles", FON:"Fonctions/opérateurs", LIN:"Algèbre linéaire",
  ANA:"Analyse", PROB:"Probabilités/statistique", INFO:"Information", GRA:"Graphes/réseaux",
  OPT:"Optimisation/contraintes", DYN:"Dynamique/temps/régimes", META:"Métanotation"
};
const MATH_ROLES = ["STD","SON","CON","TRC","MOD","OBS"];
const MATH_ROLE_LABELS = {STD:"Standard",SON:"Sonde",CON:"Contrainte",TRC:"Traceur",MOD:"Modèle",OBS:"Observable"};

const mathSymbols = [
  {z:1,sym:"¬",name:"Négation",bloc:"LOG",grp:"Connecteurs",util:"Contraindre → exclusion → inversion proposition",epist:"Contrainte → réfutation → non-vrai formel",sectors:["LOG","META"],roles:["CON"]},
  {z:2,sym:"∧",name:"Conjonction",bloc:"LOG",grp:"Connecteurs",util:"Composer → conditions → ET",epist:"Contrainte → satisfaction simultanée → preuve",sectors:["LOG"],roles:["CON"]},
  {z:3,sym:"∨",name:"Disjonction",bloc:"LOG",grp:"Connecteurs",util:"Composer → alternatives → OU",epist:"Contrainte → satisfaction alternative → preuve",sectors:["LOG"],roles:["CON"]},
  {z:4,sym:"⇒",name:"Implication",bloc:"LOG",grp:"Relations",util:"Relier → propositions → conditionnel",epist:"Structure → chaîne d'inférence → preuve",sectors:["LOG","META"],roles:["MOD"]},
  {z:5,sym:"⇔",name:"Équivalence",bloc:"LOG",grp:"Relations",util:"Identifier → propositions → équivalence",epist:"Standard → invariance logique → substitution",sectors:["LOG","META"],roles:["STD"]},
  {z:6,sym:"∀",name:"Universel",bloc:"LOG",grp:"Quantificateurs",util:"Généraliser → domaine → pour tout",epist:"Standard → portée universelle → axiome/loi",sectors:["LOG","ENS"],roles:["STD"]},
  {z:7,sym:"∃",name:"Existentiel",bloc:"LOG",grp:"Quantificateurs",util:"Postuler → existence → il existe",epist:"Sonde → existence → constructif/non-constructif",sectors:["LOG","ENS"],roles:["SON"]},
  {z:12,sym:"=",name:"Égalité",bloc:"LOG",grp:"Relations",util:"Identifier → objets → égalité",epist:"Standard → substitution → invariance",sectors:["LOG","META"],roles:["STD"]},
  {z:21,sym:"∈",name:"Appartenance",bloc:"ENS",grp:"Appartenance",util:"Typer → élément → ∈",epist:"Contrainte → domaine → validité",sectors:["ENS","META"],roles:["CON"]},
  {z:25,sym:"∪",name:"Union",bloc:"ENS",grp:"Opérations",util:"Agréger → ensembles → ∪",epist:"Structure → construction → fermeture",sectors:["ENS"],roles:["MOD"]},
  {z:26,sym:"∩",name:"Intersection",bloc:"ENS",grp:"Opérations",util:"Filtrer → ensembles → ∩",epist:"Contrainte → compatibilité → commun",sectors:["ENS"],roles:["CON"]},
  {z:31,sym:"ℝ",name:"Réels",bloc:"ENS",grp:"Nombres",util:"Représenter → continu → mesure",epist:"Standard → support analyse → limites",sectors:["ENS","ANA"],roles:["STD"]},
  {z:32,sym:"ℂ",name:"Complexes",bloc:"ENS",grp:"Nombres",util:"Représenter → phase/amplitude → ℂ",epist:"Modèle → oscillations → structure",sectors:["ENS","ANA"],roles:["MOD"]},
  {z:37,sym:"f:A→B",name:"Fonction",bloc:"FON",grp:"Applications",util:"Mapper → entrée→sortie → application",epist:"Standard → typage → domaine/codomaine",sectors:["FON","META"],roles:["STD"]},
  {z:45,sym:"x",name:"Vecteur",bloc:"LIN",grp:"Vecteurs",util:"Représenter → état → x",epist:"Modèle → espace vectoriel → état",sectors:["LIN","DYN"],roles:["MOD"]},
  {z:47,sym:"‖x‖",name:"Norme",bloc:"LIN",grp:"Normes",util:"Mesurer → magnitude → ‖x‖",epist:"Sonde → distance → métrique",sectors:["LIN","ANA"],roles:["SON"]},
  {z:49,sym:"A",name:"Matrice",bloc:"LIN",grp:"Matrices",util:"Transformer → linéaire → A",epist:"Modèle → opérateur linéaire → structure",sectors:["LIN"],roles:["MOD"]},
  {z:52,sym:"det(A)",name:"Déterminant",bloc:"LIN",grp:"Invariants",util:"Tester → inversibilité → det(A)",epist:"Sonde → singularité → volume",sectors:["LIN","ANA"],roles:["SON"]},
  {z:55,sym:"λ",name:"Valeur propre",bloc:"LIN",grp:"Spectral",util:"Paramétrer → modes → λ",epist:"Sonde → modes/stabilité → spectre",sectors:["LIN","DYN"],roles:["SON"]},
  {z:58,sym:"lim",name:"Limite",bloc:"ANA",grp:"Limites",util:"Évaluer → tendance → lim",epist:"Sonde → asymptotique → comportement",sectors:["ANA"],roles:["SON"]},
  {z:60,sym:"∇f",name:"Gradient",bloc:"ANA",grp:"Opérateurs",util:"Diriger → variation → ∇f",epist:"Sonde → direction max → sensibilité",sectors:["ANA","OPT"],roles:["SON"]},
  {z:61,sym:"∫",name:"Intégrale",bloc:"ANA",grp:"Intégrales",util:"Accumuler → continu → ∫",epist:"Sonde → accumulation → aire/masse",sectors:["ANA","PROB"],roles:["SON"]},
  {z:65,sym:"ℙ(A)",name:"Probabilité",bloc:"PROB",grp:"Probabilité",util:"Mesurer → événement → ℙ(A)",epist:"Sonde → incertitude → mesure",sectors:["PROB"],roles:["SON"]},
  {z:70,sym:"H(X)",name:"Entropie",bloc:"INFO",grp:"Entropie",util:"Mesurer → incertitude → H(X)",epist:"Sonde → diversité → information",sectors:["INFO","PROB"],roles:["SON"]},
  {z:73,sym:"G=(V,E)",name:"Graphe",bloc:"GRA",grp:"Définition",util:"Structurer → relations → graphe",epist:"Modèle → réseau → représentation",sectors:["GRA","ENS"],roles:["MOD"]},
  {z:79,sym:"min",name:"Minimiser",bloc:"OPT",grp:"Objectifs",util:"Optimiser → objectif → min",epist:"Standard → critère → sélection",sectors:["OPT"],roles:["STD"]},
  {z:81,sym:"ℒ(x,λ)",name:"Lagrangien",bloc:"OPT",grp:"Méthodes",util:"Combiner → objectif+contraintes → ℒ(x,λ)",epist:"Modèle → dualité → contraintes",sectors:["OPT"],roles:["MOD"]},
  {z:82,sym:"t",name:"Temps continu",bloc:"DYN",grp:"Temps",util:"Indexer → temps → t",epist:"Standard → axe temporel → continuité",sectors:["DYN"],roles:["STD"]},
  {z:84,sym:"τ",name:"Temps de rupture",bloc:"DYN",grp:"Rupture",util:"Localiser → rupture → τ",epist:"Sonde → shift de régime → détection",sectors:["DYN"],roles:["SON"]},
];

// ─── COLOR PALETTE / ORI-C DESIGN SYSTEM ────────────────────────────────────
const ORIC = {
  glow: "#4defa8",
  glowSoft: "rgba(77,239,168,.28)",
  gold: "#ffc97a",
  blue: "#7ed9ff",
  violet: "#d3a1ff",
  coral: "#ff9e8a",
  ink: "#030a07",
  panel: "rgba(133,231,180,.055)",
  panelStrong: "rgba(133,231,180,.085)",
  border: "rgba(141,235,189,.18)",
  text: "#edf7f1",
  muted: "#93b2a2",
  subtle: "#5e7a6d"
};

const BLOC_COLORS = {
  S: "#7ed9ff", P: "#4defa8", D: "#ffc97a", F: "#ff9e8a",
  LOG: "#d3a1ff", ENS: "#a9b4ff", FON: "#d3a1ff", LIN: "#ff8ec7", ANA: "#ff9e8a",
  PROB: "#ffc97a", INFO: "#e8d48a", GRA: "#8ae68a", OPT: "#4defa8", DYN: "#7ed9ff", META: "#93b2a2"
};
const TYPE_COLORS = { TECH: "#7ed9ff", MIXTE: "#d3a1ff", EPIST: "#ffc97a" };
const SECTOR_COLORS_CHEM = { EN: "#ffc97a", CHI: "#4defa8", MAT: "#a9b4ff", NUM: "#7ed9ff", SAN: "#ff9e8a", AGR: "#8ae68a", ENV: "#64e0c3", SPA: "#8ac4ff", DEF: "#ffb37a", NUC: "#ff8ec7", RES: "#93b2a2" };
const SECTOR_COLORS_MATH = { LOG: "#d3a1ff", ENS: "#a9b4ff", FON: "#c9a1ff", LIN: "#ff8ec7", ANA: "#ff9e8a", PROB: "#ffc97a", INFO: "#e8d48a", GRA: "#8ae68a", OPT: "#4defa8", DYN: "#7ed9ff", META: "#93b2a2" };

const ALL_ROLE_LABELS = {
  ...CHEM_ROLE_CODES,
  ...MATH_ROLE_LABELS,
  "Contrainte": "Contrainte",
  "Modèle": "Modèle",
  "Observable": "Observable",
  "Sonde": "Sonde",
  "Standard": "Standard",
  "Système modèle": "Système modèle",
  "Traceur": "Traceur"
};

function roleLabel(role) {
  return ALL_ROLE_LABELS[role] || role;
}

function compactLabel(label, max = 18) {
  if (!label) return "";
  return label.length > max ? label.slice(0, max - 1) + "…" : label;
}

function includesText(value, needle) {
  return String(value || "").toLowerCase().includes(needle);
}

function itemSearchBlob(item, sectorLabels) {
  return [
    item.z, item.sym, item.name, item.bloc, item.grp, item.type,
    item.util, item.epist,
    ...(item.sectors || []), ...(item.sectors || []).map(s => sectorLabels[s]),
    ...(item.roles || []), ...(item.roles || []).map(roleLabel)
  ].join(" ").toLowerCase();
}

function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
  return Promise.resolve();
}

// ─── COMPONENTS ─────────────────────────────────────────────────────────────
const Pill = ({ children, color = ORIC.glow, muted = false, title }) => (
  <span className={muted ? "pill pill-muted" : "pill"} title={title || children} style={{ "--pill": color }}>
    {children}
  </span>
);

const SegmentButton = ({ active, children, onClick }) => (
  <button className={active ? "segment active" : "segment"} onClick={onClick} type="button">
    {children}
  </button>
);

const FilterChip = ({ active, label, color, onClick, title }) => (
  <button
    type="button"
    className={active ? "filter-chip active" : "filter-chip"}
    onClick={onClick}
    title={title || label}
    style={{ "--chip": color || ORIC.glow }}
  >
    {label}
  </button>
);

const FilterGroup = ({ title, options, selected, onToggle, colorMap, labels }) => (
  <div className="filter-group">
    <div className="filter-title">{title}</div>
    <div className="filter-list">
      {options.map(opt => {
        const label = labels?.[opt] || opt;
        return (
          <FilterChip
            key={opt}
            active={selected.includes(opt)}
            label={compactLabel(label, 22)}
            title={label}
            color={colorMap?.[opt] || ORIC.glow}
            onClick={() => onToggle(opt)}
          />
        );
      })}
    </div>
  </div>
);

const LineText = ({ text }) => (
  <div className="line-text">
    {String(text || "").split("\n").filter(Boolean).map((line, i) => <p key={i}>{line}</p>)}
  </div>
);

const MetricCard = ({ label, value, accent = ORIC.glow }) => (
  <div className="metric-card" style={{ "--accent": accent }}>
    <strong>{value}</strong>
    <span>{label}</span>
  </div>
);

const ActiveFilters = ({ filters, onClear }) => {
  const active = filters.filter(f => f.count > 0);
  if (!active.length) return null;
  return (
    <div className="active-filters">
      {active.map(f => <span key={f.label}>{f.label} : {f.count}</span>)}
      <button type="button" onClick={onClear}>Réinitialiser</button>
    </div>
  );
};

const DetailPanel = ({ item, isChem, sectorLabels, sectorColors }) => {
  if (!item) {
    return (
      <aside className="detail-panel empty">
        <div className="detail-orb" />
        <h3>Sélectionnez une ligne</h3>
        <p>La fiche détail affiche la fonction utile, la valeur épistémique, les secteurs et les rôles associés.</p>
      </aside>
    );
  }
  const blocColor = BLOC_COLORS[item.bloc] || ORIC.glow;
  return (
    <aside className="detail-panel active" style={{ "--detail": blocColor }}>
      <div className="detail-topline">
        <span>#{item.z}</span>
        <span>{isChem ? "élément chimique" : "symbole mathématique"}</span>
      </div>
      <div className="detail-symbol">{item.sym}</div>
      <h3>{item.name}</h3>
      <p className="detail-meta">Bloc <b>{item.bloc}</b> · Groupe <b>{item.grp}</b>{isChem ? <> · Type <b>{item.type}</b></> : null}</p>
      <div className="detail-section">
        <h4>Utilisation opératoire</h4>
        <LineText text={item.util} />
      </div>
      <div className="detail-section">
        <h4>Lecture épistémique</h4>
        <LineText text={item.epist} />
      </div>
      <div className="detail-section">
        <h4>Secteurs</h4>
        <div className="pill-row">
          {item.sectors.map(s => <Pill key={s} color={sectorColors[s]} title={sectorLabels[s]}>{s}</Pill>)}
        </div>
      </div>
      <div className="detail-section">
        <h4>Rôles</h4>
        <div className="pill-row">
          {item.roles.map(r => <Pill key={r} color={ORIC.violet}>{roleLabel(r)}</Pill>)}
        </div>
      </div>
    </aside>
  );
};

function TableView({ rows, selected, setSelected, isChem, sectorLabels, sectorColors, sortKey, setSortKey, sortAsc, setSortAsc }) {
  const header = (key, label) => (
    <button
      type="button"
      className={sortKey === key ? "sort-head active" : "sort-head"}
      onClick={() => {
        if (sortKey === key) setSortAsc(!sortAsc);
        else { setSortKey(key); setSortAsc(true); }
      }}
    >
      {label}<span>{sortKey === key ? (sortAsc ? "↑" : "↓") : ""}</span>
    </button>
  );

  return (
    <div className="table-shell">
      <table className="oric-table">
        <thead>
          <tr>
            <th>{header("z", "N°")}</th>
            <th>{header("sym", "Symbole")}</th>
            <th>{header("name", "Nom")}</th>
            <th>{header("bloc", "Bloc")}</th>
            <th>Usage</th>
            <th>Lecture</th>
            <th>Secteurs</th>
            <th>Rôles</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(item => {
            const active = selected?.z === item.z && selected?.sym === item.sym && selected?.name === item.name;
            const blocColor = BLOC_COLORS[item.bloc] || ORIC.glow;
            return (
              <tr key={`${item.z}-${item.sym}-${item.name}`} className={active ? "selected" : ""} onClick={() => setSelected(item)}>
                <td className="num">{item.z}</td>
                <td><span className="symbol-badge" style={{ "--symbol": blocColor }}>{item.sym}</span></td>
                <td>
                  <strong>{item.name}</strong>
                  <small>{item.grp}{isChem && item.type ? ` · ${item.type}` : ""}</small>
                </td>
                <td><Pill color={blocColor}>{item.bloc}</Pill></td>
                <td className="text-cell"><LineText text={item.util} /></td>
                <td className="text-cell"><LineText text={item.epist} /></td>
                <td>
                  <div className="pill-row compact">
                    {item.sectors.map(s => <Pill key={s} color={sectorColors[s]} title={sectorLabels[s]}>{s}</Pill>)}
                  </div>
                </td>
                <td>
                  <div className="pill-row compact">
                    {item.roles.map(r => <Pill key={r} color={ORIC.violet}>{roleLabel(r)}</Pill>)}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {!rows.length && <div className="empty-results">Aucun résultat avec ces filtres.</div>}
    </div>
  );
}

function CardView({ rows, selected, setSelected, sectorLabels, sectorColors }) {
  return (
    <div className="cards-grid">
      {rows.map(item => {
        const blocColor = BLOC_COLORS[item.bloc] || ORIC.glow;
        const active = selected?.z === item.z && selected?.sym === item.sym && selected?.name === item.name;
        return (
          <article key={`${item.z}-${item.sym}-${item.name}`} className={active ? "mini-card active" : "mini-card"} onClick={() => setSelected(item)} style={{ "--card": blocColor }}>
            <div className="mini-head">
              <span>#{item.z}</span>
              <Pill color={blocColor}>{item.bloc}</Pill>
            </div>
            <div className="mini-symbol">{item.sym}</div>
            <h3>{item.name}</h3>
            <p>{item.grp}</p>
            <LineText text={item.util} />
            <div className="pill-row compact">
              {item.sectors.slice(0, 5).map(s => <Pill key={s} color={sectorColors[s]} title={sectorLabels[s]}>{s}</Pill>)}
              {item.sectors.length > 5 ? <Pill muted>+{item.sectors.length - 5}</Pill> : null}
            </div>
          </article>
        );
      })}
      {!rows.length && <div className="empty-results full">Aucune carte à afficher.</div>}
    </div>
  );
}

function MatrixView({ rows, sectors, sectorLabels, sectorColors, selected, setSelected }) {
  return (
    <div className="matrix-shell">
      <table className="matrix-table">
        <thead>
          <tr>
            <th className="matrix-name">Entrée</th>
            {sectors.map(s => <th key={s} title={sectorLabels[s]} style={{ "--sector": sectorColors[s] }}>{s}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map(item => {
            const active = selected?.z === item.z && selected?.sym === item.sym && selected?.name === item.name;
            return (
              <tr key={`${item.z}-${item.sym}-${item.name}`} className={active ? "selected" : ""} onClick={() => setSelected(item)}>
                <td className="matrix-name"><b>{item.sym}</b><span>{item.name}</span></td>
                {sectors.map(s => {
                  const has = item.sectors.includes(s);
                  return <td key={s}><span className={has ? "dot on" : "dot"} title={has ? sectorLabels[s] : ""} style={{ "--sector": sectorColors[s] }}>{has ? "" : ""}</span></td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {!rows.length && <div className="empty-results">Aucune correspondance matricielle.</div>}
    </div>
  );
}

function StatsView({ stats, sectors, sectorLabels, sectorColors, isChem, filtersCount }) {
  const topRoles = Object.entries(stats.roleCounts).sort((a, b) => b[1] - a[1]);
  return (
    <div className="stats-view">
      <div className="metrics-grid">
        <MetricCard label="entrées affichées" value={stats.total} accent={ORIC.glow} />
        <MetricCard label="secteurs / entrée" value={stats.avgSectors} accent={ORIC.blue} />
        <MetricCard label={isChem ? "type épistémique" : "méta-notation"} value={stats.specialCount} accent={ORIC.gold} />
        <MetricCard label="filtres actifs" value={filtersCount} accent={ORIC.violet} />
      </div>
      <div className="bars-grid">
        <section className="bars-card">
          <h3>Distribution par secteur</h3>
          {sectors.map(s => {
            const count = stats.sectorCounts[s] || 0;
            const pct = stats.total ? Math.round((count / stats.total) * 100) : 0;
            return (
              <div className="bar-row" key={s}>
                <span className="bar-label" title={sectorLabels[s]} style={{ color: sectorColors[s] }}>{s}</span>
                <div className="bar-track"><i style={{ width: `${pct}%`, background: sectorColors[s] }} /></div>
                <span className="bar-count">{count}</span>
              </div>
            );
          })}
        </section>
        <section className="bars-card">
          <h3>Distribution par rôle</h3>
          {topRoles.map(([r, count]) => {
            const pct = stats.total ? Math.round((count / stats.total) * 100) : 0;
            return (
              <div className="bar-row" key={r}>
                <span className="bar-label role" title={roleLabel(r)}>{compactLabel(roleLabel(r), 15)}</span>
                <div className="bar-track"><i style={{ width: `${pct}%`, background: ORIC.violet }} /></div>
                <span className="bar-count">{count}</span>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}

// ─── MAIN APP ───────────────────────────────────────────────────────────────
function App() {
  const [tab, setTab] = useState("chem");
  const [view, setView] = useState("table");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("z");
  const [sortAsc, setSortAsc] = useState(true);
  const [selBlocs, setSelBlocs] = useState([]);
  const [selSectors, setSelSectors] = useState([]);
  const [selRoles, setSelRoles] = useState([]);
  const [selTypes, setSelTypes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [copied, setCopied] = useState(false);

  const isChem = tab === "chem";
  const data = isChem ? chemElements : mathSymbols;
  const sectors = isChem ? CHEM_SECTORS : MATH_SECTORS;
  const sectorLabels = isChem ? CHEM_SECTOR_LABELS : MATH_SECTOR_LABELS;
  const sectorColors = isChem ? SECTOR_COLORS_CHEM : SECTOR_COLORS_MATH;
  const blocs = useMemo(() => [...new Set(data.map(d => d.bloc))], [data]);
  const roles = useMemo(() => [...new Set(data.flatMap(d => d.roles))], [data]);

  const resetFilters = () => {
    setSearch(""); setSelBlocs([]); setSelSectors([]); setSelRoles([]); setSelTypes([]);
  };

  const switchTab = (next) => {
    setTab(next);
    setSelected(null);
    setSortKey("z");
    setSortAsc(true);
    resetFilters();
  };

  const toggle = (setter, value) => setter(prev => prev.includes(value) ? prev.filter(x => x !== value) : [...prev, value]);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    let rows = data.filter(item => {
      if (needle && !itemSearchBlob(item, sectorLabels).includes(needle)) return false;
      if (selBlocs.length && !selBlocs.includes(item.bloc)) return false;
      if (selSectors.length && !item.sectors.some(s => selSectors.includes(s))) return false;
      if (selRoles.length && !item.roles.some(r => selRoles.includes(r))) return false;
      if (isChem && selTypes.length && !selTypes.includes(item.type)) return false;
      return true;
    });
    rows = rows.slice().sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (sortKey === "sectors") { av = a.sectors.length; bv = b.sectors.length; }
      if (sortKey === "roles") { av = a.roles.length; bv = b.roles.length; }
      if (typeof av === "number" && typeof bv === "number") return sortAsc ? av - bv : bv - av;
      return sortAsc ? String(av).localeCompare(String(bv), "fr") : String(bv).localeCompare(String(av), "fr");
    });
    return rows;
  }, [data, sectorLabels, search, selBlocs, selSectors, selRoles, selTypes, isChem, sortKey, sortAsc]);

  const stats = useMemo(() => {
    const sectorCounts = Object.fromEntries(sectors.map(s => [s, 0]));
    const roleCounts = {};
    filtered.forEach(item => {
      item.sectors.forEach(s => { sectorCounts[s] = (sectorCounts[s] || 0) + 1; });
      item.roles.forEach(r => { roleCounts[r] = (roleCounts[r] || 0) + 1; });
    });
    const avg = filtered.length ? (filtered.reduce((sum, item) => sum + item.sectors.length, 0) / filtered.length).toFixed(1) : "0.0";
    const specialCount = isChem
      ? filtered.filter(item => item.type === "EPIST").length
      : filtered.filter(item => item.sectors.includes("META")).length;
    return { total: filtered.length, sectorCounts, roleCounts, avgSectors: avg, specialCount };
  }, [filtered, sectors, isChem]);

  const filtersCount = selBlocs.length + selSectors.length + selRoles.length + selTypes.length + (search.trim() ? 1 : 0);

  const csvText = useMemo(() => {
    const escape = value => `"${String(value ?? "").replaceAll('"', '""')}"`;
    const headers = ["z", "symbole", "nom", "bloc", "groupe", "type", "secteurs", "roles", "utilisation", "epistemique"];
    const lines = filtered.map(item => [
      item.z, item.sym, item.name, item.bloc, item.grp, item.type || "",
      item.sectors.join("|"), item.roles.map(roleLabel).join("|"), item.util, item.epist
    ].map(escape).join(","));
    return [headers.join(","), ...lines].join("\n");
  }, [filtered]);

  const handleCopyCsv = () => {
    copyText(csvText).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    });
  };

  const currentSelected = selected && filtered.some(item => item.z === selected.z && item.sym === selected.sym && item.name === selected.name)
    ? selected
    : filtered[0] || null;

  return (
    <div className="oric-app" id="tables">
      <header className="app-hero">
        <nav className="top-nav" aria-label="Navigation du tableau">
          <a href="https://www.ori-c.be/" className="brand"><span />ORI-C</a>
          <div className="nav-actions">
            <a href="https://www.ori-c.be/ori-c-outils.html">Outils</a>
            <a href="https://www.ori-c.be/ori-c-presentation.html">Cadre</a>
          </div>
        </nav>
        <div className="hero-grid">
          <div>
            <p className="eyebrow">TABLEAU DE COHÉRENCE · VERSION ORI-C</p>
            <h1>Explorer les correspondances entre usage, trace et connaissance.</h1>
            <p className="lead">Une interface plus lisible pour parcourir les éléments chimiques et les symboles mathématiques selon leurs secteurs d’usage, leurs rôles épistémiques et leur fonction de modélisation.</p>
            <div className="hero-actions">
              <button type="button" onClick={() => document.getElementById("explorer")?.scrollIntoView({ behavior: "smooth" })}>Explorer le tableau</button>
              <button type="button" className="ghost" onClick={handleCopyCsv}>{copied ? "CSV copié" : "Copier CSV filtré"}</button>
            </div>
          </div>
          <div className="hero-panel" aria-hidden="true">
            <div className="orbit o1" />
            <div className="orbit o2" />
            <div className="core">Σ</div>
            <span className="node n1" /><span className="node n2" /><span className="node n3" />
          </div>
        </div>
      </header>

      <main className="workspace" id="explorer">
        <section className="control-panel">
          <div className="switch-row">
            <div className="segments" role="tablist" aria-label="Jeu de données">
              <SegmentButton active={isChem} onClick={() => switchTab("chem")}>Éléments chimiques</SegmentButton>
              <SegmentButton active={!isChem} onClick={() => switchTab("math")}>Symboles mathématiques</SegmentButton>
            </div>
            <div className="segments small" aria-label="Mode d'affichage">
              <SegmentButton active={view === "table"} onClick={() => setView("table")}>Table</SegmentButton>
              <SegmentButton active={view === "cards"} onClick={() => setView("cards")}>Cartes</SegmentButton>
              <SegmentButton active={view === "matrix"} onClick={() => setView("matrix")}>Matrice</SegmentButton>
              <SegmentButton active={view === "stats"} onClick={() => setView("stats")}>Stats</SegmentButton>
            </div>
          </div>

          <div className="search-row">
            <label className="search-box">
              <span>Recherche</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Nom, symbole, secteur, rôle, usage, trace…"
              />
            </label>
            <button type="button" className="clear-btn" onClick={resetFilters}>Réinitialiser</button>
          </div>

          <div className="filters-grid">
            <FilterGroup title="Blocs" options={blocs} selected={selBlocs} onToggle={v => toggle(setSelBlocs, v)} colorMap={BLOC_COLORS} />
            <FilterGroup title="Secteurs" options={sectors} selected={selSectors} onToggle={v => toggle(setSelSectors, v)} colorMap={sectorColors} labels={sectorLabels} />
            <FilterGroup title="Rôles" options={roles} selected={selRoles} onToggle={v => toggle(setSelRoles, v)} colorMap={{}} labels={Object.fromEntries(roles.map(r => [r, roleLabel(r)]))} />
            {isChem ? <FilterGroup title="Types" options={CHEM_TYPES} selected={selTypes} onToggle={v => toggle(setSelTypes, v)} colorMap={TYPE_COLORS} /> : null}
          </div>

          <ActiveFilters
            filters={[
              { label: "Recherche", count: search.trim() ? 1 : 0 },
              { label: "Blocs", count: selBlocs.length },
              { label: "Secteurs", count: selSectors.length },
              { label: "Rôles", count: selRoles.length },
              { label: "Types", count: selTypes.length }
            ]}
            onClear={resetFilters}
          />
        </section>

        <section className="content-grid">
          <div className="results-panel">
            <div className="results-head">
              <div>
                <p>{isChem ? "Chimie" : "Mathématiques"}</p>
                <h2>{filtered.length} entrée{filtered.length > 1 ? "s" : ""} affichée{filtered.length > 1 ? "s" : ""}</h2>
              </div>
              <button type="button" className="copy-btn" onClick={handleCopyCsv}>{copied ? "Copié" : "Copier CSV"}</button>
            </div>

            {view === "table" ? <TableView rows={filtered} selected={currentSelected} setSelected={setSelected} isChem={isChem} sectorLabels={sectorLabels} sectorColors={sectorColors} sortKey={sortKey} setSortKey={setSortKey} sortAsc={sortAsc} setSortAsc={setSortAsc} /> : null}
            {view === "cards" ? <CardView rows={filtered} selected={currentSelected} setSelected={setSelected} sectorLabels={sectorLabels} sectorColors={sectorColors} /> : null}
            {view === "matrix" ? <MatrixView rows={filtered} sectors={sectors} sectorLabels={sectorLabels} sectorColors={sectorColors} selected={currentSelected} setSelected={setSelected} /> : null}
            {view === "stats" ? <StatsView stats={stats} sectors={sectors} sectorLabels={sectorLabels} sectorColors={sectorColors} isChem={isChem} filtersCount={filtersCount} /> : null}
          </div>

          <DetailPanel item={currentSelected} isChem={isChem} sectorLabels={sectorLabels} sectorColors={sectorColors} />
        </section>
      </main>
    </div>
  );
}

// Mount
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
