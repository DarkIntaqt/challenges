<?php

    header("Content-Type: application/json");


    if(isset($_GET["server"]) && isset($_GET["name"])) {
        $server = $_GET["server"];
        $name = $_GET["name"];
    }

    include_once($_SERVER["DOCUMENT_ROOT"]."api/malPHPhite.php");

    try {
        $api = new LeagueOfLegendsAPI("${{ secrets.RG_API_KEY }}",$server,true,$_SERVER["HOME"]."/ff15/cache");
    } catch (\Throwable $th) {
        header("Status: 500 Internal Server Error");
        die(json_encode(array("status"=>array("message"=>"Invalid region","status_code"=>500)),JSON_PRETTY_PRINT));
    }

    $summoner = $api->getSummonerByName($name,true);
    #print_r($name);
    if($summoner === false) {
        header("Status: 404 Not Found");
        die(json_encode(array("status"=>array("message"=>"Summoner not found","status_code"=>404)),JSON_PRETTY_PRINT));
    }

    $challenges = $api->getChallenges($summoner);

    $F = array("CHALLENGES"=>$challenges);

    include_once($_SERVER["DOCUMENT_ROOT"]."api/functions.php");

    #print_r($F);
    #die();

    $list = ["div",array("class"=>"challengeMain"),[]];
  
    if(isset($_GET["order-by"])) {
        $filter = $_GET["order-by"];
        if($_GET["order-by"] == "timestamp") {
            function cmp($a, $b) {
            if($a["achievedTime"] == $b["achievedTime"]) {
                return 0;
            }
            return ($a["achievedTime"] > $b["achievedTime"] ? -1 : 1);
            }
        } elseif($_GET["order-by"] == "percentile") {
            function cmp($a, $b) {
            if($a["percentile"] == $b["percentile"]) {
                if(isset($a["position"])) {
                if (isset($b["position"])) {
                    return ($a["position"] < $b["position"] ? -1 : 1);
                } else {
                    return -4;
                }
                } elseif (isset($b["position"])) {
                return -5;
                }
                return 0;
            }
            return ($a["percentile"] < $b["percentile"] ? -1 : 1);
            }
        } elseif($_GET["order-by"] == "alphabetic-a-z") {
            function cmp($a, $b) {
            if($a["challengeId"] < 10 || $b["challengeId"] < 10) {
                return 0;
            }
            $g = getChallenge($a["challengeId"]);
            $h = getChallenge($b["challengeId"]);
            #print_r($a);
            return strcmp($g["translation"]["name"]??"Error loading title",$h["translation"]["name"]??"Error loading title");
            }
        } elseif($_GET["order-by"] == "alphabetic-z-a") {
            function cmp($a, $b) {
            if($a["challengeId"] < 10 || $b["challengeId"] < 10) {
                return 0;
            }
            $g = getChallenge($a["challengeId"]);
            $h = getChallenge($b["challengeId"]);
            #print_r($a);
            return strcmp($h["translation"]["name"]??"Error loading title",$g["translation"]["name"]??"Error loading title");
            }
        } elseif($_GET["order-by"] == "level") {
            function cmp($a, $b) {
            if(levelToNum($a["level"]) == levelToNum($b["level"])) {
                return 0;
            }
            return (levelToNum($a["level"]) > levelToNum($b["level"]) ? -1 : 1);
            }
        } elseif($_GET["order-by"] == "levelup") {
            function cmp($a, $b) {
            $nextlevelA = 1;
            $c = getChallenge($a["challengeId"]);
            if(isset($c["thresholds"][getNextLevel($a["level"])])) {
                $nextLevelA = $c["thresholds"][getNextLevel($a["level"])];
            }  else {
                $maxed ="max";
                $nextLevelA = $c["thresholds"][$a["level"]]??"1";
            }
            #echo $nextLevelA.PHP_EOL;
            #echo $a["value"].PHP_EOL.PHP_EOL;
            $nextLevelB = 1;
            $c = getChallenge($b["challengeId"]);
            if(isset($c["thresholds"][getNextLevel($b["level"])])) {
                $nextLevelB = $c["thresholds"][getNextLevel($b["level"])];
            }  else {
                $maxed ="max";
                $nextLevelB = $c["thresholds"][$b["level"]]??"1";
            }
            if(round($a["value"] / $nextLevelA,3) >= 1) {
                return 1;
            }
            if(round($b["value"] / $nextLevelB,3) >= 1) {
                return -1;
            }
            if((round($a["value"] / $nextLevelA,3) == round($b["value"] / $nextLevelB,3))) {
                if(levelToNum($a["level"]) == levelToNum($b["level"])) {
                return 0;
                }
                return (levelToNum($a["level"]) < levelToNum($b["level"]) ? -1 : 1);
            }
            return (round($a["value"] / $nextLevelA,2) > round($b["value"] / $nextLevelB,2) ? -1 : 1);
            }
        } else {
            header("Status: 500 Internal Server Error");
            die(json_encode(array("status"=>array("message"=>"Invalid filter","status_code"=>500)),JSON_PRETTY_PRINT));
        }
    } else {
        $filter="level";
        function cmp($a, $b) {
        if(levelToNum($a["level"]) == levelToNum($b["level"])) {
            return 0;
        }
        return (levelToNum($a["level"]) > levelToNum($b["level"]) ? -1 : 1);
        }
    }
    
    $c1level = "none";
    $c2level = "none";
    $c3level = "none";

    $c = $F["CHALLENGES"]["challenges"];

    if($c==NULL) {
        header("Status: 404 Not Found");
        die(json_encode(array("status"=>array("message"=>"Summoner not found","status_code"=>404.2)),JSON_PRETTY_PRINT));
    }

    usort($c, "cmp");
    
    $types = array("CHALLENGER"=>0,"GRANDMASTER"=>0,"MASTER"=>0,"DIAMOND"=>0,"PLATINUM"=>0,"GOLD"=>0,"SILVER"=>0,"BRONZE"=>0,"IRON"=>0,"UNRANKED"=>0);
    foreach ($c as $key => $value) {
        if($value["challengeId"] > 10){
        if($value["challengeId"] == ($F["CHALLENGES"]["preferences"]["challengeIds"][0]??-1)) {
            $c1level = strtolower($value["level"]);
        } 
        if($value["challengeId"] == ($F["CHALLENGES"]["preferences"]["challengeIds"][1]??-1)) {
            $c2level = strtolower($value["level"]);
        } 
        if($value["challengeId"] == ($F["CHALLENGES"]["preferences"]["challengeIds"][2]??-1)) {
            $c3level = strtolower($value["level"]);
        } 
        $c = getChallenge($value["challengeId"]);
        if(!isset($types[$value["level"]])) {
            $types[$value["level"]] = 0;
        }
        $types[$value["level"]]++;
        $nextLevel = "MAXED";
        $position = "";
        
        if(isset($value["position"])) {
            $pos = 0;
            if($value["level"] === "CHALLENGER") {
            $pos = 0;
            }
            if($value["level"] === "GRANDMASTER") {
            $pos = $c["leaderboardThresholds"][3]??0;
            }
            if($value["level"] === "MASTER") {
            $pos = $c["leaderboardThresholds"][5]??0;
            }
            $position = "#".number_format((intval($value["position"]) + $pos) , 0, ',', '.')." - ";
        }
        
        
        $maxed = "no";

        if(isset($c["thresholds"][getNextLevel($value["level"])])) {
            $nextLevel = $c["thresholds"][getNextLevel($value["level"])];
        }  else {
            $maxed ="max";
            $nextLevel = $c["thresholds"][$value["level"]]??"MAXED";
        }
        
        
        if($value["level"] === "NONE") {
            $value["level"] = "UNRANKED";
        }
        if($nextLevel === "MAXED") {
            $maxed = "max";
        }

        $postext = $position."Top ". ($value["percentile"] * 100) ."%";
        if($_GET["order-by"] == "timestamp") {
            $postext = "Updated " . time_elapsed_string("@".$value["achievedTime"] / 1000);
        }

        $value["value"] = intval($value["value"]);
        $nextLevel = intval($nextLevel);
        
        $array = ["a", array(
            "class"=> "".$value["level"]. " ".$maxed,
            "id"=> "cid".$value["challengeId"],
            "href"=>"/challenge/{$value["challengeId"]}?region={$server}"
            ),
            [
            ["div", array(
                "class"=> "tier ".$value["level"]
                ),
                [
                ["span", array(),
                    [
                    ["#text", array(),
                        [], array(), getChallenge($c["parentCategory"])["translation"]["name"]
                    ]
                    ]
                ]
                ]
            ],
            ["p", array(
                "class"=>"title"
            ),
                [
                ["#text", array(),
                    [], array(), $c["translation"]["name"]??"Error CID#".$value["challengeId"]
                ],
                
                ["span",array(),[
                    [
                    "#text",array(),[],array(),$postext
                    ]
                ]]
                ],

            ],
            ["p", array(
                "class"=>"description"
            ),
                [
                ["#text", array(),
                    [], array(), $c["translation"]["description"] ?? "Can't load the challenge text. ¯\_(ツ)_/¯ Don't know why"
                ]
                ]
            ],
            ["span", array(
                "class"=>"progressText"
            ),
                [
                
                ["#text", array(),
                    [], array(), @number_format($value["value"] , 0, ',', '.')." / ".@number_format($nextLevel, 0, ',', '.')
                ]
                ]
                ],
            ["div", array(
                "class"=> "progress"
                ),
                [
                ["div",
                    array("class"=>"indicator","style"=>"width: calc(102px * ".(@($value["value"] / (($nextLevel > 0) ? $nextLevel : 1))??1).")"),
                    []
                ]
                
                
                
                ]
            ]
            ]
        ];
        
        
        #$push = "<div class='challenge' tier='".$value["level"]."' id='cid".$value["challengeId"]."'><div class='tier'><span>".$value["level"]."</span></div><p>".$c["localizedNames"][$lang]["name"]."</p><p>".$c["localizedNames"][$lang]["description"]."</p><div class='progress'><span>".$value["value"]." / ".$nextLevel."</span></div></div>";
        array_push($list[2],$array);
        }
    }

    $usertitle = "<span style='opacity:0;'>No title</span>";
  
    #print_r($F);
    
    #$debug = array();

    $desc = "This summoner has not selected a title";$need="nothing to unlock";$titletype="UNRANKED";

    if(isset($titles["titles"][$F["CHALLENGES"]["preferences"]["title"]??"0"]) && @$F["CHALLENGES"]["preferences"]["title"]??"0" !== "") {
        $usertitle =$titles["titles"][$F["CHALLENGES"]["preferences"]["title"]??"0"]??"No Title";
        $desc = getChallenge(substr(strval($F["CHALLENGES"]["preferences"]["title"]),0,-2))["translation"]["description"] ?? "Currrently not available";
        $need = getChallenge(substr(strval($F["CHALLENGES"]["preferences"]["title"]),0,-2))["thresholds"][$titles["tiers"][substr(strval($F["CHALLENGES"]["preferences"]["title"]),-2)]] ?? "?";
        $titletype = numToLevel(intval(substr(strval($F["CHALLENGES"]["preferences"]["title"]),-2,2)));
    }
    
    array_push($list[2],["p",array("class"=>"disclaimer"),[["#text",array(),[],array(),"'Challenges.DarkIntaqt.Com' isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc."]]]);

    $debug = $F["CHALLENGES"]["preferences"];

    $c1 = array("No token selected","nothing to unlock");
    if($F["CHALLENGES"]["preferences"]["challengeIds"][0]??0 != 0) {
        $c1[0] = getChallenge($F["CHALLENGES"]["preferences"]["challengeIds"][0])["translation"]["description"] ?? "Currrently not available";
        $c1[1] = getChallenge($F["CHALLENGES"]["preferences"]["challengeIds"][0])["thresholds"][strtoupper($c1level)] ?? "?";
    }

    $c2 = array("No token selected","nothing to unlock");
    if($F["CHALLENGES"]["preferences"]["challengeIds"][1]??0 != 0) {
        $c2[0] = getChallenge($F["CHALLENGES"]["preferences"]["challengeIds"][1])["translation"]["description"] ?? "Currrently not available";
        $c2[1] = getChallenge($F["CHALLENGES"]["preferences"]["challengeIds"][1])["thresholds"][strtoupper($c2level)] ?? "?";
    }

    $c3 = array("No token selected","nothing to unlock");
    if($F["CHALLENGES"]["preferences"]["challengeIds"][2]??0 != 0) {
        $c3[0] = getChallenge($F["CHALLENGES"]["preferences"]["challengeIds"][2])["translation"]["description"] ?? "Currrently not available";
        $c3[1] = getChallenge($F["CHALLENGES"]["preferences"]["challengeIds"][2])["thresholds"][strtoupper($c3level)] ?? "?";
    }


    $response = array(
        "name"=>$summoner["name"],
        "icon"=>dechex($summoner["profileIcon"]["id"] * 7),
        "points"=> [
            number_format($F["CHALLENGES"]["totalPoints"]["current"],0,",","."),
            number_format(getChallenge(0)["thresholds"][@getNextLevel($F["CHALLENGES"]["totalPoints"]["level"])??($F["CHALLENGES"]["totalPoints"]["max"])],0,",",".")
        ],
        "title"=>array(
            "title"=>$usertitle,
            "description"=>$desc,
            "threshold"=>$need,
            "id"=>intval(substr(strval($F["CHALLENGES"]["preferences"]["title"]),0,-2)),
            "tier"=>$titletype
        ),
        "selections"=>array(
            "left"=>array(
                "id"=>dechex((@$F["CHALLENGES"]["preferences"]["challengeIds"][0]??1) * 3)."-".$c1level,
                "tier"=>strtoupper($c1level),
                "challenge"=>$c1
            ),
            "middle"=>array(
                "id"=>dechex((@$F["CHALLENGES"]["preferences"]["challengeIds"][1]??1) * 3)."-".$c2level,
                "tier"=>strtoupper($c2level),
                "challenge"=>$c2
            ),
            "right"=>array(
                "id"=>dechex((@$F["CHALLENGES"]["preferences"]["challengeIds"][2]??1) * 3)."-".$c3level,
                "tier"=>strtoupper($c3level),
                "challenge"=>$c3
            )
        ),
        "type"=>$F["CHALLENGES"]["totalPoints"]["level"],
        "types"=>$types,
        "challenges"=>$list
    );

    #sleep(1);

    die(json_encode($response , JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));

?>