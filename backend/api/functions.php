<?php

    $titles = json_decode(file_get_contents("/var/www/cdn/lol/static/titles.json"),true);

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
        case 'IRON':
          return "BRONZE";
        case 'BRONZE':
          return "SILVER";
        case 'SILVER':
          return "GOLD";
        case 'GOLD':
          return "PLATINUM";
        case 'PLATINUM':
          return "DIAMOND";
        case 'DIAMOND':
          return "MASTER";
        case 'MASTER':
          return "GRANDMASTER";
        case 'GRANDMASTER':
          return "CHALLENGER";
        default:
          return "MAXED";
      }}
      
      function levelToNum($r) {
        switch ($r) {
          case 'NONE':
            return 0;
          case 'IRON':
            return 1;
          case 'BRONZE':
            return 2;
          case 'SILVER':
            return 3;
          case 'GOLD':
            return 4;
          case 'PLATINUM':
            return 5;
          case 'DIAMOND':
            return 6;
          case 'MASTER':
            return 7;
          case 'GRANDMASTER':
            return 8;
          case 'CHALLENGER':
            return 9;
          default:
            return -1;
        }
      }

      function numToLevel($num) {
        switch ($num) {
          case 0:
            return "NONE";
          case 1:
            return "IRON";
          case 2:
            return "BRONZE";
          case 3:
            return "SILVER";
          case 4:
            return "GOLD";
          case 5:
            return "PLATINUM";
          case 6:
            return "DIAMOND";
          case 7:
            return "MASTER";
          case 8:
            return "GRANDMASTER";
          case 9:
            return "CHALLENGER";
          default:
            return "UNDEFINED";
        }
      }


      $challenges = @json_decode(@file_get_contents("/var/www/cdn/lol/static/challenges-{$api->getRegion()["region"]}.json"),true);

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