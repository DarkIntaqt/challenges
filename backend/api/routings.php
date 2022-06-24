<?php 

  // TODO: Switch to Function
  switch (strtolower($server)) {
    case 'euw':
      $route = "euw1";
      $routingserver = "europe";
      $serverid=0;
      break;
    case 'eune':
      $route = "eun1";
      $routingserver = "europe";
      $serverid=1;
      break;
    case 'kr':
      $route = "kr";
      $routingserver = "asia";
      $serverid=2;
      break;
    case 'br':
      $route = "br1";
      $routingserver = "americas";
      $serverid=3;
      break;
    case 'oc':
      $route = "oc1";
      $routingserver = "americas";
      $serverid=4;
      break;
    case 'na':
      $route = "na1";
      $routingserver = "americas";
      $serverid=5;
      break;
    case 'jp':
      $route = "jp1";
      $routingserver = "asia";
      $serverid=6;
      break;
    case 'ru':
      $route = "ru";
      $routingserver = "europe";
      $serverid=7;
      break;
    case 'lan':
      $route = "la1";
      $routingserver = "americas";
      $serverid=8;
      break;
    case 'las':
      $route = "la2";
      $routingserver = "americas";
      $serverid=9;
      break;
    case 'tr':
      $route = "tr1";
      $routingserver = "europe";
      $serverid=10;
      break;
    default:
      $route = "undefined";
      $routingserver = "undefined";
      $serverid=99;
      break;
  }

 ?>