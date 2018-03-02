drop database infoteam;

create database infoteam;
	
use infoteam;

create table Personne (
id int primary key AUTO_INCREMENT,
nom varchar(20) not null,
prenom varchar(20) not null,
mail varchar(50) not null,
mdp varchar(40) character set ascii not null,
type varchar(20) not null
)engine = InnoDB;

create table Article (
numArticle int primary key AUTO_INCREMENT,
titre varchar(40) not null,
nomAuteur varchar(20) not null,
prenomAuteur varchar(20) not null,
tag varchar(30) not null,
datePublication datetime,
etat varchar(20),
contenuArticle text,
nbVue int
)engine = InnoDB;

create table Commentaire (
idCommentaire int primary key AUTO_INCREMENT,
nomCommentaire varchar(20) not null,
prenomCommentaire varchar(20) not null,
dateCommentaire datetime,
etatCommentaire varchar(20),
contenuCommentaire text,
idPersonne int,
foreign key (idPersonne) references Personne(id)   
)engine = InnoDB;


create table Redaction (
idPersRedac int,
numArRedac int,
dateModification datetime,
foreign key (idPersRedac) references Personne(id),
foreign key (numArRedac) REFERENCES Article(numArticle),
PRIMARY KEY (idPersRedac, numArRedac, dateModification)
)engine = InnoDB;