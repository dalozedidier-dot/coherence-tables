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

// ─── COLOR PALETTE ──────────────────────────────────────────────────────────
const BLOC_COLORS = {S:"#3b82f6",P:"#10b981",D:"#f59e0b",F:"#ef4444",
  LOG:"#6366f1",ENS:"#8b5cf6",FON:"#a855f7",LIN:"#ec4899",ANA:"#f43f5e",
  PROB:"#f97316",INFO:"#eab308",GRA:"#22c55e",OPT:"#14b8a6",DYN:"#06b6d4",META:"#64748b"};

const TYPE_COLORS = {TECH:"#3b82f6",MIXTE:"#a855f7",EPIST:"#ef4444"};

const SECTOR_COLORS_CHEM = {EN:"#f59e0b",CHI:"#10b981",MAT:"#6366f1",NUM:"#3b82f6",SAN:"#ef4444",AGR:"#22c55e",ENV:"#14b8a6",SPA:"#06b6d4",DEF:"#f97316",NUC:"#ec4899",RES:"#64748b"};
const SECTOR_COLORS_MATH = {LOG:"#6366f1",ENS:"#8b5cf6",FON:"#a855f7",LIN:"#ec4899",ANA:"#f43f5e",PROB:"#f97316",INFO:"#eab308",GRA:"#22c55e",OPT:"#14b8a6",DYN:"#06b6d4",META:"#64748b"};

// ─── COMPONENTS ─────────────────────────────────────────────────────────────
const Pill = ({label, color, small}) => (
  <span style={{
    display:"inline-block", padding: small ? "1px 6px" : "2px 8px",
    borderRadius:999, fontSize: small ? 10 : 11, fontWeight:600,
    background:`${color}18`, color, border:`1px solid ${color}40`,
    marginRight:4, marginBottom:2, lineHeight:"16px", whiteSpace:"nowrap"
  }}>{label}</span>
);

const FilterBar = ({label, options, selected, onToggle, colorMap}) => (
  <div style={{marginBottom:8}}>
    <span style={{fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:1,marginRight:8}}>{label}</span>
    {options.map(o => {
      const active = selected.includes(o);
      const c = colorMap?.[o] || "#64748b";
      return (
        <button key={o} onClick={() => onToggle(o)} style={{
          display:"inline-block", padding:"2px 8px", borderRadius:999,
          fontSize:11, fontWeight:600, marginRight:4, marginBottom:2,
          cursor:"pointer", border:`1px solid ${active ? c : "#334155"}`,
          background: active ? `${c}20` : "transparent",
          color: active ? c : "#64748b", transition:"all .15s"
        }}>{o}</button>
      );
    })}
  </div>
);

const CellText = ({text}) => (
  <div style={{fontSize:12, lineHeight:"17px", whiteSpace:"pre-wrap"}}>
    {text.split("\n").map((l,i) => <div key={i} style={{marginBottom:2}}>{l}</div>)}
  </div>
);

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
  const [expanded, setExpanded] = useState(null);
  const [showGuide, setShowGuide] = useState(false);

  const isChem = tab === "chem";
  const data = isChem ? chemElements : mathSymbols;
  const sectors = isChem ? CHEM_SECTORS : MATH_SECTORS;
  const sectorLabels = isChem ? CHEM_SECTOR_LABELS : MATH_SECTOR_LABELS;
  const sectorColors = isChem ? SECTOR_COLORS_CHEM : SECTOR_COLORS_MATH;
  const blocs = [...new Set(data.map(d => d.bloc))];

  const toggle = (arr, setArr, v) => setArr(prev => prev.includes(v) ? prev.filter(x=>x!==v) : [...prev, v]);

  const filtered = useMemo(() => {
    let f = data;
    if (search) {
      const s = search.toLowerCase();
      f = f.filter(d => d.sym.toLowerCase().includes(s) || d.name.toLowerCase().includes(s) || String(d.z).includes(s));
    }
    if (selBlocs.length) f = f.filter(d => selBlocs.includes(d.bloc));
    if (selSectors.length) f = f.filter(d => d.sectors.some(s => selSectors.includes(s)));
    if (selRoles.length) f = f.filter(d => d.roles.some(r => selRoles.includes(r)));
    if (isChem && selTypes.length) f = f.filter(d => selTypes.includes(d.type));

    f = [...f].sort((a,b) => {
      let va = a[sortKey], vb = b[sortKey];
      if (sortKey === "z") return sortAsc ? va - vb : vb - va;
      if (typeof va === "string") return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
      return 0;
    });
    return f;
  }, [data, search, selBlocs, selSectors, selRoles, selTypes, sortKey, sortAsc, isChem]);

  const handleSort = useCallback((key) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  }, [sortKey, sortAsc]);

  const clearFilters = () => { setSelBlocs([]); setSelSectors([]); setSelRoles([]); setSelTypes([]); setSearch(""); };

  // Stats
  const stats = useMemo(() => {
    const sectorCounts = {};
    sectors.forEach(s => { sectorCounts[s] = filtered.filter(d => d.sectors.includes(s)).length; });
    const roleCounts = {};
    (isChem ? CHEM_ROLES : MATH_ROLES).forEach(r => { roleCounts[r] = filtered.filter(d => d.roles.includes(r)).length; });
    const avgSectors = filtered.length ? (filtered.reduce((a,d) => a + d.sectors.length, 0) / filtered.length).toFixed(1) : 0;
    const resOnly = filtered.filter(d => d.sectors.length === 1 && d.sectors[0] === (isChem ? "RES" : "META")).length;
    return {sectorCounts, roleCounts, avgSectors, resOnly, total: filtered.length};
  }, [filtered, sectors, isChem]);

  const SortHeader = ({k, children, w}) => (
    <th onClick={() => handleSort(k)} style={{
      padding:"10px 8px", textAlign:"left", cursor:"pointer", userSelect:"none",
      fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase",
      letterSpacing:.5, borderBottom:"2px solid #1e293b", width: w || "auto",
      position:"sticky", top:0, background:"#0f172a", zIndex:2
    }}>
      {children} {sortKey === k ? (sortAsc ? "▲" : "▼") : ""}
    </th>
  );

  return (
    <div style={{
      fontFamily:"'IBM Plex Sans', 'Segoe UI', system-ui, sans-serif",
      background:"#0a0f1a", color:"#e2e8f0", minHeight:"100vh", padding:0
    }}>
      {/* ─── HEADER ─── */}
      <div style={{
        background:"linear-gradient(135deg, #0f172a 0%, #1a1f3a 100%)",
        borderBottom:"1px solid #1e293b", padding:"20px 24px 12px"
      }}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12}}>
          <div>
            <h1 style={{margin:0, fontSize:20, fontWeight:800, letterSpacing:-.5,
              background:"linear-gradient(135deg, #60a5fa, #a78bfa)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"
            }}>Cohérence interne de la science expérimentale</h1>
            <p style={{margin:"4px 0 0", fontSize:12, color:"#64748b"}}>
              Daloze Didier — Tableaux normalisés · Navigation interactive
            </p>
          </div>
          <div style={{display:"flex", gap:6}}>
            <button onClick={() => setShowGuide(!showGuide)} style={{
              padding:"6px 12px", borderRadius:8, fontSize:11, fontWeight:600,
              border:"1px solid #334155", background: showGuide ? "#1e293b" : "transparent",
              color:"#94a3b8", cursor:"pointer"
            }}>📖 Guide</button>
          </div>
        </div>

        {/* Tab selector */}
        <div style={{display:"flex", gap:4, marginTop:12}}>
          {[["chem","⚛ Éléments chimiques (Z=1→118)"],["math","∑ Grammaire mathématique"]].map(([k,l]) => (
            <button key={k} onClick={() => { setTab(k); clearFilters(); setView("table"); }} style={{
              padding:"8px 16px", borderRadius:"8px 8px 0 0", fontSize:12, fontWeight:700,
              border: tab===k ? "1px solid #334155" : "1px solid transparent",
              borderBottom: tab===k ? "1px solid #0f172a" : "none",
              background: tab===k ? "#0f172a" : "transparent",
              color: tab===k ? "#e2e8f0" : "#64748b", cursor:"pointer"
            }}>{l}</button>
          ))}
        </div>
      </div>

      {/* ─── GUIDE PANEL ─── */}
      {showGuide && (
        <div style={{background:"#111827", borderBottom:"1px solid #1e293b", padding:"16px 24px"}}>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, fontSize:12, lineHeight:"18px"}}>
            <div>
              <h3 style={{margin:"0 0 8px", fontSize:13, color:"#60a5fa"}}>Tableau 1 — Global normalisé</h3>
              <p style={{color:"#94a3b8", margin:0}}>Table canonique : couverture maximale, format stable. Base pour comparaison, tri, extension. Chaque ligne = unité comparable via le triptyque Utilisation / Usage épistémique / Multisecteurs.</p>
            </div>
            <div>
              <h3 style={{margin:"0 0 8px", fontSize:13, color:"#a78bfa"}}>Tableau 2 — Extrait Bloc P</h3>
              <p style={{color:"#94a3b8", margin:0}}>Extrait focal (groupes 13–18). Test de robustesse : semi-conducteurs, halogènes, gaz nobles, superlourds. Vérifie que le gabarit verbe-first / rôle-first reste stable.</p>
            </div>
            <div>
              <h3 style={{margin:"0 0 8px", fontSize:13, color:"#f472b6"}}>Tableau 3 — Vue rapide (diagnostic)</h3>
              <p style={{color:"#94a3b8", margin:0}}>Projection basse dimension. Détecte : sous-typage (nan), pollution de colonnes, hétérogénéité lexicale, densité sectorielle anormale.</p>
            </div>
          </div>
          <div style={{marginTop:12, padding:"8px 12px", background:"#1e293b", borderRadius:8, fontSize:11, color:"#94a3b8"}}>
            <strong style={{color:"#e2e8f0"}}>Protocole : </strong>
            1. Référence sur le global → 2. Validation locale (extrait) → 3. Diagnostic (vue rapide) → 4. Correction par règles
          </div>
        </div>
      )}

      {/* ─── TOOLBAR ─── */}
      <div style={{padding:"12px 24px", borderBottom:"1px solid #1e293b", background:"#0f172a"}}>
        <div style={{display:"flex", gap:8, alignItems:"center", marginBottom:8, flexWrap:"wrap"}}>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder={isChem ? "Rechercher (symbole, nom, Z)…" : "Rechercher (symbole, nom)…"}
            style={{
              padding:"6px 12px", borderRadius:8, fontSize:12, width:220,
              background:"#1e293b", border:"1px solid #334155", color:"#e2e8f0", outline:"none"
            }}
          />
          <div style={{display:"flex", gap:4}}>
            {["table","matrix","stats"].map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding:"5px 12px", borderRadius:6, fontSize:11, fontWeight:600,
                border:`1px solid ${view===v ? "#3b82f6" : "#334155"}`,
                background: view===v ? "#3b82f620" : "transparent",
                color: view===v ? "#60a5fa" : "#64748b", cursor:"pointer"
              }}>{v === "table" ? "📋 Tableau" : v === "matrix" ? "🔢 Matrice" : "📊 Stats"}</button>
            ))}
          </div>
          {(selBlocs.length || selSectors.length || selRoles.length || selTypes.length || search) ? (
            <button onClick={clearFilters} style={{
              padding:"5px 10px", borderRadius:6, fontSize:11, border:"1px solid #ef4444",
              background:"transparent", color:"#ef4444", cursor:"pointer"
            }}>✕ Réinitialiser</button>
          ) : null}
          <span style={{fontSize:11, color:"#64748b", marginLeft:"auto"}}>
            {filtered.length} / {data.length} {isChem ? "éléments" : "symboles"}
          </span>
        </div>

        <FilterBar label="Bloc" options={blocs} selected={selBlocs} onToggle={v => toggle(selBlocs, setSelBlocs, v)} colorMap={BLOC_COLORS} />
        <FilterBar label="Secteurs" options={sectors} selected={selSectors} onToggle={v => toggle(selSectors, setSelSectors, v)} colorMap={sectorColors} />
        <FilterBar label="Rôles" options={isChem ? CHEM_ROLES : MATH_ROLES} selected={selRoles} onToggle={v => toggle(selRoles, setSelRoles, v)} />
        {isChem && <FilterBar label="Type" options={CHEM_TYPES} selected={selTypes} onToggle={v => toggle(selTypes, setSelTypes, v)} colorMap={TYPE_COLORS} />}
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div style={{padding:"0 24px 24px"}}>
        {view === "table" && (
          <div style={{overflowX:"auto", marginTop:12}}>
            <table style={{width:"100%", borderCollapse:"collapse", fontSize:12}}>
              <thead>
                <tr>
                  <SortHeader k="z" w="50px">Z</SortHeader>
                  <SortHeader k="sym" w="60px">Sym.</SortHeader>
                  <SortHeader k="name" w="120px">Nom</SortHeader>
                  <SortHeader k="bloc" w="50px">Bloc</SortHeader>
                  <th style={{padding:"10px 8px",textAlign:"left",fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.5,borderBottom:"2px solid #1e293b",position:"sticky",top:0,background:"#0f172a",zIndex:2,width:"28%"}}>Utilisation</th>
                  <th style={{padding:"10px 8px",textAlign:"left",fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.5,borderBottom:"2px solid #1e293b",position:"sticky",top:0,background:"#0f172a",zIndex:2,width:"28%"}}>Usage épistémique</th>
                  <th style={{padding:"10px 8px",textAlign:"left",fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.5,borderBottom:"2px solid #1e293b",position:"sticky",top:0,background:"#0f172a",zIndex:2}}>Multi­secteurs</th>
                  <th style={{padding:"10px 8px",textAlign:"left",fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.5,borderBottom:"2px solid #1e293b",position:"sticky",top:0,background:"#0f172a",zIndex:2}}>Rôles</th>
                  {isChem && <th style={{padding:"10px 8px",textAlign:"left",fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:.5,borderBottom:"2px solid #1e293b",position:"sticky",top:0,background:"#0f172a",zIndex:2,width:60}}>Type</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((d, i) => {
                  const isExp = expanded === d.z;
                  return (
                    <tr key={d.z} onClick={() => setExpanded(isExp ? null : d.z)} style={{
                      cursor:"pointer", background: isExp ? "#1e293b" : i%2===0 ? "transparent" : "#0f172a08",
                      borderBottom:"1px solid #1e293b", transition:"background .1s"
                    }}>
                      <td style={{padding:"8px",fontWeight:700,color:"#60a5fa",fontVariantNumeric:"tabular-nums"}}>{d.z}</td>
                      <td style={{padding:"8px"}}>
                        <span style={{
                          display:"inline-flex",alignItems:"center",justifyContent:"center",
                          width:36,height:36,borderRadius:8,fontWeight:800,fontSize:14,
                          background:`${BLOC_COLORS[d.bloc]}15`,color:BLOC_COLORS[d.bloc],
                          border:`1px solid ${BLOC_COLORS[d.bloc]}30`
                        }}>{d.sym}</span>
                      </td>
                      <td style={{padding:"8px",fontWeight:500}}>{d.name}</td>
                      <td style={{padding:"8px"}}><Pill label={d.bloc} color={BLOC_COLORS[d.bloc]} small /></td>
                      <td style={{padding:"8px"}}><CellText text={d.util} /></td>
                      <td style={{padding:"8px"}}><CellText text={d.epist} /></td>
                      <td style={{padding:"8px"}}>
                        {d.sectors.map(s => <Pill key={s} label={s} color={sectorColors[s] || "#64748b"} small />)}
                      </td>
                      <td style={{padding:"8px"}}>
                        {d.roles.map(r => <Pill key={r} label={isChem ? r.slice(0,3).toUpperCase() : r} color="#a78bfa" small />)}
                      </td>
                      {isChem && <td style={{padding:"8px"}}><Pill label={d.type} color={TYPE_COLORS[d.type]} small /></td>}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {view === "matrix" && (
          <div style={{overflowX:"auto", marginTop:12}}>
            <h3 style={{fontSize:14,fontWeight:700,color:"#94a3b8",marginBottom:8}}>
              Matrice d'incidence — {isChem ? "Éléments × Secteurs" : "Symboles × Secteurs"}
            </h3>
            <table style={{borderCollapse:"collapse",fontSize:11}}>
              <thead>
                <tr>
                  <th style={{padding:"4px 8px",position:"sticky",left:0,background:"#0f172a",zIndex:3,borderBottom:"2px solid #1e293b",color:"#94a3b8",fontSize:10}}>Z</th>
                  <th style={{padding:"4px 8px",position:"sticky",left:40,background:"#0f172a",zIndex:3,borderBottom:"2px solid #1e293b",color:"#94a3b8",fontSize:10}}>Sym</th>
                  {sectors.map(s => (
                    <th key={s} style={{padding:"4px 6px",textAlign:"center",borderBottom:"2px solid #1e293b",color:sectorColors[s],fontSize:10,fontWeight:700,minWidth:36}}>{s}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((d,i) => (
                  <tr key={d.z} style={{borderBottom:"1px solid #1e293b15"}}>
                    <td style={{padding:"3px 8px",fontWeight:600,color:"#60a5fa",position:"sticky",left:0,background:"#0f172a",fontSize:10}}>{d.z}</td>
                    <td style={{padding:"3px 8px",fontWeight:700,position:"sticky",left:40,background:"#0f172a",fontSize:10}}>{d.sym}</td>
                    {sectors.map(s => {
                      const has = d.sectors.includes(s);
                      return (
                        <td key={s} style={{textAlign:"center",padding:"3px"}}>
                          <div style={{
                            width:20,height:20,borderRadius:4,margin:"0 auto",
                            background: has ? `${sectorColors[s]}30` : "transparent",
                            border: has ? `1px solid ${sectorColors[s]}50` : "1px solid #1e293b30",
                            display:"flex",alignItems:"center",justifyContent:"center",
                            fontSize:10,fontWeight:800,color: has ? sectorColors[s] : "transparent"
                          }}>{has ? "1" : ""}</div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === "stats" && (
          <div style={{marginTop:16}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12,marginBottom:20}}>
              {[
                {label:"Éléments affichés",value:stats.total,color:"#60a5fa"},
                {label:"Moy. secteurs/élément",value:stats.avgSectors,color:"#a78bfa"},
                {label:isChem ? "RES uniquement" : "META uniquement",value:stats.resOnly,color:"#64748b"},
                {label:"Filtres actifs",value:selBlocs.length+selSectors.length+selRoles.length+selTypes.length,color:"#f59e0b"},
              ].map((s,i) => (
                <div key={i} style={{background:"#111827",borderRadius:12,padding:"16px",border:"1px solid #1e293b"}}>
                  <div style={{fontSize:28,fontWeight:800,color:s.color}}>{s.value}</div>
                  <div style={{fontSize:11,color:"#64748b",marginTop:4}}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div style={{background:"#111827",borderRadius:12,padding:16,border:"1px solid #1e293b"}}>
                <h4 style={{margin:"0 0 12px",fontSize:13,color:"#94a3b8"}}>Distribution par secteur</h4>
                {sectors.map(s => {
                  const c = stats.sectorCounts[s] || 0;
                  const pct = stats.total ? (c / stats.total * 100) : 0;
                  return (
                    <div key={s} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                      <span style={{width:40,fontSize:10,fontWeight:700,color:sectorColors[s],textAlign:"right"}}>{s}</span>
                      <div style={{flex:1,height:16,background:"#1e293b",borderRadius:4,overflow:"hidden"}}>
                        <div style={{width:`${pct}%`,height:"100%",background:`${sectorColors[s]}60`,borderRadius:4,transition:"width .3s"}} />
                      </div>
                      <span style={{width:30,fontSize:10,color:"#64748b",textAlign:"right"}}>{c}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{background:"#111827",borderRadius:12,padding:16,border:"1px solid #1e293b"}}>
                <h4 style={{margin:"0 0 12px",fontSize:13,color:"#94a3b8"}}>Distribution par rôle épistémique</h4>
                {Object.entries(stats.roleCounts).map(([r,c]) => {
                  const pct = stats.total ? (c / stats.total * 100) : 0;
                  return (
                    <div key={r} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                      <span style={{width:80,fontSize:10,fontWeight:600,color:"#a78bfa",textAlign:"right"}}>{r}</span>
                      <div style={{flex:1,height:16,background:"#1e293b",borderRadius:4,overflow:"hidden"}}>
                        <div style={{width:`${pct}%`,height:"100%",background:"#a78bfa40",borderRadius:4,transition:"width .3s"}} />
                      </div>
                      <span style={{width:30,fontSize:10,color:"#64748b",textAlign:"right"}}>{c}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Mount
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
