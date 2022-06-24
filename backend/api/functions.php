<?php

    $titles = json_decode(file_get_contents($_SERVER["HOME"]."/cdn/lol/static/titles.json"),true);

    function curlGet($url) {
        $data = curl_init($url);
        curl_setopt($data, CURLOPT_RETURNTRANSFER, true);
        $result = curl_exec($data);
        curl_close ($data);
        return $result;
      }
      
      function getChallenge($challengeId = 0) {
        global $challenges;
        foreach ($challenges as $key => $value) {
          if($value["id"] === intval($challengeId)) {
            return $value;
          }
        }
        return "DARKINTAQT";
      }

      function puzzle($str="") {
        global $v;
        global $apikey;
        $f = "";
        $r = str_split(substr(base64_encode(substr($str,0,1).hash("md5",$v.base64_encode($v.$str.$apikey."-darkintaqt.com")).substr($str,-1,1)),0,-2),11);
        foreach ($r as $key => $value) {
          if($key < count($r) - 1) {
              $f .= $value."-";
          } else {
              $f .= $value;
          }
        }
        return $f;
      }
      
      function getNextLevel($r){
        switch ($r) {
          case 'NONE':
            return "IRON";
            break; 
          case 'IRON':
            return "BRONZE";
            break;
          case 'BRONZE':
            return "SILVER";
            break;
          case 'SILVER':
            return "GOLD";
            break;
          case 'GOLD':
            return "PLATINUM";
            break;
          case 'PLATINUM':
            return "DIAMOND";
            break;
          case 'DIAMOND':
            return "MASTER";
            break;
          case 'MASTER':
            return "GRANDMASTER";
            break;
          case 'GRANDMASTER':
            return "CHALLENGER";
            break;
          default:
            return "MAXED";
            break;
        }
      }
      
      function levelToNum($r) {
        switch ($r) {
          case 'NONE':
            return 0;
            break; 
          case 'IRON':
            return 1;
            break;
          case 'BRONZE':
            return 2;
            break;
          case 'SILVER':
            return 3;
            break;
          case 'GOLD':
            return 4;
            break;
          case 'PLATINUM':
            return 5;
            break;
          case 'DIAMOND':
            return 6;
            break;
          case 'MASTER':
            return 7;
            break;
          case 'GRANDMASTER':
            return 8;
            break;
          case 'CHALLENGER':
            return 9;
            break;
          default:
            return -1;
            break;
        }
      }

      function numToLevel($num) {
        switch ($num) {
          case 0:
            return "NONE";
            break;
          case 1:
            return "IRON";
            break;
          case 2:
            return "BRONZE";
            break;
          case 3:
            return "SILVER";
            break;
          case 4:
            return "GOLD";
            break;
          case 5:
            return "PLATINUM";
            break;
          case 6:
            return "DIAMOND";
            break;
          case 7:
            return "MASTER";
            break;
          case 8:
            return "GRANDMASTER";
            break;
          case 9:
            return "CHALLENGER";
            break;
          default:
            return "UNDEFINED";
            break;
        }
      }


    $challenges = @json_decode(@file_get_contents($_SERVER["HOME"]."/cdn/lol/static/challenges-{$api->getRegion()["region"]}.json"),true);

    function time_elapsed_string($datetime, $full = false) {
      $now = new DateTime;
      $ago = new DateTime($datetime);
      $diff = $now->diff($ago);

      $diff->w = floor($diff->d / 7);
      $diff->d -= $diff->w * 7;

      $string = array(
        'y' => 'year',
        'm' => 'month',
        'w' => 'week',
        'd' => 'day',
        'h' => 'hour',
        'i' => 'minute',
        's' => 'second',
      );
      foreach ($string as $k => &$v) {
        if ($diff->$k) {
          $v = $diff->$k . ' ' . $v . ($diff->$k > 1 ? 's' : '');
        } else {
          unset($string[$k]);
        }
      }

      if (!$full) $string = array_slice($string, 0, 1);
      return $string ? implode(', ', $string) . ' ago' : 'just now';
    }

?>