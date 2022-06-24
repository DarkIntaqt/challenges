<?php

    header("Content-Type: application/json");

    $response = array();

    if(isset($_GET["region"]) && isset($_GET["region"])) {
        $server = $_GET["region"];
        $name = $_GET["id"];
    } else {
        header("Status: 404 Not Found");
        die(json_encode(array("status"=>array("message"=>"Summoner not found","status_code"=>404)),JSON_PRETTY_PRINT));
    }
    include_once($_SERVER["DOCUMENT_ROOT"]."api/malPHPhite.php");
    if($server == "world") {
        $api = new LeagueOfLegendsAPI("${{ secrets.RG_API_KEY }}","euw1",true,$_SERVER["HOME"]."ff15/cache");
    } else {
        $api = new LeagueOfLegendsAPI("${{ secrets.RG_API_KEY }}",$server,true,$_SERVER["HOME"]."ff15/cache");
    }
    
    include_once($_SERVER["DOCUMENT_ROOT"]."api/functions.php");

    function update($e) {
        $e = str_replace("/euw1/","/euw/",$e);
        $e = str_replace("/eun1/","/eune/",$e);
        $e = str_replace("/jp1/","/jp/",$e);
        $e = str_replace("/na1/","/na/",$e);
        $e = str_replace("/oc1/","/oc/",$e);
        $e = str_replace("/br1/","/br/",$e);
        $e = str_replace("/la1/","/lan/",$e);
        $e = str_replace("/la2/","/las/",$e);
        $e = str_replace("/tr1/","/tr/",$e);
    
        return $e;
    }
      
    function change($e) {
        $e = str_replace("in euw1","in Europe West",$e);
        $e = str_replace("in eun1","in Europe Nordic & East",$e);
        $e = str_replace("in jp1","in Japan",$e);
        $e = str_replace("in kr","in Korea",$e);
        $e = str_replace("in na1","in North America",$e);
        $e = str_replace("in oc1","in Oceania",$e);
        $e = str_replace("in br1","in Brazil",$e);
        $e = str_replace("in la1","in Latin America North",$e);
        $e = str_replace("in la2","in Latin America North",$e);
        $e = str_replace("in tr1","in Turkey",$e);
    
        return $e;
    }

    $c = getChallenge($name);
    if($c["translation"]["name"] === "CRYSTAL") {
        header("Status: 404 Not Found");
        die(json_encode(array("status"=>array("message"=>"Summoner not found","status_code"=>404)),JSON_PRETTY_PRINT));
    }

    $list = json_encode(["div",array("class"=>"challengeMain"),[["p", array(
        "class"=>"error GRANDMASTER"
      ),
        [
          ["i",array("class"=>"fa-solid fa-xmark"),[]],
          ["#text", array(),
            [], array(), " Leaderboards aren't enabled for this challenge"
          ]
        ]
    ]]]);


    $regions = array(
        "euw" =>json_decode(@file_get_contents($_SERVER["HOME"]."/ff15/cache/CC.".$c["id"].".euw1.json") ?: $list,true),
        "eune"=>json_decode(@file_get_contents($_SERVER["HOME"]."ff15/cache/CC.".$c["id"].".eun1.json") ?: $list,true),
        "kr"=>json_decode(@file_get_contents($_SERVER["HOME"]."ff15/cache/CC.".$c["id"].".kr.json") ?: $list,true),
        "jp"=>json_decode(@file_get_contents($_SERVER["HOME"]."ff15/cache/CC.".$c["id"].".jp1.json") ?: $list,true),
        "na"=>json_decode(@file_get_contents($_SERVER["HOME"]."ff15/cache/CC.".$c["id"].".na1.json") ?: $list,true),
        "oc"=>json_decode(@file_get_contents($_SERVER["HOME"]."ff15/cache/CC.".$c["id"].".oc1.json") ?: $list,true),
        "br"=>json_decode(@file_get_contents($_SERVER["HOME"]."ff15/cache/CC.".$c["id"].".br1.json") ?: $list,true),
        "lan"=>json_decode(@file_get_contents($_SERVER["HOME"]."ff15/cache/CC.".$c["id"].".la1.json") ?: $list,true),
        "las"=>json_decode(@file_get_contents($_SERVER["HOME"]."ff15/cache/CC.".$c["id"].".la2.json") ?: $list,true),
        "tr"=>json_decode(@file_get_contents($_SERVER["HOME"]."ff15/cache/CC.".$c["id"].".tr1.json") ?: $list,true),
        "world"=>array("div", array(
            "class"=> "challengeMain"
        ),
          array()
        )
    );

    $list = json_decode($list,true);

    foreach ($regions as $key => $value) {
        // if($key != "world") {
        //   if(isset($regions[$key][2][$k][2][2][2][0][4])) {
        //     array_push($regions["world"],$value);
        //   }
        // }
        if(isset($value[2])){
        foreach ($value[2] as $k => $v) {
          if(isset($regions[$key][2][$k][2][2][2][0][4])) {      
            
            $regions[$key][2][$k][2][2][2][0][4] = number_format($regions[$key][2][$k][2][2][2][0][4]);

            array_push($regions["world"][2],$regions[$key][2][$k]);
          }
        }}
      }

      $types = $c["thresholds"];

      #print_r($regions["world"]);

      if(isset($_GET["region"])) {
        if($_GET["region"] === "world") {
            $lastupdated = @filemtime($_SERVER["HOME"]."/ff15/cache/CC.".$c["id"].".euw1.json"); // All challenges are stored as CC.CHALLENGEID.REGION.json
            $region = "world";
            usort($regions["world"][2],function($a,$b) {
                
                $a = intval(str_replace(",","",$a[2][2][2][0][4]));
                $b = intval(str_replace(",","",$b[2][2][2][0][4]));
                
                if($a === $b) {
                    return 0;
                }
                
                return $a < $b;
            });
        } elseif(in_array($_GET["region"],["euw","eune","kr","jp","oc","br","na","lan","las","tr"])) {
        $region = $_GET["region"];
        $server = $region;
        include_once($_SERVER["DOCUMENT_ROOT"].'api/routings.php');
        
        $lastupdated = @filemtime($_SERVER["HOME"]."/ff15/cache/CC.".$c["id"].".{$route}.json");
        } else {
            header("Status: 404 Not Found");
            die(json_encode(array("status"=>array("message"=>"Summoner not found","status_code"=>404)),JSON_PRETTY_PRINT));
        }
      }
        
      
    if(count($regions["world"][2]) == 0) {
        $regions["world"] = $list;
    }

    $thresholds = array(
        number_format($types["NONE"]??0),
        number_format($types["IRON"]??0),
        number_format($types["BRONZE"]??0),
        number_format($types["SILVER"]??0),
        number_format($types["GOLD"]??0),
        number_format($types["PLATINUM"]??0),
        number_format($types["DIAMOND"]??0),
        number_format($types["MASTER"]??0),
        number_format($types["GRANDMASTER"]??0),
        number_format($types["CHALLENGER"]??0)
    );

    foreach ($thresholds as $key => $value) {
        if($value === "0") {
            $thresholds[$key] = "-";
        }
    }

    $response = array(
        "name"=>$c["translation"]["name"],
        "type"=>"MASTER",
        "icon"=>dechex($c["id"] * 3)."",
        "thresholds"=>$thresholds,
        "timestamp"=>$lastupdated,
        "title"=>array("title"=>$c["translation"]["description"],"tier"=>"SILVER"),
        "challenge"=>$regions[$server]??$list
    );

    die(change(update(json_encode($response, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE))));

?>